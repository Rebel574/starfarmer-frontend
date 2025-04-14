import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { ShoppingBag, CreditCard, Truck } from "lucide-react";
import { ShippingAddress, User, PaymentMethod,CartItem as LocalCartItem } from "../common/types";

// Import API functions
import { initiatePhonePePayment, createCodOrder } from "../api/index";


export default function Checkout(): JSX.Element | null {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore() as {
    isAuthenticated: boolean;
    user: User | null;
  };
  const { items, clearCart, total } = useCartStore() as {
    items: LocalCartItem[];
    clearCart: () => void;
    total: () => number;
  };
  const { i18n, t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");

  const shippingCharge: number = paymentMethod === "cod" ? 50 : 0;

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated && items.length === 0) {
      console.log("Cart is empty, redirecting to /cart");
      navigate("/cart");
    }
  }, [items.length, loading, navigate, isAuthenticated]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const finalTotal: number = total() + shippingCharge;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!user) {
      setErrorMessage(t("checkout.errors.userNotFound"));
      setLoading(false);
      return;
    }
    if (items.length === 0) {
      setErrorMessage(t("checkout.errors.cartEmpty"));
      setLoading(false);
      return;
    }

    const orderPayload = {
      items: items.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.discountedPrice, // Using discountedPrice from cart item
      })),
      shippingAddress,
      paymentMethod,
      shippingCharge,
      total: finalTotal,
    };

    try {
      if (paymentMethod === "online") {
        console.log("Initiating PhonePe payment via API service...");
        const response = await initiatePhonePePayment(orderPayload);

        // Handle different response structures
        const redirectUrl = response.data?.redirectUrl;

        if (!redirectUrl) {
          console.error("API service did not return a PhonePe redirect URL.");
          throw new Error(t("checkout.errors.phonepeUrlMissing"));
        }

        console.log("Redirecting to PhonePe:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        // paymentMethod === 'cod'
        console.log("Creating COD order via API service...");
        const response = await createCodOrder(orderPayload);
        console.log(
          "Received Response in Component:",
          JSON.stringify(response, null, 2)
        );

        // Handle different response structures
        const createdOrder = response.data?.data?.order;

        if (!createdOrder || !createdOrder._id) {
          throw new Error(t("checkout.errors.orderCreationFailed"));
        }

        console.log("COD Order created successfully, clearing cart.");
        clearCart();
        console.log(
          "Navigating to order success page for COD order:",
          createdOrder._id
        );
        navigate(`/order-success/${createdOrder._id}`);
      }
    } catch (error: unknown) {
      console.error("Checkout API error:", error);
      let message = t("checkout.errors.generic");
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }
  if (items.length === 0 && !loading && isAuthenticated) {
    return null;
  }

  const currentLang = i18n.language;
  const getLocalizedName = (name: string | Record<string, string>): string => {
    if (typeof name === "string") {
      return name;
    }
    return name[currentLang] || name["en"] || t("checkout.unknownProduct");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("checkout.title")}
      </h1>

      {errorMessage && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side - Form */}
        <div className="md:col-span-2">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                {t("checkout.shippingAddress")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.fullName")}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.phone")}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    autoComplete="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="addressLine1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.addressLine1")}
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-line1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="addressLine2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.addressLine2")} ({t("checkout.optional")})
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleInputChange}
                    autoComplete="address-line2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.city")}
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-level2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.state")}
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-level1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("checkout.pincode")}
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    required
                    autoComplete="postal-code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                {t("checkout.paymentMethod")}
              </h2>
              <fieldset className="space-y-4">
                <legend className="sr-only">
                  {t("checkout.paymentMethod")}
                </legend>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => handlePaymentMethodChange("online")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label
                    htmlFor="online"
                    className="ml-3 text-sm font-medium text-gray-700 flex items-center cursor-pointer"
                  >
                    <span>
                      {t("checkout.onlinePayment")} (PhonePe/UPI/Cards)
                    </span>
                    <span className="ml-2 text-green-600 text-xs font-semibold bg-green-100 px-2 py-0.5 rounded-full hidden sm:inline">
                      {t("checkout.freeShipping")}
                    </span>
                    <span className="ml-2 text-green-600 text-xs font-semibold bg-green-100 px-2 py-0.5 rounded-full inline sm:hidden">
                      {t("checkout.free")}
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => handlePaymentMethodChange("cod")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label
                    htmlFor="cod"
                    className="ml-3 text-sm font-medium text-gray-700 flex items-center cursor-pointer"
                  >
                    <span>{t("checkout.cashOnDelivery")}</span>
                    <span className="ml-2 text-yellow-600 text-xs font-semibold bg-yellow-100 px-2 py-0.5 rounded-full">
                      + ₹{shippingCharge} {t("checkout.shipping")}
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Submit Button - Mobile */}
            <div className="md:hidden pt-2">
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("checkout.processing")}
                  </span>
                ) : (
                  <span>{t("checkout.placeOrder")}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              {t("checkout.orderSummary")}
            </h2>
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">{t("checkout.cartEmpty")}</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-60 overflow
                overflow-y-auto pr-2">
                  {items.map((item) => {
                    const displayName = getLocalizedName(item.name);
                    // Using discountedPrice for calculations
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center min-w-0">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                            <img
                              src={item.image}
                              alt={displayName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {displayName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} &times; ₹{item.discountedPrice}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 pl-2 flex-shrink-0">
                          ₹{item.quantity * item.discountedPrice}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("checkout.subtotal")}
                    </span>
                    <span className="font-medium">₹{total()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("checkout.shippingFee")}
                    </span>
                    <span className="font-medium">
                      {shippingCharge > 0 ? (
                        `₹${shippingCharge}`
                      ) : (
                        <span className="text-green-600">
                          {t("checkout.free")}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                    <span>{t("checkout.total")}</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
                {/* Submit Button - Desktop */}
                <div className="mt-6 hidden md:block">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading || items.length === 0}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("checkout.processing")}
                      </span>
                    ) : (
                      <span>{t("checkout.placeOrder")}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios, { AxiosError } from 'axios';
import { CheckCircle, ShoppingBag, Truck, Calendar, AlertTriangle, ListOrdered, Package } from 'lucide-react'; // Added ListOrdered, Package
import { getOrderDetails } from '../api/index'; 


// Define the exact response structure from the API
interface OrderResponse {
  status: string;
  data: {
    order: {
      _id: string;
      createdAt: string;
      updatedAt: string;
      items: Array<{
        productId: {
          _id: string;
          name: {
            en: string;
            mr: string;
            _id: string;
          };
          image: string;
        };
        quantity: number;
        price: number;
        _id: string;
      }>;
      paymentGateway: string;
      paymentMethod: string;
      paymentStatus: string; // e.g., 'paid', 'pending', 'failed', 'not_applicable'
      shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string; // Optional
        city: string;
        state: string;
        pincode: string;
      };
      shippingCharge: number;
      status: string; // e.g., 'pending', 'payment_pending', 'processing', 'shipped', 'delivered', 'cancelled'
      total: number;
      userId: {
        _id: string;
        email: string;
        name: string; // Assuming user name might be available
      };
      __v: number;
      // Optional: Add if your API provides it
      // estimatedDeliveryDate?: string;
    };
  };
}

export default function OrderSuccess(): JSX.Element {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, i18n } = useTranslation();

  const [order, setOrder] = useState<OrderResponse['data']['order'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError(t('orderSuccess.errors.missingId'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getOrderDetails(orderId);
        // console.log('API Response:', response.data);

        if (response.data.status === 'success' && response.data.data?.order) {
          setOrder(response.data.data.order);
        } else {
          // Handle cases where API returns success status but no order data
          throw new Error(t('orderSuccess.errors.notFoundSpecific', { orderId }));
        }
      } catch (err: unknown) {
        console.error("Failed to load order:", err);
        let message = t('orderSuccess.errors.loadFailed');

        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<{ message?: string }>;
          if (axiosError.response?.status === 404) {
            message = t('orderSuccess.errors.notFoundSpecific', { orderId });
          } else {
            // Try to get a more specific message from the API response
            message = axiosError.response?.data?.message || axiosError.message || message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, t]);

  // Helper function to get localized name with proper type checking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLocalizedName = (product: any): string => {
    const currentLang = i18n.language;

    if (!product) {
      return t('orderSuccess.unknownProduct');
    }

    try {
      if (product.name && typeof product.name === 'object') {
        const nameObj = product.name as { en?: string; mr?: string };
        return (currentLang === 'en' || currentLang === 'mr') && nameObj[currentLang]
          ? nameObj[currentLang]!
          : nameObj.en || t('orderSuccess.unknownProduct');
      } else if (typeof product.name === 'string') {
        return product.name;
      }
    } catch (error) {
      console.error("Error in getLocalizedName:", error);
    }

    return t('orderSuccess.unknownProduct');
  };


  // Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-600">{t('orderSuccess.loadingOrder')}</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-center max-w-lg mx-auto" role="alert">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 text-red-500"/>
          <span>{error}</span>
        </div>
         <div className="mt-8">
            <Link
                to="/products"
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
                 <ShoppingBag className="h-4 w-4 mr-2"/>
                {t('orderSuccess.continueShopping')}
            </Link>
         </div>
      </div>
    );
  }

  // Order Not Found State (after loading, if order is null)
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg max-w-lg mx-auto" role="alert">
          {t('orderSuccess.errors.notFound')} {/* General not found if order is null post-fetch */}
        </div>
         <div className="mt-8">
            <Link
                to="/products"
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
                 <ShoppingBag className="h-4 w-4 mr-2"/>
                {t('orderSuccess.continueShopping')}
            </Link>
         </div>
      </div>
    );
  }

  // Format date safely
  let formattedDate = t('orderSuccess.invalidDate');
  try {
    formattedDate = new Date(order.createdAt).toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : 'en-GB', { // Use appropriate locale codes
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
     console.error("Error formatting date:", order.createdAt, e);
  }

  // Calculate subtotal
  const subtotal = order.total - order.shippingCharge;


  // Main Success Content
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* --- Success Header --- */}
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5 shadow">
             <CheckCircle className="h-12 w-12 text-emerald-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">{t('orderSuccess.title')}</h1>
        <p className="mt-3 text-lg text-gray-600">
            {t('orderSuccess.thankYouPersonalized', { name: order.userId?.name || t('orderSuccess.customer') })} {/* Personalized if name exists */}
        </p>
        <p className="text-base text-gray-500 mt-4">
             {t('orderSuccess.orderNumber')}:{' '}
             <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded text-sm tracking-wider">{order._id}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
             {t('orderSuccess.confirmationEmailSentTo', { email: order.userId?.email || 'your email' })}
        </p>
      </div>

      {/* --- Order Details Card --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5 bg-gray-50/50">
             <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Package className="mr-2.5 h-5 w-5 text-emerald-600" /> {/* Changed Icon */}
                {t('orderSuccess.orderDetails')}
            </h2>
        </div>

        <div className="px-5 py-5 sm:px-6">
            {/* Meta Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mb-6 gap-3 sm:gap-5">
                <div className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{t('orderSuccess.orderPlaced')}: <span className="font-medium text-gray-700">{formattedDate}</span></span>
                </div>
                 {/* Status Badge - Improved Styling */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    order.status === 'payment_pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200' // Default/unknown status
                }`}>
                    {t(`orderStatus.${order.status}`, order.status)} {/* Assuming translations like orderStatus.processing */}
                </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-100 border-t border-gray-200">
                {order.items && order.items.map((item) => {
                    const productName = getLocalizedName(item.productId);
                    const productLink = item.productId?._id ? `/products/${item.productId._id}` : '#'; // Link if ID exists

                    return (
                        <div key={item._id} className="flex py-5 space-x-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                <img
                                    src={item.productId?.image || '/'} 
                                    alt={productName}
                                    className="h-full w-full object-cover object-center"
                                    onError={(e) => (e.currentTarget.src = '/placeholder-product.jpg')} // Handle broken images
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h3 className="text-sm sm:text-base font-medium text-gray-800">
                                        <Link to={productLink} className="hover:text-emerald-600 transition-colors duration-150">
                                            {productName}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{t('orderSuccess.qty')}: {item.quantity}</p>
                                </div>
                                <div className="mt-2 text-sm font-medium text-gray-900 text-right">
                                    <p>₹{item.price * item.quantity}</p>
                                    {item.quantity > 1 && <p className="text-xs text-gray-500 font-normal">₹{item.price} / {t('orderSuccess.item')}</p>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

           {/* Totals */}
           <div className="border-t-2 border-gray-200 pt-5 mt-5"> {/* Stronger border, more padding */}
                <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-gray-500">{t('orderSuccess.subtotal')}</dt>
                        <dd className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-500">{t('orderSuccess.shipping')}</dt>
                        <dd className="font-medium text-gray-800">
                            {order.shippingCharge > 0 ? `₹${order.shippingCharge.toFixed(2)}` : t('orderSuccess.free')}
                        </dd>
                    </div>
                    {/* Optional: Add Discount Line if applicable */}
                    {/* <div className="flex justify-between text-green-600">
                        <dt>{t('orderSuccess.discount')}</dt>
                        <dd className="font-medium">-₹{discountAmount.toFixed(2)}</dd>
                    </div> */}
                    <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-3 mt-3">
                        <dt>{t('orderSuccess.total')}</dt>
                        <dd>₹{order.total.toFixed(2)}</dd>
                    </div>
                </dl>
           </div>
        </div>
      </div>

      {/* --- Delivery Information Card --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Truck className="mr-2.5 h-5 w-5 text-emerald-600" />
                {t('orderSuccess.deliveryInformation')}
            </h2>
        </div>
        <div className="px-5 py-5 sm:px-6 divide-y divide-gray-100">
            {/* Shipping Address */}
            <div className="pb-5"> {/* Increased padding */}
                 <h3 className="text-base font-semibold text-gray-800 mb-2">{t('orderSuccess.shippingAddress')}</h3>
                 <address className="mt-1 text-sm text-gray-600 not-italic leading-relaxed">
                   <p className="font-medium text-gray-700">{order.shippingAddress.fullName}</p>
                   <p>{order.shippingAddress.addressLine1}</p>
                   {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                   <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                   <p className="mt-1">{t('orderSuccess.phoneAbbr')}: {order.shippingAddress.phone}</p>
                 </address>
            </div>

            {/* Payment Method */}
            <div className="pt-5"> {/* Increased padding */}
                <h3 className="text-base font-semibold text-gray-800 mb-2">{t('orderSuccess.paymentMethod')}</h3>
                <div className="flex items-center text-sm text-gray-600">
                    <span>
                        {order.paymentMethod === 'cod'
                            ? t('orderSuccess.paymentMethods.cod')
                            : t('orderSuccess.paymentMethods.online', { gateway: order.paymentGateway || '' }) // Pass gateway if needed
                        }
                    </span>
                     {/* Payment Status Badge */}
                    {order.paymentMethod === 'online' && order.paymentStatus && order.paymentStatus !== 'not_applicable' && (
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200' // Default
                        }`}>
                            {order.paymentStatus === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {/* Add icons for pending/failed if desired */}
                            {t(`paymentStatus.${order.paymentStatus}`, order.paymentStatus)} {/* e.g. paymentStatus.paid */}
                        </span>
                    )}
                     {order.paymentMethod === 'cod' && ( // Optional: Show status for COD too, e.g., 'Pending' until delivered?
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
                           {t(`paymentStatus.cod_pending`, 'Pay on Delivery')}
                        </span>
                     )}
                </div>
            </div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center mt-10 md:mt-12">
        {/* Primary Button: Continue Shopping */}
        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out order-2 sm:order-1"
        >
          <ShoppingBag className="h-4 w-4 mr-2"/>
          {t('orderSuccess.continueShopping')}
        </Link>
        {/* Secondary Button: View Orders */}
        <Link
          to="/my-orders" // Or potentially `/my-orders/${order._id}` if you have a specific order view
          className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out order-1 sm:order-2"
        >
          <ListOrdered className="h-4 w-4 mr-2"/>
          {t('orderSuccess.viewMyOrders')}
        </Link>
         {/* Optional Third Button: Track Order (if applicable) */}
         {/* { (order.status === 'shipped' || order.status === 'processing') &&
            <Link to={`/my-orders/${order._id}/track`} className="...">Track Package</Link>
         } */}
      </div>
    </div>
  );
}
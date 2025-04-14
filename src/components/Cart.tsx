import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { useAuthStore } from '../store/authStore'; 
import { useTranslation } from 'react-i18next'; 
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const { i18n, t } = useTranslation();
  const handleProceedToCheckout = () => {
    // Optional: Add checks here if needed (e.g., is cart empty? Although Checkout also checks)
    navigate('/checkout'); // 4. Navigate to the checkout route path
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);


  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('cart.empty.title')}</h2>
          <p className="mt-2 text-gray-600">{t('cart.empty.subtitle')}</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {t('cart.empty.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  const currentLang = i18n.language as 'en' | 'mr';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.title')}</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 divide-y divide-gray-200">
          {items.map((item) => {
            const displayName = item.name?.[currentLang] || item.name?.en || 'Unknown Product';

            return (
              <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between py-6">
                <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={displayName}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">₹{item.discountedPrice}</p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border rounded-lg mr-4">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-700"
                    title={t('cart.removeItem')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-700">{t('cart.total')}:</span>
            <span className="text-2xl font-bold text-gray-900">₹{total()}</span>
          </div>
          <button
            onClick={handleProceedToCheckout} // 5. Attach the handler
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
            // Optional: Disable button if cart is empty
            disabled={items.length === 0}
          >
            {t('cart.proceedToCheckout')}
          </button>
        </div>
      </div>
    </div>
  );
}
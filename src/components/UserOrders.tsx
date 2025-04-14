import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { getUserOrders } from '../api/index';
import axios from 'axios';
import {  Order } from '@/common/orderTypes';

export default function UserOrders() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Function to fetch orders using the API function from index.ts
  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getUserOrders();

      if (response.data?.status === 'success' && Array.isArray(response.data?.data?.orders)) {
        setOrders(response.data.data.orders);
      } else {
        throw new Error(t('orders.fetchError'));
      }
    } catch (err) {
      let message = t('orders.fetchError');

      if (axios.isAxiosError(err)) {
        const axiosError = err;
        message = axiosError.response?.data?.message || axiosError.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

    // eslint-disable-next-line
  const getLocalizedName = (product: any): string => {
    const currentLang = i18n.language;

    if (!product) {
      return t('orders.unknownProduct');
    }

    try {
      // Handle case where product has name object with language keys
      if (product.name && typeof product.name === 'object') {
        return (currentLang === 'en' || currentLang === 'mr') && product.name[currentLang]
          ? product.name[currentLang]
          : product.name.en || t('orders.unknownProduct');
      }
      // Handle case where product is just a string name
      else if (typeof product === 'string') {
        return product;
      }
      // Handle case where product has direct name string
      else if (typeof product.name === 'string') {
        return product.name;
      }
    } catch (error) {
      console.error("Error in getLocalizedName:", error);
    }

    return t('orders.unknownProduct');
  };

  const filteredOrders = orders.filter(order =>
    statusFilter === 'all' || order.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {t('orders.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">{t('orders.myOrders')}</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-auto"
        >
          <option value="all">{t('orders.filters.allStatus')}</option>
          <option value="payment_pending">{t('orders.filters.paymentPending')}</option>
          <option value="processing">{t('orders.filters.processing')}</option>
          <option value="shipped">{t('orders.filters.shipped')}</option>
          <option value="delivered">{t('orders.filters.delivered')}</option>
          <option value="completed">{t('orders.filters.completed')}</option>
          <option value="cancelled">{t('orders.filters.cancelled')}</option>
          <option value="payment_failed">{t('orders.filters.paymentFailed')}</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('orders.noOrdersFound')}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('orders.noOrdersDescription')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
                <div className="sm:flex sm:justify-between sm:items-center flex-wrap gap-2">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm text-gray-500">{t('orders.orderId')}</p>
                    <p className="font-medium">{order._id}</p>
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm text-gray-500">{t('orders.date')}</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString(i18n.language, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm text-gray-500">{t('orders.status')}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${order.status === 'payment_pending' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'cancelled' || order.status === 'payment_failed' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {t(`orders.statuses.${order.status}`, order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('orders.total')}</p>
                    <p className="font-medium">₹{order.total}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">{t('orders.orderItems')}</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="sm:flex items-center gap-4">
                      <img
                        src={item.productId.image}
                        alt={getLocalizedName(item.productId)}
                        className="h-16 w-16 object-cover rounded flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium">{getLocalizedName(item.productId)}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 sm:flex sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-500">{t('orders.paymentMethod')}</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod === 'cod' ? t('orders.paymentMethods.cod') : t('orders.paymentMethods.online')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{t('orders.paymentStatus')}</p>
                  <p className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' :
                    order.paymentStatus === 'pending' ? 'text-yellow-600' :
                    order.paymentStatus === 'failed' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {order.paymentStatus === 'not_applicable' ?
                      t('orders.paymentStatuses.notApplicable') :
                      t(`orders.paymentStatuses.${order.paymentStatus}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
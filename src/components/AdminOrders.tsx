// src/components/Admin/AdminOrders.tsx

import React, { useState, useEffect } from 'react'; // Import React for ChangeEvent type
import { useTranslation } from 'react-i18next';
import { Package, Search } from 'lucide-react';
import axios from 'axios'; // Import axios to check for AxiosError

// --- API Function Imports ---
// Adjust path as needed
import { getAllOrders, updateAdminOrderStatus } from '../api/index';

// --- Type Imports ---
import { OrderStatus } from '../common/types';
import { Order } from '../common/orderTypes';

// --- Component ---
export default function AdminOrders() {
  // If using i18n, ensure it's configured
  useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Use null for no error
  const [searchTerm, setSearchTerm] = useState('');
  // Use the specific OrderStatus type for the filter state
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // --- Data Fetching ---
  const fetchOrders = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await getAllOrders(); // Use API function
      // Ensure the response structure matches OrdersListResponse
      setOrders(response.data.data.orders);
    } catch (err) {
        console.error("Failed to fetch orders:", err);
        let message = 'Failed to load orders. Please try again.';
        if (axios.isAxiosError(err)) {
            message = err.response?.data?.message || err.message || message;
        } else if (err instanceof Error) {
            message = err.message;
        }
        setError(message);
        setOrders([]); // Clear orders on fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Run only on mount

  // --- Status Update Handler ---
  const handleStatusChange = async (orderId: string, newStatusValue: string) => {
    // Validate if the selected value is a valid OrderStatus
    // Type assertion is okay here if the <select> values are guaranteed to match OrderStatus
    const validatedStatus = newStatusValue as OrderStatus;

    const originalOrders = [...orders]; // Store original state for rollback
    // --- Optimistic UI Update ---
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: validatedStatus } : order
      )
    );
    setError(null); // Clear previous errors during optimistic update

    // --- API Call ---
    try {
      // Use the validated status which matches the OrderStatus type
      await updateAdminOrderStatus(orderId, validatedStatus);
      // Success! Optimistic update is correct. Optionally show a success message.

    } catch (err) {
      console.error('Error updating order status:', err);
      // --- Rollback Optimistic Update on Failure ---
      setOrders(originalOrders);

      // --- Set Error Message ---
      let message = 'Failed to update order status.';
       if (axios.isAxiosError(err)) {
            message = err.response?.data?.message || err.message || message;
        } else if (err instanceof Error) {
            message = err.message;
        }
      setError(message); // Display error to the user
    }
  };

  // --- Filtering Logic ---
  const filteredOrders = orders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(lowerSearchTerm) ||
      (order.userId && order.userId.email.toLowerCase().includes(lowerSearchTerm)) ||
      (order.userId && order.userId.name.toLowerCase().includes(lowerSearchTerm)); // Search by name too

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="ml-4 text-gray-600">Loading Orders...</p>
      </div>
    );
  }

  // Display error prominently if it prevents loading orders
  if (error && !loading && orders.length === 0) {
     return (
       <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg shadow max-w-md mx-auto mt-10">
         <p className="font-semibold">Error:</p>
         <p>{error}</p>
         <button
           onClick={fetchOrders}
           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
         >
           Try Again
         </button>
       </div>
     );
   }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Display non-critical error as a dismissible notification bar */}
      {error && (
         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex justify-between items-center" role="alert">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 text-red-700 hover:text-red-900" aria-label="Close">
                {/* Simple text close button */}
                 &times;
             </button>
         </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID, Email, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              aria-label="Search Orders"
            />
          </div>
          {/* Status Filter Dropdown */}
          <select
             value={statusFilter}
             // Type the event handler correctly
             onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as OrderStatus | 'all')}
             className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-auto"
             aria-label="Filter by Status"
           >
            <option value="all">All Status</option>
            {/* Generate options from the OrderStatus type */}
            <option value="pending">Pending</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="payment_failed">Payment Failed</option>
            <option value="payment_issue">Payment Issue</option>
          </select>
        </div>
      </div>

      {/* Orders Table or No Orders Message */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No orders match your current filters.'
              : 'There are currently no orders.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Table Headers */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Table Rows */}
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    {/* Order ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs" title={order._id}>
                      {order._id}
                    </td>
                    {/* Customer Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.userId?.name ?? 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.userId?.email ?? 'N/A'}</div>
                    </td>
                    {/* Items */}
                    <td className="px-6 py-4">
                       <div className="text-sm text-gray-900 max-h-24 overflow-y-auto custom-scrollbar"> {/* Added scrollbar */}
                         {order.items.map((item, index) => (
                           <div key={item._id || index} className="mb-1 last:mb-0 truncate" title={`${item.productId?.name?.en || item.productId?.name?.mr || 'Product'} x ${item.quantity}`}>
                             {/* Handle nested product name object */}
                              {item.productId?.name?.en || item.productId?.name?.mr || 'Product Name Unavailable'} x {item.quantity}
                           </div>
                         ))}
                       </div>
                     </td>
                    {/* Total */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </td>
                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColorClass(order.status as OrderStatus)}`}>
                        {order.status.replace('_', ' ')} {/* Nicer display */}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    {/* Actions (Status Update Dropdown) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={order.status}
                        // Use the handler function
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-green-500 focus:border-green-500 text-xs capitalize"
                        aria-label={`Update status for order ${order._id}`}
                      >
                        {/* Generate options */}
                         <option value="pending">Pending</option>
                         <option value="payment_pending">Payment Pending</option>
                         <option value="processing">Processing</option>
                         <option value="shipped">Shipped</option>
                         <option value="delivered">Delivered</option>
                         <option value="completed">Completed</option>
                         <option value="cancelled">Cancelled</option>
                         <option value="payment_failed">Payment Failed</option>
                         <option value="payment_issue">Payment Issue</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Optional: Add Pagination controls here if needed */}
        </div>
      )}
    </div>
  );
}

// --- Helper Function for Status Badge Color ---
function getStatusColorClass(status: OrderStatus): string {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-yellow-100 text-yellow-800';
        case 'shipped': return 'bg-purple-100 text-purple-800';
        case 'delivered': return 'bg-teal-100 text-teal-800';
        case 'payment_pending': return 'bg-orange-100 text-orange-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'payment_failed': return 'bg-red-200 text-red-900 font-bold'; // Emphasize failure
        case 'payment_issue': return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800'; // Fallback
    }
}

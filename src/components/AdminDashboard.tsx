import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart, Users, Package, IndianRupee, LayoutGrid, ShoppingBag } from 'lucide-react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname === '/admin/orders' ? 'orders' : 'products');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">₹45,231</p>
            </div>
            <IndianRupee className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Products</p>
              <p className="text-2xl font-bold">89</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Revenue</p>
              <p className="text-2xl font-bold">₹12,345</p>
            </div>
            <BarChart className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'products'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('products')}
          >
            <LayoutGrid className="h-5 w-5 mr-2" />
            Products
          </Link>
          <Link
            to="/admin/orders"
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === 'orders'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Orders
          </Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<AdminProducts />} />
        <Route path="/orders" element={<AdminOrders />} />
      </Routes>
    </div>
  );
}
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://starfarmer-backend.onrender.com/api',
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface GetProductsParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;

}

export const fetchCurrentUser = () => {
  const token = localStorage.getItem('token');
  return api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// Cart
export const fetchCart = () => api.get('/cart');
export const syncCart = (
  items: { productId: string; quantity: number }[],
  token: string
) =>
  api.post('/cart/sync', { items }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


// Products
export const getProducts = (params: GetProductsParams = {}) => api.get('/products', {params});export const getProduct = (id: string) => api.get(`/products/${id}`);
export const createProduct = (product: any) => api.post('/products', product);// eslint-disable-line @typescript-eslint/no-explicit-any
export const updateProduct = (id: string, product: any) => api.put(`/products/${id}`, product);// eslint-disable-line @typescript-eslint/no-explicit-any
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Auth
export const login = (credentials: { email: string; password: string }) => 
  api.post('/auth/login', credentials);
export const register = (userData: { name: string; email: string; password: string }) => 
  api.post('/auth/register', userData);
export const verifyEmail = (token: string) => 
  api.post('/auth/verify-email', { token });
export const resendVerification = (email: string) =>
  api.post('/auth/resend-verification', { email });
export const googleLogin = (token: string) => 
  api.post('/auth/google', { token });
export const getCurrentUser = () => api.get('/auth/me');

// Orders
export const createOrder = (orderData: any) => api.post('/orders', orderData); // eslint-disable-line @typescript-eslint/no-explicit-any
export const getUserOrders = (userId: string) => api.get(`/orders/user/${userId}`);
export const updateOrderStatus = (orderId: string, status: string) => 
  api.patch(`/orders/${orderId}/status`, { status });
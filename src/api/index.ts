import axios, { AxiosResponse } from 'axios';
import { ShippingAddress, PaymentMethod ,OrderStatus,Order} from '../common/types';
import { OrdersListResponse } from '@/common/orderTypes';
// --- Interfaces ---
interface OrderItemPayload {
  productId: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  items: OrderItemPayload[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingCharge: number;
  total: number;
  userId?: string;
}

export interface OrderStatusResponse {
  orderId: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | string;
  status: string;
}

interface PhonePeInitiateResponse {
  redirectUrl: string;
}


interface CodCreateResponse {
  status: string; // Added: Corresponds to "status": "success"
  data: {        // Added: Corresponds to the nested "data": { ... }
    order: {     // Kept: Corresponds to "order": { ... } inside the nested data
      _id: string; // Kept: The essential order ID

      // Optional but recommended: Add other fields you might use from the order object
      // These are based on your console.log output:
      shippingAddress?: {
         fullName?: string;
         phone?: string;
         addressLine1?: string;
         addressLine2?: string;
         city?: string;
         state?: string;
         pincode?: string;
       };
      userId?: {
         _id?: string;
         email?: string;
         name?: string;
       };
      items?: Array<{
         productId?: {
           _id?: string;
           name?: { en?: string; mr?: string; _id?: string };
           image?: string;
         };
         quantity?: number;
         price?: number;
         _id?: string;
       }>;
      paymentMethod?: string;
      shippingCharge?: number;
      total?: number;
      paymentStatus?: string;
      paymentGateway?: string;
      status?: string; // This is the order status ('processing', etc.)
      createdAt?: string;
      updatedAt?: string;
    };
  };
}

// Make sure this is the ONLY definition of CodCreateResponse used by your createCodOrder function.

export interface GetOrderResponse {
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
      paymentStatus: string;
      shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        pincode: string;
      };
      shippingCharge: number;
      status: string;
      total: number;
      userId: {
        _id: string;
        email: string;
        name: string;
      };
      __v: number;
    };
  };
}

// --- Axios Instance ---
const api = axios.create({
  baseURL: 'https://starfarmer-backend.onrender.com/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth API ---
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

// --- Cart API ---
export const fetchCart = () => api.get('/cart');

export const syncCart = (items: { productId: string; quantity: number }[]) =>
  api.post('/cart/sync', { items });

// --- Product API ---
interface GetProductsParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const getProducts = (params: GetProductsParams = {}) =>
  api.get('/products', { params });

export const getProduct = (id: string) =>
  api.get(`/products/${id}`);

// eslint-disable-next-line 
export const createProduct = (product: any) =>
  api.post('/products', product);

// eslint-disable-next-line 
export const updateProduct = (id: string, product: any) =>
  api.put(`/products/${id}`, product);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);

// --- Order / Checkout API ---
export const initiatePhonePePayment = (
  orderPayload: OrderPayload
): Promise<AxiosResponse<PhonePeInitiateResponse>> =>
  api.post('/orders/initiate-payment', orderPayload);

export const createCodOrder = (
  orderPayload: OrderPayload
): Promise<AxiosResponse<CodCreateResponse>> => {
  const payloadForCod = { ...orderPayload, paymentMethod: 'cod' as PaymentMethod };
  return api.post('/orders', payloadForCod);
};

export const getOrderStatusByMtid = (
  merchantTransactionId: string
): Promise<AxiosResponse<OrderStatusResponse>> => {
  if (!merchantTransactionId) {
    return Promise.reject(new Error("Merchant Transaction ID is required."));
  }
  return api.get(`/orders/status-by-mtid/${merchantTransactionId}`);
};

export const getOrderDetails = (
  orderId: string
): Promise<AxiosResponse<GetOrderResponse>> => {
  if (!orderId) {
    return Promise.reject(new Error("Order ID is required."));
  }
  return api.get(`/orders/${orderId}`);
};

export const getUserOrders = (): Promise<AxiosResponse<OrdersListResponse>> => {
  return api.get('/orders/my-orders');
};

export const getAllOrders = (): Promise<AxiosResponse<OrdersListResponse>> => {
  // Corresponds to backend route: GET / (Admin only)
  return api.get('/orders');
};



interface UpdateOrderStatusAdminResponse {
  status: string;
  data: {
    order: Order; 
  };
}
// Admin: Update status of ANY order
export const updateAdminOrderStatus = (
  orderId: string,
  newStatus: OrderStatus // Use the specific OrderStatus type here
): Promise<AxiosResponse<UpdateOrderStatusAdminResponse>> => {
   // Corresponds to backend route: PATCH /:id/status (Admin only)
  // Backend expects { status: "newStatusValue" } in the body
  return api.patch(`/orders/${orderId}/status`, { status: newStatus });
};
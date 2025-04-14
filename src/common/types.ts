export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  // Google ID is optional
  googleId?: string;
}

export interface Product {
  _id: string;
  name: {
    en: string;
    mr: string;
  };
  description: {
    en: string;
    mr: string;
  };
  benefits: Array<{
    en: string;
    mr: string;
  }>;
  price: number;
  discountedPrice: number;
  category: 'fertilizers' | 'seeds' | 'insecticide' | 'fungicide';
  image: string;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  name: {
    en: string;
    mr: string;
  };
  price: number;
  discountedPrice: number;
  image: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string | User; // Can be string ID or populated User object
  items: CartItem[];
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string; // Optional
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string | {
    _id: string;
    name: {
      en: string;
      mr: string;
    };
    image: string;
  };
  quantity: number;
  price: number
  _id?: string; 
}

export type OrderStatus = 
  | 'payment_pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'payment_failed'
  | 'payment_issue';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'not_applicable';
export type PaymentMethod = 'online' | 'cod';
export type PaymentGateway = 'phonepe' | 'cod';

export interface Order {
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


export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  // Other order actions
}

// PhonePe specific types
export interface PhonePeCallbackData {
  merchantId: string;
  merchantTransactionId: string;
  transactionId: string;
  amount: number;
  state: string;
  responseCode: string;
  // Add other fields as needed
}
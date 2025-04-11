import { create } from 'zustand';
import { login as apiLoginCall, register as apiRegisterCall, getCurrentUser } from '../api';
import { useCartStore } from './cartStore';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStoreState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterResponse {
  status: "success";
  message: string;
}

interface AuthStoreActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  setAuthStateFromGoogle: (user: User, token: string) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,

  login: async (email, password) => {
    const response = await apiLoginCall({ email, password });
    const user = response.data.data.user;
    const token = response.data.token;

    set({
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
    });

    localStorage.setItem('token', token);

    // ✅ Set token and sync cart after login
    const cartStore = useCartStore.getState();
    cartStore.setToken(token);
    await cartStore.syncCartFromServer();
  },

  register: async (name, email, password) => {
    const response = await apiRegisterCall({ name, email, password });
    return response.data;
  },

  logout: () => {
    const cartStore = useCartStore.getState();
    cartStore.saveCartToServer(); // ✅ Save cart before clearing
    cartStore.setToken(undefined);
    cartStore.clearCart();

    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },

  fetchCurrentUser: async () => {
    try {
      const response = await getCurrentUser();
      const user = response.data.data.user;

      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });

      // ✅ Ensure cart is synced if token is available
      const token = localStorage.getItem('token');
      if (token) {
        const cartStore = useCartStore.getState();
        cartStore.setToken(token);
        await cartStore.syncCartFromServer();
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      localStorage.removeItem('token');
    }
  },

  setAuthStateFromGoogle: (user, token) => {
    set({
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
    });

    localStorage.setItem('token', token);

    const cartStore = useCartStore.getState();
    cartStore.setToken(token);
    cartStore.syncCartFromServer(); // Fire and forget
  },
}));

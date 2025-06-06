import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchCart, syncCart } from '../api/index.ts';

// Import types from common types file
import { Product as ProductType} from '../common/types';

// Local interface for cart items as used in the store
interface CartItem {
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

// Server response type
interface ServerCartItem {
  productId: {
    _id: string;
    name: {
      en: string;
      mr: string;
    };
    price: number;
    discountedPrice: number;
    image: string;
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  token?: string;
  setToken: (token?: string) => void;
  addItem: (product: ProductType) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  syncCartFromServer: () => Promise<void>;
  saveCartToServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const syncIfToken = async () => {
        if (get().token) {
          await get().saveCartToServer();
        }
      };

      return {
        items: [],
        token: undefined,

        setToken: (token?: string) => {
          set({ token });
        },

        addItem: (product) => {
          set((state) => {
            const existing = state.items.find((item) => item._id === product._id);
            const updatedItems = existing
              ? state.items.map((item) =>
                  item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              : [
                  ...state.items,
                  {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    discountedPrice: product.discountedPrice,
                    image: product.image,
                    quantity: 1,
                  },
                ];
            return { items: updatedItems };
          });

          syncIfToken();
        },

        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter((item) => item._id !== productId),
          }));
          syncIfToken();
        },

        updateQuantity: (productId, quantity) => {
          set((state) => ({
            items: state.items
              .map((item) =>
                item._id === productId
                  ? { ...item, quantity: Math.max(0, quantity) }
                  : item
              )
              .filter((item) => item.quantity > 0),
          }));
          syncIfToken();
        },

        clearCart: () => {
          set({ items: [] });
          syncIfToken();
        },

        total: () => {
          return get().items.reduce(
            (sum, item) => sum + item.discountedPrice * item.quantity,
            0
          );
        },

        syncCartFromServer: async () => {
          const token = get().token;
          if (!token) return;
        
          try {
            const res = await fetchCart();
            const json = res.data;
        
            // Check for different response structures
            const serverItems = json.data?.items || json.items || [];
            
            const populatedItems: CartItem[] = serverItems.map((entry: ServerCartItem) => ({
              _id: entry.productId._id,
              name: entry.productId.name,
              price: entry.productId.price,
              discountedPrice: entry.productId.discountedPrice,
              image: entry.productId.image,
              quantity: entry.quantity,
            }));
        
            set({ items: populatedItems });
          } catch (error) {
            console.error('Cart sync failed:', error);
          }
        },
        
        saveCartToServer: async () => {
          const token = get().token;
          if (!token) return;
        
          try {
            const items = get().items;
            const formatted = items.map((item) => ({
              productId: item._id,
              quantity: item.quantity,
            }));
        
            // Remove the token parameter since the API function doesn't expect it directly
            await syncCart(formatted);
          } catch (error) {
            console.error('Saving cart failed:', error);
          }
        },               
      };
    },
    { name: 'cart-storage' }
  )
);
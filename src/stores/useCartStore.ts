// stores/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface CartItem {
  id: string;
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  brandName: string;
  volumeMl: number;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku: string;
}
interface CartStore {
  isOpenCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;

  // Sync với server
  syncWithServer: (userId: string) => Promise<void>;
  saveToServer: (userId: string) => Promise<void>;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemByVariantId: (variantId: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      isOpenCart: false,
      openCart: () => set({ isOpenCart: true }),
      closeCart: () => set({ isOpenCart: false }),
      toggleCart: () => set((state) => ({ isOpenCart: !state.isOpenCart })),
      items: [],
      isLoading: false,
      error: null,

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.variantId === newItem.variantId);

        if (existingItem) {
          // Nếu sản phẩm đã có, tăng số lượng
          set({
            items: items.map((item) =>
              item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item,
            ),
          });
        } else {
          // Thêm sản phẩm mới
          const cartItem: CartItem = {
            ...newItem,
            id: `${newItem.variantId}-${Date.now()}`,
          };
          set({ items: [...items, cartItem] });
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      syncWithServer: async (userId) => {
        set({ isLoading: true, error: null });

        try {
          // Kiểm tra xem server có cart không
          const response = await axios.get(`/api/cart/${userId}/check`);
          const { hasCart, items: serverItems } = response.data;

          const localItems = get().items;

          if (!hasCart && localItems.length > 0) {
            // Server chưa có cart, đồng bộ local lên server
            console.log('Server empty, syncing local cart to server...');
            await get().saveToServer(userId);
          } else if (hasCart && localItems.length === 0) {
            // Local empty, server có data, lấy từ server
            console.log('Local empty, getting cart from server...');
            set({ items: serverItems });
          } else if (hasCart && localItems.length > 0) {
            // Cả hai đều có data, ưu tiên server (hoặc có thể merge)
            console.log('Both have data, using server cart...');
            set({ items: serverItems });
          }
          // Nếu cả hai đều empty thì không làm gì
        } catch (error) {
          console.error('Error syncing cart:', error);
          set({ error: 'Không thể đồng bộ giỏ hàng' });
        } finally {
          set({ isLoading: false });
        }
      },

      saveToServer: async (userId) => {
        try {
          const items = get().items;
          await axios.post(`/api/cart/${userId}/sync`, { items });
        } catch (error) {
          console.error('Error saving cart to server:', error);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemByVariantId: (variantId) => {
        return get().items.find((item) => item.variantId === variantId);
      },
    }),
    {
      name: 'cart-storage',
      // Chỉ persist items, không persist loading states
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

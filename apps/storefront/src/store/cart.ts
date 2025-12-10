import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  storeId: string | null;
}

interface CartActions {
  setStoreId: (storeId: string) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      storeId: null,

      setStoreId: (storeId: string) => {
        const currentStoreId = get().storeId;
        // Clear cart if switching stores
        if (currentStoreId && currentStoreId !== storeId) {
          set({ items: [], storeId });
        } else {
          set({ storeId });
        }
      },

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingIndex >= 0) {
          const updatedItems = [...items];
          const newQuantity = updatedItems[existingIndex].quantity + (item.quantity || 1);

          // Respect max quantity if set
          if (item.maxQuantity && newQuantity > item.maxQuantity) {
            updatedItems[existingIndex].quantity = item.maxQuantity;
          } else {
            updatedItems[existingIndex].quantity = newQuantity;
          }

          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId, variantId) => {
        const { items } = get();
        set({
          items: items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const { items } = get();

        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        const updatedItems = items.map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const finalQuantity = item.maxQuantity
              ? Math.min(quantity, item.maxQuantity)
              : quantity;
            return { ...item, quantity: finalQuantity };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'rendrix-cart',
      partialize: (state) => ({
        items: state.items,
        storeId: state.storeId,
      }),
    }
  )
);

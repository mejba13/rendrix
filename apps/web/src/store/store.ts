import { create } from 'zustand';

interface Store {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  industry: string;
  logoUrl: string | null;
  status: string;
}

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  isLoading: boolean;

  setStores: (stores: Store[]) => void;
  setCurrentStore: (store: Store | null) => void;
  switchStore: (storeId: string) => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  currentStore: null,
  isLoading: true,

  setStores: (stores) => {
    const { currentStore } = get();
    set({
      stores,
      isLoading: false,
      // Keep current store if it exists in the new list
      currentStore: currentStore && stores.find((s) => s.id === currentStore.id)
        ? currentStore
        : stores[0] || null,
    });
  },

  setCurrentStore: (store) => {
    set({ currentStore: store });
    if (typeof window !== 'undefined' && store) {
      localStorage.setItem('currentStoreId', store.id);
    }
  },

  switchStore: (storeId) => {
    const { stores } = get();
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      set({ currentStore: store });
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentStoreId', storeId);
      }
    }
  },
}));

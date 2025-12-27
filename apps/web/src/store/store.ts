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
  initializeFromStorage: () => void;
}

// Helper to get saved store ID from localStorage
const getSavedStoreId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('currentStoreId');
};

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  currentStore: null,
  isLoading: true,

  setStores: (stores) => {
    const { currentStore } = get();
    const savedStoreId = getSavedStoreId();

    // Priority order for selecting current store:
    // 1. If currentStore exists and is in the new list, keep it
    // 2. If savedStoreId exists in localStorage and store is in list, use that
    // 3. Otherwise, use the first store
    let selectedStore: Store | null = null;

    if (currentStore && stores.find((s) => s.id === currentStore.id)) {
      selectedStore = currentStore;
    } else if (savedStoreId) {
      const savedStore = stores.find((s) => s.id === savedStoreId);
      if (savedStore) {
        selectedStore = savedStore;
      }
    }

    // Fallback to first store if no saved selection found
    if (!selectedStore && stores.length > 0) {
      selectedStore = stores[0];
      // Save the default selection
      if (typeof window !== 'undefined' && selectedStore) {
        localStorage.setItem('currentStoreId', selectedStore.id);
      }
    }

    set({
      stores,
      isLoading: false,
      currentStore: selectedStore,
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

  initializeFromStorage: () => {
    const { stores } = get();
    const savedStoreId = getSavedStoreId();
    if (savedStoreId && stores.length > 0) {
      const savedStore = stores.find((s) => s.id === savedStoreId);
      if (savedStore) {
        set({ currentStore: savedStore });
      }
    }
  },
}));

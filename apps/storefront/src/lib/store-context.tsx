'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreInfo, Category, getStoreInfo, getCategories } from './api';

interface StoreContextValue {
  store: StoreInfo | null;
  categories: Category[];
  storeIdentifier: string | null;
  isLoading: boolean;
  error: Error | null;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  categories: [],
  storeIdentifier: null,
  isLoading: true,
  error: null,
});

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

interface StoreProviderProps {
  children: React.ReactNode;
  initialStore?: StoreInfo | null;
  initialCategories?: Category[];
  storeIdentifier?: string | null;
}

export function StoreProvider({
  children,
  initialStore = null,
  initialCategories = [],
  storeIdentifier: initialStoreIdentifier = null,
}: StoreProviderProps) {
  const [store, setStore] = useState<StoreInfo | null>(initialStore);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [storeIdentifier, setStoreIdentifier] = useState<string | null>(initialStoreIdentifier);
  const [isLoading, setIsLoading] = useState(!initialStore);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If we already have initial data from server, don't fetch again
    if (initialStore && initialCategories.length > 0) {
      return;
    }

    // Get store identifier from cookie if not provided
    let identifier = storeIdentifier;
    if (!identifier && typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const storeCookie = cookies.find(c => c.trim().startsWith('store-identifier='));
      if (storeCookie) {
        identifier = storeCookie.split('=')[1].trim();
        setStoreIdentifier(identifier);
      } else {
        // Fallback to URL query param
        const urlParams = new URLSearchParams(window.location.search);
        identifier = urlParams.get('store');
        if (identifier) {
          setStoreIdentifier(identifier);
        }
      }
    }

    if (!identifier) {
      setIsLoading(false);
      return;
    }

    async function fetchStoreData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch store info by slug/subdomain
        const storeResponse = await getStoreInfo(identifier!);
        if (storeResponse.success && storeResponse.data) {
          setStore(storeResponse.data);

          // Fetch categories for this store
          const categoriesResponse = await getCategories(storeResponse.data.id);
          if (categoriesResponse.success && categoriesResponse.data) {
            setCategories(categoriesResponse.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch store data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch store data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStoreData();
  }, [initialStore, initialCategories, storeIdentifier]);

  return (
    <StoreContext.Provider
      value={{
        store,
        categories,
        storeIdentifier: storeIdentifier || store?.slug || null,
        isLoading,
        error,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

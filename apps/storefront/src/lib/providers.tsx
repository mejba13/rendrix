'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { StoreProvider } from './store-context';
import type { StoreInfo, Category } from './api';

interface ProvidersProps {
  children: React.ReactNode;
  initialStore?: StoreInfo | null;
  initialCategories?: Category[];
  storeIdentifier?: string | null;
}

export function Providers({
  children,
  initialStore,
  initialCategories = [],
  storeIdentifier,
}: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider
        initialStore={initialStore}
        initialCategories={initialCategories}
        storeIdentifier={storeIdentifier}
      >
        {children}
      </StoreProvider>
    </QueryClientProvider>
  );
}

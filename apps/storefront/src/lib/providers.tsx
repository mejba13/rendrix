'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { StoreProvider } from './store-context';
import { ThemeStyleProvider } from './theme-provider';
import type { StoreInfo, Category, ThemeSettings } from './api';

interface ProvidersProps {
  children: React.ReactNode;
  initialStore?: StoreInfo | null;
  initialCategories?: Category[];
  storeIdentifier?: string | null;
  themeSettings?: ThemeSettings;
  customCss?: string | null;
}

export function Providers({
  children,
  initialStore,
  initialCategories = [],
  storeIdentifier,
  themeSettings = {},
  customCss,
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
        <ThemeStyleProvider themeSettings={themeSettings} customCss={customCss}>
          {children}
        </ThemeStyleProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

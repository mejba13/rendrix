'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  Store,
  StoreSettings,
  StoreSeoSettings,
  CreateStoreInput,
  UpdateStoreInput,
} from '@rendrix/types';

// Types for API responses
interface StoreListItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  customDomain: string | null;
  industry: string;
  logoUrl: string | null;
  status: string;
  theme: { name: string; thumbnailUrl: string } | null;
  stats: {
    products: number;
    orders: number;
    customers: number;
  };
  createdAt: string;
}

interface StoresResponse {
  data: StoreListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface StoreDetail extends Store {
  theme?: {
    id: string;
    name: string;
    slug: string;
    thumbnailUrl: string | null;
  };
  _count?: {
    products: number;
    orders: number;
    customers: number;
  };
}

interface StoresParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'suspended';
  industry?: string;
  search?: string;
}

export type { StoreListItem, StoreDetail, StoresParams };

// Fetch stores list
export function useStores(params: StoresParams = {}) {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.status) searchParams.set('status', params.status);
      if (params.industry) searchParams.set('industry', params.industry);
      if (params.search) searchParams.set('search', params.search);

      const response = await api.fetch<StoresResponse>(
        `/api/v1/stores?${searchParams.toString()}`
      );
      return response;
    },
  });
}

// Fetch single store
export function useStore(storeId: string) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const response = await api.fetch<{ success: boolean; data: StoreDetail }>(
        `/api/v1/stores/${storeId}`
      );
      return response.data;
    },
    enabled: !!storeId,
  });
}

// Create store
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoreInput) => {
      const response = await api.fetch<{ success: boolean; data: Store }>(
        '/api/v1/stores',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}

// Update store
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      data,
    }: {
      storeId: string;
      data: UpdateStoreInput;
    }) => {
      const response = await api.fetch<{ success: boolean; data: Store }>(
        `/api/v1/stores/${storeId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
    },
  });
}

// Update store settings
export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      data,
    }: {
      storeId: string;
      data: Partial<StoreSettings>;
    }) => {
      const response = await api.fetch<{ success: boolean; data: Store }>(
        `/api/v1/stores/${storeId}/settings`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
    },
  });
}

// Update store SEO settings
export function useUpdateStoreSeo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      data,
    }: {
      storeId: string;
      data: Partial<StoreSeoSettings>;
    }) => {
      const response = await api.fetch<{ success: boolean; data: Store }>(
        `/api/v1/stores/${storeId}/seo`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
    },
  });
}

// Delete store
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: string) => {
      await api.fetch<{ success: boolean; data: { message: string } }>(
        `/api/v1/stores/${storeId}`,
        { method: 'DELETE' }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}

// Update subdomain
export function useUpdateSubdomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      subdomain,
    }: {
      storeId: string;
      subdomain: string;
    }) => {
      const response = await api.fetch<{ success: boolean; data: Store }>(
        `/api/v1/stores/${storeId}/subdomain`,
        {
          method: 'PATCH',
          body: JSON.stringify({ subdomain }),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
    },
  });
}

// Set custom domain
export function useSetCustomDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      domain,
    }: {
      storeId: string;
      domain: string;
    }) => {
      const response = await api.fetch<{
        success: boolean;
        data: {
          domain: string;
          verified: boolean;
          dnsRecords: Array<{
            type: string;
            name: string;
            value: string;
            verified: boolean;
          }>;
        };
      }>(`/api/v1/stores/${storeId}/domain`, {
        method: 'POST',
        body: JSON.stringify({ domain }),
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
    },
  });
}

// Verify domain
export function useVerifyDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: string) => {
      const response = await api.fetch<{
        success: boolean;
        data: {
          verified: boolean;
          message: string;
        };
      }>(`/api/v1/stores/${storeId}/domain/verify`, {
        method: 'POST',
      });
      return response.data;
    },
    onSuccess: (_, storeId) => {
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
    },
  });
}

// Remove custom domain
export function useRemoveCustomDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: string) => {
      await api.fetch<{ success: boolean }>(
        `/api/v1/stores/${storeId}/domain`,
        { method: 'DELETE' }
      );
    },
    onSuccess: (_, storeId) => {
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
    },
  });
}

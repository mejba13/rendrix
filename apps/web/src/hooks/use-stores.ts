'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
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

      const response = await apiClient.get<StoresResponse>(
        `/stores?${searchParams.toString()}`
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
      const response = await apiClient.get<StoreDetail>(`/stores/${storeId}`);
      return response;
    },
    enabled: !!storeId,
  });
}

// Create store
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoreInput) => {
      const response = await apiClient.post<Store>('/stores', data);
      return response;
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
      const response = await apiClient.patch<Store>(`/stores/${storeId}`, data);
      return response;
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
      const response = await apiClient.patch<Store>(
        `/stores/${storeId}/settings`,
        data
      );
      return response;
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
      const response = await apiClient.patch<Store>(
        `/stores/${storeId}/seo`,
        data
      );
      return response;
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
      await apiClient.delete(`/stores/${storeId}`);
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
      const response = await apiClient.patch<Store>(
        `/stores/${storeId}/subdomain`,
        { subdomain }
      );
      return response;
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
      const response = await apiClient.post<{
        domain: string;
        verified: boolean;
        dnsRecords: Array<{
          type: string;
          name: string;
          value: string;
          verified: boolean;
        }>;
      }>(`/stores/${storeId}/domain`, { domain });
      return response;
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
      const response = await apiClient.post<{
        verified: boolean;
        message: string;
      }>(`/stores/${storeId}/domain/verify`);
      return response;
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
      await apiClient.delete(`/stores/${storeId}/domain`);
    },
    onSuccess: (_, storeId) => {
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
    },
  });
}

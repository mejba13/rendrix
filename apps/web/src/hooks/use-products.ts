'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useStoreStore } from '@/store/store';
import type {
  Product,
  ProductStatus,
  ProductVisibility,
  ProductType,
  CreateProductInput,
  UpdateProductInput,
} from '@rendrix/types';

interface ProductListItem {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  type: ProductType;
  status: ProductStatus;
  visibility: ProductVisibility;
  price: number | null;
  compareAtPrice: number | null;
  quantity: number;
  trackInventory: boolean;
  image: { url: string; altText: string | null } | null;
  categories: { id: string; name: string }[];
  variantsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  success: boolean;
  data: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface ProductResponse {
  success: boolean;
  data: Product & {
    categories: { id: string; name: string }[];
  };
}

interface ProductsParams {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  type?: ProductType;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export function useProducts(params: ProductsParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['products', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const response = await api.fetch<ProductsResponse>(
        `/api/v1/stores/${currentStore.id}/products?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore,
  });
}

export function useProduct(productId: string | null) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['product', currentStore?.id, productId],
    queryFn: async () => {
      if (!currentStore || !productId) throw new Error('Missing store or product ID');

      const response = await api.fetch<ProductResponse>(
        `/api/v1/stores/${currentStore.id}/products/${productId}`
      );
      return response.data;
    },
    enabled: !!currentStore && !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<ProductResponse>(
        `/api/v1/stores/${currentStore.id}/products`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentStore?.id] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: UpdateProductInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<ProductResponse>(
        `/api/v1/stores/${currentStore.id}/products/${productId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['product', currentStore?.id, variables.productId],
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await api.fetch(`/api/v1/stores/${currentStore.id}/products/${productId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentStore?.id] });
    },
  });
}

export function useBulkProductAction() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      action,
      productIds,
    }: {
      action: 'publish' | 'unpublish' | 'archive' | 'delete';
      productIds: string[];
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<{ success: boolean; data: { affected: number } }>(
        `/api/v1/stores/${currentStore.id}/products/bulk`,
        {
          method: 'POST',
          body: JSON.stringify({ action, productIds }),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', currentStore?.id] });
    },
  });
}

export type { ProductListItem, ProductsParams };

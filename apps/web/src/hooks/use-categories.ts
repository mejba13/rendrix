'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useStoreStore } from '@/store/store';

export interface Category {
  id: string;
  storeId: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  productsCount: number;
  childrenCount?: number;
  parent?: { id: string; name: string; slug?: string } | null;
  children?: Category[];
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoriesParams {
  page?: number;
  limit?: number;
  parentId?: string | null;
  search?: string;
  includeChildren?: boolean;
  flat?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export function useCategories(params: CategoriesParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['categories', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });

      const response = await api.fetch<CategoriesResponse>(
        `/api/v1/stores/${currentStore.id}/categories?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore,
  });
}

export function useCategory(categoryId: string | null) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['category', currentStore?.id, categoryId],
    queryFn: async () => {
      if (!currentStore || !categoryId) throw new Error('Missing store or category ID');

      const response = await api.fetch<CategoryResponse>(
        `/api/v1/stores/${currentStore.id}/categories/${categoryId}`
      );
      return response.data;
    },
    enabled: !!currentStore && !!categoryId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<CategoryResponse>(
        `/api/v1/stores/${currentStore.id}/categories`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentStore?.id] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ categoryId, data }: { categoryId: string; data: UpdateCategoryInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<CategoryResponse>(
        `/api/v1/stores/${currentStore.id}/categories/${categoryId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['category', currentStore?.id, variables.categoryId],
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await api.fetch(`/api/v1/stores/${currentStore.id}/categories/${categoryId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentStore?.id] });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (
      categories: Array<{ id: string; sortOrder: number; parentId?: string | null }>
    ) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<{ success: boolean; data: { message: string } }>(
        `/api/v1/stores/${currentStore.id}/categories/reorder`,
        {
          method: 'POST',
          body: JSON.stringify({ categories }),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentStore?.id] });
    },
  });
}

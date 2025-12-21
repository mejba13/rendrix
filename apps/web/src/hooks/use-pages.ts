'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';

export type PageStatus = 'draft' | 'published';
export type PageVisibility = 'public' | 'private';
export type PageTemplate = 'default' | 'full-width' | 'sidebar' | 'landing' | 'contact' | 'faq';

export interface Page {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  content: string | null;
  template: PageTemplate;
  status: PageStatus;
  visibility: PageVisibility;
  showInNav: boolean;
  navOrder: number;
  parentId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: { id: string; title: string; slug: string } | null;
  children?: { id: string; title: string; slug: string; status: PageStatus }[];
  childrenCount?: number;
}

export interface PageListItem extends Omit<Page, 'content' | 'children'> {
  childrenCount: number;
}

export interface PageTreeItem {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  template: PageTemplate;
  showInNav: boolean;
  navOrder: number;
  parentId: string | null;
  children: PageTreeItem[];
}

interface PagesResponse {
  success: boolean;
  data: PageListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface PageResponse {
  success: boolean;
  data: Page;
}

interface PageTreeResponse {
  success: boolean;
  data: PageTreeItem[];
}

interface PagesParams {
  page?: number;
  limit?: number;
  status?: PageStatus;
  template?: PageTemplate;
  showInNav?: boolean;
  parentId?: string;
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'navOrder';
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePageInput {
  title: string;
  slug?: string;
  content?: string;
  template?: PageTemplate;
  status?: PageStatus;
  visibility?: PageVisibility;
  showInNav?: boolean;
  navOrder?: number;
  parentId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string | null;
}

export interface UpdatePageInput extends Partial<CreatePageInput> {}

// Pages Hooks
export function usePages(params: PagesParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['pages', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const response = await apiClient.get<PagesResponse>(
        `/stores/${currentStore.id}/pages?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore,
  });
}

export function usePageTree() {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['pageTree', currentStore?.id],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.get<PageTreeResponse>(
        `/stores/${currentStore.id}/pages/tree`
      );
      return response.data;
    },
    enabled: !!currentStore,
  });
}

export function usePage(pageId: string | undefined) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['page', currentStore?.id, pageId],
    queryFn: async () => {
      if (!currentStore || !pageId) throw new Error('No store or page selected');

      const response = await apiClient.get<PageResponse>(
        `/stores/${currentStore.id}/pages/${pageId}`
      );
      return response.data;
    },
    enabled: !!currentStore && !!pageId,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreatePageInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<PageResponse>(
        `/stores/${currentStore.id}/pages`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['pageTree', currentStore?.id] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ pageId, data }: { pageId: string; data: UpdatePageInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.patch<PageResponse>(
        `/stores/${currentStore.id}/pages/${pageId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: ['pages', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['page', currentStore?.id, pageId] });
      queryClient.invalidateQueries({ queryKey: ['pageTree', currentStore?.id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (pageId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await apiClient.delete(`/stores/${currentStore.id}/pages/${pageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['pageTree', currentStore?.id] });
    },
  });
}

export function useDuplicatePage() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (pageId: string) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<PageResponse>(
        `/stores/${currentStore.id}/pages/${pageId}/duplicate`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['pageTree', currentStore?.id] });
    },
  });
}

export function useBulkPageAction() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      action,
      pageIds,
    }: {
      action: 'publish' | 'unpublish' | 'delete' | 'showInNav' | 'hideFromNav';
      pageIds: string[];
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<{ success: boolean; data: { affected: number } }>(
        `/stores/${currentStore.id}/pages/bulk`,
        { action, pageIds }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['pageTree', currentStore?.id] });
    },
  });
}

export function useReorderPages() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (pages: { id: string; navOrder: number; parentId?: string | null }[]) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<{ success: boolean }>(
        `/stores/${currentStore.id}/pages/reorder`,
        { pages }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['pageTree', currentStore?.id] });
    },
  });
}

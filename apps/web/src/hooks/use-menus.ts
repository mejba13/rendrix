'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';

// Types
export type MenuLocation = 'header' | 'footer' | 'mobile' | 'utility';
export type MenuItemType = 'link' | 'page' | 'category' | 'product' | 'divider';

export interface MenuItem {
  id: string;
  menuId: string;
  parentId: string | null;
  type: MenuItemType;
  title: string;
  url: string | null;
  target: '_self' | '_blank';
  icon: string | null;
  pageId: string | null;
  categoryId: string | null;
  productId: string | null;
  sortOrder: number;
  isVisible: boolean;
  cssClass: string | null;
  highlight: boolean;
  badge: string | null;
  createdAt: string;
  updatedAt: string;
  page?: { id: string; title: string; slug: string; status: string } | null;
  category?: { id: string; name: string; slug: string } | null;
  product?: { id: string; name: string; slug: string; status: string } | null;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  location: MenuLocation;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
  items?: MenuItem[];
}

interface MenusResponse {
  success: boolean;
  data: Menu[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface MenuResponse {
  success: boolean;
  data: Menu;
}

interface MenuItemResponse {
  success: boolean;
  data: MenuItem;
}

interface MenusParams {
  page?: number;
  limit?: number;
  location?: MenuLocation;
  isActive?: boolean;
  search?: string;
}

export interface CreateMenuInput {
  name: string;
  slug?: string;
  location?: MenuLocation;
  description?: string;
  isActive?: boolean;
}

export interface UpdateMenuInput extends Partial<CreateMenuInput> {}

export interface CreateMenuItemInput {
  type: MenuItemType;
  title: string;
  url?: string | null;
  target?: '_self' | '_blank';
  icon?: string | null;
  pageId?: string | null;
  categoryId?: string | null;
  productId?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
  cssClass?: string | null;
  highlight?: boolean;
  badge?: string | null;
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {}

export interface ReorderItem {
  id: string;
  sortOrder: number;
  parentId?: string | null;
}

// Menus Hooks
export function useMenus(params: MenusParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['menus', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const response = await apiClient.get<MenusResponse>(
        `/stores/${currentStore.id}/menus?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore,
  });
}

export function useMenu(menuId: string | undefined) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['menu', currentStore?.id, menuId],
    queryFn: async () => {
      if (!currentStore || !menuId) throw new Error('No store or menu selected');

      const response = await apiClient.get<MenuResponse>(
        `/stores/${currentStore.id}/menus/${menuId}`
      );
      return response.data;
    },
    enabled: !!currentStore && !!menuId,
  });
}

export function useMenuByLocation(location: MenuLocation) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['menuByLocation', currentStore?.id, location],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.get<MenuResponse>(
        `/stores/${currentStore.id}/menus/location/${location}`
      );
      return response.data;
    },
    enabled: !!currentStore,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateMenuInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<MenuResponse>(
        `/stores/${currentStore.id}/menus`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', currentStore?.id] });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ menuId, data }: { menuId: string; data: UpdateMenuInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.patch<MenuResponse>(
        `/stores/${currentStore.id}/menus/${menuId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, { menuId }) => {
      queryClient.invalidateQueries({ queryKey: ['menus', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['menu', currentStore?.id, menuId] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (menuId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await apiClient.delete(`/stores/${currentStore.id}/menus/${menuId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

// Menu Items Hooks
export function useAddMenuItem() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ menuId, data }: { menuId: string; data: CreateMenuItemInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<MenuItemResponse>(
        `/stores/${currentStore.id}/menus/${menuId}/items`,
        data
      );
      return response.data;
    },
    onSuccess: (_, { menuId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', currentStore?.id, menuId] });
      queryClient.invalidateQueries({ queryKey: ['menus', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      menuId,
      itemId,
      data,
    }: {
      menuId: string;
      itemId: string;
      data: UpdateMenuItemInput;
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.patch<MenuItemResponse>(
        `/stores/${currentStore.id}/menus/${menuId}/items/${itemId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, { menuId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', currentStore?.id, menuId] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ menuId, itemId }: { menuId: string; itemId: string }) => {
      if (!currentStore) throw new Error('No store selected');

      await apiClient.delete(`/stores/${currentStore.id}/menus/${menuId}/items/${itemId}`);
    },
    onSuccess: (_, { menuId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', currentStore?.id, menuId] });
      queryClient.invalidateQueries({ queryKey: ['menus', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

export function useReorderMenuItems() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ menuId, items }: { menuId: string; items: ReorderItem[] }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<{ success: boolean }>(
        `/stores/${currentStore.id}/menus/${menuId}/reorder`,
        { items }
      );
      return response;
    },
    onSuccess: (_, { menuId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', currentStore?.id, menuId] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

export function useBulkMenuItemAction() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      menuId,
      action,
      itemIds,
    }: {
      menuId: string;
      action: 'show' | 'hide' | 'delete' | 'highlight' | 'unhighlight';
      itemIds: string[];
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<{ success: boolean; data: { affected: number } }>(
        `/stores/${currentStore.id}/menus/${menuId}/items/bulk`,
        { action, itemIds }
      );
      return response.data;
    },
    onSuccess: (_, { menuId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', currentStore?.id, menuId] });
      queryClient.invalidateQueries({ queryKey: ['menus', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['menuByLocation', currentStore?.id] });
    },
  });
}

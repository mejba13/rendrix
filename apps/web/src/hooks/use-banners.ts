'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';

// Types
export type BannerPlacement = 'homepage_hero' | 'section_banner' | 'collection_banner' | 'announcement_bar';
export type BannerStatus = 'draft' | 'active' | 'scheduled' | 'inactive';

export interface Banner {
  id: string;
  storeId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageUrlTablet: string | null;
  imageUrlMobile: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  ctaTarget: '_self' | '_blank';
  placement: BannerPlacement;
  status: BannerStatus;
  startDate: string | null;
  endDate: string | null;
  priority: number;
  sortOrder: number;
  backgroundColor: string | null;
  textColor: string | null;
  overlayOpacity: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  isLive?: boolean;
}

export interface BannerStats {
  total: number;
  active: number;
  scheduled: number;
  draft: number;
  byPlacement: Record<string, number>;
}

interface BannersResponse {
  success: boolean;
  data: Banner[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface BannerResponse {
  success: boolean;
  data: Banner;
}

interface BannerStatsResponse {
  success: boolean;
  data: BannerStats;
}

interface BannersParams {
  page?: number;
  limit?: number;
  placement?: BannerPlacement;
  status?: BannerStatus;
  search?: string;
}

export interface CreateBannerInput {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageUrlTablet?: string | null;
  imageUrlMobile?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  ctaTarget?: '_self' | '_blank';
  placement?: BannerPlacement;
  status?: BannerStatus;
  startDate?: string | null;
  endDate?: string | null;
  priority?: number;
  sortOrder?: number;
  backgroundColor?: string | null;
  textColor?: string | null;
  overlayOpacity?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {}

export interface ReorderBannerItem {
  id: string;
  sortOrder: number;
}

// Banner Hooks
export function useBanners(params: BannersParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['banners', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const response = await apiClient.get<BannersResponse>(
        `/stores/${currentStore.id}/banners?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore,
  });
}

export function useBanner(bannerId: string | undefined) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['banner', currentStore?.id, bannerId],
    queryFn: async () => {
      if (!currentStore || !bannerId) throw new Error('No store or banner selected');

      const response = await apiClient.get<BannerResponse>(
        `/stores/${currentStore.id}/banners/${bannerId}`
      );
      return response.data;
    },
    enabled: !!currentStore && !!bannerId,
  });
}

export function useBannerStats() {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['bannerStats', currentStore?.id],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.get<BannerStatsResponse>(
        `/stores/${currentStore.id}/banners/stats`
      );
      return response.data;
    },
    enabled: !!currentStore,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateBannerInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<BannerResponse>(
        `/stores/${currentStore.id}/banners`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['bannerStats', currentStore?.id] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ bannerId, data }: { bannerId: string; data: UpdateBannerInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.patch<BannerResponse>(
        `/stores/${currentStore.id}/banners/${bannerId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, { bannerId }) => {
      queryClient.invalidateQueries({ queryKey: ['banners', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['banner', currentStore?.id, bannerId] });
      queryClient.invalidateQueries({ queryKey: ['bannerStats', currentStore?.id] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (bannerId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await apiClient.delete(`/stores/${currentStore.id}/banners/${bannerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['bannerStats', currentStore?.id] });
    },
  });
}

export function useDuplicateBanner() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (bannerId: string) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<BannerResponse>(
        `/stores/${currentStore.id}/banners/${bannerId}/duplicate`,
        {}
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['bannerStats', currentStore?.id] });
    },
  });
}

export function useReorderBanners() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (items: ReorderBannerItem[]) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<{ success: boolean }>(
        `/stores/${currentStore.id}/banners/reorder`,
        { items }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners', currentStore?.id] });
    },
  });
}

export function useBulkBannerAction() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      action,
      bannerIds,
    }: {
      action: 'activate' | 'deactivate' | 'delete' | 'draft';
      bannerIds: string[];
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await apiClient.post<{ success: boolean; data: { affected: number } }>(
        `/stores/${currentStore.id}/banners/bulk`,
        { action, bannerIds }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['bannerStats', currentStore?.id] });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';

// Types
interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string | null;
  folder: string | null;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface MediaParams {
  page?: number;
  limit?: number;
  folder?: string;
  search?: string;
  mimeType?: string;
}

interface UploadResult {
  id: string;
  url: string;
  filename: string;
}

export type { MediaItem, MediaParams };

// Fetch media list
export function useMedia(params: MediaParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['media', currentStore?.id, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.folder) searchParams.set('folder', params.folder);
      if (params.search) searchParams.set('search', params.search);
      if (params.mimeType) searchParams.set('mimeType', params.mimeType);

      const response = await apiClient.get<MediaResponse>(
        `/stores/${currentStore?.id}/media?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore?.id,
  });
}

// Upload media
export function useUploadMedia() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      file,
      folder,
      altText,
    }: {
      file: File;
      folder?: string;
      altText?: string;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);
      if (altText) formData.append('altText', altText);

      const response = await apiClient.post<UploadResult>(
        `/stores/${currentStore?.id}/media/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', currentStore?.id] });
    },
  });
}

// Update media
export function useUpdateMedia() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      mediaId,
      data,
    }: {
      mediaId: string;
      data: { altText?: string; folder?: string };
    }) => {
      const response = await apiClient.patch<MediaItem>(
        `/stores/${currentStore?.id}/media/${mediaId}`,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', currentStore?.id] });
    },
  });
}

// Delete media
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (mediaId: string) => {
      await apiClient.delete(`/stores/${currentStore?.id}/media/${mediaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', currentStore?.id] });
    },
  });
}

// Bulk delete media
export function useBulkDeleteMedia() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (mediaIds: string[]) => {
      await apiClient.post(`/stores/${currentStore?.id}/media/bulk-delete`, {
        ids: mediaIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media', currentStore?.id] });
    },
  });
}

// Get folders
export function useMediaFolders() {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['media-folders', currentStore?.id],
    queryFn: async () => {
      const response = await apiClient.get<{ data: string[] }>(
        `/stores/${currentStore?.id}/media/folders`
      );
      return response.data;
    },
    enabled: !!currentStore?.id,
  });
}

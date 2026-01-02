'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ThemeValidationError,
  ThemeValidationWarning,
} from '@rendrix/types';

// ==================== TYPES ====================

export interface UploadThemeResponse {
  themeId: string;
  slug: string;
  version: string;
  assetsUploaded: number;
  warnings?: ThemeValidationWarning[];
}

export interface UploadThemeError {
  errors: ThemeValidationError[];
  warnings: ThemeValidationWarning[];
}

export interface CustomTheme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  version: string;
  author: string;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  storeCount: number;
  versionCount: number;
}

export interface CustomThemesResponse {
  data: CustomTheme[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ThemeVersionInfo {
  id: string;
  themeId: string;
  version: string;
  changelog: string | null;
  isLatest: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface ThemeVersionsResponse {
  data: ThemeVersionInfo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== QUERIES ====================

/**
 * Fetch organization's custom themes
 */
export function useCustomThemes(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery<CustomThemesResponse>({
    queryKey: ['customThemes', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.search) searchParams.set('search', params.search);

      const response = await apiClient.get<CustomThemesResponse>(
        `/themes/manage/custom?${searchParams.toString()}`
      );
      return response;
    },
  });
}

/**
 * Fetch theme versions
 */
export function useThemeVersions(themeId: string, params?: { page?: number; limit?: number }) {
  return useQuery<ThemeVersionsResponse>({
    queryKey: ['themeVersions', themeId, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const response = await apiClient.get<ThemeVersionsResponse>(
        `/themes/manage/${themeId}/versions?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!themeId,
  });
}

// ==================== MUTATIONS ====================

/**
 * Upload a new custom theme
 */
export function useUploadTheme() {
  const queryClient = useQueryClient();

  return useMutation<UploadThemeResponse, UploadThemeError, File, { progress: number }>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/themes/manage/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Organization-Id': localStorage.getItem('currentOrganizationId') || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.data || { errors: [{ code: 'UPLOAD_ERROR', message: data.error || 'Upload failed' }], warnings: [] };
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customThemes'] });
    },
  });
}

/**
 * Upload a new theme version
 */
export function useUploadThemeVersion(themeId: string) {
  const queryClient = useQueryClient();

  return useMutation<UploadThemeResponse, UploadThemeError, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/v1/themes/manage/${themeId}/versions`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Organization-Id': localStorage.getItem('currentOrganizationId') || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.data || { errors: [{ code: 'UPLOAD_ERROR', message: data.error || 'Upload failed' }], warnings: [] };
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeVersions', themeId] });
      queryClient.invalidateQueries({ queryKey: ['customThemes'] });
    },
  });
}

/**
 * Delete a custom theme
 */
export function useDeleteCustomTheme() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (themeId: string) => {
      await apiClient.delete(`/themes/manage/custom/${themeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customThemes'] });
    },
  });
}

/**
 * Update a custom theme
 */
export function useUpdateCustomTheme() {
  const queryClient = useQueryClient();

  return useMutation<
    CustomTheme,
    Error,
    { themeId: string; data: { name?: string; description?: string; isActive?: boolean } }
  >({
    mutationFn: async ({ themeId, data }) => {
      const response = await apiClient.patch<{ data: CustomTheme }>(
        `/themes/manage/custom/${themeId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customThemes'] });
    },
  });
}

/**
 * Activate a specific theme version
 */
export function useActivateThemeVersion() {
  const queryClient = useQueryClient();

  return useMutation<{ version: string }, Error, { themeId: string; versionId: string }>({
    mutationFn: async ({ themeId, versionId }) => {
      const response = await apiClient.post<{ data: { version: string } }>(
        `/themes/manage/${themeId}/versions/${versionId}/activate`
      );
      return response.data;
    },
    onSuccess: (_, { themeId }) => {
      queryClient.invalidateQueries({ queryKey: ['themeVersions', themeId] });
      queryClient.invalidateQueries({ queryKey: ['customThemes'] });
    },
  });
}

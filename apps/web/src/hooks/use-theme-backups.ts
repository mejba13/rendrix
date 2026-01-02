'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ==================== TYPES ====================

export type ThemeBackupReason = 'manual' | 'auto_upgrade' | 'rollback' | 'theme_change';

export interface ThemeBackup {
  id: string;
  storeId: string;
  themeId: string;
  themeVersion: string;
  themeSettings: Record<string, unknown>;
  customCss: string | null;
  sections: unknown[];
  reason: ThemeBackupReason | null;
  createdAt: string;
}

export interface BackupsResponse {
  data: ThemeBackup[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CustomCssResponse {
  customCss: string;
}

export interface ThemeExportData {
  themeId: string | null;
  themeName: string | null;
  themeVersion: string | null;
  themeSettings: Record<string, unknown>;
  customCss: string | null;
  sections: unknown[];
  exportedAt: string;
}

// ==================== QUERIES ====================

/**
 * Fetch store backups
 */
export function useStoreBackups(storeId: string, params?: { page?: number; limit?: number }) {
  return useQuery<BackupsResponse>({
    queryKey: ['storeBackups', storeId, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const response = await apiClient.get<BackupsResponse>(
        `/themes/manage/stores/${storeId}/backups?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!storeId,
  });
}

/**
 * Fetch store custom CSS
 */
export function useStoreCustomCss(storeId: string) {
  return useQuery<{ data: CustomCssResponse }>({
    queryKey: ['storeCustomCss', storeId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: CustomCssResponse }>(
        `/themes/manage/stores/${storeId}/custom-css`
      );
      return response;
    },
    enabled: !!storeId,
  });
}

/**
 * Export store theme configuration
 */
export function useExportThemeConfig(storeId: string) {
  return useQuery<{ data: ThemeExportData }>({
    queryKey: ['themeExport', storeId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: ThemeExportData }>(
        `/themes/manage/stores/${storeId}/export`
      );
      return response;
    },
    enabled: false, // Manual trigger only
  });
}

// ==================== MUTATIONS ====================

/**
 * Create a backup
 */
export function useCreateBackup(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<ThemeBackup, Error, ThemeBackupReason | undefined>({
    mutationFn: async (reason) => {
      const response = await apiClient.post<{ data: ThemeBackup }>(
        `/themes/manage/stores/${storeId}/backups`,
        { reason }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeBackups', storeId] });
    },
  });
}

/**
 * Restore from a backup
 */
export function useRestoreBackup(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (backupId) => {
      const response = await apiClient.post<{ data: unknown }>(
        `/themes/manage/stores/${storeId}/backups/${backupId}/restore`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeBackups', storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeTheme'] });
      queryClient.invalidateQueries({ queryKey: ['storeCustomCss', storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeSections', storeId] });
    },
  });
}

/**
 * Update custom CSS
 */
export function useUpdateCustomCss(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<{ customCss: string }, Error, string>({
    mutationFn: async (customCss) => {
      const response = await apiClient.put<{ data: { customCss: string } }>(
        `/themes/manage/stores/${storeId}/custom-css`,
        { customCss }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeCustomCss', storeId] });
    },
  });
}

/**
 * Import theme configuration
 */
export function useImportThemeConfig(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { themeSettings?: unknown; customCss?: string; sections?: unknown[] }>({
    mutationFn: async (importData) => {
      const response = await apiClient.post<{ data: unknown }>(
        `/themes/manage/stores/${storeId}/import`,
        importData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeTheme'] });
      queryClient.invalidateQueries({ queryKey: ['storeCustomCss', storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeSections', storeId] });
    },
  });
}

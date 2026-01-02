'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ==================== TYPES ====================

export interface ThemeSection {
  id: string;
  themeId: string;
  name: string;
  slug: string;
  type: string;
  component: string;
  schema: Record<string, unknown>;
  defaults: Record<string, unknown>;
  previewUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface StoreSectionConfig {
  id: string;
  sectionSlug: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  blocks?: StoreSectionBlock[];
  sortOrder: number;
}

export interface StoreSectionBlock {
  id: string;
  type: string;
  settings: Record<string, unknown>;
  sortOrder: number;
}

export interface StoreSectionsResponse {
  storeSections: StoreSectionConfig[];
  availableSections: ThemeSection[];
}

// ==================== QUERIES ====================

/**
 * Fetch theme sections
 */
export function useThemeSections(themeId: string) {
  return useQuery<{ data: ThemeSection[] }>({
    queryKey: ['themeSections', themeId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: ThemeSection[] }>(
        `/themes/manage/${themeId}/sections`
      );
      return response;
    },
    enabled: !!themeId,
  });
}

/**
 * Fetch store sections configuration
 */
export function useStoreSections(storeId: string) {
  return useQuery<{ data: StoreSectionsResponse }>({
    queryKey: ['storeSections', storeId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: StoreSectionsResponse }>(
        `/themes/manage/stores/${storeId}/sections`
      );
      return response;
    },
    enabled: !!storeId,
  });
}

// ==================== MUTATIONS ====================

/**
 * Update store sections
 */
export function useUpdateStoreSections(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<{ sections: StoreSectionConfig[] }, Error, StoreSectionConfig[]>({
    mutationFn: async (sections) => {
      const response = await apiClient.patch<{ data: { sections: StoreSectionConfig[] } }>(
        `/themes/manage/stores/${storeId}/sections`,
        { sections }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSections', storeId] });
    },
  });
}

/**
 * Reorder store sections
 */
export function useReorderStoreSections(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<{ sections: StoreSectionConfig[] }, Error, string[]>({
    mutationFn: async (sectionIds) => {
      const response = await apiClient.post<{ data: { sections: StoreSectionConfig[] } }>(
        `/themes/manage/stores/${storeId}/sections/reorder`,
        { sectionIds }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSections', storeId] });
    },
  });
}

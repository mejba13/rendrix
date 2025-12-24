'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Types for theme API
export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  version: string;
  author: string | null;
  industries: string[];
  features: string[];
  isPremium: boolean;
  price: number | null;
  settingsSchema: ThemeSettingsSchema;
  createdAt: string;
  usageCount?: number;
}

export interface ThemeSettingsSchema {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    muted?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    baseFontSize?: number;
    headingWeight?: string;
    bodyWeight?: string;
  };
  layout?: {
    containerWidth?: 'narrow' | 'medium' | 'wide' | 'full';
    headerStyle?: 'minimal' | 'centered' | 'expanded';
    footerStyle?: 'minimal' | 'standard' | 'expanded';
    productGridColumns?: number;
  };
  components?: {
    buttonStyle?: 'rounded' | 'pill' | 'sharp';
    cardStyle?: 'flat' | 'raised' | 'bordered';
    imageStyle?: 'square' | 'rounded' | 'circle';
  };
  effects?: {
    enableAnimations?: boolean;
    enableHoverEffects?: boolean;
    enableParallax?: boolean;
  };
  customCss?: string;
}

export interface ThemesParams {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  isPremium?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface ThemesResponse {
  data: Theme[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface StoreThemeResponse {
  theme: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    previewUrl?: string | null;
    isPremium: boolean;
    price?: number | null;
    settingsSchema?: ThemeSettingsSchema;
    features?: string[];
  } | null;
  themeSettings: ThemeSettingsSchema;
}

interface ApplyThemeResponse {
  storeId: string;
  theme: {
    id: string;
    name: string;
    slug: string;
    thumbnailUrl: string | null;
    isPremium: boolean;
    price: number | null;
  } | null;
  themeSettings: ThemeSettingsSchema;
}

// Fetch themes list with pagination and filtering
export function useThemes(params: ThemesParams = {}) {
  return useQuery({
    queryKey: ['themes', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.search) searchParams.set('search', params.search);
      if (params.industry) searchParams.set('industry', params.industry);
      if (params.isPremium !== undefined)
        searchParams.set('isPremium', String(params.isPremium));
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

      const response = await api.fetch<{ success: boolean } & ThemesResponse>(
        `/api/v1/themes?${searchParams.toString()}`
      );
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single theme by ID or slug
export function useTheme(themeIdOrSlug: string) {
  return useQuery({
    queryKey: ['theme', themeIdOrSlug],
    queryFn: async () => {
      const response = await api.fetch<{ success: boolean; data: Theme }>(
        `/api/v1/themes/${themeIdOrSlug}`
      );
      return response.data;
    },
    enabled: !!themeIdOrSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Get store's current theme and settings
export function useStoreTheme(storeId: string) {
  return useQuery({
    queryKey: ['storeTheme', storeId],
    queryFn: async () => {
      const response = await api.fetch<{
        success: boolean;
        data: StoreThemeResponse;
      }>(`/api/v1/themes/stores/${storeId}/current`);
      return response.data;
    },
    enabled: !!storeId,
  });
}

// Apply theme to store
export function useApplyTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      themeId,
    }: {
      storeId: string;
      themeId: string;
    }) => {
      const response = await api.fetch<{
        success: boolean;
        data: ApplyThemeResponse;
      }>(`/api/v1/themes/stores/${storeId}/apply`, {
        method: 'POST',
        body: JSON.stringify({ themeId }),
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['storeTheme', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}

// Update store's theme settings
export function useUpdateThemeSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      settings,
    }: {
      storeId: string;
      settings: Partial<ThemeSettingsSchema>;
    }) => {
      const response = await api.fetch<{
        success: boolean;
        data: {
          theme: { id: string; name: string; slug: string } | null;
          themeSettings: ThemeSettingsSchema;
        };
      }>(`/api/v1/themes/stores/${storeId}/settings`, {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['storeTheme', variables.storeId] });
    },
  });
}

// Reset store's theme settings to default
export function useResetThemeSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: string) => {
      const response = await api.fetch<{
        success: boolean;
        data: {
          theme: { id: string; name: string; slug: string } | null;
          themeSettings: ThemeSettingsSchema;
        };
      }>(`/api/v1/themes/stores/${storeId}/reset`, {
        method: 'POST',
      });
      return response.data;
    },
    onSuccess: (_, storeId) => {
      queryClient.invalidateQueries({ queryKey: ['storeTheme', storeId] });
    },
  });
}

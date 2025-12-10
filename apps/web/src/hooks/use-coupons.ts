'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';
import type {
  Coupon,
  CouponType,
  CreateCouponInput,
  UpdateCouponInput,
} from '@rendrix/types';

// Types for API responses
interface CouponListItem {
  id: string;
  code: string;
  type: CouponType;
  value: number | null;
  minimumOrder: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface CouponsResponse {
  data: CouponListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface CouponsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  type?: CouponType;
  isActive?: boolean;
}

export type { CouponListItem, CouponsParams };

// Fetch coupons list
export function useCoupons(params: CouponsParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['coupons', currentStore?.id, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      if (params.search) searchParams.set('search', params.search);
      if (params.type) searchParams.set('type', params.type);
      if (params.isActive !== undefined)
        searchParams.set('isActive', String(params.isActive));

      const response = await apiClient.get<CouponsResponse>(
        `/stores/${currentStore?.id}/coupons?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore?.id,
  });
}

// Fetch single coupon
export function useCoupon(couponId: string) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['coupon', currentStore?.id, couponId],
    queryFn: async () => {
      const response = await apiClient.get<Coupon>(
        `/stores/${currentStore?.id}/coupons/${couponId}`
      );
      return response;
    },
    enabled: !!currentStore?.id && !!couponId,
  });
}

// Create coupon
export function useCreateCoupon() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateCouponInput) => {
      const response = await apiClient.post<Coupon>(
        `/stores/${currentStore?.id}/coupons`,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons', currentStore?.id] });
    },
  });
}

// Update coupon
export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      couponId,
      data,
    }: {
      couponId: string;
      data: UpdateCouponInput;
    }) => {
      const response = await apiClient.patch<Coupon>(
        `/stores/${currentStore?.id}/coupons/${couponId}`,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coupons', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['coupon', currentStore?.id, variables.couponId],
      });
    },
  });
}

// Delete coupon
export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (couponId: string) => {
      await apiClient.delete(`/stores/${currentStore?.id}/coupons/${couponId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons', currentStore?.id] });
    },
  });
}

// Toggle coupon active status
export function useToggleCoupon() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ couponId, isActive }: { couponId: string; isActive: boolean }) => {
      const response = await apiClient.patch<Coupon>(
        `/stores/${currentStore?.id}/coupons/${couponId}`,
        { isActive }
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coupons', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['coupon', currentStore?.id, variables.couponId],
      });
    },
  });
}

// Validate coupon code
export function useValidateCoupon() {
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ code, cartTotal }: { code: string; cartTotal?: number }) => {
      const response = await apiClient.post<{
        valid: boolean;
        coupon?: Coupon;
        discount?: number;
        message?: string;
      }>(`/stores/${currentStore?.id}/coupons/validate`, { code, cartTotal });
      return response;
    },
  });
}

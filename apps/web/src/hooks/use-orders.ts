'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useStoreStore } from '@/store/store';
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  CreateFulfillmentInput,
} from '@rendrix/types';

interface OrderListItem {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  email: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  currency: string;
  total: number;
  itemsCount: number;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  placedAt: string;
  createdAt: string;
}

interface OrdersResponse {
  success: boolean;
  data: OrderListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

interface OrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  customerId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'total' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
}

export function useOrders(params: OrdersParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['orders', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const response = await api.fetch<OrdersResponse>(
        `/api/v1/stores/${currentStore.id}/orders?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore,
  });
}

export function useOrder(orderId: string | null) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['order', currentStore?.id, orderId],
    queryFn: async () => {
      if (!currentStore || !orderId) throw new Error('Missing store or order ID');

      const response = await api.fetch<OrderResponse>(
        `/api/v1/stores/${currentStore.id}/orders/${orderId}`
      );
      return response.data;
    },
    enabled: !!currentStore && !!orderId,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: { status?: OrderStatus; notes?: string };
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<OrderResponse>(
        `/api/v1/stores/${currentStore.id}/orders/${orderId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['order', currentStore?.id, variables.orderId],
      });
    },
  });
}

export function useFulfillOrder() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: CreateFulfillmentInput;
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<{ success: boolean; data: any }>(
        `/api/v1/stores/${currentStore.id}/orders/${orderId}/fulfill`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['order', currentStore?.id, variables.orderId],
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (orderId: string) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.fetch<OrderResponse>(
        `/api/v1/stores/${currentStore.id}/orders/${orderId}/cancel`,
        {
          method: 'POST',
        }
      );
      return response.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['order', currentStore?.id, orderId],
      });
    },
  });
}

export type { OrderListItem, OrdersParams };

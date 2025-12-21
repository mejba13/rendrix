'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';
import type {
  Customer,
  CustomerAddress,
  CreateCustomerInput,
  UpdateCustomerInput,
  ListCustomersParams,
} from '@rendrix/types';

// Types for API responses
interface CustomerListItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  createdAt: string;
}

interface CustomersResponse {
  data: CustomerListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface CustomerDetail extends Customer {
  addresses: CustomerAddress[];
  recentOrders?: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    placedAt: string;
  }>;
}

export type { CustomerListItem, CustomerDetail };

// Fetch customers list
export function useCustomers(params: ListCustomersParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['customers', currentStore?.id, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      if (params.search) searchParams.set('search', params.search);
      if (params.acceptsMarketing !== undefined)
        searchParams.set('acceptsMarketing', String(params.acceptsMarketing));
      if (params.tags?.length) searchParams.set('tags', params.tags.join(','));
      if (params.minOrders) searchParams.set('minOrders', String(params.minOrders));
      if (params.minSpent) searchParams.set('minSpent', String(params.minSpent));

      const response = await apiClient.get<CustomersResponse>(
        `/stores/${currentStore?.id}/customers?${searchParams.toString()}`
      );
      return response;
    },
    enabled: !!currentStore?.id,
  });
}

// Fetch single customer
export function useCustomer(customerId: string) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['customer', currentStore?.id, customerId],
    queryFn: async () => {
      const response = await apiClient.get<CustomerDetail>(
        `/stores/${currentStore?.id}/customers/${customerId}`
      );
      return response;
    },
    enabled: !!currentStore?.id && !!customerId,
  });
}

// Create customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateCustomerInput) => {
      const response = await apiClient.post<Customer>(
        `/stores/${currentStore?.id}/customers`,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', currentStore?.id] });
    },
  });
}

// Update customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      customerId,
      data,
    }: {
      customerId: string;
      data: UpdateCustomerInput;
    }) => {
      const response = await apiClient.patch<Customer>(
        `/stores/${currentStore?.id}/customers/${customerId}`,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers', currentStore?.id] });
      queryClient.invalidateQueries({
        queryKey: ['customer', currentStore?.id, variables.customerId],
      });
    },
  });
}

// Delete customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (customerId: string) => {
      await apiClient.delete(`/stores/${currentStore?.id}/customers/${customerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', currentStore?.id] });
    },
  });
}

// Address management
export function useAddCustomerAddress() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      customerId,
      data,
    }: {
      customerId: string;
      data: Omit<CustomerAddress, 'id' | 'customerId'>;
    }) => {
      const response = await apiClient.post<CustomerAddress>(
        `/stores/${currentStore?.id}/customers/${customerId}/addresses`,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['customer', currentStore?.id, variables.customerId],
      });
    },
  });
}

export function useUpdateCustomerAddress() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      customerId,
      addressId,
      data,
    }: {
      customerId: string;
      addressId: string;
      data: Partial<Omit<CustomerAddress, 'id' | 'customerId'>>;
    }) => {
      const response = await apiClient.patch<CustomerAddress>(
        `/stores/${currentStore?.id}/customers/${customerId}/addresses/${addressId}`,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['customer', currentStore?.id, variables.customerId],
      });
    },
  });
}

export function useDeleteCustomerAddress() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      customerId,
      addressId,
    }: {
      customerId: string;
      addressId: string;
    }) => {
      await apiClient.delete(
        `/stores/${currentStore?.id}/customers/${customerId}/addresses/${addressId}`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['customer', currentStore?.id, variables.customerId],
      });
    },
  });
}

// Export customer data
export function useExportCustomers() {
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (params?: ListCustomersParams) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.acceptsMarketing !== undefined)
        searchParams.set('acceptsMarketing', String(params.acceptsMarketing));
      if (params?.tags?.length) searchParams.set('tags', params.tags.join(','));

      const response = await apiClient.get<Blob>(
        `/stores/${currentStore?.id}/customers/export?${searchParams.toString()}`
      );
      return response;
    },
  });
}

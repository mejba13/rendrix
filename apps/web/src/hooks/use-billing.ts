'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number | null;
  priceYearly: number | null;
  features: Record<string, boolean>;
  limits: Record<string, number | null>;
}

interface SubscriptionUsage {
  stores: { used: number; limit: number | null };
  products: { used: number; limit: number | null };
}

interface Subscription {
  id: string;
  plan: {
    name: string;
    slug: string;
    features: Record<string, boolean>;
    limits: Record<string, number | null>;
  };
  status: string;
  billingInterval: 'monthly' | 'yearly';
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAt: string | null;
  usage: SubscriptionUsage;
}

interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  pdfUrl: string | null;
  createdAt: string;
}

export type { Plan, Subscription, SubscriptionUsage, Invoice };

// Fetch available plans
export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Plan[] }>('/subscriptions/plans');
      return response.data;
    },
  });
}

// Fetch current subscription
export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Subscription }>(
        '/subscriptions/current'
      );
      return response.data;
    },
  });
}

// Fetch invoices
export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Invoice[] }>('/subscriptions/invoices');
      return response.data;
    },
  });
}

// Create checkout session
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async ({
      planSlug,
      billingInterval,
    }: {
      planSlug: string;
      billingInterval: 'monthly' | 'yearly';
    }) => {
      const response = await apiClient.post<{ checkoutUrl: string }>(
        '/subscriptions/checkout',
        { planSlug, billingInterval }
      );
      return response;
    },
  });
}

// Create billing portal session
export function useCreatePortalSession() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ portalUrl: string }>(
        '/subscriptions/portal'
      );
      return response;
    },
  });
}

// Cancel subscription
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/subscriptions/cancel');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

// Resume subscription
export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/subscriptions/resume');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

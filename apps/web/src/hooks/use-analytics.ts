'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useStoreStore } from '@/store/store';

// Types
interface OverviewStats {
  revenue: {
    total: number;
    change: number;
    previousTotal: number;
  };
  orders: {
    total: number;
    change: number;
    previousTotal: number;
  };
  customers: {
    total: number;
    change: number;
    previousTotal: number;
  };
  averageOrderValue: {
    total: number;
    change: number;
    previousTotal: number;
  };
}

interface RevenueChartData {
  labels: string[];
  data: number[];
}

interface OrdersChartData {
  labels: string[];
  data: number[];
}

interface TopProduct {
  id: string;
  name: string;
  sku: string | null;
  imageUrl: string | null;
  revenue: number;
  quantity: number;
}

interface TopCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  totalSpent: number;
  orderCount: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  placedAt: string;
}

interface AnalyticsData {
  overview: OverviewStats;
  revenueChart: RevenueChartData;
  ordersChart: OrdersChartData;
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  recentOrders: RecentOrder[];
}

export type {
  OverviewStats,
  RevenueChartData,
  OrdersChartData,
  TopProduct,
  TopCustomer,
  RecentOrder,
  AnalyticsData,
};

type DateRange = '7d' | '30d' | '90d' | '12m';

// Fetch analytics overview
export function useAnalytics(dateRange: DateRange = '30d') {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['analytics', currentStore?.id, dateRange],
    queryFn: async () => {
      const response = await apiClient.get<{ data: AnalyticsData }>(
        `/stores/${currentStore?.id}/analytics?range=${dateRange}`
      );
      return response.data;
    },
    enabled: !!currentStore?.id,
    // For demo purposes, return mock data if API fails
    placeholderData: {
      overview: {
        revenue: { total: 12548.50, change: 12.5, previousTotal: 11154.22 },
        orders: { total: 156, change: 8.2, previousTotal: 144 },
        customers: { total: 89, change: 15.3, previousTotal: 77 },
        averageOrderValue: { total: 80.44, change: 3.9, previousTotal: 77.46 },
      },
      revenueChart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [2850, 3200, 2980, 3518],
      },
      ordersChart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [35, 42, 38, 41],
      },
      topProducts: [
        { id: '1', name: 'Premium Headphones', sku: 'HP-001', imageUrl: null, revenue: 2450, quantity: 49 },
        { id: '2', name: 'Wireless Keyboard', sku: 'KB-002', imageUrl: null, revenue: 1890, quantity: 63 },
        { id: '3', name: 'USB-C Hub', sku: 'HB-003', imageUrl: null, revenue: 1560, quantity: 78 },
        { id: '4', name: 'Ergonomic Mouse', sku: 'MS-004', imageUrl: null, revenue: 1240, quantity: 62 },
        { id: '5', name: 'Laptop Stand', sku: 'LS-005', imageUrl: null, revenue: 980, quantity: 35 },
      ],
      topCustomers: [
        { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', totalSpent: 856.50, orderCount: 8 },
        { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', totalSpent: 642.00, orderCount: 5 },
        { id: '3', email: 'bob@example.com', firstName: 'Bob', lastName: 'Wilson', totalSpent: 520.75, orderCount: 6 },
        { id: '4', email: 'alice@example.com', firstName: 'Alice', lastName: 'Brown', totalSpent: 445.00, orderCount: 4 },
        { id: '5', email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Davis', totalSpent: 398.25, orderCount: 3 },
      ],
      recentOrders: [
        { id: '1', orderNumber: 'ORD-1001', email: 'customer1@example.com', total: 125.00, status: 'delivered', placedAt: new Date().toISOString() },
        { id: '2', orderNumber: 'ORD-1002', email: 'customer2@example.com', total: 89.50, status: 'shipped', placedAt: new Date().toISOString() },
        { id: '3', orderNumber: 'ORD-1003', email: 'customer3@example.com', total: 256.00, status: 'processing', placedAt: new Date().toISOString() },
        { id: '4', orderNumber: 'ORD-1004', email: 'customer4@example.com', total: 45.00, status: 'pending', placedAt: new Date().toISOString() },
        { id: '5', orderNumber: 'ORD-1005', email: 'customer5@example.com', total: 178.25, status: 'confirmed', placedAt: new Date().toISOString() },
      ],
    },
  });
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStoreStore } from '@/store/store';
import { useAnalytics } from '@/hooks/use-analytics';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { formatCurrency, formatRelativeTime, formatFullName } from '@rendrix/utils';

type DateRange = '7d' | '30d' | '90d' | '12m';

export default function AnalyticsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');
  const { data: analytics, isLoading, refetch } = useAnalytics(dateRange);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store from the sidebar to view analytics.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px]" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  const overview = analytics?.overview;
  const revenueChart = analytics?.revenueChart;
  const topProducts = analytics?.topProducts || [];
  const topCustomers = analytics?.topCustomers || [];
  const recentOrders = analytics?.recentOrders || [];

  const dateRangeLabels: Record<DateRange, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '12m': 'Last 12 months',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your store's performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overview?.revenue?.total || 0, 'USD')}
            </div>
            <div className="flex items-center text-sm mt-1">
              {(overview?.revenue?.change || 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">
                    +{overview?.revenue?.change?.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">
                    {overview?.revenue?.change?.toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Orders</CardDescription>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.orders?.total || 0}</div>
            <div className="flex items-center text-sm mt-1">
              {(overview?.orders?.change || 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">
                    +{overview?.orders?.change?.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">
                    {overview?.orders?.change?.toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>New Customers</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.customers?.total || 0}</div>
            <div className="flex items-center text-sm mt-1">
              {(overview?.customers?.change || 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">
                    +{overview?.customers?.change?.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">
                    {overview?.customers?.change?.toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Avg. Order Value</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overview?.averageOrderValue?.total || 0, 'USD')}
            </div>
            <div className="flex items-center text-sm mt-1">
              {(overview?.averageOrderValue?.change || 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">
                    +{overview?.averageOrderValue?.change?.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">
                    {overview?.averageOrderValue?.change?.toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>{dateRangeLabels[dateRange]}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-end gap-2">
              {revenueChart?.data?.map((value, index) => {
                const maxValue = Math.max(...(revenueChart?.data || [1]));
                const height = (value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                      style={{ height: `${height}%` }}
                      title={formatCurrency(value, 'USD')}
                    />
                    <span className="text-xs text-muted-foreground">
                      {revenueChart?.labels?.[index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <span className="text-muted-foreground w-6">{index + 1}</span>
                  <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity} sold
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(product.revenue, 'USD')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Customers */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Customers with highest lifetime value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.slice(0, 5).map((customer) => {
                const name = formatFullName(customer.firstName, customer.lastName);
                const initials = name
                  ? name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : customer.email[0].toUpperCase();

                return (
                  <div key={customer.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(customer.totalSpent, 'USD')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.orderCount} orders
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(order.total, 'USD')}
                    </p>
                    <OrderStatusBadge status={order.status as any} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

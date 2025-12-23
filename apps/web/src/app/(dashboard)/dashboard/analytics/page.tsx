'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatCurrency, formatFullName } from '@rendrix/utils';
import {
  AreaChartComponent,
  DonutChartComponent,
  MetricCard,
  Sparkline,
} from '@/components/analytics/charts';

type DateRange = '7d' | '30d' | '90d' | '12m';

// Mock data for enhanced analytics
const conversionFunnelData = [
  { name: 'Visitors', value: 12580, color: '#FF9100' },
  { name: 'Add to Cart', value: 3240, color: '#3B82F6' },
  { name: 'Checkout', value: 1890, color: '#8B5CF6' },
  { name: 'Purchased', value: 892, color: '#10B981' },
];

const trafficSourcesData = [
  { name: 'Direct', value: 4250, color: '#FF9100' },
  { name: 'Organic Search', value: 3180, color: '#3B82F6' },
  { name: 'Social Media', value: 2340, color: '#8B5CF6' },
  { name: 'Referral', value: 1650, color: '#10B981' },
  { name: 'Email', value: 1160, color: '#F59E0B' },
];

const deviceData = [
  { name: 'Desktop', value: 5840, color: '#FF9100' },
  { name: 'Mobile', value: 4920, color: '#3B82F6' },
  { name: 'Tablet', value: 1820, color: '#8B5CF6' },
];

export default function AnalyticsHighlightsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');
  const { data: analytics, isLoading, refetch } = useAnalytics(dateRange);

  // Generate chart data from analytics
  const revenueChartData = React.useMemo(() => {
    if (!analytics?.revenueChart) return [];
    return analytics.revenueChart.labels.map((label, index) => ({
      name: label,
      revenue: analytics.revenueChart.data[index] || 0,
      orders: analytics.ordersChart?.data[index] || 0,
    }));
  }, [analytics]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px]" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[400px] lg:col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  const overview = analytics?.overview;
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
          <h1 className="text-3xl font-semibold tracking-tight">Analytics Highlights</h1>
          <p className="text-muted-foreground mt-1">
            Key performance metrics and insights for your store.
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

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(overview?.revenue?.total || 0, 'USD')}
          change={overview?.revenue?.change}
          icon={<DollarSign className="h-5 w-5 text-green-500" />}
          iconBgColor="from-green-500/20 to-emerald-500/10"
        />
        <MetricCard
          title="Total Orders"
          value={(overview?.orders?.total || 0).toLocaleString()}
          change={overview?.orders?.change}
          icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
          iconBgColor="from-blue-500/20 to-cyan-500/10"
        />
        <MetricCard
          title="New Customers"
          value={(overview?.customers?.total || 0).toLocaleString()}
          change={overview?.customers?.change}
          icon={<Users className="h-5 w-5 text-primary" />}
          iconBgColor="from-primary/20 to-orange-500/10"
        />
        <MetricCard
          title="Avg. Order Value"
          value={formatCurrency(overview?.averageOrderValue?.total || 0, 'USD')}
          change={overview?.averageOrderValue?.change}
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          iconBgColor="from-purple-500/20 to-violet-500/10"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/40">Conversion Rate</p>
                <p className="text-xl font-semibold text-white mt-1">7.09%</p>
              </div>
              <div className="w-20 h-10">
                <Sparkline data={[3.2, 4.1, 3.8, 5.2, 6.1, 5.8, 7.09]} color="#10B981" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/40">Page Views</p>
                <p className="text-xl font-semibold text-white mt-1">48,592</p>
              </div>
              <div className="w-20 h-10">
                <Sparkline data={[32000, 38000, 35000, 42000, 45000, 43000, 48592]} color="#3B82F6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/40">Bounce Rate</p>
                <p className="text-xl font-semibold text-white mt-1">32.4%</p>
              </div>
              <div className="w-20 h-10">
                <Sparkline data={[38, 36, 35, 34, 33, 32.8, 32.4]} color="#F59E0B" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/40">Avg. Session</p>
                <p className="text-xl font-semibold text-white mt-1">4m 32s</p>
              </div>
              <div className="w-20 h-10">
                <Sparkline data={[180, 210, 240, 220, 250, 260, 272]} color="#8B5CF6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue & Orders Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue & Orders</CardTitle>
              <CardDescription>{dateRangeLabels[dateRange]}</CardDescription>
            </div>
            <Link href="/dashboard/analytics/reports">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                View report <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <AreaChartComponent
              data={revenueChartData}
              dataKey="revenue"
              secondaryDataKey="orders"
              height={300}
              color="#FF9100"
              secondaryColor="#3B82F6"
              isCurrency={false}
            />
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Funnel</CardTitle>
            <CardDescription>Visitor to purchase journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((item, index) => {
                const prevValue = index > 0 ? conversionFunnelData[index - 1].value : item.value;
                const percentage = ((item.value / prevValue) * 100).toFixed(1);
                const widthPercent = (item.value / conversionFunnelData[0].value) * 100;

                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{item.value.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-xs text-white/40">({percentage}%)</span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Devices Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traffic Sources */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </div>
            <Link href="/dashboard/analytics/traffic">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <DonutChartComponent data={trafficSourcesData} height={200} innerRadius={50} outerRadius={75} showLegend={false} />
              </div>
              <div className="space-y-3">
                {trafficSourcesData.map((source) => (
                  <div key={source.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <div className="flex-1">
                      <p className="text-sm text-white/70">{source.name}</p>
                      <p className="text-xs text-white/40">{source.value.toLocaleString()} visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Devices</CardTitle>
              <CardDescription>Device breakdown</CardDescription>
            </div>
            <Link href="/dashboard/analytics/behavior">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <DonutChartComponent data={deviceData} height={200} innerRadius={50} outerRadius={75} showLegend={false} />
              </div>
              <div className="space-y-4">
                {deviceData.map((device) => {
                  const total = deviceData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = ((device.value / total) * 100).toFixed(1);
                  return (
                    <div key={device.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                      <div className="flex-1">
                        <p className="text-sm text-white/70">{device.name}</p>
                        <p className="text-xs text-white/40">{percentage}%</p>
                      </div>
                      <p className="text-sm font-medium text-white">{device.value.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products & Customers Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Top Products</CardTitle>
              <CardDescription>Best performing products by revenue</CardDescription>
            </div>
            <Link href="/dashboard/products">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <span className="text-muted-foreground w-6 text-sm">{index + 1}</span>
                  <div className="h-10 w-10 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center overflow-hidden">
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
                    <p className="font-medium truncate text-white/90">{product.name}</p>
                    <p className="text-sm text-white/40">
                      {product.quantity} sold
                    </p>
                  </div>
                  <p className="font-semibold text-white">
                    {formatCurrency(product.revenue, 'USD')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Top Customers</CardTitle>
              <CardDescription>Customers with highest lifetime value</CardDescription>
            </div>
            <Link href="/dashboard/customers">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
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
                      <p className="font-medium truncate text-white/90">{name || 'Anonymous'}</p>
                      <p className="text-sm text-white/40 truncate">
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatCurrency(customer.totalSpent, 'USD')}
                      </p>
                      <p className="text-sm text-white/40">
                        {customer.orderCount} orders
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <CardDescription>Latest orders from your store</CardDescription>
          </div>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {recentOrders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">#{order.orderNumber}</p>
                  <OrderStatusBadge status={order.status as any} />
                </div>
                <p className="text-sm text-white/40 truncate mb-2">{order.email}</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(order.total, 'USD')}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useStoreStore } from '@/store/store';
import { useAnalytics } from '@/hooks/use-analytics';
import { formatCurrency } from '@rendrix/utils';

export default function DashboardPage() {
  const { currentStore } = useStoreStore();
  const { data: analytics, isLoading } = useAnalytics('7d');

  const overview = analytics?.overview;

  const stats = [
    {
      title: 'Total Revenue',
      value: overview?.revenue?.total ? formatCurrency(overview.revenue.total, 'USD') : '$0.00',
      change: overview?.revenue?.change ? `${overview.revenue.change > 0 ? '+' : ''}${overview.revenue.change.toFixed(1)}%` : '+0%',
      trend: (overview?.revenue?.change || 0) >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'from-green-500/20 to-emerald-500/10',
      iconColor: 'text-green-500',
    },
    {
      title: 'Orders',
      value: overview?.orders?.total?.toString() || '0',
      change: overview?.orders?.change ? `${overview.orders.change > 0 ? '+' : ''}${overview.orders.change.toFixed(1)}%` : '+0%',
      trend: (overview?.orders?.change || 0) >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'from-blue-500/20 to-cyan-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Products',
      value: analytics?.topProducts?.length?.toString() || '0',
      change: '+0%',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500/20 to-violet-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Customers',
      value: overview?.customers?.total?.toString() || '0',
      change: overview?.customers?.change ? `${overview.customers.change > 0 ? '+' : ''}${overview.customers.change.toFixed(1)}%` : '+0%',
      trend: (overview?.customers?.change || 0) >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'from-primary/20 to-orange-500/10',
      iconColor: 'text-primary',
    },
  ];

  const recentOrders = analytics?.recentOrders || [];

  const quickActions = [
    { label: 'Add Product', href: '/dashboard/products/new', icon: Package },
    { label: 'Create Coupon', href: '/dashboard/coupons/new', icon: Plus },
    { label: 'View Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-[150px] mb-2" />
            <Skeleton className="h-5 w-[280px]" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[130px]" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-white/[0.02] border-white/[0.08]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-white/50 mt-1">
            Welcome back! Here's an overview of{' '}
            <span className="text-white/70">{currentStore?.name || 'your store'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]"
          >
            <Clock className="w-4 h-4 mr-2" />
            Last 7 days
          </Button>
          <Link href="/dashboard/products/new">
            <Button className="btn-primary text-black font-medium">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-white">{stat.value}</h3>
                <p className="text-sm text-white/40">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="bg-white/[0.02] border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-white">{action.label}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/[0.08]">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-medium text-white">Recent Orders</CardTitle>
            <Link href="/dashboard/orders">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white hover:bg-white/[0.04]"
              >
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                  <ShoppingCart className="h-6 w-6 text-white/30" />
                </div>
                <p className="text-white/50 text-sm">No orders yet</p>
                <p className="text-white/30 text-xs mt-1">Orders will appear here once customers make purchases</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentOrders.slice(0, 5).map((order, index) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors ${
                      index !== Math.min(recentOrders.length, 5) - 1 ? 'border-b border-white/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{order.email}</p>
                        <p className="text-xs text-white/40">#{order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(order.total, 'USD')}</p>
                        <p className="text-xs text-white/40">
                          {new Date(order.placedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity / Top Customers */}
        <Card className="bg-white/[0.02] border-white/[0.08]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-white">Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.topCustomers && analytics.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {analytics.topCustomers.slice(0, 4).map((customer) => (
                  <ActivityItem
                    key={customer.id}
                    icon={<Users className="h-4 w-4" />}
                    title={`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer'}
                    description={`${customer.orderCount} orders - ${formatCurrency(customer.totalSpent, 'USD')}`}
                    time={customer.email}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-white/30" />
                </div>
                <p className="text-white/50 text-sm">No activity yet</p>
                <p className="text-white/30 text-xs mt-1">Customer activity will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="bg-white/[0.02] border-white/[0.08]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
            <CardTitle className="text-lg font-medium text-white">Low Stock Products</CardTitle>
          </div>
          <Link href="/dashboard/products?filter=low-stock">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/[0.04]"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/50">
            All products are in stock. We'll notify you when items run low.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    shipped: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    confirmed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const icons: Record<string, React.ReactNode> = {
    completed: <CheckCircle2 className="h-3 w-3" />,
    delivered: <CheckCircle2 className="h-3 w-3" />,
    processing: <Clock className="h-3 w-3" />,
    shipped: <Package className="h-3 w-3" />,
    pending: <AlertCircle className="h-3 w-3" />,
    confirmed: <CheckCircle2 className="h-3 w-3" />,
    cancelled: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${
        styles[status] || styles.pending
      }`}
    >
      {icons[status] || icons.pending}
      <span className="capitalize">{status}</span>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/50 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/40 truncate">{description}</p>
      </div>
      <span className="text-xs text-white/30 flex-shrink-0 truncate max-w-[100px]">{time}</span>
    </div>
  );
}

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
import { useStoreStore } from '@/store/store';

export default function DashboardPage() {
  const { currentStore } = useStoreStore();

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeValue: '+$7,543',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500/20 to-emerald-500/10',
      iconColor: 'text-green-500',
    },
    {
      title: 'Orders',
      value: '356',
      change: '+12.5%',
      changeValue: '+42 orders',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500/20 to-cyan-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Products',
      value: '128',
      change: '+8 new',
      changeValue: 'this week',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500/20 to-violet-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Customers',
      value: '2,350',
      change: '+180',
      changeValue: 'new signups',
      trend: 'up',
      icon: Users,
      color: 'from-primary/20 to-orange-500/10',
      iconColor: 'text-primary',
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-7823',
      customer: 'Sarah Johnson',
      amount: '$156.00',
      status: 'completed',
      time: '2 min ago',
    },
    {
      id: '#ORD-7822',
      customer: 'Michael Chen',
      amount: '$89.00',
      status: 'processing',
      time: '15 min ago',
    },
    {
      id: '#ORD-7821',
      customer: 'Emily Davis',
      amount: '$234.50',
      status: 'pending',
      time: '1 hour ago',
    },
    {
      id: '#ORD-7820',
      customer: 'James Wilson',
      amount: '$67.00',
      status: 'completed',
      time: '2 hours ago',
    },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/dashboard/products/new', icon: Package },
    { label: 'Create Coupon', href: '/dashboard/coupons/new', icon: Plus },
    { label: 'View Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  ];

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
          <Button className="btn-primary text-black font-medium">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </span>
          </Button>
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
            <div className="space-y-1">
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors ${
                    index !== recentOrders.length - 1 ? 'border-b border-white/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-white/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{order.customer}</p>
                      <p className="text-xs text-white/40">{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{order.amount}</p>
                      <p className="text-xs text-white/40">{order.time}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity / Summary */}
        <Card className="bg-white/[0.02] border-white/[0.08]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-white">Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <ActivityItem
                icon={<Package className="h-4 w-4" />}
                title="New product added"
                description="Premium Leather Wallet"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<Users className="h-4 w-4" />}
                title="New customer signup"
                description="john@example.com"
                time="4 hours ago"
              />
              <ActivityItem
                icon={<ShoppingCart className="h-4 w-4" />}
                title="Order completed"
                description="#ORD-7819 - $123.00"
                time="5 hours ago"
              />
              <ActivityItem
                icon={<TrendingUp className="h-4 w-4" />}
                title="Sales milestone"
                description="Reached $10,000 this month"
                time="1 day ago"
              />
            </div>
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
  const styles = {
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  const icons = {
    completed: <CheckCircle2 className="h-3 w-3" />,
    processing: <Clock className="h-3 w-3" />,
    pending: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${
        styles[status as keyof typeof styles]
      }`}
    >
      {icons[status as keyof typeof icons]}
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
      <span className="text-xs text-white/30 flex-shrink-0">{time}</span>
    </div>
  );
}

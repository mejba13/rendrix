'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  ShoppingCart,
  DollarSign,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStoreStore } from '@/store/store';
import { LiveIndicator, LineChartComponent } from '@/components/analytics/charts';
import { formatCurrency } from '@rendrix/utils';

// Mock real-time data
const generateRealtimeData = () => ({
  activeUsers: Math.floor(Math.random() * 50) + 120,
  pageViews: Math.floor(Math.random() * 200) + 450,
  activeCartsValue: Math.floor(Math.random() * 2000) + 3500,
  ordersLast30Min: Math.floor(Math.random() * 10) + 5,
  revenueLast30Min: Math.floor(Math.random() * 500) + 800,
});

// Mock active pages data
const activePages = [
  { path: '/products/wireless-headphones', views: 24, title: 'Wireless Bluetooth Headphones' },
  { path: '/products/smart-watch', views: 18, title: 'Smart Watch Pro' },
  { path: '/', views: 15, title: 'Homepage' },
  { path: '/products/portable-speaker', views: 12, title: 'Portable Bluetooth Speaker' },
  { path: '/collections/electronics', views: 10, title: 'Electronics Collection' },
  { path: '/cart', views: 8, title: 'Shopping Cart' },
  { path: '/products/leather-wallet', views: 7, title: 'Premium Leather Wallet' },
  { path: '/checkout', views: 5, title: 'Checkout' },
];

// Mock visitor locations
const visitorLocations = [
  { country: 'United States', flag: '🇺🇸', visitors: 45, percentage: 35 },
  { country: 'United Kingdom', flag: '🇬🇧', visitors: 28, percentage: 22 },
  { country: 'Canada', flag: '🇨🇦', visitors: 18, percentage: 14 },
  { country: 'Germany', flag: '🇩🇪', visitors: 15, percentage: 12 },
  { country: 'Australia', flag: '🇦🇺', visitors: 12, percentage: 9 },
  { country: 'France', flag: '🇫🇷', visitors: 10, percentage: 8 },
];

// Mock device data
const deviceBreakdown = [
  { device: 'Desktop', icon: Monitor, visitors: 58, percentage: 45 },
  { device: 'Mobile', icon: Smartphone, visitors: 52, percentage: 40 },
  { device: 'Tablet', icon: Tablet, visitors: 19, percentage: 15 },
];

// Mock live activity feed
const generateActivityFeed = () => [
  { type: 'view', page: 'Wireless Headphones', time: '2s ago', location: 'New York, US' },
  { type: 'cart', product: 'Smart Watch Pro', time: '5s ago', location: 'London, UK' },
  { type: 'order', amount: 129.99, time: '12s ago', location: 'Toronto, CA' },
  { type: 'view', page: 'Homepage', time: '15s ago', location: 'Berlin, DE' },
  { type: 'cart', product: 'Leather Wallet', time: '23s ago', location: 'Sydney, AU' },
  { type: 'view', page: 'Electronics Collection', time: '28s ago', location: 'Paris, FR' },
  { type: 'order', amount: 89.50, time: '35s ago', location: 'Chicago, US' },
  { type: 'view', page: 'Portable Speaker', time: '42s ago', location: 'Munich, DE' },
];

// Generate mock chart data for last 30 minutes
const generateChartData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    name: `${30 - i}m`,
    visitors: Math.floor(Math.random() * 30) + 80,
    pageViews: Math.floor(Math.random() * 100) + 200,
  }));
};

export default function RealtimeAnalyticsPage() {
  const { currentStore } = useStoreStore();
  const [realtimeData, setRealtimeData] = React.useState(generateRealtimeData());
  const [activityFeed, setActivityFeed] = React.useState(generateActivityFeed());
  const [chartData, setChartData] = React.useState(generateChartData());

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData());
      setActivityFeed(generateActivityFeed());
      setChartData(generateChartData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Activity className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view real-time analytics.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold tracking-tight">Real-time</h1>
            <LiveIndicator />
          </div>
          <p className="text-muted-foreground">
            Live activity on your store right now.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Clock className="h-4 w-4" />
          <span>Updates every 5 seconds</span>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">{realtimeData.activeUsers}</p>
            <p className="text-sm text-white/40 mt-1">Active users now</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">{realtimeData.pageViews}</p>
            <p className="text-sm text-white/40 mt-1">Page views (30m)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">
              {formatCurrency(realtimeData.activeCartsValue, 'USD')}
            </p>
            <p className="text-sm text-white/40 mt-1">Active carts value</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">{realtimeData.ordersLast30Min}</p>
            <p className="text-sm text-white/40 mt-1">Orders (30m)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">
              {formatCurrency(realtimeData.revenueLast30Min, 'USD')}
            </p>
            <p className="text-sm text-white/40 mt-1">Revenue (30m)</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visitors & Page Views (Last 30 Minutes)</CardTitle>
          <CardDescription>Real-time traffic to your store</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChartComponent
            data={chartData}
            lines={[
              { dataKey: 'visitors', color: '#FF9100', name: 'Visitors' },
              { dataKey: 'pageViews', color: '#3B82F6', name: 'Page Views' },
            ]}
            height={250}
          />
        </CardContent>
      </Card>

      {/* Activity & Pages Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Live Activity
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </CardTitle>
            <CardDescription>What's happening right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activityFeed.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'order'
                        ? 'bg-emerald-500/20'
                        : activity.type === 'cart'
                        ? 'bg-purple-500/20'
                        : 'bg-blue-500/20'
                    }`}
                  >
                    {activity.type === 'order' ? (
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    ) : activity.type === 'cart' ? (
                      <ShoppingCart className="h-4 w-4 text-purple-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">
                      {activity.type === 'order'
                        ? `New order: ${formatCurrency(activity.amount!, 'USD')}`
                        : activity.type === 'cart'
                        ? `Added to cart: ${activity.product}`
                        : `Viewing: ${activity.page}`}
                    </p>
                    <p className="text-xs text-white/40 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </p>
                  </div>
                  <span className="text-xs text-white/30">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Pages</CardTitle>
            <CardDescription>Most viewed pages right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activePages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm text-white/40 w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{page.title}</p>
                    <p className="text-xs text-white/40 truncate">{page.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(page.views / activePages[0].views) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">{page.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location & Devices Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visitor Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitor Locations</CardTitle>
            <CardDescription>Where your visitors are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visitorLocations.map((location) => (
                <div key={location.country} className="flex items-center gap-3">
                  <span className="text-xl">{location.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/90">{location.country}</span>
                      <span className="text-sm font-medium text-white">{location.visitors}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Breakdown</CardTitle>
            <CardDescription>How visitors are accessing your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {deviceBreakdown.map((device) => {
                const Icon = device.icon;
                return (
                  <div
                    key={device.device}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-white/60" />
                    </div>
                    <p className="text-2xl font-bold text-white">{device.visitors}</p>
                    <p className="text-sm text-white/40">{device.device}</p>
                    <p className="text-xs text-primary mt-1">{device.percentage}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

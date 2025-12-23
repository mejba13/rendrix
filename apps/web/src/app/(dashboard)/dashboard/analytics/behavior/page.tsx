'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MousePointer,
  Clock,
  ArrowRight,
  Eye,
  ShoppingCart,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStoreStore } from '@/store/store';
import {
  BarChartComponent,
  MetricCard,
} from '@/components/analytics/charts';

type DateRange = '7d' | '30d' | '90d' | '12m';

// User flow data
const userFlowData = [
  { step: 'Homepage', users: 12580, dropoff: 0 },
  { step: 'Product View', users: 8420, dropoff: 33.1 },
  { step: 'Add to Cart', users: 3240, dropoff: 61.5 },
  { step: 'Checkout', users: 1890, dropoff: 41.7 },
  { step: 'Purchase', users: 892, dropoff: 52.8 },
];

// Page engagement data
const pageEngagementData = [
  { page: 'Homepage', avgTime: '1:45', views: 15420, exitRate: 18.2 },
  { page: 'Product Listing', avgTime: '2:32', views: 12840, exitRate: 22.5 },
  { page: 'Product Detail', avgTime: '3:15', views: 9650, exitRate: 15.8 },
  { page: 'Shopping Cart', avgTime: '2:08', views: 4280, exitRate: 28.4 },
  { page: 'Checkout', avgTime: '4:52', views: 2140, exitRate: 35.2 },
  { page: 'Search Results', avgTime: '1:28', views: 3650, exitRate: 20.1 },
];

// Click heatmap simulation data
const clickData = [
  { element: 'Add to Cart Button', clicks: 8420, percentage: 28.5 },
  { element: 'Product Images', clicks: 6850, percentage: 23.2 },
  { element: 'Navigation Menu', clicks: 5240, percentage: 17.8 },
  { element: 'Search Bar', clicks: 3650, percentage: 12.4 },
  { element: 'Filter Options', clicks: 2890, percentage: 9.8 },
  { element: 'Size Selector', clicks: 2450, percentage: 8.3 },
];

// Scroll depth data
const scrollDepthData = [
  { depth: '25%', users: 11200, percentage: 89 },
  { depth: '50%', users: 8940, percentage: 71 },
  { depth: '75%', users: 5620, percentage: 45 },
  { depth: '100%', users: 2810, percentage: 22 },
];

// Device behavior
const deviceBehavior = [
  { device: 'Desktop', icon: Monitor, sessions: 5840, avgTime: '4:12', bounceRate: 28.5, conversion: 8.2 },
  { device: 'Mobile', icon: Smartphone, sessions: 4920, avgTime: '2:45', bounceRate: 38.2, conversion: 5.8 },
  { device: 'Tablet', icon: Tablet, sessions: 1820, avgTime: '3:28', bounceRate: 32.1, conversion: 6.5 },
];

// Session duration distribution
const sessionDurationData = [
  { name: '0-10s', sessions: 1580 },
  { name: '10-30s', sessions: 2340 },
  { name: '30s-1m', sessions: 3120 },
  { name: '1-3m', sessions: 4580 },
  { name: '3-10m', sessions: 3240 },
  { name: '10m+', sessions: 1720 },
];

export default function BehaviorAnalyticsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <MousePointer className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view behavior analytics.
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
          <h1 className="text-3xl font-semibold tracking-tight">Behavior</h1>
          <p className="text-muted-foreground mt-1">
            Understand how users interact with your store.
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
          <Button variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Avg. Session Duration"
          value="3m 42s"
          change={8.5}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          iconBgColor="from-blue-500/20 to-cyan-500/10"
        />
        <MetricCard
          title="Pages per Session"
          value="4.8"
          change={5.2}
          icon={<Eye className="h-5 w-5 text-purple-500" />}
          iconBgColor="from-purple-500/20 to-violet-500/10"
        />
        <MetricCard
          title="Bounce Rate"
          value="32.4%"
          change={-3.8}
          icon={<MousePointer className="h-5 w-5 text-primary" />}
          iconBgColor="from-primary/20 to-orange-500/10"
        />
        <MetricCard
          title="Conversion Rate"
          value="7.09%"
          change={12.5}
          icon={<ShoppingCart className="h-5 w-5 text-emerald-500" />}
          iconBgColor="from-emerald-500/20 to-green-500/10"
        />
      </div>

      {/* User Flow Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Journey Flow</CardTitle>
          <CardDescription>How users navigate through your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            {userFlowData.map((step, index) => (
              <React.Fragment key={step.step}>
                <div className="flex-1 text-center">
                  <div
                    className="mx-auto mb-3 rounded-xl p-4 transition-all"
                    style={{
                      backgroundColor: `rgba(255, 145, 0, ${0.2 - index * 0.03})`,
                      width: `${100 - index * 10}%`,
                    }}
                  >
                    <p className="text-2xl font-bold text-white">{step.users.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-medium text-white/90">{step.step}</p>
                  {index > 0 && (
                    <p className="text-xs text-red-400 mt-1">-{step.dropoff}%</p>
                  )}
                </div>
                {index < userFlowData.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-white/20 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Engagement & Clicks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Page Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Engagement</CardTitle>
            <CardDescription>Time spent and exit rates by page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pageEngagementData.map((page) => (
                <div key={page.page} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90">{page.page}</p>
                    <p className="text-xs text-white/40">{page.views.toLocaleString()} views</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-sm font-medium text-white">{page.avgTime}</p>
                    <p className="text-xs text-white/40">avg time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{page.exitRate}%</p>
                    <p className="text-xs text-white/40">exit rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Click Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Click Distribution</CardTitle>
            <CardDescription>Most clicked elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clickData.map((item, index) => (
                <div key={item.element} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{item.element}</span>
                    <span className="font-medium text-white">{item.clicks.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: `hsl(${30 + index * 15}, 90%, 55%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Duration & Scroll Depth */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Session Duration Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Duration Distribution</CardTitle>
            <CardDescription>How long users stay on your store</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={sessionDurationData}
              dataKey="sessions"
              height={250}
              color="#FF9100"
            />
          </CardContent>
        </Card>

        {/* Scroll Depth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scroll Depth</CardTitle>
            <CardDescription>How far users scroll on pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scrollDepthData.map((depth) => (
                <div key={depth.depth} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Scrolled to {depth.depth}</span>
                    <span className="font-medium text-white">{depth.percentage}%</span>
                  </div>
                  <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${depth.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40">{depth.users.toLocaleString()} users</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device Behavior Comparison</CardTitle>
          <CardDescription>How behavior differs across devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {deviceBehavior.map((device) => {
              const Icon = device.icon;
              return (
                <div key={device.device} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white/60" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{device.device}</p>
                      <p className="text-sm text-white/40">{device.sessions.toLocaleString()} sessions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">Avg. Time</span>
                      <span className="text-sm font-medium text-white">{device.avgTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">Bounce Rate</span>
                      <span className="text-sm font-medium text-white">{device.bounceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">Conversion</span>
                      <span className="text-sm font-medium text-emerald-500">{device.conversion}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

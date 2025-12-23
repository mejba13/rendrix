'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Globe,
  Search,
  Share2,
  Mail,
  Link2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  Eye,
  Clock,
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
  DonutChartComponent,
  MetricCard,
} from '@/components/analytics/charts';

type DateRange = '7d' | '30d' | '90d' | '12m';

// Traffic sources data
const trafficSourcesData = [
  { name: 'Direct', value: 4250, color: '#FF9100', change: 12.5 },
  { name: 'Organic Search', value: 3180, color: '#3B82F6', change: 8.2 },
  { name: 'Social Media', value: 2340, color: '#8B5CF6', change: 15.8 },
  { name: 'Referral', value: 1650, color: '#10B981', change: -3.2 },
  { name: 'Email', value: 1160, color: '#F59E0B', change: 22.4 },
  { name: 'Paid Search', value: 890, color: '#EF4444', change: 5.1 },
];

// Traffic over time data
const trafficOverTime = [
  { name: 'Mon', direct: 580, organic: 420, social: 310, referral: 220, email: 150 },
  { name: 'Tue', direct: 620, organic: 450, social: 340, referral: 240, email: 170 },
  { name: 'Wed', direct: 590, organic: 480, social: 380, referral: 230, email: 160 },
  { name: 'Thu', direct: 650, organic: 510, social: 350, referral: 250, email: 180 },
  { name: 'Fri', direct: 700, organic: 540, social: 400, referral: 280, email: 200 },
  { name: 'Sat', direct: 550, organic: 390, social: 320, referral: 210, email: 140 },
  { name: 'Sun', direct: 560, organic: 390, social: 340, referral: 220, email: 160 },
];

// Top referrers
const topReferrers = [
  { domain: 'google.com', visits: 2840, percentage: 22.5 },
  { domain: 'facebook.com', visits: 1520, percentage: 12.1 },
  { domain: 'instagram.com', visits: 980, percentage: 7.8 },
  { domain: 'twitter.com', visits: 650, percentage: 5.2 },
  { domain: 'linkedin.com', visits: 420, percentage: 3.3 },
  { domain: 'pinterest.com', visits: 380, percentage: 3.0 },
  { domain: 'youtube.com', visits: 340, percentage: 2.7 },
  { domain: 'reddit.com', visits: 290, percentage: 2.3 },
];

// Top landing pages
const topLandingPages = [
  { page: '/', title: 'Homepage', sessions: 4250, bounceRate: 28.5 },
  { page: '/products', title: 'All Products', sessions: 2840, bounceRate: 32.1 },
  { page: '/collections/electronics', title: 'Electronics', sessions: 1920, bounceRate: 25.8 },
  { page: '/products/wireless-headphones', title: 'Wireless Headphones', sessions: 1540, bounceRate: 22.4 },
  { page: '/collections/accessories', title: 'Accessories', sessions: 1280, bounceRate: 30.2 },
];

// Geographic data
const geographicData = [
  { country: 'United States', flag: '🇺🇸', sessions: 5240, percentage: 41.6 },
  { country: 'United Kingdom', flag: '🇬🇧', sessions: 2180, percentage: 17.3 },
  { country: 'Canada', flag: '🇨🇦', sessions: 1450, percentage: 11.5 },
  { country: 'Germany', flag: '🇩🇪', sessions: 1120, percentage: 8.9 },
  { country: 'Australia', flag: '🇦🇺', sessions: 890, percentage: 7.1 },
  { country: 'France', flag: '🇫🇷', sessions: 720, percentage: 5.7 },
  { country: 'Netherlands', flag: '🇳🇱', sessions: 540, percentage: 4.3 },
  { country: 'Other', flag: '🌍', sessions: 460, percentage: 3.6 },
];

export default function TrafficAnalyticsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Globe className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view traffic analytics.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  const totalTraffic = trafficSourcesData.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Traffic</h1>
          <p className="text-muted-foreground mt-1">
            Understand where your visitors come from and how they find you.
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
          title="Total Sessions"
          value={totalTraffic.toLocaleString()}
          change={11.2}
          icon={<Users className="h-5 w-5 text-primary" />}
          iconBgColor="from-primary/20 to-orange-500/10"
        />
        <MetricCard
          title="Unique Visitors"
          value="9,840"
          change={8.5}
          icon={<Eye className="h-5 w-5 text-blue-500" />}
          iconBgColor="from-blue-500/20 to-cyan-500/10"
        />
        <MetricCard
          title="Avg. Session Duration"
          value="3m 42s"
          change={5.2}
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          iconBgColor="from-purple-500/20 to-violet-500/10"
        />
        <MetricCard
          title="Bounce Rate"
          value="32.4%"
          change={-2.8}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          iconBgColor="from-emerald-500/20 to-green-500/10"
        />
      </div>

      {/* Traffic Sources Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Traffic Sources Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Traffic by Source</CardTitle>
            <CardDescription>Sessions breakdown by acquisition channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <DonutChartComponent
                data={trafficSourcesData}
                height={250}
                innerRadius={60}
                outerRadius={90}
                showLegend={false}
              />
              <div className="space-y-3">
                {trafficSourcesData.map((source) => (
                  <div key={source.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/90">{source.name}</span>
                        <span className="text-sm font-medium text-white">{source.value.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-white/40">
                          {((source.value / totalTraffic) * 100).toFixed(1)}%
                        </span>
                        <span className={`text-xs flex items-center gap-0.5 ${source.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {source.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(source.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source Icons Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channel Performance</CardTitle>
            <CardDescription>Top performing channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Direct', icon: Link2, color: '#FF9100', sessions: 4250 },
                { name: 'Organic', icon: Search, color: '#3B82F6', sessions: 3180 },
                { name: 'Social', icon: Share2, color: '#8B5CF6', sessions: 2340 },
                { name: 'Email', icon: Mail, color: '#F59E0B', sessions: 1160 },
              ].map((channel) => {
                const Icon = channel.icon;
                return (
                  <div key={channel.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${channel.color}20` }}>
                      <Icon className="h-5 w-5" style={{ color: channel.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{channel.name}</p>
                      <p className="text-xs text-white/40">{channel.sessions.toLocaleString()} sessions</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Traffic Over Time</CardTitle>
          <CardDescription>Daily sessions by source</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartComponent
            data={trafficOverTime}
            dataKey="direct"
            secondaryDataKey="organic"
            height={300}
            color="#FF9100"
            secondaryColor="#3B82F6"
          />
        </CardContent>
      </Card>

      {/* Referrers & Landing Pages */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Referrers</CardTitle>
            <CardDescription>Websites sending you traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topReferrers.map((referrer, index) => (
                <div key={referrer.domain} className="flex items-center gap-3">
                  <span className="text-sm text-white/40 w-6">{index + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{referrer.domain}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{referrer.visits.toLocaleString()}</p>
                    <p className="text-xs text-white/40">{referrer.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Landing Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Landing Pages</CardTitle>
            <CardDescription>Most popular entry points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLandingPages.map((page, index) => (
                <div key={page.page} className="flex items-center gap-3">
                  <span className="text-sm text-white/40 w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{page.title}</p>
                    <p className="text-xs text-white/40 truncate">{page.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{page.sessions.toLocaleString()}</p>
                    <p className="text-xs text-white/40">{page.bounceRate}% bounce</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Geographic Distribution</CardTitle>
          <CardDescription>Where your visitors are located</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {geographicData.map((geo) => (
              <div key={geo.country} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{geo.flag}</span>
                  <span className="text-sm text-white/90 truncate">{geo.country}</span>
                </div>
                <p className="text-xl font-semibold text-white">{geo.sessions.toLocaleString()}</p>
                <div className="mt-2">
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${geo.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">{geo.percentage}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

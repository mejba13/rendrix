'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Mail,
  Share2,
  Search,
  DollarSign,
  TrendingUp,
  Target,
  RefreshCw,
  ArrowUpRight,
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
import { formatCurrency } from '@rendrix/utils';

type DateRange = '7d' | '30d' | '90d' | '12m';

// Campaign performance data
const campaignData = [
  { name: 'Black Friday Sale', channel: 'Email', spent: 2500, revenue: 18500, roas: 7.4, conversions: 245, status: 'active' },
  { name: 'Holiday Collection', channel: 'Social', spent: 1800, revenue: 9200, roas: 5.1, conversions: 128, status: 'active' },
  { name: 'New Year Promo', channel: 'Search', spent: 3200, revenue: 12800, roas: 4.0, conversions: 186, status: 'active' },
  { name: 'Flash Sale Weekend', channel: 'Email', spent: 800, revenue: 5600, roas: 7.0, conversions: 89, status: 'completed' },
  { name: 'Product Launch', channel: 'Social', spent: 2100, revenue: 8400, roas: 4.0, conversions: 112, status: 'paused' },
];

// Channel performance
const channelPerformance = [
  { name: 'Email Marketing', value: 35200, color: '#FF9100', spent: 4200, conversions: 456, cpa: 9.21 },
  { name: 'Paid Social', value: 22800, color: '#8B5CF6', spent: 5800, conversions: 312, cpa: 18.59 },
  { name: 'Paid Search', value: 18400, color: '#3B82F6', spent: 4500, conversions: 248, cpa: 18.15 },
  { name: 'Organic Social', value: 12600, color: '#10B981', spent: 0, conversions: 168, cpa: 0 },
  { name: 'Referral', value: 8900, color: '#F59E0B', spent: 1200, conversions: 124, cpa: 9.68 },
];

// Marketing spend over time
const spendOverTime = [
  { name: 'Week 1', email: 1200, social: 1500, search: 1100 },
  { name: 'Week 2', email: 1400, social: 1800, search: 1300 },
  { name: 'Week 3', email: 1100, social: 2100, search: 1500 },
  { name: 'Week 4', email: 1600, social: 1900, search: 1200 },
];

// Attribution data
const attributionData = [
  { model: 'First Touch', email: 32, social: 28, search: 24, direct: 16 },
  { model: 'Last Touch', email: 38, social: 22, search: 26, direct: 14 },
  { model: 'Linear', email: 35, social: 25, search: 25, direct: 15 },
];

// Top performing ads
const topAds = [
  { name: 'Winter Sale - 50% Off', channel: 'Facebook', ctr: 4.2, conversions: 89, spend: 450, revenue: 3560 },
  { name: 'New Arrivals Collection', channel: 'Instagram', ctr: 3.8, conversions: 72, spend: 380, revenue: 2880 },
  { name: 'Free Shipping Weekend', channel: 'Google Ads', ctr: 5.1, conversions: 64, spend: 520, revenue: 2560 },
  { name: 'Limited Time Offer', channel: 'Email', ctr: 8.4, conversions: 58, spend: 120, revenue: 2320 },
  { name: 'Best Sellers Showcase', channel: 'TikTok', ctr: 2.9, conversions: 45, spend: 290, revenue: 1800 },
];

export default function MarketingAnalyticsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view marketing analytics.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  const totalRevenue = channelPerformance.reduce((sum, c) => sum + c.value, 0);
  const totalSpent = channelPerformance.reduce((sum, c) => sum + c.spent, 0);
  const totalConversions = channelPerformance.reduce((sum, c) => sum + c.conversions, 0);
  const overallRoas = totalRevenue / totalSpent;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Marketing</h1>
          <p className="text-muted-foreground mt-1">
            Track campaign performance and marketing ROI.
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
          title="Marketing Revenue"
          value={formatCurrency(totalRevenue, 'USD')}
          change={18.5}
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          iconBgColor="from-emerald-500/20 to-green-500/10"
        />
        <MetricCard
          title="Total Ad Spend"
          value={formatCurrency(totalSpent, 'USD')}
          change={12.2}
          icon={<Megaphone className="h-5 w-5 text-primary" />}
          iconBgColor="from-primary/20 to-orange-500/10"
        />
        <MetricCard
          title="ROAS"
          value={`${overallRoas.toFixed(1)}x`}
          change={8.4}
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          iconBgColor="from-blue-500/20 to-cyan-500/10"
        />
        <MetricCard
          title="Conversions"
          value={totalConversions.toLocaleString()}
          change={22.1}
          icon={<Target className="h-5 w-5 text-purple-500" />}
          iconBgColor="from-purple-500/20 to-violet-500/10"
        />
      </div>

      {/* Channel Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Channel</CardTitle>
            <CardDescription>Performance breakdown by marketing channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <DonutChartComponent
                data={channelPerformance}
                height={250}
                innerRadius={60}
                outerRadius={90}
                showLegend={false}
              />
              <div className="space-y-3">
                {channelPerformance.map((channel) => (
                  <div key={channel.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/90">{channel.name}</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(channel.value, 'USD')}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-white/40">
                          {((channel.value / totalRevenue) * 100).toFixed(1)}% of total
                        </span>
                        <span className="text-xs text-white/40">
                          CPA: {channel.cpa > 0 ? formatCurrency(channel.cpa, 'USD') : 'Organic'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channel Overview</CardTitle>
            <CardDescription>Key metrics by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Email', icon: Mail, color: '#FF9100', roas: 8.4 },
                { name: 'Social', icon: Share2, color: '#8B5CF6', roas: 3.9 },
                { name: 'Search', icon: Search, color: '#3B82F6', roas: 4.1 },
              ].map((channel) => {
                const Icon = channel.icon;
                return (
                  <div key={channel.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${channel.color}20` }}>
                      <Icon className="h-5 w-5" style={{ color: channel.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{channel.name}</p>
                      <p className="text-xs text-white/40">ROAS: {channel.roas}x</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-500 text-sm flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" />
                        +12%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Performance</CardTitle>
          <CardDescription>Active and recent marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/40">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/40">Channel</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white/40">Spent</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white/40">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white/40">ROAS</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white/40">Conversions</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-white/40">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign) => (
                  <tr key={campaign.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-white">{campaign.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-white/60">{campaign.channel}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-white">{formatCurrency(campaign.spent, 'USD')}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-white font-medium">{formatCurrency(campaign.revenue, 'USD')}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`text-sm font-medium ${campaign.roas >= 5 ? 'text-emerald-500' : campaign.roas >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {campaign.roas.toFixed(1)}x
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-white">{campaign.conversions}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : campaign.status === 'paused'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Spend Over Time & Top Ads */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Marketing Spend Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ad Spend by Channel</CardTitle>
            <CardDescription>Weekly spend breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={spendOverTime}
              dataKey="email"
              secondaryDataKey="social"
              height={250}
              color="#FF9100"
              secondaryColor="#8B5CF6"
              isCurrency
            />
          </CardContent>
        </Card>

        {/* Top Performing Ads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Ads</CardTitle>
            <CardDescription>Best ROI ads this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAds.map((ad, index) => (
                <div key={ad.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <span className="text-sm text-white/40 w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{ad.name}</p>
                    <p className="text-xs text-white/40">{ad.channel} • CTR: {ad.ctr}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatCurrency(ad.revenue, 'USD')}</p>
                    <p className="text-xs text-emerald-500">{((ad.revenue / ad.spend)).toFixed(1)}x ROAS</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attribution Model Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attribution Model Comparison</CardTitle>
          <CardDescription>How different models attribute conversions to channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {attributionData.map((model) => (
              <div key={model.model} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="text-sm font-medium text-white mb-4">{model.model}</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Email', value: model.email, color: '#FF9100' },
                    { name: 'Social', value: model.social, color: '#8B5CF6' },
                    { name: 'Search', value: model.search, color: '#3B82F6' },
                    { name: 'Direct', value: model.direct, color: '#10B981' },
                  ].map((channel) => (
                    <div key={channel.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">{channel.name}</span>
                        <span className="text-white">{channel.value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${channel.value}%`, backgroundColor: channel.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

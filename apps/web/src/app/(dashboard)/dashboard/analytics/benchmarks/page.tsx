'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Award,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
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
import { formatCurrency } from '@rendrix/utils';
import { BarChartComponent } from '@/components/analytics/charts';

type Industry = 'ecommerce' | 'fashion' | 'electronics' | 'home' | 'beauty';

// Benchmark data structure
interface BenchmarkMetric {
  name: string;
  yourValue: number | string;
  industryAvg: number | string;
  topPerformers: number | string;
  percentile: number;
  unit?: string;
  format?: 'currency' | 'percent' | 'number' | 'time';
}

// Benchmark metrics
const benchmarkMetrics: BenchmarkMetric[] = [
  {
    name: 'Conversion Rate',
    yourValue: 4.2,
    industryAvg: 2.8,
    topPerformers: 6.5,
    percentile: 72,
    unit: '%',
    format: 'percent',
  },
  {
    name: 'Average Order Value',
    yourValue: 89.50,
    industryAvg: 75.20,
    topPerformers: 125.00,
    percentile: 65,
    format: 'currency',
  },
  {
    name: 'Cart Abandonment Rate',
    yourValue: 68.5,
    industryAvg: 69.8,
    topPerformers: 55.0,
    percentile: 58,
    unit: '%',
    format: 'percent',
  },
  {
    name: 'Bounce Rate',
    yourValue: 32.4,
    industryAvg: 42.5,
    topPerformers: 25.0,
    percentile: 78,
    unit: '%',
    format: 'percent',
  },
  {
    name: 'Session Duration',
    yourValue: '3:42',
    industryAvg: '2:45',
    topPerformers: '5:20',
    percentile: 68,
    format: 'time',
  },
  {
    name: 'Pages per Session',
    yourValue: 4.8,
    industryAvg: 3.2,
    topPerformers: 6.5,
    percentile: 74,
    format: 'number',
  },
  {
    name: 'Customer Return Rate',
    yourValue: 28.5,
    industryAvg: 22.0,
    topPerformers: 45.0,
    percentile: 62,
    unit: '%',
    format: 'percent',
  },
  {
    name: 'Email Open Rate',
    yourValue: 22.4,
    industryAvg: 18.5,
    topPerformers: 32.0,
    percentile: 70,
    unit: '%',
    format: 'percent',
  },
];

// Competitive comparison data
const competitiveData = [
  { name: 'Your Store', conversion: 4.2, aov: 89.5, satisfaction: 4.5 },
  { name: 'Industry Avg', conversion: 2.8, aov: 75.2, satisfaction: 3.8 },
  { name: 'Top 10%', conversion: 6.5, aov: 125.0, satisfaction: 4.8 },
];

// Performance scoring
const performanceScore = {
  overall: 72,
  conversion: 78,
  engagement: 74,
  retention: 62,
  acquisition: 68,
};

// Industry trends
const industryTrends = [
  { metric: 'Mobile Traffic', change: '+12%', direction: 'up', insight: 'Mobile shopping continues to grow' },
  { metric: 'Social Commerce', change: '+28%', direction: 'up', insight: 'Social media driving more sales' },
  { metric: 'Email Engagement', change: '-5%', direction: 'down', insight: 'Email fatigue affecting opens' },
  { metric: 'Video Content', change: '+45%', direction: 'up', insight: 'Product videos boost conversions' },
  { metric: 'Same-Day Shipping', change: '+35%', direction: 'up', insight: 'Fast shipping expectations rising' },
];

export default function BenchmarksPage() {
  const { currentStore } = useStoreStore();
  const [industry, setIndustry] = React.useState<Industry>('ecommerce');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Award className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view industry benchmarks.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-emerald-500';
    if (percentile >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPercentileBg = (percentile: number) => {
    if (percentile >= 75) return 'bg-emerald-500';
    if (percentile >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatValue = (value: number | string, format?: string): string => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return formatCurrency(value, 'USD');
      case 'percent':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Benchmarks</h1>
          <p className="text-muted-foreground mt-1">
            Compare your store against industry standards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={industry} onValueChange={(v: Industry) => setIndustry(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">All E-commerce</SelectItem>
              <SelectItem value="fashion">Fashion & Apparel</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="beauty">Beauty & Health</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Performance Score Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Overall Score */}
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#FF9100"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${performanceScore.overall * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{performanceScore.overall}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Performance Score</h3>
                <p className="text-sm text-white/60">You're outperforming {performanceScore.overall}% of stores</p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(performanceScore)
                .filter(([key]) => key !== 'overall')
                .map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-white/40 capitalize">{key}</p>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getPercentileBg(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics Comparison</CardTitle>
          <CardDescription>How your store compares to industry benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/40">Metric</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-white/40">Your Store</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-white/40">Industry Avg</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-white/40">Top 10%</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-white/40">Percentile</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkMetrics.map((metric) => (
                  <tr key={metric.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-white">{metric.name}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium text-white">
                        {formatValue(metric.yourValue, metric.format)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-white/60">
                        {formatValue(metric.industryAvg, metric.format)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-emerald-500">
                        {formatValue(metric.topPerformers, metric.format)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getPercentileBg(metric.percentile)}`}
                            style={{ width: `${metric.percentile}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getPercentileColor(metric.percentile)}`}>
                          {metric.percentile}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Comparison & Industry Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Rate Comparison</CardTitle>
            <CardDescription>Your performance vs. benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={competitiveData}
              dataKey="conversion"
              height={250}
              color="#FF9100"
            />
          </CardContent>
        </Card>

        {/* Industry Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Industry Trends</CardTitle>
            <CardDescription>What's changing in e-commerce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {industryTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    trend.direction === 'up' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    {trend.direction === 'up' ? (
                      <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{trend.metric}</p>
                      <span className={`text-sm font-medium ${
                        trend.direction === 'up' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {trend.change}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{trend.insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
          <CardDescription>Areas where you can catch up to top performers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {benchmarkMetrics
              .filter((m) => m.percentile < 70)
              .slice(0, 3)
              .map((metric) => {
                const gap = typeof metric.topPerformers === 'number' && typeof metric.yourValue === 'number'
                  ? ((metric.topPerformers - metric.yourValue) / metric.yourValue * 100).toFixed(0)
                  : null;
                return (
                  <div key={metric.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-white">{metric.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          Currently at {metric.percentile}th percentile
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        metric.percentile < 50 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        Below avg
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Your value</span>
                        <span className="text-white">{formatValue(metric.yourValue, metric.format)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Top 10% target</span>
                        <span className="text-emerald-500">{formatValue(metric.topPerformers, metric.format)}</span>
                      </div>
                      {gap && (
                        <p className="text-xs text-primary mt-2">
                          {gap}% improvement needed to reach top performers
                        </p>
                      )}
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

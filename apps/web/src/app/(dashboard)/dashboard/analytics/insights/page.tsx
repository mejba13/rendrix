'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Target,
  Users,
  RefreshCw,
  ChevronRight,
  Zap,
  Heart,
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

type DateRange = '7d' | '30d' | '90d' | '12m';
type InsightCategory = 'all' | 'growth' | 'conversion' | 'customer' | 'product';

// AI-generated insights
const insights = [
  {
    id: 1,
    category: 'growth',
    type: 'opportunity',
    priority: 'high',
    title: 'Mobile conversion rate is 40% lower than desktop',
    description: 'Your mobile visitors convert at 3.2% compared to 5.8% on desktop. Optimizing mobile checkout could increase revenue by $12,400/month.',
    impact: '+$12,400/mo',
    impactType: 'revenue',
    actionable: true,
    action: 'Optimize mobile checkout',
    metrics: [
      { label: 'Desktop conversion', value: '5.8%' },
      { label: 'Mobile conversion', value: '3.2%' },
      { label: 'Mobile traffic share', value: '58%' },
    ],
  },
  {
    id: 2,
    category: 'conversion',
    type: 'alert',
    priority: 'high',
    title: 'Cart abandonment spike detected',
    description: 'Cart abandonment rate increased by 15% in the last 7 days. Most abandonments occur at the shipping step.',
    impact: '-8.2%',
    impactType: 'conversion',
    actionable: true,
    action: 'Review shipping options',
    metrics: [
      { label: 'Current abandonment', value: '72.4%' },
      { label: 'Previous period', value: '62.8%' },
      { label: 'Drop-off point', value: 'Shipping' },
    ],
  },
  {
    id: 3,
    category: 'product',
    type: 'success',
    priority: 'medium',
    title: 'Wireless Headphones exceeding expectations',
    description: 'This product has 3.2x higher conversion rate than average. Consider featuring it more prominently and creating bundles.',
    impact: '+$8,240',
    impactType: 'revenue',
    actionable: true,
    action: 'Create product bundles',
    metrics: [
      { label: 'Product conversion', value: '12.4%' },
      { label: 'Store average', value: '3.9%' },
      { label: 'Monthly revenue', value: '$24,680' },
    ],
  },
  {
    id: 4,
    category: 'customer',
    type: 'opportunity',
    priority: 'medium',
    title: 'Repeat customers spend 2.4x more',
    description: 'Your returning customers have an AOV of $156 vs $65 for new customers. A loyalty program could increase retention by 25%.',
    impact: '+25%',
    impactType: 'retention',
    actionable: true,
    action: 'Launch loyalty program',
    metrics: [
      { label: 'Repeat customer AOV', value: '$156' },
      { label: 'New customer AOV', value: '$65' },
      { label: 'Repeat rate', value: '18%' },
    ],
  },
  {
    id: 5,
    category: 'growth',
    type: 'opportunity',
    priority: 'low',
    title: 'Email campaigns underperforming',
    description: 'Your email open rate (18%) is below industry average (22%). Subject line optimization could improve engagement.',
    impact: '+22%',
    impactType: 'engagement',
    actionable: true,
    action: 'A/B test subject lines',
    metrics: [
      { label: 'Open rate', value: '18%' },
      { label: 'Industry avg', value: '22%' },
      { label: 'Click rate', value: '2.4%' },
    ],
  },
  {
    id: 6,
    category: 'product',
    type: 'alert',
    priority: 'medium',
    title: 'Low stock alert for top seller',
    description: 'Smart Watch Pro has only 12 units left and sells 8/day on average. Risk of stockout in 2 days.',
    impact: 'Stockout risk',
    impactType: 'inventory',
    actionable: true,
    action: 'Reorder inventory',
    metrics: [
      { label: 'Units remaining', value: '12' },
      { label: 'Daily sales avg', value: '8' },
      { label: 'Days to stockout', value: '2' },
    ],
  },
];

// Trend analysis
const trends = [
  { metric: 'Revenue', current: 48250, previous: 42100, change: 14.6, trend: 'up' },
  { metric: 'Orders', current: 892, previous: 784, change: 13.8, trend: 'up' },
  { metric: 'Conversion Rate', current: 4.2, previous: 3.8, change: 10.5, trend: 'up' },
  { metric: 'Cart Abandonment', current: 72.4, previous: 68.2, change: 6.2, trend: 'down' },
  { metric: 'Avg. Session Duration', current: 3.42, previous: 3.18, change: 7.5, trend: 'up' },
  { metric: 'Bounce Rate', current: 32.4, previous: 35.8, change: -9.5, trend: 'up' },
];

// Recommendations
const recommendations = [
  {
    icon: Target,
    title: 'Enable abandoned cart emails',
    description: 'Recover 15-20% of abandoned carts with automated email reminders.',
    priority: 'high',
    estimatedImpact: '+$3,200/mo',
  },
  {
    icon: Users,
    title: 'Add customer reviews',
    description: 'Products with reviews convert 270% better than those without.',
    priority: 'high',
    estimatedImpact: '+18% conversion',
  },
  {
    icon: Zap,
    title: 'Enable one-click checkout',
    description: 'Reduce checkout friction for returning customers.',
    priority: 'medium',
    estimatedImpact: '+12% conversion',
  },
  {
    icon: Heart,
    title: 'Add wishlist feature',
    description: 'Let customers save products for later and re-engage them.',
    priority: 'low',
    estimatedImpact: '+8% retention',
  },
];

export default function InsightsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');
  const [category, setCategory] = React.useState<InsightCategory>('all');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Lightbulb className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view AI-powered insights.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  const filteredInsights = insights.filter((insight) =>
    category === 'all' ? true : insight.category === category
  );

  const highPriorityCount = insights.filter((i) => i.priority === 'high').length;
  const opportunityCount = insights.filter((i) => i.type === 'opportunity').length;
  const alertCount = insights.filter((i) => i.type === 'alert').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
              <Sparkles className="h-3 w-3" />
              AI-powered
            </span>
          </div>
          <p className="text-muted-foreground">
            Actionable recommendations to grow your business.
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

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{highPriorityCount}</p>
                <p className="text-sm text-white/40">High priority items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{opportunityCount}</p>
                <p className="text-sm text-white/40">Growth opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{alertCount}</p>
                <p className="text-sm text-white/40">Alerts to address</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All Insights' },
          { value: 'growth', label: 'Growth' },
          { value: 'conversion', label: 'Conversion' },
          { value: 'customer', label: 'Customer' },
          { value: 'product', label: 'Product' },
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={category === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(tab.value as InsightCategory)}
            className={category === tab.value ? '' : 'border-white/[0.08]'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className={`border-l-4 ${
            insight.type === 'alert'
              ? 'border-l-yellow-500'
              : insight.type === 'success'
              ? 'border-l-emerald-500'
              : 'border-l-blue-500'
          }`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  insight.type === 'alert'
                    ? 'bg-yellow-500/20'
                    : insight.type === 'success'
                    ? 'bg-emerald-500/20'
                    : 'bg-blue-500/20'
                }`}>
                  {insight.type === 'alert' ? (
                    <AlertTriangle className={`h-5 w-5 text-yellow-500`} />
                  ) : insight.type === 'success' ? (
                    <CheckCircle className={`h-5 w-5 text-emerald-500`} />
                  ) : (
                    <Lightbulb className={`h-5 w-5 text-blue-500`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-white">{insight.title}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          insight.priority === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : insight.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {insight.priority}
                        </span>
                      </div>
                      <p className="text-sm text-white/60">{insight.description}</p>
                    </div>

                    {/* Impact */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${
                        insight.impactType === 'revenue' || insight.impactType === 'retention'
                          ? 'text-emerald-500'
                          : insight.impactType === 'conversion'
                          ? insight.impact.startsWith('-') ? 'text-red-500' : 'text-emerald-500'
                          : 'text-yellow-500'
                      }`}>
                        {insight.impact}
                      </p>
                      <p className="text-xs text-white/40 capitalize">{insight.impactType}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/[0.06]">
                    {insight.metrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-sm font-medium text-white">{metric.value}</p>
                        <p className="text-xs text-white/40">{metric.label}</p>
                      </div>
                    ))}
                    {insight.actionable && (
                      <div className="ml-auto">
                        <Button size="sm" variant="outline" className="border-white/[0.08]">
                          {insight.action}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Analysis & Recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trend Analysis</CardTitle>
            <CardDescription>Key metrics compared to previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.map((item) => (
                <div key={item.metric} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{item.metric}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">
                      {typeof item.current === 'number' && item.metric.includes('Rate')
                        ? `${item.current}%`
                        : typeof item.current === 'number' && item.metric === 'Revenue'
                        ? formatCurrency(item.current, 'USD')
                        : item.current}
                    </span>
                    <span className={`text-sm flex items-center gap-0.5 ${
                      (item.trend === 'up' && item.change > 0) || (item.trend === 'down' && item.change < 0)
                        ? item.metric === 'Cart Abandonment' || item.metric === 'Bounce Rate'
                          ? item.change > 0 ? 'text-red-500' : 'text-emerald-500'
                          : 'text-emerald-500'
                        : 'text-red-500'
                    }`}>
                      {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Wins</CardTitle>
            <CardDescription>Easy improvements with high impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white">{rec.title}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          rec.priority === 'high'
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{rec.description}</p>
                      <p className="text-xs text-emerald-500 mt-1">{rec.estimatedImpact}</p>
                    </div>
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

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Instagram,
  Mail,
  Share2,
  Gift,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  ArrowUpRight,
  BarChart3,
  Zap,
  Calendar,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Marketing overview stats
const overviewStats = [
  {
    label: 'Total Spend',
    value: '$2,450',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Total Reach',
    value: '45.2K',
    change: '+28.3%',
    changeType: 'positive' as const,
    icon: Eye,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Conversions',
    value: '1,284',
    change: '+18.7%',
    changeType: 'positive' as const,
    icon: MousePointer,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'New Customers',
    value: '342',
    change: '-5.2%',
    changeType: 'negative' as const,
    icon: Users,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

// Marketing channels
const marketingChannels = [
  {
    name: 'Google Ads',
    icon: Target,
    href: '/dashboard/marketing/google-ads',
    status: 'active',
    spend: '$1,245',
    conversions: 456,
    cpc: '$0.82',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    name: 'Facebook & Instagram',
    icon: Instagram,
    href: '/dashboard/marketing/facebook-ads',
    status: 'active',
    spend: '$856',
    conversions: 328,
    cpc: '$0.64',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    gradient: 'from-pink-500/20 to-purple-600/5',
  },
  {
    name: 'Email Marketing',
    icon: Mail,
    href: '/dashboard/marketing/email',
    status: 'active',
    spend: '$0',
    conversions: 245,
    cpc: 'Free',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20 to-orange-600/5',
  },
  {
    name: 'Social Media',
    icon: Share2,
    href: '/dashboard/marketing/social',
    status: 'paused',
    spend: '$349',
    conversions: 156,
    cpc: '$1.12',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    gradient: 'from-cyan-500/20 to-blue-600/5',
  },
  {
    name: 'Referral Program',
    icon: Gift,
    href: '/dashboard/marketing/referral',
    status: 'active',
    spend: '$0',
    conversions: 99,
    cpc: 'Free',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20 to-green-600/5',
  },
];

// Recent campaigns
const recentCampaigns = [
  {
    name: 'Summer Sale 2024',
    channel: 'Google Ads',
    status: 'active',
    spend: '$456',
    impressions: '12.4K',
    clicks: '892',
  },
  {
    name: 'New Collection Launch',
    channel: 'Instagram',
    status: 'active',
    spend: '$289',
    impressions: '8.7K',
    clicks: '634',
  },
  {
    name: 'Weekly Newsletter',
    channel: 'Email',
    status: 'sent',
    spend: '$0',
    impressions: '5.2K',
    clicks: '421',
  },
  {
    name: 'Black Friday Prep',
    channel: 'Facebook',
    status: 'scheduled',
    spend: '$0',
    impressions: '-',
    clicks: '-',
  },
];

// Stat card component
function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
            <Icon className={cn('w-5 h-5', color)} />
          </div>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              changeType === 'positive'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-red-400 bg-red-500/10'
            )}
          >
            {changeType === 'positive' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </div>
        </div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-white/40">{label}</p>
      </div>
    </div>
  );
}

// Channel card component
function ChannelCard({
  channel,
}: {
  channel: (typeof marketingChannels)[0];
}) {
  return (
    <Link
      href={channel.href}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300"
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300', channel.gradient)} />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', channel.bg)}>
            <channel.icon className={cn('w-6 h-6', channel.color)} />
          </div>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              channel.status === 'active'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            )}
          >
            {channel.status === 'active' ? 'Active' : 'Paused'}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors">
          {channel.name}
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-white/40 mb-1">Spend</p>
            <p className="text-sm font-medium text-white">{channel.spend}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Conv.</p>
            <p className="text-sm font-medium text-white">{channel.conversions}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">CPC</p>
            <p className="text-sm font-medium text-white">{channel.cpc}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-white/40">View details</span>
          <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default function MarketingHomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing</h1>
          <p className="text-white/50 mt-1">
            Manage your marketing campaigns and track performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Marketing Channels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Marketing Channels</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/40 hover:text-white"
          >
            View All
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {marketingChannels.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>
      </div>

      {/* Recent Campaigns & Tips */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Campaigns</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white/40 hover:text-white"
              >
                View All
              </Button>
            </div>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {recentCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{campaign.name}</p>
                    <p className="text-sm text-white/40">{campaign.channel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right hidden sm:block">
                    <p className="text-white/40">Impressions</p>
                    <p className="font-medium text-white">{campaign.impressions}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-white/40">Clicks</p>
                    <p className="font-medium text-white">{campaign.clicks}</p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      campaign.status === 'active' && 'bg-emerald-500/20 text-emerald-400',
                      campaign.status === 'sent' && 'bg-blue-500/20 text-blue-400',
                      campaign.status === 'scheduled' && 'bg-amber-500/20 text-amber-400'
                    )}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Marketing Tips</h3>
                <p className="text-xs text-white/40">Optimize your campaigns</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      Set up retargeting
                    </p>
                    <p className="text-xs text-white/40">
                      Re-engage visitors who didn't convert with targeted ads.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      A/B test your emails
                    </p>
                    <p className="text-xs text-white/40">
                      Test subject lines to improve open rates by up to 30%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      Launch referral program
                    </p>
                    <p className="text-xs text-white/40">
                      Turn customers into advocates with rewards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-white/[0.02] border-primary/30 hover:bg-primary/10 text-primary"
            >
              View All Tips
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  BarChart3,
  Play,
  Pause,
  Settings,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Campaign stats
const campaignStats = [
  {
    label: 'Total Spend',
    value: '$1,245',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Impressions',
    value: '124.5K',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: Eye,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Clicks',
    value: '3,842',
    change: '+12.1%',
    changeType: 'positive' as const,
    icon: MousePointer,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Conversions',
    value: '456',
    change: '-2.4%',
    changeType: 'negative' as const,
    icon: Target,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

// Campaigns data
const campaigns = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    type: 'Search',
    status: 'active',
    budget: '$50/day',
    spend: '$456',
    impressions: '45.2K',
    clicks: '1,284',
    ctr: '2.84%',
    conversions: 156,
    cpc: '$0.36',
    roas: '4.2x',
  },
  {
    id: '2',
    name: 'Brand Awareness',
    type: 'Display',
    status: 'active',
    budget: '$30/day',
    spend: '$289',
    impressions: '32.1K',
    clicks: '892',
    ctr: '2.78%',
    conversions: 89,
    cpc: '$0.32',
    roas: '3.8x',
  },
  {
    id: '3',
    name: 'Product Launch - Q4',
    type: 'Shopping',
    status: 'paused',
    budget: '$75/day',
    spend: '$0',
    impressions: '0',
    clicks: '0',
    ctr: '0%',
    conversions: 0,
    cpc: '-',
    roas: '-',
  },
  {
    id: '4',
    name: 'Retargeting Campaign',
    type: 'Display',
    status: 'active',
    budget: '$25/day',
    spend: '$198',
    impressions: '18.4K',
    clicks: '634',
    ctr: '3.45%',
    conversions: 78,
    cpc: '$0.31',
    roas: '5.1x',
  },
  {
    id: '5',
    name: 'Holiday Prep',
    type: 'Search',
    status: 'scheduled',
    budget: '$100/day',
    spend: '$0',
    impressions: '0',
    clicks: '0',
    ctr: '0%',
    conversions: 0,
    cpc: '-',
    roas: '-',
  },
];

// Ad groups for quick view
const topAdGroups = [
  { name: 'Electronics', clicks: 892, conversions: 67, spend: '$156' },
  { name: 'Clothing', clicks: 634, conversions: 45, spend: '$98' },
  { name: 'Home & Garden', clicks: 421, conversions: 32, spend: '$72' },
  { name: 'Sports', clicks: 312, conversions: 24, spend: '$54' },
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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

// Status badge component
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        status === 'active' && 'bg-emerald-500/20 text-emerald-400',
        status === 'paused' && 'bg-amber-500/20 text-amber-400',
        status === 'scheduled' && 'bg-blue-500/20 text-blue-400',
        status === 'ended' && 'bg-white/10 text-white/50'
      )}
    >
      {status === 'active' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'paused' && <Pause className="w-3 h-3" />}
      {status === 'scheduled' && <Clock className="w-3 h-3" />}
      {status === 'ended' && <AlertCircle className="w-3 h-3" />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

// Campaign type badge
function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-xs font-medium',
        type === 'Search' && 'bg-blue-500/20 text-blue-400',
        type === 'Display' && 'bg-purple-500/20 text-purple-400',
        type === 'Shopping' && 'bg-emerald-500/20 text-emerald-400',
        type === 'Video' && 'bg-red-500/20 text-red-400'
      )}
    >
      {type}
    </span>
  );
}

export default function GoogleAdsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="shrink-0 hover:bg-white/[0.08] rounded-xl"
          >
            <Link href="/dashboard/marketing">
              <ArrowLeft className="h-5 w-5 text-white/70" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Google Ads</h1>
                <p className="text-white/50 text-sm">
                  Manage your search, display, and shopping campaigns
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Button
            variant="outline"
            className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Google Ads
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {campaignStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Campaigns</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#1a1a1a] border-white/[0.08]"
                >
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('all')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('active')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('paused')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    Paused
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('scheduled')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    Scheduled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Conv.
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  ROAS
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{campaign.name}</p>
                        <TypeBadge type={campaign.type} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.budget}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {campaign.spend}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {campaign.impressions}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.clicks}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.ctr}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {campaign.conversions}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        campaign.roas !== '-' ? 'text-emerald-400' : 'text-white/40'
                      )}
                    >
                      {campaign.roas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-white/[0.08]"
                        >
                          <MoreHorizontal className="w-4 h-4 text-white/50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1a1a1a] border-white/[0.08]"
                      >
                        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.08]">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.08]">
                          {campaign.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Campaign
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume Campaign
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.08]">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.08]">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.08]" />
                        <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Top Ad Groups & Quick Tips */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Ad Groups */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-white">Top Performing Ad Groups</h3>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {topAdGroups.map((group, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm font-medium text-blue-400">
                    {index + 1}
                  </div>
                  <span className="font-medium text-white">{group.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-white/40">Clicks</p>
                    <p className="font-medium text-white">{group.clicks}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40">Conv.</p>
                    <p className="font-medium text-white">{group.conversions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40">Spend</p>
                    <p className="font-medium text-white">{group.spend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Optimization Tips</h3>
                <p className="text-xs text-white/40">Improve your campaigns</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <p className="text-sm font-medium text-white mb-1">
                  Add negative keywords
                </p>
                <p className="text-xs text-white/40">
                  Exclude irrelevant searches to improve ROI.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <p className="text-sm font-medium text-white mb-1">
                  Review Quality Score
                </p>
                <p className="text-xs text-white/40">
                  Improve ad relevance to lower CPC.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <p className="text-sm font-medium text-white mb-1">
                  Test ad variations
                </p>
                <p className="text-xs text-white/40">
                  A/B test headlines and descriptions.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-white/[0.02] border-blue-500/30 hover:bg-blue-500/10 text-blue-400"
            >
              View All Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

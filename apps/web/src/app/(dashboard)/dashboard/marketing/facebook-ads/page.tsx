'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Instagram,
  Facebook,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Heart,
  MessageCircle,
  Share,
  Play,
  Pause,
  Settings,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  ChevronDown,
  Image,
  Film,
  Layers,
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
    value: '$856',
    change: '+14.2%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Reach',
    value: '89.2K',
    change: '+22.8%',
    changeType: 'positive' as const,
    icon: Eye,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Engagement',
    value: '12.4K',
    change: '+18.5%',
    changeType: 'positive' as const,
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    label: 'Conversions',
    value: '328',
    change: '+8.3%',
    changeType: 'positive' as const,
    icon: MousePointer,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

// Campaigns data
const campaigns = [
  {
    id: '1',
    name: 'New Collection Launch',
    platform: 'both',
    type: 'Carousel',
    status: 'active',
    budget: '$40/day',
    spend: '$289',
    reach: '32.1K',
    impressions: '45.2K',
    engagement: '4,521',
    clicks: '1,284',
    conversions: 89,
    ctr: '2.84%',
  },
  {
    id: '2',
    name: 'Story Ads - Summer',
    platform: 'instagram',
    type: 'Stories',
    status: 'active',
    budget: '$25/day',
    spend: '$198',
    reach: '18.4K',
    impressions: '24.1K',
    engagement: '2,341',
    clicks: '892',
    conversions: 67,
    ctr: '3.70%',
  },
  {
    id: '3',
    name: 'Reels Campaign',
    platform: 'instagram',
    type: 'Reels',
    status: 'active',
    budget: '$35/day',
    spend: '$245',
    reach: '28.7K',
    impressions: '38.4K',
    engagement: '5,892',
    clicks: '1,023',
    conversions: 78,
    ctr: '2.66%',
  },
  {
    id: '4',
    name: 'Facebook Retargeting',
    platform: 'facebook',
    type: 'Feed',
    status: 'paused',
    budget: '$20/day',
    spend: '$0',
    reach: '0',
    impressions: '0',
    engagement: '0',
    clicks: '0',
    conversions: 0,
    ctr: '0%',
  },
  {
    id: '5',
    name: 'Product Showcase',
    platform: 'both',
    type: 'Collection',
    status: 'scheduled',
    budget: '$50/day',
    spend: '$0',
    reach: '0',
    impressions: '0',
    engagement: '0',
    clicks: '0',
    conversions: 0,
    ctr: '0%',
  },
];

// Top performing ads
const topAds = [
  {
    name: 'Summer Dress Collection',
    type: 'Carousel',
    platform: 'instagram',
    engagement: '2,341',
    ctr: '4.2%',
    thumbnail: '/placeholder-ad-1.jpg',
  },
  {
    name: 'Flash Sale Announcement',
    type: 'Reels',
    platform: 'instagram',
    engagement: '1,892',
    ctr: '3.8%',
    thumbnail: '/placeholder-ad-2.jpg',
  },
  {
    name: 'New Arrivals Teaser',
    type: 'Stories',
    platform: 'both',
    engagement: '1,567',
    ctr: '3.5%',
    thumbnail: '/placeholder-ad-3.jpg',
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
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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

// Platform badge
function PlatformBadge({ platform }: { platform: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {(platform === 'facebook' || platform === 'both') && (
        <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
          <Facebook className="w-3 h-3 text-blue-400" />
        </div>
      )}
      {(platform === 'instagram' || platform === 'both') && (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
          <Instagram className="w-3 h-3 text-pink-400" />
        </div>
      )}
    </div>
  );
}

// Status badge
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

// Type badge with icon
function TypeBadge({ type }: { type: string }) {
  const getIcon = () => {
    switch (type) {
      case 'Carousel':
        return <Layers className="w-3 h-3" />;
      case 'Stories':
        return <Image className="w-3 h-3" />;
      case 'Reels':
        return <Film className="w-3 h-3" />;
      case 'Collection':
        return <Layers className="w-3 h-3" />;
      default:
        return <Image className="w-3 h-3" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white/[0.06] text-white/60">
      {getIcon()}
      {type}
    </span>
  );
}

export default function FacebookAdsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [platformFilter, setPlatformFilter] = React.useState<string>('all');

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesPlatform =
      platformFilter === 'all' ||
      campaign.platform === platformFilter ||
      (campaign.platform === 'both' && platformFilter !== 'all');
    return matchesSearch && matchesStatus && matchesPlatform;
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Facebook & Instagram Ads</h1>
                <p className="text-white/50 text-sm">
                  Manage your social media advertising campaigns
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
            Meta Business Suite
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium">
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
                    {platformFilter === 'all' ? 'All Platforms' : platformFilter}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#1a1a1a] border-white/[0.08]"
                >
                  <DropdownMenuItem
                    onClick={() => setPlatformFilter('all')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    All Platforms
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPlatformFilter('facebook')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    <Facebook className="w-4 h-4 mr-2 text-blue-400" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPlatformFilter('instagram')}
                    className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                  >
                    <Instagram className="w-4 h-4 mr-2 text-pink-400" />
                    Instagram
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70"
                  >
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
                  Platform
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Reach
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Conv.
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
                    <div>
                      <p className="font-medium text-white mb-1">{campaign.name}</p>
                      <TypeBadge type={campaign.type} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PlatformBadge platform={campaign.platform} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.budget}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.reach}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.engagement}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{campaign.clicks}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {campaign.conversions}
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

      {/* Bottom Section: Top Ads & Quick Tips */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Performing Ads */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-white">Top Performing Ads</h3>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {topAds.map((ad, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                    {ad.type === 'Reels' ? (
                      <Film className="w-6 h-6 text-pink-400" />
                    ) : ad.type === 'Carousel' ? (
                      <Layers className="w-6 h-6 text-pink-400" />
                    ) : (
                      <Image className="w-6 h-6 text-pink-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{ad.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TypeBadge type={ad.type} />
                      <PlatformBadge platform={ad.platform} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-white/40">Engagement</p>
                    <p className="font-medium text-white">{ad.engagement}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40">CTR</p>
                    <p className="font-medium text-emerald-400">{ad.ctr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Social Tips</h3>
                <p className="text-xs text-white/40">Boost engagement</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <p className="text-sm font-medium text-white mb-1">
                  Use Reels for reach
                </p>
                <p className="text-xs text-white/40">
                  Reels get 22% more engagement than standard posts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <p className="text-sm font-medium text-white mb-1">
                  Carousel for products
                </p>
                <p className="text-xs text-white/40">
                  Showcase multiple products in a single ad.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                <p className="text-sm font-medium text-white mb-1">
                  Stories for urgency
                </p>
                <p className="text-xs text-white/40">
                  Limited-time offers work great in Stories.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-white/[0.02] border-pink-500/30 hover:bg-pink-500/10 text-pink-400"
            >
              View Creative Gallery
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Plus,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageCircle,
  Eye,
  Users,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Settings,
  ExternalLink,
  Calendar,
  Clock,
  Image,
  Film,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Zap,
  BarChart3,
  Send,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Social stats
const socialStats = [
  {
    label: 'Total Followers',
    value: '24.8K',
    change: '+8.4%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Total Reach',
    value: '156K',
    change: '+22.3%',
    changeType: 'positive' as const,
    icon: Eye,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Engagement Rate',
    value: '4.2%',
    change: '+0.8%',
    changeType: 'positive' as const,
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    label: 'Posts This Month',
    value: '28',
    change: '-3',
    changeType: 'negative' as const,
    icon: FileText,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

// Connected accounts
const connectedAccounts = [
  {
    platform: 'Instagram',
    icon: Instagram,
    handle: '@mystore',
    followers: '12.4K',
    engagement: '5.2%',
    connected: true,
    color: 'from-pink-500/20 to-purple-500/20',
    iconColor: 'text-pink-400',
  },
  {
    platform: 'Facebook',
    icon: Facebook,
    handle: 'My Store',
    followers: '8.2K',
    engagement: '3.1%',
    connected: true,
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-400',
  },
  {
    platform: 'Twitter',
    icon: Twitter,
    handle: '@mystore',
    followers: '3.1K',
    engagement: '2.8%',
    connected: true,
    color: 'from-sky-500/20 to-sky-600/20',
    iconColor: 'text-sky-400',
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    handle: 'My Store Inc.',
    followers: '1.1K',
    engagement: '4.5%',
    connected: false,
    color: 'from-blue-600/20 to-blue-700/20',
    iconColor: 'text-blue-500',
  },
  {
    platform: 'YouTube',
    icon: Youtube,
    handle: 'My Store',
    followers: '0',
    engagement: '0%',
    connected: false,
    color: 'from-red-500/20 to-red-600/20',
    iconColor: 'text-red-400',
  },
];

// Scheduled posts
const scheduledPosts = [
  {
    id: '1',
    content: 'Check out our new summer collection! Link in bio.',
    platforms: ['instagram', 'facebook'],
    type: 'image',
    scheduledFor: '2024-12-23 10:00 AM',
    status: 'scheduled',
  },
  {
    id: '2',
    content: 'Behind the scenes of our latest photoshoot!',
    platforms: ['instagram'],
    type: 'video',
    scheduledFor: '2024-12-24 2:00 PM',
    status: 'scheduled',
  },
  {
    id: '3',
    content: 'Flash sale alert! 24 hours only.',
    platforms: ['instagram', 'facebook', 'twitter'],
    type: 'image',
    scheduledFor: '2024-12-25 9:00 AM',
    status: 'scheduled',
  },
  {
    id: '4',
    content: 'Thank you for 10K followers!',
    platforms: ['instagram'],
    type: 'image',
    scheduledFor: '2024-12-26 12:00 PM',
    status: 'draft',
  },
];

// Recent posts performance
const recentPosts = [
  {
    content: 'New arrivals just dropped!',
    platform: 'instagram',
    type: 'carousel',
    likes: 892,
    comments: 45,
    shares: 23,
    reach: '8.2K',
    postedAt: '2024-12-20',
  },
  {
    content: 'Weekend vibes with our latest collection',
    platform: 'instagram',
    type: 'reel',
    likes: 1234,
    comments: 89,
    shares: 67,
    reach: '12.4K',
    postedAt: '2024-12-19',
  },
  {
    content: 'Customer spotlight: @happy_customer',
    platform: 'facebook',
    type: 'image',
    likes: 345,
    comments: 12,
    shares: 8,
    reach: '3.1K',
    postedAt: '2024-12-18',
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
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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

// Platform icon component
function PlatformIcon({ platform, size = 'sm' }: { platform: string; size?: 'sm' | 'md' }) {
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const containerClass = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  const getIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram className={cn(iconClass, 'text-pink-400')} />;
      case 'facebook':
        return <Facebook className={cn(iconClass, 'text-blue-400')} />;
      case 'twitter':
        return <Twitter className={cn(iconClass, 'text-sky-400')} />;
      case 'linkedin':
        return <Linkedin className={cn(iconClass, 'text-blue-500')} />;
      case 'youtube':
        return <Youtube className={cn(iconClass, 'text-red-400')} />;
      default:
        return <Share2 className={cn(iconClass, 'text-white/50')} />;
    }
  };

  return (
    <div
      className={cn(
        containerClass,
        'rounded flex items-center justify-center',
        platform === 'instagram' && 'bg-pink-500/20',
        platform === 'facebook' && 'bg-blue-500/20',
        platform === 'twitter' && 'bg-sky-500/20',
        platform === 'linkedin' && 'bg-blue-600/20',
        platform === 'youtube' && 'bg-red-500/20'
      )}
    >
      {getIcon()}
    </div>
  );
}

// Content type badge
function ContentTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
        type === 'image' && 'bg-purple-500/20 text-purple-400',
        type === 'video' && 'bg-red-500/20 text-red-400',
        type === 'carousel' && 'bg-blue-500/20 text-blue-400',
        type === 'reel' && 'bg-pink-500/20 text-pink-400',
        type === 'text' && 'bg-white/10 text-white/60'
      )}
    >
      {type === 'image' && <Image className="w-3 h-3" />}
      {type === 'video' && <Film className="w-3 h-3" />}
      {type === 'carousel' && <Image className="w-3 h-3" />}
      {type === 'reel' && <Film className="w-3 h-3" />}
      {type === 'text' && <FileText className="w-3 h-3" />}
      <span className="capitalize">{type}</span>
    </span>
  );
}

export default function SocialMediaPage() {
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
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Social Media</h1>
                <p className="text-white/50 text-sm">
                  Manage and schedule your social media content
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
            <Calendar className="w-4 h-4 mr-2" />
            Content Calendar
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {socialStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Connected Accounts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Connected Accounts</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/40 hover:text-white"
          >
            Manage Connections
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {connectedAccounts.map((account) => (
            <div
              key={account.platform}
              className={cn(
                'rounded-2xl border p-4 transition-all',
                account.connected
                  ? 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
                  : 'border-dashed border-white/[0.08] bg-transparent hover:border-white/[0.15]'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
                    account.color
                  )}
                >
                  <account.icon className={cn('w-5 h-5', account.iconColor)} />
                </div>
                {account.connected ? (
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    Connected
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06]"
                  >
                    Connect
                  </Button>
                )}
              </div>
              <p className="font-medium text-white text-sm">{account.platform}</p>
              <p className="text-xs text-white/40 mb-2">{account.handle}</p>
              {account.connected && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-white/60">
                    <span className="text-white font-medium">{account.followers}</span> followers
                  </span>
                  <span className="text-emerald-400">{account.engagement} eng.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scheduled Posts */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Scheduled Posts</h3>
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
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {post.platforms.map((platform) => (
                          <PlatformIcon key={platform} platform={platform} />
                        ))}
                      </div>
                      <ContentTypeBadge type={post.type} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" />
                      {post.scheduledFor}
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        post.status === 'scheduled'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-white/10 text-white/50'
                      )}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts Performance */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Performance</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white/40 hover:text-white"
              >
                Analytics
              </Button>
            </div>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {recentPosts.map((post, index) => (
              <div
                key={index}
                className="p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <PlatformIcon platform={post.platform} size="md" />
                      <p className="text-sm text-white line-clamp-1">{post.content}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-blue-400" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Send className="w-3 h-3 text-emerald-400" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{post.reach}</p>
                    <p className="text-xs text-white/40">reach</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Social Media Tips</h3>
              <p className="text-xs text-white/40">Grow your audience</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Post consistently</p>
              <p className="text-xs text-white/40">
                Aim for 3-5 posts per week to maintain engagement.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Use hashtags strategically</p>
              <p className="text-xs text-white/40">
                Mix popular and niche hashtags for better reach.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Engage with followers</p>
              <p className="text-xs text-white/40">
                Reply to comments within the first hour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

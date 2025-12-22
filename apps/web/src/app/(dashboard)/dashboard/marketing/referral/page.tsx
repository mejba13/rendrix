'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Gift,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Share2,
  Copy,
  Check,
  Settings,
  ExternalLink,
  Award,
  Zap,
  ChevronRight,
  QrCode,
  Link2,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Sparkles,
  Target,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Referral stats
const referralStats = [
  {
    label: 'Total Referrals',
    value: '342',
    change: '+18.3%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Revenue Generated',
    value: '$8,450',
    change: '+24.6%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Active Advocates',
    value: '156',
    change: '+12.1%',
    changeType: 'positive' as const,
    icon: Award,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Conversion Rate',
    value: '23.4%',
    change: '+3.2%',
    changeType: 'positive' as const,
    icon: Target,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

// Top referrers
const topReferrers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    referrals: 28,
    revenue: '$1,245',
    earned: '$124.50',
    status: 'active',
  },
  {
    name: 'Mike Chen',
    email: 'mike.c@email.com',
    referrals: 24,
    revenue: '$986',
    earned: '$98.60',
    status: 'active',
  },
  {
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    referrals: 19,
    revenue: '$756',
    earned: '$75.60',
    status: 'active',
  },
  {
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    referrals: 15,
    revenue: '$623',
    earned: '$62.30',
    status: 'active',
  },
  {
    name: 'Jessica Lee',
    email: 'jessica.l@email.com',
    referrals: 12,
    revenue: '$489',
    earned: '$48.90',
    status: 'active',
  },
];

// Recent referrals
const recentReferrals = [
  {
    referrer: 'Sarah Johnson',
    referred: 'John Smith',
    email: 'john.s@email.com',
    date: '2024-12-21',
    status: 'converted',
    value: '$89',
  },
  {
    referrer: 'Mike Chen',
    referred: 'Lisa Wang',
    email: 'lisa.w@email.com',
    date: '2024-12-20',
    status: 'pending',
    value: '-',
  },
  {
    referrer: 'Emily Davis',
    referred: 'Tom Brown',
    email: 'tom.b@email.com',
    date: '2024-12-20',
    status: 'converted',
    value: '$145',
  },
  {
    referrer: 'Sarah Johnson',
    referred: 'Anna Miller',
    email: 'anna.m@email.com',
    date: '2024-12-19',
    status: 'converted',
    value: '$67',
  },
];

// Reward tiers
const rewardTiers = [
  { tier: 'Bronze', referrals: '1-5', reward: '5% commission', color: 'text-amber-600' },
  { tier: 'Silver', referrals: '6-15', reward: '7.5% commission', color: 'text-gray-400' },
  { tier: 'Gold', referrals: '16-30', reward: '10% commission', color: 'text-yellow-400' },
  { tier: 'Platinum', referrals: '31+', reward: '15% commission', color: 'text-cyan-400' },
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
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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

// Share link component
function ShareLinkCard() {
  const [copied, setCopied] = React.useState(false);
  const referralLink = 'https://mystore.rendrix.com/ref/SUMMER2024';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Your Referral Link</h3>
          <p className="text-xs text-white/40">Share with customers</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Input
          value={referralLink}
          readOnly
          className="bg-white/[0.04] border-white/[0.08] text-white text-sm"
        />
        <Button
          onClick={handleCopy}
          className={cn(
            'shrink-0 transition-all',
            copied
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-white/[0.06] hover:bg-white/[0.1]'
          )}
        >
          {copied ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Copy className="w-4 h-4 text-white/70" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40">Share via:</span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 hover:bg-white/[0.08]"
          >
            <Mail className="w-4 h-4 text-white/50" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 hover:bg-white/[0.08]"
          >
            <MessageCircle className="w-4 h-4 text-white/50" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 hover:bg-white/[0.08]"
          >
            <Twitter className="w-4 h-4 text-white/50" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 hover:bg-white/[0.08]"
          >
            <Facebook className="w-4 h-4 text-white/50" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 hover:bg-white/[0.08]"
          >
            <QrCode className="w-4 h-4 text-white/50" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ReferralProgramPage() {
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
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Referral Program</h1>
                <p className="text-white/50 text-sm">
                  Turn customers into brand advocates
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
            <Settings className="w-4 h-4 mr-2" />
            Program Settings
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Invite Advocates
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {referralStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Share Link & Reward Tiers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ShareLinkCard />

        {/* Reward Tiers */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Reward Tiers</h3>
              <p className="text-xs text-white/40">Commission structure</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {rewardTiers.map((tier) => (
              <div
                key={tier.tier}
                className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.04]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className={cn('w-4 h-4', tier.color)} />
                  <span className={cn('font-medium text-sm', tier.color)}>{tier.tier}</span>
                </div>
                <p className="text-xs text-white/40">{tier.referrals} referrals</p>
                <p className="text-sm font-medium text-white mt-1">{tier.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Referrers & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Referrers */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Top Advocates</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white/40 hover:text-white"
              >
                View All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {topReferrers.map((referrer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center text-sm font-medium text-emerald-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{referrer.name}</p>
                    <p className="text-xs text-white/40">{referrer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Referrals</p>
                    <p className="font-medium text-white">{referrer.referrals}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Revenue</p>
                    <p className="font-medium text-emerald-400">{referrer.revenue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Earned</p>
                    <p className="font-medium text-blue-400">{referrer.earned}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Referrals</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white/40 hover:text-white"
              >
                View All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {recentReferrals.map((referral, index) => (
              <div
                key={index}
                className="p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white text-sm">{referral.referred}</p>
                      <ArrowUpRight className="w-3 h-3 text-white/30" />
                    </div>
                    <p className="text-xs text-white/40">
                      Referred by <span className="text-white/60">{referral.referrer}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        referral.status === 'converted'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      )}
                    >
                      {referral.status === 'converted' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {referral.status}
                    </span>
                    {referral.value !== '-' && (
                      <span className="text-sm font-medium text-emerald-400">
                        {referral.value}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Referral Program Tips</h3>
              <p className="text-xs text-white/40">Maximize your program success</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Make it easy to share</p>
              <p className="text-xs text-white/40">
                Add share buttons to order confirmations and emails.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Reward both parties</p>
              <p className="text-xs text-white/40">
                Give discounts to both referrer and the referred customer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Celebrate milestones</p>
              <p className="text-xs text-white/40">
                Send congratulations when advocates reach new tiers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

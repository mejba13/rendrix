'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  Send,
  Inbox,
  FileText,
  Play,
  Pause,
  Settings,
  Copy,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronDown,
  BarChart3,
  Sparkles,
  Calendar,
  UserPlus,
  Target,
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

// Email stats
const emailStats = [
  {
    label: 'Total Subscribers',
    value: '4,521',
    change: '+12.3%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Emails Sent',
    value: '12.4K',
    change: '+8.5%',
    changeType: 'positive' as const,
    icon: Send,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Open Rate',
    value: '42.3%',
    change: '+5.2%',
    changeType: 'positive' as const,
    icon: Eye,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Click Rate',
    value: '8.7%',
    change: '-1.2%',
    changeType: 'negative' as const,
    icon: MousePointer,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

// Campaigns data
const campaigns = [
  {
    id: '1',
    name: 'Weekly Newsletter',
    type: 'Newsletter',
    status: 'sent',
    recipients: 4521,
    sent: 4498,
    opened: 1892,
    clicked: 423,
    openRate: '42.1%',
    clickRate: '9.4%',
    sentDate: '2024-12-20',
  },
  {
    id: '2',
    name: 'Flash Sale Announcement',
    type: 'Promotional',
    status: 'sent',
    recipients: 4521,
    sent: 4512,
    opened: 2341,
    clicked: 567,
    openRate: '51.9%',
    clickRate: '12.6%',
    sentDate: '2024-12-18',
  },
  {
    id: '3',
    name: 'New Arrivals Alert',
    type: 'Product Update',
    status: 'scheduled',
    recipients: 4521,
    sent: 0,
    opened: 0,
    clicked: 0,
    openRate: '-',
    clickRate: '-',
    sentDate: '2024-12-25',
  },
  {
    id: '4',
    name: 'Holiday Greetings',
    type: 'Seasonal',
    status: 'draft',
    recipients: 4521,
    sent: 0,
    opened: 0,
    clicked: 0,
    openRate: '-',
    clickRate: '-',
    sentDate: '-',
  },
  {
    id: '5',
    name: 'Abandoned Cart Reminder',
    type: 'Automation',
    status: 'active',
    recipients: 234,
    sent: 189,
    opened: 98,
    clicked: 45,
    openRate: '51.9%',
    clickRate: '23.8%',
    sentDate: 'Automated',
  },
];

// Subscriber segments
const segments = [
  { name: 'All Subscribers', count: 4521, growth: '+12%' },
  { name: 'Active Customers', count: 2341, growth: '+8%' },
  { name: 'New Signups (30d)', count: 456, growth: '+15%' },
  { name: 'VIP Customers', count: 234, growth: '+5%' },
];

// Automation flows
const automations = [
  { name: 'Welcome Series', status: 'active', sent: 456, converted: 89 },
  { name: 'Abandoned Cart', status: 'active', sent: 189, converted: 45 },
  { name: 'Post-Purchase', status: 'active', sent: 567, converted: 123 },
  { name: 'Win-back', status: 'paused', sent: 0, converted: 0 },
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
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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

// Status badge
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        status === 'sent' && 'bg-emerald-500/20 text-emerald-400',
        status === 'active' && 'bg-blue-500/20 text-blue-400',
        status === 'scheduled' && 'bg-amber-500/20 text-amber-400',
        status === 'draft' && 'bg-white/10 text-white/50',
        status === 'paused' && 'bg-red-500/20 text-red-400'
      )}
    >
      {status === 'sent' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'active' && <Play className="w-3 h-3" />}
      {status === 'scheduled' && <Clock className="w-3 h-3" />}
      {status === 'draft' && <FileText className="w-3 h-3" />}
      {status === 'paused' && <Pause className="w-3 h-3" />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

// Type badge
function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-xs font-medium',
        type === 'Newsletter' && 'bg-blue-500/20 text-blue-400',
        type === 'Promotional' && 'bg-purple-500/20 text-purple-400',
        type === 'Product Update' && 'bg-emerald-500/20 text-emerald-400',
        type === 'Seasonal' && 'bg-pink-500/20 text-pink-400',
        type === 'Automation' && 'bg-amber-500/20 text-amber-400'
      )}
    >
      {type}
    </span>
  );
}

export default function EmailMarketingPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [activeTab, setActiveTab] = React.useState<'campaigns' | 'automations' | 'segments'>('campaigns');

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
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Email Marketing</h1>
                <p className="text-white/50 text-sm">
                  Manage campaigns, automations, and subscribers
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
            <UserPlus className="w-4 h-4 mr-2" />
            Import Subscribers
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {emailStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'campaigns'
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-white/50 hover:text-white/70'
          )}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('automations')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'automations'
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-white/50 hover:text-white/70'
          )}
        >
          Automations
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'segments'
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-white/50 hover:text-white/70'
          )}
        >
          Segments
        </button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Email Campaigns</h2>
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
                      onClick={() => setStatusFilter('sent')}
                      className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                    >
                      Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('scheduled')}
                      className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                    >
                      Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('draft')}
                      className="text-white/70 focus:text-white focus:bg-white/[0.08]"
                    >
                      Draft
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
                    Recipients
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                    Opened
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                    Clicked
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                    Click Rate
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
                        <div className="flex items-center gap-2">
                          <TypeBadge type={campaign.type} />
                          {campaign.sentDate !== '-' && (
                            <span className="text-xs text-white/40">
                              {campaign.sentDate === 'Automated' ? 'Automated' : campaign.sentDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {campaign.recipients.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {campaign.opened.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {campaign.clicked.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          campaign.openRate !== '-' ? 'text-emerald-400' : 'text-white/40'
                        )}
                      >
                        {campaign.openRate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          campaign.clickRate !== '-' ? 'text-blue-400' : 'text-white/40'
                        )}
                      >
                        {campaign.clickRate}
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
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.08]">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.08]">
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
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
      )}

      {/* Automations Tab */}
      {activeTab === 'automations' && (
        <div className="grid gap-4 md:grid-cols-2">
          {automations.map((automation, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{automation.name}</h3>
                    <StatusBadge status={automation.status} />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-white/[0.08]">
                  <Settings className="w-4 h-4 text-white/50" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02]">
                  <p className="text-xs text-white/40 mb-1">Emails Sent</p>
                  <p className="text-lg font-semibold text-white">{automation.sent}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02]">
                  <p className="text-xs text-white/40 mb-1">Converted</p>
                  <p className="text-lg font-semibold text-emerald-400">{automation.converted}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border-2 border-dashed border-white/[0.08] p-5 flex flex-col items-center justify-center min-h-[180px] hover:border-amber-500/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
              <Plus className="w-6 h-6 text-white/40 group-hover:text-amber-400 transition-colors" />
            </div>
            <p className="font-medium text-white/50 group-hover:text-white transition-colors">
              Create Automation
            </p>
            <p className="text-xs text-white/30 mt-1">Set up triggered email flows</p>
          </div>
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {segment.growth}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{segment.count.toLocaleString()}</p>
              <p className="text-sm text-white/40">{segment.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Section: Quick Tips */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Email Best Practices</h3>
              <p className="text-xs text-white/40">Improve your email performance</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Optimize subject lines</p>
              <p className="text-xs text-white/40">
                Keep subject lines under 50 characters for better open rates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Segment your audience</p>
              <p className="text-xs text-white/40">
                Targeted emails get 50% higher click-through rates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.04]">
              <p className="text-sm font-medium text-white mb-1">Send at optimal times</p>
              <p className="text-xs text-white/40">
                Tuesday and Thursday mornings often work best.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

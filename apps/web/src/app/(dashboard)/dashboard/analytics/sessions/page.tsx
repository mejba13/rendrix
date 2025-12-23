'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Video,
  Play,
  Clock,
  MousePointer,
  Eye,
  RefreshCw,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  CheckCircle,
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
type SessionFilter = 'all' | 'converted' | 'bounced' | 'rage-clicks' | 'errors';

// Mock session recordings data
const sessionRecordings = [
  {
    id: 'sess_1',
    visitor: 'Visitor #8294',
    duration: '4:32',
    pages: 8,
    device: 'Desktop',
    deviceIcon: Monitor,
    location: 'New York, US',
    startTime: '2 hours ago',
    converted: true,
    cartValue: 189.99,
    events: ['page_view', 'product_view', 'add_to_cart', 'checkout', 'purchase'],
    hasErrors: false,
    hasRageClicks: false,
  },
  {
    id: 'sess_2',
    visitor: 'Visitor #7183',
    duration: '2:18',
    pages: 5,
    device: 'Mobile',
    deviceIcon: Smartphone,
    location: 'London, UK',
    startTime: '3 hours ago',
    converted: false,
    cartValue: 0,
    events: ['page_view', 'product_view', 'product_view', 'exit'],
    hasErrors: false,
    hasRageClicks: true,
  },
  {
    id: 'sess_3',
    visitor: 'Visitor #6592',
    duration: '6:45',
    pages: 12,
    device: 'Desktop',
    deviceIcon: Monitor,
    location: 'Toronto, CA',
    startTime: '4 hours ago',
    converted: true,
    cartValue: 324.50,
    events: ['page_view', 'search', 'product_view', 'add_to_cart', 'checkout', 'purchase'],
    hasErrors: false,
    hasRageClicks: false,
  },
  {
    id: 'sess_4',
    visitor: 'Visitor #5471',
    duration: '0:42',
    pages: 2,
    device: 'Mobile',
    deviceIcon: Smartphone,
    location: 'Berlin, DE',
    startTime: '5 hours ago',
    converted: false,
    cartValue: 0,
    events: ['page_view', 'bounce'],
    hasErrors: true,
    hasRageClicks: false,
  },
  {
    id: 'sess_5',
    visitor: 'Visitor #4360',
    duration: '3:21',
    pages: 6,
    device: 'Tablet',
    deviceIcon: Tablet,
    location: 'Sydney, AU',
    startTime: '6 hours ago',
    converted: false,
    cartValue: 89.99,
    events: ['page_view', 'product_view', 'add_to_cart', 'cart_abandon'],
    hasErrors: false,
    hasRageClicks: true,
  },
  {
    id: 'sess_6',
    visitor: 'Visitor #3249',
    duration: '5:12',
    pages: 9,
    device: 'Desktop',
    deviceIcon: Monitor,
    location: 'Paris, FR',
    startTime: '7 hours ago',
    converted: true,
    cartValue: 156.00,
    events: ['page_view', 'search', 'product_view', 'product_view', 'add_to_cart', 'purchase'],
    hasErrors: false,
    hasRageClicks: false,
  },
];

// Session stats
const sessionStats = {
  totalRecordings: 2847,
  avgDuration: '3:24',
  convertedSessions: 418,
  rageClickSessions: 124,
  errorSessions: 89,
};

// Heatmap zones (simulated)
const heatmapZones = [
  { name: 'Add to Cart Button', clicks: 8420, engagement: 'high' },
  { name: 'Product Images', clicks: 6850, engagement: 'high' },
  { name: 'Navigation Menu', clicks: 5240, engagement: 'medium' },
  { name: 'Search Bar', clicks: 3650, engagement: 'medium' },
  { name: 'Footer Links', clicks: 1240, engagement: 'low' },
];

// Common user paths
const userPaths = [
  { path: 'Home → Products → Product Detail → Cart → Checkout', sessions: 1245, conversion: 12.4 },
  { path: 'Home → Search → Product Detail → Cart', sessions: 892, conversion: 8.2 },
  { path: 'Product Detail (Direct) → Cart → Checkout', sessions: 654, conversion: 18.5 },
  { path: 'Home → Collections → Product Detail', sessions: 543, conversion: 5.8 },
  { path: 'Home → Products → Exit', sessions: 1821, conversion: 0 },
];

export default function SessionRecordingsPage() {
  const { currentStore } = useStoreStore();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');
  const [filter, setFilter] = React.useState<SessionFilter>('all');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Video className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view session recordings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  const filteredSessions = sessionRecordings.filter((session) => {
    switch (filter) {
      case 'converted':
        return session.converted;
      case 'bounced':
        return session.pages <= 2 && !session.converted;
      case 'rage-clicks':
        return session.hasRageClicks;
      case 'errors':
        return session.hasErrors;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Session Recordings</h1>
          <p className="text-muted-foreground mt-1">
            Watch how users interact with your store.
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Video className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{sessionStats.totalRecordings.toLocaleString()}</p>
            <p className="text-sm text-white/40 mt-1">Total Recordings</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{sessionStats.avgDuration}</p>
            <p className="text-sm text-white/40 mt-1">Avg. Duration</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{sessionStats.convertedSessions}</p>
            <p className="text-sm text-white/40 mt-1">Converted</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{sessionStats.rageClickSessions}</p>
            <p className="text-sm text-white/40 mt-1">Rage Clicks</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{sessionStats.errorSessions}</p>
            <p className="text-sm text-white/40 mt-1">With Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All Sessions' },
          { value: 'converted', label: 'Converted' },
          { value: 'bounced', label: 'Bounced' },
          { value: 'rage-clicks', label: 'Rage Clicks' },
          { value: 'errors', label: 'With Errors' },
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={filter === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.value as SessionFilter)}
            className={filter === tab.value ? '' : 'border-white/[0.08]'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Session Recordings List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
          <CardDescription>Click to watch a session replay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const DeviceIcon = session.deviceIcon;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] cursor-pointer transition-all group"
                >
                  {/* Play Button */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Play className="h-5 w-5 text-primary ml-0.5" />
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white">{session.visitor}</p>
                      {session.converted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-500">
                          Converted
                        </span>
                      )}
                      {session.hasRageClicks && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                          Rage clicks
                        </span>
                      )}
                      {session.hasErrors && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-500">
                          Errors
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {session.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <DeviceIcon className="h-3 w-3" />
                        {session.device}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </span>
                    </div>
                  </div>

                  {/* Cart Value */}
                  {session.cartValue > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{formatCurrency(session.cartValue, 'USD')}</p>
                      <p className="text-xs text-white/40">Cart value</p>
                    </div>
                  )}

                  {/* Time */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-sm text-white/60">{session.startTime}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Heatmap & User Paths */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Click Heatmap Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Click Hotspots</CardTitle>
            <CardDescription>Most clicked elements across sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {heatmapZones.map((zone) => (
                <div key={zone.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{zone.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        zone.engagement === 'high'
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : zone.engagement === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {zone.engagement}
                      </span>
                      <span className="font-medium text-white">{zone.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(zone.clicks / heatmapZones[0].clicks) * 100}%`,
                        backgroundColor: zone.engagement === 'high' ? '#10B981' : zone.engagement === 'medium' ? '#F59E0B' : '#6B7280',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common User Paths */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common User Journeys</CardTitle>
            <CardDescription>Most frequent paths through your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userPaths.map((path, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-sm text-white/80 mb-2">{path.path}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">{path.sessions.toLocaleString()} sessions</span>
                    <span className={`font-medium ${path.conversion > 0 ? 'text-emerald-500' : 'text-white/40'}`}>
                      {path.conversion > 0 ? `${path.conversion}% conversion` : 'No conversion'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

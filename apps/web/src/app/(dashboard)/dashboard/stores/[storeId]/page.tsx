'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Copy,
  Check,
  Settings,
  Package,
  ShoppingCart,
  Users,
  Paintbrush,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Calendar,
  Clock,
  MoreHorizontal,
  Zap,
  Shield,
  RefreshCw,
  ChevronRight,
  Store,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';
import { cn, getStorefrontUrl } from '@/lib/utils';
import { ViewStoreButton } from '@/components/store/view-store-button';
import { StorePreviewModal } from '@/components/store/store-preview-modal';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  customDomain: string | null;
  description: string | null;
  industry: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  status: string;
  settings: Record<string, unknown>;
  seoSettings: Record<string, unknown>;
  theme: { id: string; name: string; thumbnailUrl: string | null } | null;
  stats: {
    products: number;
    orders: number;
    customers: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Industry config
const industryConfig: Record<string, { label: string; color: string; bg: string }> = {
  toys: { label: 'Toys & Games', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  kitchen: { label: 'Kitchen & Dining', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  nail_care: { label: 'Nail Care', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20' },
  home_decor: { label: 'Home Decor', color: 'text-teal-400', bg: 'bg-teal-500/20' },
  garments: { label: 'Fashion & Apparel', color: 'text-violet-400', bg: 'bg-violet-500/20' },
  beauty: { label: 'Beauty & Cosmetics', color: 'text-rose-400', bg: 'bg-rose-500/20' },
  sports: { label: 'Sports & Fitness', color: 'text-green-400', bg: 'bg-green-500/20' },
  gadgets: { label: 'Electronics', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  home_appliances: { label: 'Appliances', color: 'text-slate-400', bg: 'bg-slate-500/20' },
  general: { label: 'General Store', color: 'text-orange-400', bg: 'bg-orange-500/20' },
};

// Quick action items
const quickActions = [
  { icon: Package, label: 'Add Product', href: '/products/new', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: ShoppingCart, label: 'View Orders', href: '/orders', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Users, label: 'Customers', href: '/customers', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Paintbrush, label: 'Customize', href: '/theme', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

// Ambient background
function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px] animate-float" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[80px] animate-float" style={{ animationDelay: '-3s' }} />
    </div>
  );
}

// Stats card component
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04]")}>
            <Icon className="w-5 h-5 text-white/60" />
          </div>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              changeType === 'positive' && "text-emerald-400 bg-emerald-500/10",
              changeType === 'negative' && "text-red-400 bg-red-500/10",
              changeType === 'neutral' && "text-white/40 bg-white/[0.04]"
            )}>
              {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
              {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-white/40">{label}</p>
      </div>
    </div>
  );
}

// Store health indicator
function StoreHealth({ status }: { status: string }) {
  const isActive = status === 'active';

  return (
    <div className="relative p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
      {/* Background pulse for active stores */}
      {isActive && (
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Store Health</h3>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
            isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
          )}>
            <span className={cn("w-2 h-2 rounded-full", isActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400")} />
            {isActive ? 'Operational' : 'Inactive'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-white/40">SSL</p>
            <p className="text-sm font-medium text-emerald-400">Active</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-white/40">CDN</p>
            <p className="text-sm font-medium text-blue-400">Enabled</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-white/40">Uptime</p>
            <p className="text-sm font-medium text-primary">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent activity component
function RecentActivity() {
  const activities = [
    { type: 'order', message: 'New order #1234', time: '2 min ago', icon: ShoppingCart, color: 'text-green-400' },
    { type: 'product', message: 'Product updated', time: '15 min ago', icon: Package, color: 'text-blue-400' },
    { type: 'customer', message: 'New customer signup', time: '1 hour ago', icon: Users, color: 'text-purple-400' },
    { type: 'theme', message: 'Theme customized', time: '3 hours ago', icon: Paintbrush, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Recent Activity</h3>
        <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04]")}>
              <activity.icon className={cn("w-4 h-4", activity.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{activity.message}</p>
              <p className="text-xs text-white/40">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function StoreManagementPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [copied, setCopied] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const { data: storeResponse, isLoading, error } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const response = await api.fetch<{ success: boolean; data: StoreData }>(`/api/v1/stores/${storeId}`);
      return response.data;
    },
    enabled: !!storeId,
  });

  const store = storeResponse;
  const config = store ? industryConfig[store.industry] || industryConfig.general : industryConfig.general;

  // Get storefront URL (handles dev vs production automatically)
  const storefrontUrl = store
    ? getStorefrontUrl({
        slug: store.slug,
        subdomain: store.subdomain,
        customDomain: store.customDomain,
      })
    : null;

  const copyToClipboard = async () => {
    if (!storefrontUrl) return;
    await navigator.clipboard.writeText(storefrontUrl.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <AmbientBackground />
        <div className="relative">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <AmbientBackground />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Store not found</h2>
          <p className="text-white/50 mb-4">The store you're looking for doesn't exist or you don't have access.</p>
          <Button asChild>
            <Link href="/dashboard/stores">Back to Stores</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <div className="relative space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="shrink-0 hover:bg-white/[0.08] rounded-xl"
            >
              <Link href="/dashboard/stores">
                <ArrowLeft className="h-5 w-5 text-white/70" />
              </Link>
            </Button>

            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/[0.08]"
                />
              ) : (
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", config.bg)}>
                  <Store className={cn("w-7 h-7", config.color)} />
                </div>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">{store.name}</h1>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    store.status === 'active'
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  )}>
                    {store.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/40">{storefrontUrl?.displayUrl}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-white/[0.08] rounded transition-colors"
                    title={storefrontUrl?.isDev ? 'Copy dev URL' : 'Copy URL'}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white/40" />
                    )}
                  </button>
                  {storefrontUrl?.isDev && (
                    <span className="text-xs text-amber-400/60 px-1.5 py-0.5 rounded bg-amber-500/10">
                      Dev
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <ViewStoreButton
              storeUrl={storefrontUrl?.url || ''}
              storeName={store.name}
              size="sm"
              onPreview={(device) => {
                setPreviewDevice(device);
                setShowPreview(true);
              }}
            />
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-black font-medium"
              asChild
            >
              <Link href={`/dashboard/stores/${storeId}/settings`}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/[0.08]"
                >
                  <MoreHorizontal className="w-5 h-5 text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#151515] border-white/[0.08]">
                <DropdownMenuItem className="text-white hover:bg-white/[0.08] cursor-pointer">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Data
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/[0.08] cursor-pointer">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.08]" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                  Deactivate Store
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Package}
            label="Total Products"
            value={store.stats.products}
            change="+12%"
            changeType="positive"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={store.stats.orders}
            change="+8%"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            label="Customers"
            value={store.stats.customers}
            change="+24%"
            changeType="positive"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue (Today)"
            value="$0.00"
            change="0%"
            changeType="neutral"
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Health */}
            <StoreHealth status={store.status} />

            {/* Quick Actions */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={`/dashboard${action.href}`}
                    className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", action.bg, "group-hover:scale-110 transition-transform")}>
                      <action.icon className={cn("w-6 h-6", action.color)} />
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Store Information */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Store Information</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:text-primary/80"
                  asChild
                >
                  <Link href={`/dashboard/stores/${storeId}/settings`}>
                    Edit
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Store URL</span>
                  </div>
                  <p className="text-sm text-white font-medium truncate">{storefrontUrl?.displayUrl}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Industry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.bg, config.color)}>
                      {config.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Created</span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    {new Date(store.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Last Updated</span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    {new Date(store.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <RecentActivity />

            {/* Settings Shortcuts */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Store Settings</h3>
                  <p className="text-xs text-white/40">Configure your store</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'General', href: '' },
                  { label: 'Domains', href: '/domains' },
                  { label: 'SEO', href: '/seo' },
                  { label: 'Commerce', href: '/commerce' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={`/dashboard/stores/${storeId}/settings${item.href}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
                  >
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Preview Modal */}
      {showPreview && storefrontUrl && (
        <StorePreviewModal
          url={storefrontUrl.url}
          storeName={store.name}
          initialDevice={previewDevice}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

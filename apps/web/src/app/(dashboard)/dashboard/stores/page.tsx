'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Store,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ExternalLink,
  MoreHorizontal,
  Search,
  LayoutGrid,
  List,
  Globe,
  Sparkles,
  Rocket,
  RefreshCcw,
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api, ApiError } from '@/lib/api';
import { StoreSwitchModal } from '@/components/store/store-switch-modal';
import { cn, getStorefrontUrl } from '@/lib/utils';
import { useStoreStore } from '@/store/store';
import { useAuthStore } from '@/store/auth';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  customDomain: string | null;
  industry: string;
  logoUrl: string | null;
  status: string;
  theme: { name: string; thumbnailUrl: string | null } | null;
  stats: {
    products: number;
    orders: number;
    customers: number;
  };
  createdAt: string;
}

// Industry labels and colors
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

// Ambient Background
function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px] animate-float" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[80px] animate-float" style={{ animationDelay: '-3s' }} />
    </div>
  );
}

// Store Card Component
function StoreCard({ store, onSelect, isCurrentStore }: { store: StoreData; onSelect: () => void; isCurrentStore: boolean }) {
  const config = industryConfig[store.industry] || industryConfig.general;
  const storefrontUrl = getStorefrontUrl({
    slug: store.slug,
    subdomain: store.subdomain,
    customDomain: store.customDomain,
  });

  return (
    <div className={cn(
      "group relative rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden",
      isCurrentStore
        ? "border-primary/40 ring-1 ring-primary/20"
        : "border-white/[0.06] hover:border-white/[0.1]"
    )}>
      {/* Current store indicator */}
      {isCurrentStore && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          <span>Current</span>
        </div>
      )}
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.bg)}>
                <Store className={cn("w-6 h-6", config.color)} />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                {store.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Globe className="w-3 h-3" />
                <span>{storefrontUrl.displayUrl}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.08]"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#151515] border-white/[0.08]">
              <DropdownMenuItem
                onClick={onSelect}
                className="text-white hover:bg-white/[0.08] cursor-pointer"
              >
                <Store className="w-4 h-4 mr-2" />
                {isCurrentStore ? 'Manage Store' : 'Switch to Store'}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/stores/${store.id}/settings`}
                  className="text-white hover:bg-white/[0.08] cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.08]" />
              <DropdownMenuItem asChild>
                <a
                  href={storefrontUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:bg-white/[0.08] cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Storefront
                  {storefrontUrl.isDev && (
                    <span className="ml-1 text-[10px] text-amber-400">(Dev)</span>
                  )}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Industry Badge */}
        <div className="mb-4">
          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", config.bg, config.color)}>
            {config.label}
          </span>
          <span className={cn(
            "ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs",
            store.status === 'active'
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          )}>
            {store.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-white/40 mb-1">
              <Package className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-semibold text-white">{store.stats.products}</p>
            <p className="text-xs text-white/40">Products</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-white/40 mb-1">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-semibold text-white">{store.stats.orders}</p>
            <p className="text-xs text-white/40">Orders</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-white/40 mb-1">
              <Users className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-semibold text-white">{store.stats.customers}</p>
            <p className="text-xs text-white/40">Customers</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          <Button
            size="sm"
            onClick={onSelect}
            className={cn(
              "flex-1 border-0",
              isCurrentStore
                ? "bg-primary hover:bg-primary/90 text-black"
                : "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
          >
            <Store className="w-4 h-4 mr-1.5" />
            {isCurrentStore ? 'Manage' : 'Switch & Manage'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70 hover:text-white"
          >
            <Link href={`/dashboard/stores/${store.id}/settings`}>
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Premium Empty State
function EmptyState() {
  const features = [
    { icon: Zap, title: 'Fast Setup', description: '2-minute store creation' },
    { icon: Shield, title: 'Secure', description: 'SSL & PCI compliant' },
    { icon: BarChart3, title: 'Analytics', description: 'Real-time insights' },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-orange-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative px-8 py-16 sm:px-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="relative mx-auto w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-orange-600 opacity-20 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-500/10 border border-primary/30 flex items-center justify-center">
                <Rocket className="w-10 h-10 text-primary" />
              </div>
              {/* Floating particles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-orange-500/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Text */}
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Launch Your First Store
            </h2>
            <p className="text-lg text-white/50 mb-8 max-w-lg mx-auto">
              Create your online store in minutes. No coding required.
              Start selling products to customers worldwide.
            </p>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-orange-600 hover:opacity-90 text-black font-semibold rounded-xl h-14 px-8 shadow-lg shadow-primary/25 group"
            >
              <Link href="/dashboard/stores/new">
                <Plus className="w-5 h-5 mr-2" />
                Create Your Store
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/[0.06]">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white group-hover:text-primary transition-colors">Add Products</h3>
              <p className="text-sm text-white/40 mt-1">
                After creating your store, add products with images, prices, and descriptions.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-white group-hover:text-primary transition-colors">Customize Theme</h3>
              <p className="text-sm text-white/40 mt-1">
                Choose from beautiful themes and customize colors to match your brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error State
function ErrorState({ onRetry, error, hasOrganization }: { onRetry: () => void; error?: Error | null; hasOrganization: boolean }) {
  const errorMessage = error instanceof ApiError ? error.message : 'Unknown error';
  const errorCode = error instanceof ApiError ? error.code : null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/[0.05] to-transparent">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />

      <div className="relative px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          {!hasOrganization ? 'Organization Required' : 'Unable to Load Stores'}
        </h3>
        <p className="text-white/50 mb-4 max-w-md mx-auto">
          {!hasOrganization
            ? 'Your account is not associated with an organization. Please try logging out and logging back in, or contact support.'
            : 'We couldn\'t fetch your stores. This might be a temporary issue. Please check your connection and try again.'}
        </p>

        {error && (
          <p className="text-xs text-red-400/70 mb-6 font-mono">
            {errorCode && `[${errorCode}] `}{errorMessage}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={onRetry}
            className="bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.08]"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          {hasOrganization && (
            <Button
              asChild
              variant="ghost"
              className="text-white/50 hover:text-white"
            >
              <Link href="/dashboard/stores/new">
                <Plus className="w-4 h-4 mr-2" />
                Create New Store
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
            {[1, 2, 3].map((j) => (
              <div key={j} className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StoresPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedStore, setSelectedStore] = React.useState<StoreData | null>(null);
  const [showSwitchModal, setShowSwitchModal] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);
  const { switchStore, currentStore } = useStoreStore();
  const { currentOrganization } = useAuthStore();

  const { data: storesData, isLoading, error, refetch } = useQuery({
    queryKey: ['stores', currentOrganization?.id],
    queryFn: async () => {
      const response = await api.fetch<{
        success: boolean;
        data: StoreData[];
      }>('/api/v1/stores');
      return response.data;
    },
    enabled: !!currentOrganization,
    retry: false,
  });

  // Log error for debugging
  React.useEffect(() => {
    if (error) {
      console.error('Stores fetch error:', {
        message: error instanceof ApiError ? error.message : error.message,
        code: error instanceof ApiError ? error.code : 'UNKNOWN',
        status: error instanceof ApiError ? error.status : 'N/A',
        organizationId: currentOrganization?.id || 'NOT SET',
      });
    }
  }, [error, currentOrganization]);

  const filteredStores = React.useMemo(() => {
    if (!storesData) return [];
    if (!searchQuery) return storesData;
    const query = searchQuery.toLowerCase();
    return storesData.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.slug.toLowerCase().includes(query) ||
        store.industry.toLowerCase().includes(query)
    );
  }, [storesData, searchQuery]);

  const handleSelectStore = (store: StoreData) => {
    // If the store is already selected, just navigate directly without showing modal
    if (currentStore?.id === store.id) {
      router.push(`/dashboard/stores/${store.id}`);
      return;
    }
    // Otherwise, show the switch confirmation modal
    setSelectedStore(store);
    setShowSwitchModal(true);
  };

  const handleConfirmSwitch = async () => {
    if (!selectedStore) return;

    setIsSwitching(true);

    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    switchStore(selectedStore.id);
    router.push(`/dashboard/stores/${selectedStore.id}`);

    setShowSwitchModal(false);
    setIsSwitching(false);
    setSelectedStore(null);
  };

  const handleCancelSwitch = () => {
    setShowSwitchModal(false);
    setSelectedStore(null);
  };

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center border border-primary/20">
                <Store className="w-5 h-5 text-primary" />
              </div>
              My Stores
            </h1>
            <p className="text-white/50 mt-1">
              Manage your online stores and track performance
            </p>
          </div>

          {storesData && storesData.length > 0 && (
            <Button asChild className="bg-primary hover:bg-primary/90 text-black font-semibold">
              <Link href="/dashboard/stores/new">
                <Plus className="w-4 h-4 mr-2" />
                New Store
              </Link>
            </Button>
          )}
        </div>

        {/* Filters - Only show when there are stores */}
        {storesData && storesData.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-white/40">
                {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'}
              </span>
              <div className="flex items-center border border-white/[0.08] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid'
                      ? "bg-white/[0.08] text-white"
                      : "text-white/40 hover:text-white/70"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'list'
                      ? "bg-white/[0.08] text-white"
                      : "text-white/40 hover:text-white/70"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error || !currentOrganization ? (
          <ErrorState onRetry={() => refetch()} error={error} hasOrganization={!!currentOrganization} />
        ) : !storesData || storesData.length === 0 ? (
          <EmptyState />
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No stores found</h3>
            <p className="text-white/50">No stores match &quot;{searchQuery}&quot;</p>
            <Button
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="mt-4 text-primary hover:text-primary/80"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid'
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}>
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onSelect={() => handleSelectStore(store)}
                isCurrentStore={currentStore?.id === store.id}
              />
            ))}
          </div>
        )}

        {/* Pro tip - Only show when there are stores */}
        {storesData && storesData.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-orange-500/5 to-transparent border border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Pro Tip</p>
                <p className="text-xs text-white/50 mt-1">
                  You can quickly switch between stores using the dropdown selector in the sidebar.
                  The selected store determines which products, orders, and analytics you see in the dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Store Switching Modal */}
      <StoreSwitchModal
        isOpen={showSwitchModal}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        store={selectedStore}
        isLoading={isSwitching}
      />
    </div>
  );
}

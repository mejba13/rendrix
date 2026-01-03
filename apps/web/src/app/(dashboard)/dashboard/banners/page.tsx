'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  RefreshCw,
  Image as ImageIcon,
  LayoutTemplate,
  Megaphone,
  Layers,
  Eye,
  Calendar,
  Clock,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Zap,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useBanners,
  useBannerStats,
  useDeleteBanner,
  useDuplicateBanner,
  useUpdateBanner,
  BannerPlacement,
  BannerStatus,
  Banner,
} from '@/hooks/use-banners';
import { cn } from '@/lib/utils';

const placementConfig: Record<
  BannerPlacement,
  { label: string; icon: React.ElementType; description: string; color: string }
> = {
  homepage_hero: {
    label: 'Homepage Hero',
    icon: LayoutTemplate,
    description: 'Full-width hero banner on homepage',
    color: 'from-violet-500/20 to-purple-500/10',
  },
  section_banner: {
    label: 'Section Banner',
    icon: Layers,
    description: 'Promotional banners within page sections',
    color: 'from-blue-500/20 to-cyan-500/10',
  },
  collection_banner: {
    label: 'Collection Banner',
    icon: Target,
    description: 'Banners for product collections',
    color: 'from-emerald-500/20 to-green-500/10',
  },
  announcement_bar: {
    label: 'Announcement Bar',
    icon: Megaphone,
    description: 'Top bar for announcements & promos',
    color: 'from-amber-500/20 to-orange-500/10',
  },
};

const statusConfig: Record<BannerStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Active', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  draft: { label: 'Draft', color: 'text-zinc-400', bgColor: 'bg-zinc-500/20' },
  scheduled: { label: 'Scheduled', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  inactive: { label: 'Inactive', color: 'text-red-400', bgColor: 'bg-red-500/20' },
};

// Stat Card Component for Bento Grid
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  delay = 0,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: string;
  color: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6',
        'opacity-0 animate-slide-up transition-all duration-500',
        'hover:bg-white/[0.04] hover:border-white/[0.1]'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </Badge>
          )}
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-white/50">{title}</div>
      </div>
    </div>
  );
}

// Banner Card Component
function BannerCard({
  banner,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}: {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleStatus: () => void;
}) {
  const placementCfg = placementConfig[banner.placement];
  const statusCfg = statusConfig[banner.status];
  const PlacementIcon = placementCfg.icon;

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
    >
      {/* Banner Preview Image */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${placementCfg.color} flex items-center justify-center`}>
              <ImageIcon className="w-8 h-8 text-white/50" />
            </div>
          </div>
        )}

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={cn('border-0 gap-1.5', statusCfg.bgColor, statusCfg.color)}>
            {banner.isLive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live
              </>
            ) : (
              statusCfg.label
            )}
          </Badge>
        </div>

        {/* Device Icons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center',
            banner.imageUrl ? 'bg-emerald-500/30' : 'bg-white/10'
          )}>
            <Monitor className="w-3.5 h-3.5 text-white" />
          </div>
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center',
            banner.imageUrlTablet ? 'bg-emerald-500/30' : 'bg-white/10'
          )}>
            <Tablet className="w-3.5 h-3.5 text-white" />
          </div>
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center',
            banner.imageUrlMobile ? 'bg-emerald-500/30' : 'bg-white/10'
          )}>
            <Smartphone className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
              <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onClick={onEdit}
                className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Banner
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onToggleStatus}
                className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
              >
                {banner.status === 'active' ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDuplicate}
                className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white truncate">{banner.title}</h3>
          {banner.description && (
            <p className="text-sm text-white/60 line-clamp-1 mt-0.5">{banner.description}</p>
          )}
        </div>
      </div>

      {/* Banner Info */}
      <div className="p-4 space-y-4">
        {/* Placement & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${placementCfg.color} flex items-center justify-center`}>
              <PlacementIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white/70">{placementCfg.label}</span>
          </div>
          {banner.ctaText && (
            <Badge variant="outline" className="text-xs border-white/[0.1] text-white/60">
              {banner.ctaText}
            </Badge>
          )}
        </div>

        {/* Schedule */}
        {(banner.startDate || banner.endDate) && (
          <div className="flex items-center gap-4 text-xs text-white/40">
            {banner.startDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>From {formatDate(banner.startDate)}</span>
              </div>
            )}
            {banner.endDate && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Until {formatDate(banner.endDate)}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Zap className="w-3.5 h-3.5" />
            <span>Priority: {banner.priority}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-white hover:bg-white/[0.06] gap-1 h-8"
            onClick={onEdit}
          >
            Edit
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center mb-6">
          <ImageIcon className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No banners yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Create promotional banners for your storefront hero sections, announcements, and more.
        </p>
        <Button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-black font-medium shadow-md gap-2"
        >
          <Plus className="w-4 h-4" />
          Create your first banner
        </Button>
      </div>
    </div>
  );
}

// Skeleton Loader
function BannersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
        >
          <Skeleton className="h-40 w-full bg-white/[0.04]" />
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32 rounded-lg bg-white/[0.06]" />
              <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
            </div>
            <Skeleton className="h-4 w-48 bg-white/[0.04]" />
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <Skeleton className="h-4 w-20 bg-white/[0.04]" />
              <Skeleton className="h-8 w-16 rounded-lg bg-white/[0.04]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BannersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [placementFilter, setPlacementFilter] = useState<BannerPlacement | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BannerStatus | 'all'>('all');
  const [deleteBannerId, setDeleteBannerId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useBanners({
    search: search || undefined,
    placement: placementFilter !== 'all' ? placementFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const { data: stats } = useBannerStats();
  const deleteBanner = useDeleteBanner();
  const duplicateBanner = useDuplicateBanner();
  const updateBanner = useUpdateBanner();

  const handleDelete = async () => {
    if (!deleteBannerId) return;

    try {
      await deleteBanner.mutateAsync(deleteBannerId);
      toast({
        title: 'Banner deleted',
        description: 'The banner has been deleted successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete banner. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteBannerId(null);
    }
  };

  const handleDuplicate = async (bannerId: string) => {
    try {
      const newBanner = await duplicateBanner.mutateAsync(bannerId);
      toast({
        title: 'Banner duplicated',
        description: 'The banner has been duplicated successfully.',
      });
      router.push(`/dashboard/banners/${newBanner.id}/edit`);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to duplicate banner. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    try {
      await updateBanner.mutateAsync({
        bannerId: banner.id,
        data: { status: newStatus },
      });
      toast({
        title: `Banner ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        description: `The banner is now ${newStatus}.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update banner status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Banners</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Manage promotional banners for your storefront
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-black font-medium shadow-md gap-2"
          >
            <Link href="/dashboard/banners/new">
              <Plus className="w-4 h-4" />
              New Banner
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Banners"
          value={stats?.total ?? 0}
          icon={Layers}
          color="from-violet-500/20 to-purple-500/10"
          delay={0}
        />
        <StatCard
          title="Active Now"
          value={stats?.active ?? 0}
          icon={Sparkles}
          trend={stats?.active ? 'Live' : undefined}
          color="from-emerald-500/20 to-green-500/10"
          delay={50}
        />
        <StatCard
          title="Scheduled"
          value={stats?.scheduled ?? 0}
          icon={Calendar}
          color="from-blue-500/20 to-cyan-500/10"
          delay={100}
        />
        <StatCard
          title="Drafts"
          value={stats?.draft ?? 0}
          icon={Pencil}
          color="from-amber-500/20 to-orange-500/10"
          delay={150}
        />
      </div>

      {/* Placement Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(placementConfig) as [BannerPlacement, typeof placementConfig[BannerPlacement]][]).map(
          ([placement, config]) => {
            const Icon = config.icon;
            const count = stats?.byPlacement[placement] || 0;
            return (
              <div
                key={placement}
                className={cn(
                  'relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer',
                  count > 0
                    ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    : 'bg-white/[0.01] border-dashed border-white/[0.04] hover:border-white/[0.08]'
                )}
                onClick={() => setPlacementFilter(placement)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-30`} />
                <div className="relative flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">{config.label}</h4>
                    <p className="text-xs text-white/40 truncate">
                      {count > 0 ? `${count} banner${count > 1 ? 's' : ''}` : 'No banners'}
                    </p>
                  </div>
                  {count > 0 && (
                    <div className="text-lg font-bold text-white">{count}</div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search banners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={placementFilter}
              onValueChange={(value) => setPlacementFilter(value as BannerPlacement | 'all')}
            >
              <SelectTrigger className="w-[180px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
                <LayoutTemplate className="mr-2 h-4 w-4 text-white/40" />
                <SelectValue placeholder="Placement" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                  All Placements
                </SelectItem>
                {(Object.entries(placementConfig) as [BannerPlacement, typeof placementConfig[BannerPlacement]][]).map(
                  ([placement, config]) => (
                    <SelectItem
                      key={placement}
                      value={placement}
                      className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                    >
                      {config.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as BannerStatus | 'all')}
            >
              <SelectTrigger className="w-[140px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
                <Eye className="mr-2 h-4 w-4 text-white/40" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                  All Statuses
                </SelectItem>
                {(Object.entries(statusConfig) as [BannerStatus, typeof statusConfig[BannerStatus]][]).map(
                  ([status, config]) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                    >
                      {config.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <BannersSkeleton />
      ) : data?.data.length === 0 ? (
        <EmptyState onCreateClick={() => router.push('/dashboard/banners/new')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data?.data.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => router.push(`/dashboard/banners/${banner.id}/edit`)}
              onDelete={() => setDeleteBannerId(banner.id)}
              onDuplicate={() => handleDuplicate(banner.id)}
              onToggleStatus={() => handleToggleStatus(banner)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteBannerId} onOpenChange={() => setDeleteBannerId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Banner</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete this banner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

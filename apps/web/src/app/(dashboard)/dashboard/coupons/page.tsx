'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Ticket,
  RefreshCw,
  CheckCircle2,
  Clock,
  Repeat,
  Search,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useCoupons,
  useDeleteCoupon,
  useToggleCoupon,
  type CouponsParams,
} from '@/hooks/use-coupons';
import { useStoreStore } from '@/store/store';
import { createCouponColumns } from '@/components/coupons/coupon-columns';

// Stat Card Component - Dark Theme
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  iconBg,
  iconColor,
  valueColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trendUp ? 'text-emerald-400' : 'text-red-400'
          }`}>
            <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className={`text-3xl font-semibold tracking-tight ${valueColor || 'text-white'}`}>{value}</h3>
        <p className="text-sm text-white/50 mt-1">{label}</p>
      </div>
    </div>
  );
}

// Stat Card Skeleton
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-xl bg-white/[0.06]" />
        <Skeleton className="w-14 h-5 rounded-full bg-white/[0.06]" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-28 bg-white/[0.06]" />
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 flex items-center justify-center mb-6">
          <Ticket className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No coupons yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Create your first coupon to offer discounts to your customers and boost sales.
        </p>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium gap-2">
          <Link href="/dashboard/coupons/new">
            <Plus className="w-4 h-4" />
            Create your first coupon
          </Link>
        </Button>
      </div>
    </div>
  );
}

// No Results Component
function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-white/40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No coupons found</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          No coupons match your current filters. Try adjusting your search criteria.
        </p>
        <Button variant="outline" onClick={onClear} className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
          Clear filters
        </Button>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-red-500/20">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <Ticket className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Error loading coupons</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          Something went wrong while fetching your coupons. Please try again.
        </p>
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}

// Table Skeleton
function TableSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-white/[0.06]">
        <Skeleton className="h-4 w-24 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-24 bg-white/[0.06]" />
        <Skeleton className="h-4 w-16 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.04] last:border-0">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-24 bg-white/[0.06]" />
            <Skeleton className="h-3 w-16 bg-white/[0.06]" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-4 w-20 bg-white/[0.06]" />
          <Skeleton className="h-4 w-16 bg-white/[0.06]" />
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function CouponsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [filters, setFilters] = React.useState<CouponsParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [search, setSearch] = React.useState('');
  const [deleteCouponId, setDeleteCouponId] = React.useState<string | null>(null);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const { data, isLoading, error, refetch } = useCoupons(filters);
  const deleteCoupon = useDeleteCoupon();
  const toggleCoupon = useToggleCoupon();

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteCouponId) return;

    try {
      await deleteCoupon.mutateAsync(deleteCouponId);
      toast({
        title: 'Coupon deleted',
        description: 'The coupon has been deleted successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete coupon. Please try again.',
        variant: 'destructive',
      });
    }
    setDeleteCouponId(null);
  };

  const handleToggle = async (couponId: string, isActive: boolean) => {
    try {
      await toggleCoupon.mutateAsync({ couponId, isActive });
      toast({
        title: isActive ? 'Coupon activated' : 'Coupon deactivated',
        description: `The coupon has been ${isActive ? 'activated' : 'deactivated'}.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update coupon. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: 'Copied!',
        description: `Coupon code "${code}" copied to clipboard.`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = search || filters.type || filters.isActive !== undefined;

  const columns = React.useMemo(
    () =>
      createCouponColumns({
        onDelete: setDeleteCouponId,
        onToggle: handleToggle,
        onCopy: handleCopy,
        currency: 'USD',
      }),
    [copiedCode]
  );

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, active: 0, expired: 0, totalUsage: 0 };
    const coupons = data.data;
    const now = new Date();
    const active = coupons.filter(
      (c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > now)
    ).length;
    const expired = coupons.filter(
      (c) => c.expiresAt && new Date(c.expiresAt) < now
    ).length;
    const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
    return {
      total: data.meta.total,
      active,
      expired,
      totalUsage,
    };
  }, [data]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center">
          <Ticket className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">
            Please select a store from the sidebar to view coupons.
          </p>
        </div>
        <Button asChild className="mt-2">
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Coupons</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Create and manage discount codes for your store
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
            asChild
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium gap-2"
          >
            <Link href="/dashboard/coupons/new">
              <Plus className="w-4 h-4" />
              Create coupon
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Ticket}
              label="Total Coupons"
              value={stats.total}
              trend={stats.total > 0 ? '+0%' : undefined}
              trendUp={true}
              iconBg="bg-gradient-to-br from-purple-500/20 to-violet-500/10"
              iconColor="text-purple-400"
            />
            <StatCard
              icon={CheckCircle2}
              label="Active"
              value={stats.active}
              iconBg="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
              iconColor="text-emerald-400"
              valueColor={stats.active > 0 ? 'text-emerald-400' : 'text-white'}
            />
            <StatCard
              icon={Clock}
              label="Expired"
              value={stats.expired}
              iconBg="bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
              iconColor="text-amber-400"
              valueColor={stats.expired > 0 ? 'text-amber-400' : 'text-white'}
            />
            <StatCard
              icon={Repeat}
              label="Total Redemptions"
              value={stats.totalUsage.toLocaleString()}
              trend={stats.totalUsage > 0 ? '+0%' : undefined}
              trendUp={true}
              iconBg="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
              iconColor="text-blue-400"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search coupons by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                type: value === 'all' ? undefined : (value as CouponsParams['type']),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[140px] h-10 bg-white/[0.02] border-white/[0.06] text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed amount</SelectItem>
              <SelectItem value="free_shipping">Free shipping</SelectItem>
              <SelectItem value="bogo">BOGO</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              filters.isActive === undefined
                ? 'all'
                : filters.isActive
                  ? 'active'
                  : 'inactive'
            }
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                isActive: value === 'all' ? undefined : value === 'active',
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[130px] h-10 bg-white/[0.02] border-white/[0.06] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-white/50 hover:text-white"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Coupons Table / States */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length === 0 && !hasActiveFilters ? (
        <EmptyState />
      ) : data?.data.length === 0 && hasActiveFilters ? (
        <NoResults onClear={clearFilters} />
      ) : (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="code"
            searchPlaceholder="Search in results..."
            pageSize={filters.limit}
            onRowClick={(row) => router.push(`/dashboard/coupons/${row.id}`)}
          />
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-white/50">
            Showing <span className="text-white font-medium">{((data.meta.page - 1) * filters.limit!) + 1}</span> to{' '}
            <span className="text-white font-medium">{Math.min(data.meta.page * filters.limit!, data.meta.total)}</span> of{' '}
            <span className="text-white font-medium">{data.meta.total}</span> coupons
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === data.meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters((f) => ({ ...f, page: pageNum }))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {data.meta.totalPages > 5 && (
                <>
                  <span className="text-white/30 px-1">...</span>
                  <button
                    onClick={() => setFilters((f) => ({ ...f, page: data.meta.totalPages }))}
                    className="w-8 h-8 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {data.meta.totalPages}
                  </button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!data.meta.hasMore}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCouponId} onOpenChange={() => setDeleteCouponId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this coupon. Customers will no longer be able
              to use this code. This action cannot be undone.
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
              Delete coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

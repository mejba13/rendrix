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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const [_copiedCode, setCopiedCode] = React.useState<string | null>(null);

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const columns = React.useMemo(
    () =>
      createCouponColumns({
        onDelete: setDeleteCouponId,
        onToggle: handleToggle,
        onCopy: handleCopy,
        currency: 'USD',
      }),
    []
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
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Ticket className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store from the sidebar to view coupons.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage discount codes for your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/coupons/new">
              <Plus className="mr-2 h-4 w-4" />
              Create coupon
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-white">{stats.total}</h3>
              <p className="text-sm text-white/40">Total Coupons</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-emerald-500">{stats.active}</h3>
              <p className="text-sm text-white/40">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-amber-500">{stats.expired}</h3>
              <p className="text-sm text-white/40">Expired</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center">
                <Repeat className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-white">{stats.totalUsage}</h3>
              <p className="text-sm text-white/40">Total Redemptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[280px]"
        />

        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            setFilters((f) => ({
              ...f,
              type: value === 'all' ? undefined : (value as any),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[160px]">
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
              isActive:
                value === 'all' ? undefined : value === 'active',
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coupons Table */}
      {isLoading ? (
        <Card>
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Ticket className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Error loading coupons</h3>
            <p className="text-muted-foreground mt-1">
              Something went wrong. Please try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : data?.data.length === 0 && !filters.search && !filters.type ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Ticket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No coupons yet</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-sm">
              Create your first coupon to offer discounts to your customers.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/coupons/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first coupon
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchKey="code"
          searchPlaceholder="Search in results..."
          pageSize={filters.limit}
          onRowClick={(row) => router.push(`/dashboard/coupons/${row.id}`)}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} coupons)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.meta.hasMore}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            >
              Next
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

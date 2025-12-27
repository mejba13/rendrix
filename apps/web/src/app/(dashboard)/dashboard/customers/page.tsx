'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Users,
  Download,
  RefreshCw,
  DollarSign,
  ShoppingBag,
  Search,
  TrendingUp,
  Mail,
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
import { useCustomers, useDeleteCustomer } from '@/hooks/use-customers';
import { useStoreStore } from '@/store/store';
import { createCustomerColumns } from '@/components/customers/customer-columns';
import { formatCurrency } from '@rendrix/utils';

interface CustomersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  acceptsMarketing?: boolean;
}

// Stat Card Component - Dark Theme
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  iconBg: string;
  iconColor: string;
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
        <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
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
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No customers yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Start adding customers to manage their orders, track their preferences, and build lasting relationships.
        </p>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium gap-2">
          <Link href="/dashboard/customers/new">
            <Plus className="w-4 h-4" />
            Add your first customer
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
        <h3 className="text-lg font-semibold text-white mb-1">No customers found</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          No customers match your current filters. Try adjusting your search criteria.
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
          <Users className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Error loading customers</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          Something went wrong while fetching your customers. Please try again.
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
        <Skeleton className="h-4 w-32 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-24 bg-white/[0.06]" />
        <Skeleton className="h-4 w-16 bg-white/[0.06]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.04] last:border-0">
          <Skeleton className="h-10 w-10 rounded-full bg-white/[0.06]" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-32 bg-white/[0.06]" />
            <Skeleton className="h-3 w-40 bg-white/[0.06]" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-4 w-20 bg-white/[0.06]" />
          <Skeleton className="h-4 w-16 bg-white/[0.06]" />
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function CustomersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [filters, setFilters] = React.useState<CustomersParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [search, setSearch] = React.useState('');
  const [deleteCustomerId, setDeleteCustomerId] = React.useState<string | null>(null);

  const { data, isLoading, error, refetch } = useCustomers(filters);
  const deleteCustomer = useDeleteCustomer();

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteCustomerId) return;

    try {
      await deleteCustomer.mutateAsync(deleteCustomerId);
      toast({
        title: 'Customer deleted',
        description: 'The customer has been deleted successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive',
      });
    }
    setDeleteCustomerId(null);
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

  const hasActiveFilters = search || filters.acceptsMarketing !== undefined;

  const columns = React.useMemo(
    () =>
      createCustomerColumns({
        onDelete: setDeleteCustomerId,
        currency: 'USD',
      }),
    []
  );

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, marketing: 0, avgSpent: 0, avgOrders: 0 };
    const customers = data.data;
    const marketing = customers.filter((c) => c.acceptsMarketing).length;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
    return {
      total: data.meta.total,
      marketing,
      avgSpent: customers.length > 0 ? totalSpent / customers.length : 0,
      avgOrders: customers.length > 0 ? totalOrders / customers.length : 0,
    };
  }, [data]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center">
          <Users className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">
            Please select a store from the sidebar to view customers.
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Customers</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Manage your customers and their information
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
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium gap-2"
          >
            <Link href="/dashboard/customers/new">
              <Plus className="w-4 h-4" />
              Add customer
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
              icon={Users}
              label="Total Customers"
              value={stats.total.toLocaleString()}
              trend={stats.total > 0 ? '+0%' : undefined}
              trendUp={true}
              iconBg="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
              iconColor="text-blue-400"
            />
            <StatCard
              icon={Mail}
              label="Marketing Subscribers"
              value={stats.marketing}
              trend={stats.marketing > 0 ? '+0%' : undefined}
              trendUp={true}
              iconBg="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
              iconColor="text-emerald-400"
            />
            <StatCard
              icon={DollarSign}
              label="Avg. Spent per Customer"
              value={formatCurrency(stats.avgSpent, 'USD')}
              iconBg="bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
              iconColor="text-amber-400"
            />
            <StatCard
              icon={ShoppingBag}
              label="Avg. Orders per Customer"
              value={stats.avgOrders.toFixed(1)}
              iconBg="bg-gradient-to-br from-purple-500/20 to-violet-500/10"
              iconColor="text-purple-400"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search customers by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={
              filters.acceptsMarketing === undefined
                ? 'all'
                : filters.acceptsMarketing
                  ? 'true'
                  : 'false'
            }
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                acceptsMarketing: value === 'all' ? undefined : value === 'true',
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[160px] h-10 bg-white/[0.02] border-white/[0.06] text-white">
              <SelectValue placeholder="Marketing" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All customers</SelectItem>
              <SelectItem value="true" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Subscribed</SelectItem>
              <SelectItem value="false" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Not subscribed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy || 'createdAt'}
            onValueChange={(value) =>
              setFilters((f) => ({ ...f, sortBy: value, page: 1 }))
            }
          >
            <SelectTrigger className="w-[150px] h-10 bg-white/[0.02] border-white/[0.06] text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="createdAt" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Date joined</SelectItem>
              <SelectItem value="totalSpent" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Total spent</SelectItem>
              <SelectItem value="totalOrders" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Order count</SelectItem>
              <SelectItem value="email" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Email</SelectItem>
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

      {/* Customers Table / States */}
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
            searchKey="email"
            searchPlaceholder="Search in results..."
            pageSize={filters.limit}
            onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
          />
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-white/50">
            Showing <span className="text-white font-medium">{((data.meta.page - 1) * filters.limit!) + 1}</span> to{' '}
            <span className="text-white font-medium">{Math.min(data.meta.page * filters.limit!, data.meta.total)}</span> of{' '}
            <span className="text-white font-medium">{data.meta.total}</span> customers
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
      <AlertDialog open={!!deleteCustomerId} onOpenChange={() => setDeleteCustomerId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete customer?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will permanently delete this customer and all their associated data.
              This action cannot be undone.
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
              Delete customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

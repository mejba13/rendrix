'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Users,
  Download,
  RefreshCw,
  UserCheck,
  DollarSign,
  ShoppingBag,
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive',
      });
    }
    setDeleteCustomerId(null);
  };

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
    if (!data?.data)
      return { total: 0, marketing: 0, avgSpent: 0, avgOrders: 0 };
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
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store from the sidebar to view customers.
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
          <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customers and their information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-white">{stats.total}</h3>
              <p className="text-sm text-white/40">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-emerald-500">{stats.marketing}</h3>
              <p className="text-sm text-white/40">Marketing Subscribers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-white">{formatCurrency(stats.avgSpent, 'USD')}</h3>
              <p className="text-sm text-white/40">Avg. Spent per Customer</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold text-white">{stats.avgOrders.toFixed(1)}</h3>
              <p className="text-sm text-white/40">Avg. Orders per Customer</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[280px]"
        />

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
              acceptsMarketing:
                value === 'all' ? undefined : value === 'true',
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Marketing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All customers</SelectItem>
            <SelectItem value="true">Subscribed</SelectItem>
            <SelectItem value="false">Not subscribed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy || 'createdAt'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, sortBy: value, page: 1 }))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date joined</SelectItem>
            <SelectItem value="totalSpent">Total spent</SelectItem>
            <SelectItem value="totalOrders">Order count</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <Card>
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Error loading customers</h3>
            <p className="text-muted-foreground mt-1">
              Something went wrong. Please try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : data?.data.length === 0 && !filters.search ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No customers yet</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-sm">
              Start adding customers to manage their orders and information.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/customers/new">
                <Plus className="mr-2 h-4 w-4" />
                Add your first customer
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchKey="email"
          searchPlaceholder="Search in results..."
          pageSize={filters.limit}
          onRowClick={(row) => router.push(`/dashboard/customers/${row.id}`)}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} customers)
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
      <AlertDialog open={!!deleteCustomerId} onOpenChange={() => setDeleteCustomerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this customer and all their associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

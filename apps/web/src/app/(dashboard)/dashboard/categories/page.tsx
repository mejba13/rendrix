'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FolderTree,
  Search,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Package,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useCategories, useDeleteCategory, type Category } from '@/hooks/use-categories';
import { useStoreStore } from '@/store/store';
import { cn } from '@/lib/utils';

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="group relative rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-sm text-white/50">{label}</p>
      </div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-5">
            <Skeleton className="w-11 h-11 rounded-xl bg-white/[0.06] mb-4" />
            <Skeleton className="h-8 w-16 bg-white/[0.06] mb-2" />
            <Skeleton className="h-4 w-24 bg-white/[0.04]" />
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg bg-white/[0.06]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px] bg-white/[0.06]" />
              <Skeleton className="h-3 w-[100px] bg-white/[0.04]" />
            </div>
            <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center border border-violet-500/20">
            <FolderTree className="h-10 w-10 text-violet-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No categories yet</h3>
        <p className="text-white/50 text-center max-w-md mb-8 leading-relaxed">
          Organize your products by creating categories. Categories help customers browse and find products easily.
        </p>
        <Button asChild className="bg-violet-500 hover:bg-violet-400 text-white font-semibold">
          <Link href="/dashboard/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-red-500/20 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Error loading categories</h3>
        <p className="text-white/50 text-center max-w-sm mb-6">
          Something went wrong while loading your categories. Please try again.
        </p>
        <Button variant="outline" onClick={onRetry} className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]">
          Try again
        </Button>
      </div>
    </div>
  );
}

// No Store Selected State
function NoStoreState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
        <FolderTree className="h-10 w-10 text-white/30" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">No store selected</h3>
        <p className="text-white/50 max-w-sm">
          Please select a store from the sidebar to view and manage categories.
        </p>
      </div>
      <Button asChild className="bg-violet-500 hover:bg-violet-400 text-white font-semibold">
        <Link href="/dashboard/stores/new">Create a store</Link>
      </Button>
    </div>
  );
}

// Category Row Component
function CategoryRow({
  category,
  depth = 0,
  expandedIds,
  onToggle,
  onDelete,
}: {
  category: Category;
  depth?: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);

  return (
    <>
      <div
        className={cn(
          'group flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.04] last:border-b-0',
          depth > 0 && 'bg-white/[0.01]'
        )}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
        onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(category.id);
          }}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded transition-colors',
            hasChildren ? 'hover:bg-white/[0.08] text-white/50' : 'text-transparent'
          )}
        >
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </button>

        {/* Category Image */}
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FolderTree className="h-5 w-5 text-white/30" />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-white truncate">{category.name}</h4>
            {hasChildren && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-white/[0.06] text-white/50">
                {category.children?.length} sub
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 truncate">/{category.slug}</p>
        </div>

        {/* Products Count */}
        <div className="flex items-center gap-1.5 text-white/50">
          <Package className="h-3.5 w-3.5" />
          <span className="text-xs">{category.productsCount} products</span>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/[0.08]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#151515] border-white/[0.1]">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/categories/${category.id}/edit`);
              }}
              className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08]"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/categories/new?parentId=${category.id}`);
              }}
              className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add subcategory
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.08]" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category.id);
              }}
              className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {category.children?.map((child) => (
            <CategoryRow
              key={child.id}
              category={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function CategoriesPage() {
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [search, setSearch] = React.useState('');
  const [deleteCategoryId, setDeleteCategoryId] = React.useState<string | null>(null);
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useCategories({
    includeChildren: true,
    limit: 100,
    search: search || undefined,
  });
  const deleteCategory = useDeleteCategory();

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;

    try {
      await deleteCategory.mutateAsync(deleteCategoryId);
      toast({
        title: 'Category deleted',
        description: 'The category has been successfully deleted.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    }
    setDeleteCategoryId(null);
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, topLevel: 0, withProducts: 0 };

    let totalCategories = 0;
    let withProducts = 0;

    const countCategories = (categories: Category[]) => {
      for (const cat of categories) {
        totalCategories++;
        if (cat.productsCount > 0) withProducts++;
        if (cat.children) countCategories(cat.children);
      }
    };

    countCategories(data.data);

    return {
      total: totalCategories,
      topLevel: data.data.length,
      withProducts,
    };
  }, [data]);

  if (!currentStore) {
    return <NoStoreState />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/[0.02] blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[80px]" />
      </div>

      <div className="relative space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center border border-violet-500/20">
              <FolderTree className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-white/50 text-sm mt-0.5">
                Organize your products into categories for better navigation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="bg-violet-500 hover:bg-violet-400 text-white font-semibold shadow-lg shadow-violet-500/20">
              <Link href="/dashboard/categories/new">
                <Plus className="mr-2 h-4 w-4" />
                Add category
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={FolderTree}
                label="Total Categories"
                value={stats.total}
                iconColor="text-violet-400"
                iconBg="bg-gradient-to-br from-violet-500/20 to-purple-500/10"
              />
              <StatCard
                icon={Layers}
                label="Top Level"
                value={stats.topLevel}
                iconColor="text-blue-400"
                iconBg="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
              />
              <StatCard
                icon={Package}
                label="With Products"
                value={stats.withProducts}
                iconColor="text-emerald-400"
                iconBg="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
              />
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                />
              </div>
              {data?.data && data.data.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (expandedIds.size > 0) {
                      setExpandedIds(new Set());
                    } else {
                      const allIds = new Set<string>();
                      const collectIds = (cats: Category[]) => {
                        for (const cat of cats) {
                          if (cat.children && cat.children.length > 0) {
                            allIds.add(cat.id);
                            collectIds(cat.children);
                          }
                        }
                      };
                      collectIds(data.data);
                      setExpandedIds(allIds);
                    }
                  }}
                  className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  {expandedIds.size > 0 ? 'Collapse all' : 'Expand all'}
                </Button>
              )}
            </div>

            {/* Categories List */}
            {data?.data.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
                  <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    Category
                  </span>
                </div>
                <div>
                  {data?.data.map((category) => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      expandedIds={expandedIds}
                      onToggle={handleToggle}
                      onDelete={setDeleteCategoryId}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent className="bg-[#151515] border-white/[0.1]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete category?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This action cannot be undone. Products in this category will not be deleted, but they will no longer be associated with this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

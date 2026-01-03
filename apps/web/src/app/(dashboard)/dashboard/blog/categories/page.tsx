'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderTree,
  FileText,
  RefreshCw,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  useBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
  BlogCategory,
  CreateBlogCategoryInput,
} from '@/hooks/use-blogs';
import { useStoreStore } from '@/store/store';
import { cn } from '@/lib/utils';

// Blog navigation tabs
const blogTabs = [
  { name: 'All Posts', href: '/dashboard/blog', icon: FileText },
  { name: 'Categories', href: '/dashboard/blog/categories', icon: FolderTree },
  { name: 'Tags', href: '/dashboard/blog/tags', icon: Tag },
];

// Bento Stat Card
function BentoCard({
  icon: Icon,
  label,
  value,
  subValue,
  gradient,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6',
        'hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500',
        'animate-in fade-in slide-in-from-bottom-4'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className={cn('absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br', gradient)} />

      <div className="relative flex items-start justify-between">
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="relative mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
        <p className="text-sm text-white/50 mt-1">{label}</p>
        {subValue && <p className="text-xs text-white/40 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}

// Category Card
function CategoryCard({
  category,
  onEdit,
  onDelete,
  delay = 0,
}: {
  category: BlogCategory;
  onEdit: () => void;
  onDelete: () => void;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06]',
        'hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300',
        'animate-in fade-in slide-in-from-bottom-2'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center">
              {category.imageUrl ? (
                <img src={category.imageUrl} alt={category.name} className="w-full h-full rounded-lg object-cover" />
              ) : (
                <FolderTree className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-white">{category.name}</h3>
              <p className="text-xs text-white/40">/{category.slug}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
              <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem onClick={onEdit} className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {category.description && (
          <p className="text-sm text-white/50 mt-3 line-clamp-2">{category.description}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white/40" />
            <span className="text-sm text-white/60">
              {category.postsCount || 0} posts
            </span>
          </div>
          <Badge variant="outline" className="text-xs border-white/10 text-white/50 bg-transparent">
            Order: {category.sortOrder}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center mb-6">
          <FolderTree className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No categories yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Create categories to organize your blog posts and help readers find content they&apos;re interested in.
        </p>
        <Button onClick={onAdd} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2">
          <Plus className="w-4 h-4" />
          Create your first category
        </Button>
      </div>
    </div>
  );
}

// Skeleton Loader
function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg bg-white/[0.06]" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                <Skeleton className="h-3 w-16 bg-white/[0.06]" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-lg bg-white/[0.06]" />
          </div>
          <Skeleton className="h-10 w-full mt-3 bg-white/[0.06]" />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <Skeleton className="h-4 w-16 bg-white/[0.06]" />
            <Skeleton className="h-5 w-20 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogCategoriesPage() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [search, setSearch] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editCategory, setEditCategory] = React.useState<BlogCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = React.useState<BlogCategory | null>(null);
  const [formData, setFormData] = React.useState<CreateBlogCategoryInput>({
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
  });

  const { data: categories, isLoading, refetch } = useBlogCategories();
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();
  const deleteCategoryMutation = useDeleteBlogCategory();

  // Filter categories by search
  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    if (!search) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  // Stats
  const stats = React.useMemo(() => {
    if (!categories) return { total: 0, totalPosts: 0, avgPosts: 0 };
    const totalPosts = categories.reduce((sum, cat) => sum + (cat.postsCount || 0), 0);
    return {
      total: categories.length,
      totalPosts,
      avgPosts: categories.length > 0 ? Math.round(totalPosts / categories.length) : 0,
    };
  }, [categories]);

  const openDialog = (category?: BlogCategory) => {
    if (category) {
      setEditCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        sortOrder: category.sortOrder,
      });
    } else {
      setEditCategory(null);
      setFormData({ name: '', slug: '', description: '', sortOrder: categories?.length || 0 });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditCategory(null);
    setFormData({ name: '', slug: '', description: '', sortOrder: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editCategory) {
        await updateCategory.mutateAsync({ categoryId: editCategory.id, data: formData });
        toast({ title: 'Category updated', description: 'The category has been updated successfully.' });
      } else {
        await createCategory.mutateAsync(formData);
        toast({ title: 'Category created', description: 'The category has been created successfully.' });
      }
      closeDialog();
    } catch {
      toast({ title: 'Error', description: 'Failed to save category. Please try again.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      await deleteCategoryMutation.mutateAsync(deleteCategory.id);
      toast({ title: 'Category deleted', description: 'The category has been deleted successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete category. Please try again.', variant: 'destructive' });
    }
    setDeleteCategory(null);
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <FolderTree className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">Please select a store from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center ring-1 ring-blue-500/20">
            <FolderTree className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Blog Categories</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Organize your blog posts into categories
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
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
          >
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {blogTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BentoCard
          icon={FolderTree}
          label="Total Categories"
          value={stats.total}
          gradient="from-blue-500 to-indigo-500"
          delay={0}
        />
        <BentoCard
          icon={FileText}
          label="Total Posts"
          value={stats.totalPosts}
          subValue="Across all categories"
          gradient="from-emerald-500 to-green-500"
          delay={50}
        />
        <BentoCard
          icon={TrendingUp}
          label="Avg. Posts/Category"
          value={stats.avgPosts}
          gradient="from-amber-500 to-orange-500"
          delay={100}
        />
      </div>

      {/* Search */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <CategoriesSkeleton />
      ) : filteredCategories.length === 0 && !search ? (
        <EmptyState onAdd={() => openDialog()} />
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-12 text-center">
          <p className="text-white/50">No categories match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => openDialog(category)}
              onDelete={() => setDeleteCategory(category)}
              delay={index * 50}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              {editCategory
                ? 'Update the category details below.'
                : 'Add a new category to organize your blog posts.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editCategory ? formData.slug : generateSlug(e.target.value),
                  });
                }}
                placeholder="e.g., Technology"
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., technology"
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A brief description of this category..."
                rows={3}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
              >
                {createCategory.isPending || updateCategory.isPending ? 'Saving...' : editCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete &quot;{deleteCategory?.name}&quot;? Posts in this category will not be deleted but will be uncategorized.
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

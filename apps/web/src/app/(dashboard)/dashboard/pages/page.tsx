'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Copy,
  FileText,
  Navigation,
  FolderTree,
  LayoutTemplate,
  RefreshCw,
  Globe,
  EyeOff,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Filter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  usePages,
  useDeletePage,
  useDuplicatePage,
  useBulkPageAction,
  PageStatus,
  PageTemplate,
} from '@/hooks/use-pages';
import { formatRelativeTime } from '@rendrix/utils';

const statusStyles: Record<PageStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: 'Draft', bg: 'bg-white/[0.06]', text: 'text-white/60', dot: 'bg-white/40' },
  published: { label: 'Published', bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
};

const templateLabels: Record<PageTemplate, string> = {
  default: 'Default',
  'full-width': 'Full Width',
  sidebar: 'Sidebar',
  landing: 'Landing',
  contact: 'Contact',
  faq: 'FAQ',
};

// Stat Card Component - Dark Theme
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  iconGradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  iconGradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
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

// Empty State
function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No pages yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Create custom pages for your store like About Us, Contact, FAQs, and more.
        </p>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2">
          <Link href="/dashboard/pages/new">
            <Plus className="w-4 h-4" />
            Create your first page
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Table Skeleton
function TableSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-white/[0.06] bg-white/[0.02]">
        <Skeleton className="h-4 w-8 bg-white/[0.06]" />
        <Skeleton className="h-4 w-32 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-24 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.04] last:border-0">
          <Skeleton className="h-4 w-4 bg-white/[0.06]" />
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-10 w-10 rounded-lg bg-white/[0.06]" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40 bg-white/[0.06]" />
              <Skeleton className="h-3 w-24 bg-white/[0.06]" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-4 w-20 bg-white/[0.06]" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-4 w-20 bg-white/[0.06]" />
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function PagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PageStatus | 'all'>('all');
  const [templateFilter, setTemplateFilter] = useState<PageTemplate | 'all'>('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = usePages({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    template: templateFilter !== 'all' ? templateFilter : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const deletePage = useDeletePage();
  const duplicatePage = useDuplicatePage();
  const bulkAction = useBulkPageAction();

  const handleDelete = async () => {
    if (!deletePageId) return;

    try {
      await deletePage.mutateAsync(deletePageId);
      toast({
        title: 'Page deleted',
        description: 'The page has been deleted successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete page. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletePageId(null);
    }
  };

  const handleDuplicate = async (pageId: string) => {
    try {
      const newPage = await duplicatePage.mutateAsync(pageId);
      toast({
        title: 'Page duplicated',
        description: 'The page has been duplicated successfully.',
      });
      router.push(`/dashboard/pages/${newPage.id}/edit`);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to duplicate page. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete' | 'showInNav' | 'hideFromNav') => {
    if (selectedPages.length === 0) return;

    try {
      await bulkAction.mutateAsync({ action, pageIds: selectedPages });
      toast({
        title: 'Action completed',
        description: `Successfully performed action on ${selectedPages.length} page(s).`,
      });
      setSelectedPages([]);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to perform action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedPages.length === data?.data.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(data?.data.map((p) => p.id) || []);
    }
  };

  const toggleSelect = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  // Calculate stats
  const stats = {
    total: data?.meta.total || 0,
    published: data?.data.filter((p) => p.status === 'published').length || 0,
    draft: data?.data.filter((p) => p.status === 'draft').length || 0,
    inNav: data?.data.filter((p) => p.showInNav).length || 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Pages</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Create and manage static pages for your store
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
          <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2">
            <Link href="/dashboard/pages/new">
              <Plus className="w-4 h-4" />
              New Page
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Pages"
          value={stats.total}
          trend={stats.total > 0 ? '+4' : undefined}
          trendUp={true}
          iconGradient="bg-gradient-to-br from-indigo-500/20 to-purple-500/10"
        />
        <StatCard
          icon={Globe}
          label="Published"
          value={stats.published}
          iconGradient="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
        />
        <StatCard
          icon={Pencil}
          label="Drafts"
          value={stats.draft}
          iconGradient="bg-gradient-to-br from-white/10 to-white/5"
        />
        <StatCard
          icon={Navigation}
          label="In Navigation"
          value={stats.inNav}
          iconGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as PageStatus | 'all')}
          >
            <SelectTrigger className="w-[140px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <Filter className="mr-2 h-4 w-4 text-white/40" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All Status</SelectItem>
              <SelectItem value="draft" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Draft</SelectItem>
              <SelectItem value="published" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Published</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={templateFilter}
            onValueChange={(value) => setTemplateFilter(value as PageTemplate | 'all')}
          >
            <SelectTrigger className="w-[160px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <LayoutTemplate className="mr-2 h-4 w-4 text-white/40" />
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All Templates</SelectItem>
              <SelectItem value="default" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Default</SelectItem>
              <SelectItem value="full-width" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Full Width</SelectItem>
              <SelectItem value="sidebar" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Sidebar</SelectItem>
              <SelectItem value="landing" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Landing</SelectItem>
              <SelectItem value="contact" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Contact</SelectItem>
              <SelectItem value="faq" className="text-white/70 focus:bg-white/[0.06] focus:text-white">FAQ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedPages.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-sm text-white/60 font-medium">
              {selectedPages.length} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('publish')}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('unpublish')}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Unpublish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('showInNav')}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              <Navigation className="mr-1 h-3 w-3" />
              Show in Nav
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('hideFromNav')}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              <EyeOff className="mr-1 h-3 w-3" />
              Hide from Nav
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              className="bg-transparent border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Pages Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : data?.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent bg-white/[0.02]">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPages.length === data?.data.length && data?.data.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20"
                  />
                </TableHead>
                <TableHead className="text-white/60 font-medium">Title</TableHead>
                <TableHead className="text-white/60 font-medium">Status</TableHead>
                <TableHead className="text-white/60 font-medium">Template</TableHead>
                <TableHead className="text-white/60 font-medium">Navigation</TableHead>
                <TableHead className="text-white/60 font-medium">Updated</TableHead>
                <TableHead className="text-white/60 font-medium w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((pageItem) => (
                <TableRow
                  key={pageItem.id}
                  className="border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/pages/${pageItem.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedPages.includes(pageItem.id)}
                      onCheckedChange={() => toggleSelect(pageItem.id)}
                      className="border-white/20"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white/40" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{pageItem.title}</span>
                          {pageItem.childrenCount > 0 && (
                            <Badge variant="outline" className="text-xs border-white/10 text-white/60 bg-transparent">
                              <FolderTree className="mr-1 h-3 w-3" />
                              {pageItem.childrenCount}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-white/40">/{pageItem.slug}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[pageItem.status].bg} ${statusStyles[pageItem.status].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[pageItem.status].dot}`} />
                      {statusStyles[pageItem.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/60">
                    {templateLabels[pageItem.template]}
                  </TableCell>
                  <TableCell>
                    {pageItem.showInNav ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                        <Navigation className="mr-1 h-3 w-3" />
                        Visible
                      </Badge>
                    ) : (
                      <span className="text-white/40">Hidden</span>
                    )}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {formatRelativeTime(pageItem.updatedAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
                        <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]">
                          <Link href={`/dashboard/pages/${pageItem.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]">
                          <Link href={`/dashboard/pages/${pageItem.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(pageItem.id)}
                          className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem
                          onClick={() => setDeletePageId(pageItem.id)}
                          className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                          disabled={pageItem.childrenCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/[0.06]">
              <span className="text-sm text-white/50">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, data.meta.total)} of {data.meta.total}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
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
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.meta.hasMore}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePageId} onOpenChange={() => setDeletePageId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Page</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete this page? This action cannot be undone.
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

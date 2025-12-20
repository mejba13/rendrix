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
import { Card, CardContent } from '@/components/ui/card';
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

const statusStyles: Record<PageStatus, { label: string; variant: 'default' | 'secondary' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'default' },
};

const templateLabels: Record<PageTemplate, string> = {
  default: 'Default',
  'full-width': 'Full Width',
  sidebar: 'Sidebar',
  landing: 'Landing',
  contact: 'Contact',
  faq: 'FAQ',
};

export default function PagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PageStatus | 'all'>('all');
  const [templateFilter, setTemplateFilter] = useState<PageTemplate | 'all'>('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePages({
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete page. Please try again.',
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
    } catch (error) {
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
    } catch (error) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Pages</h1>
          <p className="text-white/50 mt-1">
            Create and manage static pages for your store
          </p>
        </div>
        <Button asChild className="btn-primary text-black font-medium">
          <Link href="/dashboard/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/[0.02] border-white/[0.08]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/40"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PageStatus | 'all')}
            >
              <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={templateFilter}
              onValueChange={(value) => setTemplateFilter(value as PageTemplate | 'all')}
            >
              <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.08] text-white">
                <LayoutTemplate className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="full-width">Full Width</SelectItem>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedPages.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.08]">
              <span className="text-sm text-white/70">
                {selectedPages.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('publish')}
                className="border-white/[0.08] text-white/70 hover:text-white"
              >
                Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('unpublish')}
                className="border-white/[0.08] text-white/70 hover:text-white"
              >
                Unpublish
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('showInNav')}
                className="border-white/[0.08] text-white/70 hover:text-white"
              >
                <Navigation className="mr-1 h-3 w-3" />
                Show in Nav
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="border-red-500/30 text-red-400 hover:text-red-300"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card className="bg-white/[0.02] border-white/[0.08]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPages.length === data?.data.length && data?.data.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white/70">Title</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Template</TableHead>
              <TableHead className="text-white/70">Navigation</TableHead>
              <TableHead className="text-white/70">Updated</TableHead>
              <TableHead className="text-white/70 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.08]">
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow className="border-white/[0.08]">
                <TableCell colSpan={7} className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-1">No pages yet</h3>
                  <p className="text-white/50 mb-4">Get started by creating your first page</p>
                  <Button asChild className="btn-primary text-black">
                    <Link href="/dashboard/pages/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Page
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((pageItem) => (
                <TableRow
                  key={pageItem.id}
                  className="border-white/[0.08] hover:bg-white/[0.02] cursor-pointer"
                  onClick={() => router.push(`/dashboard/pages/${pageItem.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedPages.includes(pageItem.id)}
                      onCheckedChange={() => toggleSelect(pageItem.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white/40" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{pageItem.title}</span>
                          {pageItem.childrenCount > 0 && (
                            <Badge variant="outline" className="text-xs">
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
                    <Badge variant={statusStyles[pageItem.status].variant}>
                      {statusStyles[pageItem.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {templateLabels[pageItem.template]}
                  </TableCell>
                  <TableCell>
                    {pageItem.showInNav ? (
                      <Badge variant="outline" className="text-green-400 border-green-400/30">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/pages/${pageItem.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/pages/${pageItem.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(pageItem.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePageId(pageItem.id)}
                          className="text-red-400 focus:text-red-400"
                          disabled={pageItem.childrenCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/[0.08]">
            <span className="text-sm text-white/50">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, data.meta.total)} of {data.meta.total}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-white/[0.08] text-white/70"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasMore}
                onClick={() => setPage((p) => p + 1)}
                className="border-white/[0.08] text-white/70"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePageId} onOpenChange={() => setDeletePageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

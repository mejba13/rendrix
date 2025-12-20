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
  Star,
  FileText,
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
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useBlogPosts,
  useDeleteBlogPost,
  useBulkBlogPostAction,
  BlogPostStatus,
} from '@/hooks/use-blogs';
import { formatRelativeTime } from '@rendrix/utils';

const statusStyles: Record<BlogPostStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'default' },
  scheduled: { label: 'Scheduled', variant: 'outline' },
};

export default function BlogPostsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | 'all'>('all');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBlogPosts({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const deletePost = useDeleteBlogPost();
  const bulkAction = useBulkBlogPostAction();

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      await deletePost.mutateAsync(deletePostId);
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletePostId(null);
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete' | 'feature' | 'unfeature') => {
    if (selectedPosts.length === 0) return;

    try {
      await bulkAction.mutateAsync({ action, postIds: selectedPosts });
      toast({
        title: 'Action completed',
        description: `Successfully ${action}ed ${selectedPosts.length} post(s).`,
      });
      setSelectedPosts([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === data?.data.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(data?.data.map((p) => p.id) || []);
    }
  };

  const toggleSelect = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog Posts</h1>
          <p className="text-white/50 mt-1">
            Create and manage blog content for your store
          </p>
        </div>
        <Button asChild className="btn-primary text-black font-medium">
          <Link href="/dashboard/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
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
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/40"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as BlogPostStatus | 'all')}
            >
              <SelectTrigger className="w-[180px] bg-white/[0.04] border-white/[0.08] text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.08]">
              <span className="text-sm text-white/70">
                {selectedPosts.length} selected
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
                onClick={() => handleBulkAction('feature')}
                className="border-white/[0.08] text-white/70 hover:text-white"
              >
                <Star className="mr-1 h-3 w-3" />
                Feature
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

      {/* Posts Table */}
      <Card className="bg-white/[0.02] border-white/[0.08]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPosts.length === data?.data.length && data?.data.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white/70">Title</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Categories</TableHead>
              <TableHead className="text-white/70">Author</TableHead>
              <TableHead className="text-white/70">Date</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow className="border-white/[0.08]">
                <TableCell colSpan={7} className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-1">No blog posts yet</h3>
                  <p className="text-white/50 mb-4">Get started by creating your first blog post</p>
                  <Button asChild className="btn-primary text-black">
                    <Link href="/dashboard/blog/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-white/[0.08] hover:bg-white/[0.02] cursor-pointer"
                  onClick={() => router.push(`/dashboard/blog/${post.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => toggleSelect(post.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white/40" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{post.title}</span>
                          {post.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <span className="text-sm text-white/40">/{post.slug}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusStyles[post.status].variant}>
                      {statusStyles[post.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.categories.slice(0, 2).map((cat) => (
                        <Badge key={cat.id} variant="outline" className="text-xs">
                          {cat.name}
                        </Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {post.authorName || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {post.publishedAt
                      ? formatRelativeTime(post.publishedAt)
                      : formatRelativeTime(post.createdAt)}
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
                          <Link href={`/dashboard/blog/${post.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/blog/${post.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePostId(post.id)}
                          className="text-red-400 focus:text-red-400"
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
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
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

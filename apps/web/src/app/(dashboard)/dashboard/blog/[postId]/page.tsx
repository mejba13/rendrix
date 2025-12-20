'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Star,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useBlogPost, useDeleteBlogPost, BlogPostStatus } from '@/hooks/use-blogs';
import { formatDate } from '@rendrix/utils';

const statusStyles: Record<BlogPostStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'default' },
  scheduled: { label: 'Scheduled', variant: 'outline' },
};

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const postId = params.postId as string;

  const { data: post, isLoading, error } = useBlogPost(postId);
  const deletePost = useDeleteBlogPost();

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(postId);
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted successfully.',
      });
      router.push('/dashboard/blog');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div>
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Post not found</h2>
        <p className="text-white/50 mb-4">The blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white/50 hover:text-white"
          >
            <Link href="/dashboard/blog">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{post.title}</h1>
              <Badge variant={statusStyles[post.status].variant}>
                {statusStyles[post.status].label}
              </Badge>
              {post.isFeatured && (
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-white/50 mt-1">/{post.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            asChild
            className="border-white/[0.08] text-white/70 hover:text-white"
          >
            <Link href={`/dashboard/blog/${post.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:text-red-300">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {post.featuredImage && (
            <Card className="bg-white/[0.02] border-white/[0.08] overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">Excerpt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 italic">{post.excerpt}</p>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Content</CardTitle>
            </CardHeader>
            <CardContent>
              {post.content ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-white/70 font-sans">
                    {post.content}
                  </pre>
                </div>
              ) : (
                <p className="text-white/50 italic">No content yet</p>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          {(post.seoTitle || post.seoDescription) && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">SEO Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-blue-400 text-lg">
                    {post.seoTitle || post.title}
                  </h3>
                  <p className="text-green-400 text-sm">
                    yourstore.com/blog/{post.slug}
                  </p>
                  <p className="text-white/50 text-sm">
                    {post.seoDescription || post.excerpt || 'No description'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Author</p>
                  <p className="text-white">{post.authorName || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Created</p>
                  <p className="text-white">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-white/40" />
                  <div>
                    <p className="text-sm text-white/50">Published</p>
                    <p className="text-white">{formatDate(post.publishedAt)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Views</p>
                  <p className="text-white">{post.viewCount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Comments</p>
                  <p className="text-white">{post.allowComments ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          {post.categories.length > 0 && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

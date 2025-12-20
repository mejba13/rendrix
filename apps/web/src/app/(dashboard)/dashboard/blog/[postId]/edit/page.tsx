'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useBlogPost, useUpdateBlogPost, UpdateBlogPostInput } from '@/hooks/use-blogs';
import { BlogPostForm } from '@/components/blog/blog-post-form';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const postId = params.postId as string;

  const { data: post, isLoading, error } = useBlogPost(postId);
  const updatePost = useUpdateBlogPost();

  const handleSubmit = async (data: UpdateBlogPostInput) => {
    try {
      await updatePost.mutateAsync({ postId, data });
      toast({
        title: 'Blog post updated',
        description: 'Your blog post has been updated successfully.',
      });
      router.push(`/dashboard/blog/${postId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update blog post. Please try again.',
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="text-white/50 hover:text-white"
        >
          <Link href={`/dashboard/blog/${postId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit Blog Post</h1>
          <p className="text-white/50 mt-1">{post.title}</p>
        </div>
      </div>

      <BlogPostForm post={post} onSubmit={handleSubmit} isSubmitting={updatePost.isPending} />
    </div>
  );
}

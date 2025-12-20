'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateBlogPost, CreateBlogPostInput } from '@/hooks/use-blogs';
import { BlogPostForm } from '@/components/blog/blog-post-form';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createPost = useCreateBlogPost();

  const handleSubmit = async (data: CreateBlogPostInput) => {
    try {
      const post = await createPost.mutateAsync(data);
      toast({
        title: 'Blog post created',
        description: 'Your blog post has been created successfully.',
      });
      router.push(`/dashboard/blog/${post.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create blog post. Please try again.',
        variant: 'destructive',
      });
    }
  };

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
          <Link href="/dashboard/blog">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-white">New Blog Post</h1>
          <p className="text-white/50 mt-1">Create a new blog post for your store</p>
        </div>
      </div>

      <BlogPostForm onSubmit={handleSubmit} isSubmitting={createPost.isPending} />
    </div>
  );
}

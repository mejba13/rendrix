'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BlogPost,
  BlogPostStatus,
  BlogPostVisibility,
  useBlogCategories,
} from '@/hooks/use-blogs';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format').optional().or(z.literal('')),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  featuredImage: z.string().url().optional().nullable().or(z.literal('')),
  authorName: z.string().max(255).optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  visibility: z.enum(['public', 'private', 'password']),
  password: z.string().max(255).optional(),
  allowComments: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  tags: z.array(z.string()),
  categoryIds: z.array(z.string()),
  scheduledAt: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: BlogPost;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function BlogPostForm({ post, onSubmit, isSubmitting }: BlogPostFormProps) {
  const { data: categories = [] } = useBlogCategories();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      featuredImage: post?.featuredImage || '',
      authorName: post?.authorName || '',
      status: post?.status || 'draft',
      visibility: post?.visibility || 'public',
      password: post?.password || '',
      allowComments: post?.allowComments ?? true,
      isFeatured: post?.isFeatured ?? false,
      seoTitle: post?.seoTitle || '',
      seoDescription: post?.seoDescription || '',
      tags: post?.tags || [],
      categoryIds: post?.categories?.map((c) => c.id) || [],
      scheduledAt: post?.scheduledAt || '',
    },
  });

  const status = watch('status');
  const visibility = watch('visibility');
  const selectedCategories = watch('categoryIds');
  const tags = watch('tags');
  const featuredImage = watch('featuredImage');

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setValue('tags', [...tags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setValue('tags', tags.filter((t) => t !== tagToRemove));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const current = selectedCategories || [];
    if (current.includes(categoryId)) {
      setValue('categoryIds', current.filter((id) => id !== categoryId));
    } else {
      setValue('categoryIds', [...current, categoryId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white/70">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  className="bg-white/[0.04] border-white/[0.08] text-white text-lg font-medium"
                  placeholder="Enter post title..."
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-white/70">Slug</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                  placeholder="auto-generated-from-title"
                />
                {errors.slug && (
                  <p className="text-sm text-red-400">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-white/70">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  className="bg-white/[0.04] border-white/[0.08] text-white min-h-[100px]"
                  placeholder="Brief summary of the post..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-white/70">Content</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  className="bg-white/[0.04] border-white/[0.08] text-white min-h-[400px] font-mono"
                  placeholder="Write your blog post content here... (Markdown supported)"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle" className="text-white/70">SEO Title</Label>
                <Input
                  id="seoTitle"
                  {...register('seoTitle')}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                  placeholder="Custom title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription" className="text-white/70">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  {...register('seoDescription')}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                  placeholder="Meta description for search engines"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setValue('status', value as BlogPostStatus)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt" className="text-white/70">Schedule Date</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    {...register('scheduledAt')}
                    className="bg-white/[0.04] border-white/[0.08] text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-white/70">Visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value) => setValue('visibility', value as BlogPostVisibility)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="password">Password Protected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {visibility === 'password' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/70">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="bg-white/[0.04] border-white/[0.08] text-white"
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured" className="text-white/70">Featured Post</Label>
                <Switch
                  id="isFeatured"
                  checked={watch('isFeatured')}
                  onCheckedChange={(checked) => setValue('isFeatured', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allowComments" className="text-white/70">Allow Comments</Label>
                <Switch
                  id="allowComments"
                  checked={watch('allowComments')}
                  onCheckedChange={(checked) => setValue('allowComments', checked)}
                />
              </div>

              <div className="pt-4 flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary text-black font-medium"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {post ? 'Update' : 'Publish'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70"
                    onClick={() => setValue('featuredImage', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="h-40 border-2 border-dashed border-white/[0.08] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-white/30" />
                    <p className="mt-2 text-sm text-white/50">No image selected</p>
                  </div>
                </div>
              )}
              <Input
                {...register('featuredImage')}
                className="bg-white/[0.04] border-white/[0.08] text-white"
                placeholder="Enter image URL"
              />
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-white/50">No categories available</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <div
                      className={`w-4 h-4 rounded border ${
                        selectedCategories?.includes(category.id)
                          ? 'bg-primary border-primary'
                          : 'border-white/[0.2]'
                      }`}
                    />
                    <span className="text-white/70">{category.name}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTagRemove(tag)}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
              <Input
                className="bg-white/[0.04] border-white/[0.08] text-white"
                placeholder="Add tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Author */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Author</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                {...register('authorName')}
                className="bg-white/[0.04] border-white/[0.08] text-white"
                placeholder="Author name"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

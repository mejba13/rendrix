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
import {
  Page,
  PageStatus,
  PageVisibility,
  PageTemplate,
  usePages,
} from '@/hooks/use-pages';

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format').optional().or(z.literal('')),
  content: z.string().optional(),
  template: z.enum(['default', 'full-width', 'sidebar', 'landing', 'contact', 'faq']),
  status: z.enum(['draft', 'published']),
  visibility: z.enum(['public', 'private']),
  showInNav: z.boolean(),
  navOrder: z.number().int(),
  parentId: z.string().uuid().optional().nullable().or(z.literal('')),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  featuredImage: z.string().url().optional().nullable().or(z.literal('')),
});

type PageFormData = z.infer<typeof pageSchema>;

interface PageFormProps {
  page?: Page;
  onSubmit: (data: PageFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function PageForm({ page, onSubmit, isSubmitting }: PageFormProps) {
  const { data: pagesData } = usePages({ limit: 100 });
  const availableParents = pagesData?.data.filter((p) => p.id !== page?.id) || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page?.title || '',
      slug: page?.slug || '',
      content: page?.content || '',
      template: page?.template || 'default',
      status: page?.status || 'draft',
      visibility: page?.visibility || 'public',
      showInNav: page?.showInNav ?? false,
      navOrder: page?.navOrder || 0,
      parentId: page?.parentId || '',
      seoTitle: page?.seoTitle || '',
      seoDescription: page?.seoDescription || '',
      featuredImage: page?.featuredImage || '',
    },
  });

  const status = watch('status');
  const visibility = watch('visibility');
  const template = watch('template');
  const featuredImage = watch('featuredImage');

  const handleFormSubmit = async (data: PageFormData) => {
    const submitData = {
      ...data,
      parentId: data.parentId || null,
      featuredImage: data.featuredImage || null,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  placeholder="Enter page title..."
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
                <Label htmlFor="content" className="text-white/70">Content</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  className="bg-white/[0.04] border-white/[0.08] text-white min-h-[500px] font-mono"
                  placeholder="Write your page content here... (HTML/Markdown supported)"
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
                  onValueChange={(value) => setValue('status', value as PageStatus)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value) => setValue('visibility', value as PageVisibility)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
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
                  {page ? 'Update' : 'Publish'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Template */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={template}
                onValueChange={(value) => setValue('template', value as PageTemplate)}
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="full-width">Full Width</SelectItem>
                  <SelectItem value="sidebar">With Sidebar</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="contact">Contact Page</SelectItem>
                  <SelectItem value="faq">FAQ Page</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showInNav" className="text-white/70">Show in Menu</Label>
                <Switch
                  id="showInNav"
                  checked={watch('showInNav')}
                  onCheckedChange={(checked) => setValue('showInNav', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="navOrder" className="text-white/70">Menu Order</Label>
                <Input
                  id="navOrder"
                  type="number"
                  {...register('navOrder', { valueAsNumber: true })}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent Page */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Page Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-white/70">Parent Page</Label>
                <Select
                  value={watch('parentId') || 'none'}
                  onValueChange={(value) => setValue('parentId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue placeholder="No parent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (Top level)</SelectItem>
                    {availableParents.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        </div>
      </div>
    </form>
  );
}

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Search, Eye, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStoreSeo } from '@/hooks/use-stores';

const seoSchema = z.object({
  metaTitle: z.string().max(60, 'Title should be under 60 characters').optional(),
  metaDescription: z.string().max(160, 'Description should be under 160 characters').optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
});

type SeoFormData = z.infer<typeof seoSchema>;

export default function SeoSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateSeo = useUpdateStoreSeo();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<SeoFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
      googleAnalyticsId: '',
      facebookPixelId: '',
    },
  });

  // Update form when store loads
  React.useEffect(() => {
    if (store?.seoSettings) {
      reset({
        metaTitle: store.seoSettings.metaTitle || '',
        metaDescription: store.seoSettings.metaDescription || '',
        ogImage: store.seoSettings.ogImage || '',
        googleAnalyticsId: store.seoSettings.googleAnalyticsId || '',
        facebookPixelId: store.seoSettings.facebookPixelId || '',
      });
    }
  }, [store, reset]);

  const handleFormSubmit = async (data: SeoFormData) => {
    try {
      await updateSeo.mutateAsync({
        storeId,
        data: {
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          ogImage: data.ogImage || null,
          googleAnalyticsId: data.googleAnalyticsId || null,
          facebookPixelId: data.facebookPixelId || null,
        },
      });
      toast({
        title: 'SEO settings saved',
        description: 'Your SEO settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings.',
        variant: 'destructive',
      });
    }
  };

  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');
  const ogImage = watch('ogImage');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[200px]" />
      </div>
    );
  }

  const previewTitle = metaTitle || store?.name || 'Your Store';
  const previewDescription =
    metaDescription || 'Welcome to our store. Browse our collection of products.';
  const previewUrl = store?.subdomain
    ? `https://${store.subdomain}.rendrix.store`
    : 'https://yourstore.com';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Meta Tags */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Engine Listing
          </CardTitle>
          <CardDescription>
            Control how your store appears in search engine results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="metaTitle">Page title</Label>
              <span className="text-xs text-muted-foreground">
                {(metaTitle?.length || 0)}/60
              </span>
            </div>
            <Input
              id="metaTitle"
              placeholder={store?.name || 'Your Store Name'}
              {...register('metaTitle')}
            />
            {errors.metaTitle && (
              <p className="text-sm text-destructive">{errors.metaTitle.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              The title that appears in search results and browser tabs.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="metaDescription">Meta description</Label>
              <span className="text-xs text-muted-foreground">
                {(metaDescription?.length || 0)}/160
              </span>
            </div>
            <Textarea
              id="metaDescription"
              rows={3}
              placeholder="A brief description of your store..."
              {...register('metaDescription')}
            />
            {errors.metaDescription && (
              <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              The description that appears below your title in search results.
            </p>
          </div>

          <Separator />

          {/* Search Preview */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Search preview
            </Label>
            <div className="rounded-lg border p-4 bg-white">
              <div className="space-y-1">
                <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer">
                  {previewTitle}
                </p>
                <p className="text-sm text-[#006621]">{previewUrl}</p>
                <p className="text-sm text-[#545454] line-clamp-2">
                  {previewDescription}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Sharing */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Social Sharing</CardTitle>
          <CardDescription>
            Control how your store appears when shared on social media.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogImage">Social image URL</Label>
            <Input
              id="ogImage"
              type="url"
              placeholder="https://example.com/social-image.jpg"
              {...register('ogImage')}
            />
            {errors.ogImage && (
              <p className="text-sm text-destructive">{errors.ogImage.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Recommended size: 1200x630px. Used when your store is shared on Facebook,
              Twitter, etc.
            </p>
          </div>

          {/* Social Preview */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Social preview
            </Label>
            <div className="rounded-lg border overflow-hidden max-w-md">
              <div className="h-48 bg-muted flex items-center justify-center">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="Social preview"
                    className="h-full w-full object-cover"
                    onError={() => setValue('ogImage', '')}
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  {previewUrl.replace('https://', '')}
                </p>
                <p className="font-semibold line-clamp-1">{previewTitle}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {previewDescription}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>
            Connect analytics services to track your store's performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
              {...register('googleAnalyticsId')}
            />
            <p className="text-sm text-muted-foreground">
              Your Google Analytics measurement ID (GA4 or Universal Analytics).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
            <Input
              id="facebookPixelId"
              placeholder="123456789012345"
              {...register('facebookPixelId')}
            />
            <p className="text-sm text-muted-foreground">
              Your Facebook Pixel ID for tracking conversions and remarketing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || updateSeo.isPending}>
          {updateSeo.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Save className="mr-2 h-4 w-4" />
          Save SEO settings
        </Button>
      </div>
    </form>
  );
}

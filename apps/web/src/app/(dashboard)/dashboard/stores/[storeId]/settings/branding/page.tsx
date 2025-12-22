'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStore } from '@/hooks/use-stores';

const brandingSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
});

type BrandingFormData = z.infer<typeof brandingSchema>;

export default function BrandingSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateStore = useUpdateStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logoUrl: '',
      faviconUrl: '',
    },
  });

  // Update form when store loads
  React.useEffect(() => {
    if (store) {
      reset({
        logoUrl: store.logoUrl || '',
        faviconUrl: store.faviconUrl || '',
      });
    }
  }, [store, reset]);

  const handleFormSubmit = async (data: BrandingFormData) => {
    try {
      await updateStore.mutateAsync({
        storeId,
        data: {
          logoUrl: data.logoUrl || undefined,
          faviconUrl: data.faviconUrl || undefined,
        },
      });
      toast({
        title: 'Branding updated',
        description: 'Your store branding has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update branding. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const logoUrl = watch('logoUrl');
  const faviconUrl = watch('faviconUrl');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Store Logo</CardTitle>
          <CardDescription>
            Your logo appears in the header of your storefront and in emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-6">
            <div className="h-32 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Store logo"
                  className="h-full w-full object-contain"
                  onError={() => setValue('logoUrl', '')}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  {...register('logoUrl')}
                />
                {errors.logoUrl && (
                  <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter the URL of your logo image. Recommended size: 400x100px.
                </p>
              </div>
              {logoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('logoUrl', '', { shouldDirty: true })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove logo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favicon */}
      <Card>
        <CardHeader>
          <CardTitle>Favicon</CardTitle>
          <CardDescription>
            The small icon that appears in browser tabs and bookmarks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted">
              {faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt="Favicon"
                  className="h-full w-full object-contain"
                  onError={() => setValue('faviconUrl', '')}
                />
              ) : (
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  type="url"
                  placeholder="https://example.com/favicon.ico"
                  {...register('faviconUrl')}
                />
                {errors.faviconUrl && (
                  <p className="text-sm text-destructive">{errors.faviconUrl.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter the URL of your favicon. Recommended size: 32x32px (PNG or ICO).
                </p>
              </div>
              {faviconUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('faviconUrl', '', { shouldDirty: true })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove favicon
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your branding will appear to customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Favicon preview"
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <div className="h-5 w-5 rounded bg-muted" />
                )}
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-8 object-contain"
                  />
                ) : (
                  <span className="font-semibold">{store?.name}</span>
                )}
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Shop</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Your storefront header preview
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || updateStore.isPending}>
          {updateStore.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Save className="mr-2 h-4 w-4" />
          Save branding
        </Button>
      </div>
    </form>
  );
}

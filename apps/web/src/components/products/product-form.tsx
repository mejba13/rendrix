'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Loader2,
  Package,
  DollarSign,
  Truck,
  Tag,
  Search,
  ImagePlus,
  X,
  GripVertical,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import type { Product, CreateProductInput } from '@rendrix/types';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  sku: z.string().max(100).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  shortDescription: z.string().max(500).optional().or(z.literal('')),
  type: z.enum(['simple', 'variable', 'grouped', 'digital', 'subscription']),
  status: z.enum(['draft', 'active', 'archived']),
  visibility: z.enum(['visible', 'hidden', 'featured']),
  price: z.coerce.number().nonnegative().optional().or(z.literal('')),
  compareAtPrice: z.coerce.number().nonnegative().optional().or(z.literal('')),
  costPrice: z.coerce.number().nonnegative().optional().or(z.literal('')),
  taxable: z.boolean(),
  trackInventory: z.boolean(),
  quantity: z.coerce.number().int().nonnegative(),
  allowBackorders: z.boolean(),
  weight: z.coerce.number().nonnegative().optional().or(z.literal('')),
  seoTitle: z.string().max(255).optional().or(z.literal('')),
  seoDescription: z.string().max(500).optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [images, setImages] = React.useState<{ url: string; altText?: string }[]>(
    product?.images?.map((img) => ({ url: img.url, altText: img.altText || undefined })) || []
  );

  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      type: product?.type || 'simple',
      status: product?.status || 'draft',
      visibility: product?.visibility || 'visible',
      price: product?.price || '',
      compareAtPrice: product?.compareAtPrice || '',
      costPrice: product?.costPrice || '',
      taxable: product?.taxable ?? true,
      trackInventory: product?.trackInventory ?? true,
      quantity: product?.quantity || 0,
      allowBackorders: product?.allowBackorders ?? false,
      weight: product?.weight || '',
      seoTitle: product?.seoTitle || '',
      seoDescription: product?.seoDescription || '',
    },
  });

  const watchStatus = watch('status');
  const watchTrackInventory = watch('trackInventory');
  const watchType = watch('type');

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload: CreateProductInput = {
        ...data,
        sku: data.sku || undefined,
        description: data.description || undefined,
        shortDescription: data.shortDescription || undefined,
        price: data.price ? Number(data.price) : undefined,
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
        costPrice: data.costPrice ? Number(data.costPrice) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        seoTitle: data.seoTitle || undefined,
        seoDescription: data.seoDescription || undefined,
        images: images.length > 0 ? images : undefined,
      };

      if (isEditing) {
        await updateProduct.mutateAsync({
          productId: product.id,
          data: payload,
        });
        toast({
          title: 'Product updated',
          description: 'Your changes have been saved.',
        });
      } else {
        await createProduct.mutateAsync(payload);
        toast({
          title: 'Product created',
          description: 'Your product has been created successfully.',
        });
      }

      onSuccess?.();
      router.push('/dashboard/products');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setImages([...images, { url, altText: '' }]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                The essential details about your product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Premium Cotton T-Shirt"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="e.g., PCT-001"
                    {...register('sku')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Product Type</Label>
                  <Select
                    value={watchType}
                    onValueChange={(value: any) => setValue('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple Product</SelectItem>
                      <SelectItem value="variable">Variable Product</SelectItem>
                      <SelectItem value="grouped">Grouped Product</SelectItem>
                      <SelectItem value="digital">Digital Product</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Brief product summary..."
                  rows={2}
                  {...register('shortDescription')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed product description..."
                  rows={5}
                  {...register('description')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5" />
                Product Images
              </CardTitle>
              <CardDescription>
                Add images to showcase your product. Drag to reorder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg border-2 border-dashed border-border bg-muted overflow-hidden group"
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `Product image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2" variant="secondary">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add image</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
              <CardDescription>
                Set your product pricing and profit margins.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-7"
                      {...register('price')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-7"
                      {...register('compareAtPrice')}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Original price for showing discounts
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost per Item</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-7"
                      {...register('costPrice')}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For profit calculations
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="taxable">Charge tax on this product</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply tax rates based on customer location
                  </p>
                </div>
                <Switch
                  id="taxable"
                  checked={watch('taxable')}
                  onCheckedChange={(checked) => setValue('taxable', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Inventory
              </CardTitle>
              <CardDescription>
                Track stock levels and manage inventory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackInventory">Track quantity</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor stock levels for this product
                  </p>
                </div>
                <Switch
                  id="trackInventory"
                  checked={watchTrackInventory}
                  onCheckedChange={(checked) => setValue('trackInventory', checked)}
                />
              </div>

              {watchTrackInventory && (
                <>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity in stock</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        {...register('quantity')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register('weight')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowBackorders">Allow backorders</Label>
                      <p className="text-sm text-muted-foreground">
                        Continue selling when out of stock
                      </p>
                    </div>
                    <Switch
                      id="allowBackorders"
                      checked={watch('allowBackorders')}
                      onCheckedChange={(checked) => setValue('allowBackorders', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Engine Optimization
              </CardTitle>
              <CardDescription>
                Optimize how your product appears in search results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="Custom title for search engines"
                  {...register('seoTitle')}
                />
                <p className="text-xs text-muted-foreground">
                  {(watch('seoTitle') || '').length}/60 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="Custom description for search engines"
                  rows={3}
                  {...register('seoDescription')}
                />
                <p className="text-xs text-muted-foreground">
                  {(watch('seoDescription') || '').length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="shadow-soft sticky top-6">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Product Status</Label>
                <Select
                  value={watchStatus}
                  onValueChange={(value: any) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        Archived
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={watch('visibility')}
                  onValueChange={(value: any) => setValue('visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Save changes' : 'Create product'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories - Placeholder */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Category management coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FolderTree,
  Image as ImageIcon,
  Loader2,
  Check,
  X,
  Globe,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  type Category,
  type CreateCategoryInput,
} from '@/hooks/use-categories';
import { cn } from '@/lib/utils';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  parentId: z.string().uuid().nullable().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).default(0),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  defaultParentId?: string | null;
}

// Form Section Component
function FormSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden', className)}>
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
          <Icon className="h-4 w-4 text-white/50" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Image Upload Component
function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [preview, setPreview] = React.useState(value || '');

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {/* Preview */}
        <div className="w-24 h-24 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
          {preview ? (
            <img src={preview} alt="Category" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-white/20" />
          )}
        </div>

        {/* URL Input */}
        <div className="flex-1 space-y-2">
          <Label className="text-white/70 text-sm">Image URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={preview}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50"
          />
          <p className="text-xs text-white/40">
            Enter a URL for the category image or upload from Media Library
          </p>
        </div>
      </div>
    </div>
  );
}

export function CategoryForm({ category, defaultParentId }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!category;

  const { data: categoriesData } = useCategories({ flat: true, limit: 100 });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      parentId: category?.parentId || defaultParentId || null,
      imageUrl: category?.imageUrl || '',
      sortOrder: category?.sortOrder || 0,
      seoTitle: category?.seoTitle || '',
      seoDescription: category?.seoDescription || '',
    },
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [showSeo, setShowSeo] = React.useState(false);

  const name = watch('name');
  const slug = watch('slug');
  const imageUrl = watch('imageUrl');
  const parentId = watch('parentId');

  // Auto-generate slug from name
  React.useEffect(() => {
    if (!isEditing && name && !slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug);
    }
  }, [name, slug, isEditing, setValue]);

  // Filter out the current category and its children from parent options
  const availableParents = React.useMemo(() => {
    if (!categoriesData?.data) return [];

    const getDescendantIds = (catId: string): string[] => {
      const descendants: string[] = [];
      const findChildren = (categories: Category[]) => {
        for (const cat of categories) {
          if (cat.parentId === catId) {
            descendants.push(cat.id);
            findChildren(categoriesData.data);
          }
        }
      };
      findChildren(categoriesData.data);
      return descendants;
    };

    const excludeIds = category ? [category.id, ...getDescendantIds(category.id)] : [];
    return categoriesData.data.filter((cat) => !excludeIds.includes(cat.id));
  }, [categoriesData, category]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSaving(true);

    try {
      const payload: CreateCategoryInput = {
        name: data.name,
        slug: data.slug || undefined,
        description: data.description || undefined,
        parentId: data.parentId || null,
        imageUrl: data.imageUrl || undefined,
        sortOrder: data.sortOrder,
        seoTitle: data.seoTitle || undefined,
        seoDescription: data.seoDescription || undefined,
      };

      if (isEditing) {
        await updateCategory.mutateAsync({
          categoryId: category.id,
          data: payload,
        });
        toast({
          title: 'Category updated',
          description: 'Your changes have been saved.',
        });
      } else {
        await createCategory.mutateAsync(payload);
        toast({
          title: 'Category created',
          description: 'The category has been created successfully.',
        });
      }

      router.push('/dashboard/categories');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <FormSection icon={FolderTree} title="Basic Information" description="Enter the category name and details">
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70 text-sm font-medium">
                  Category Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Electronics, Clothing, Accessories"
                  {...register('name')}
                  className={cn(
                    'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50 h-11',
                    errors.name && 'border-red-500/50 focus:ring-red-500/50'
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-white/70 text-sm font-medium">
                  URL Slug
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">/</span>
                  <Input
                    id="slug"
                    placeholder="category-slug"
                    {...register('slug')}
                    className={cn(
                      'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50 h-11 pl-6',
                      errors.slug && 'border-red-500/50 focus:ring-red-500/50'
                    )}
                  />
                </div>
                {errors.slug ? (
                  <p className="text-xs text-red-400">{errors.slug.message}</p>
                ) : (
                  <p className="text-xs text-white/40">
                    Used in URLs. Auto-generated from name if left empty.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white/70 text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe this category for your customers..."
                  rows={4}
                  {...register('description')}
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50 resize-none"
                />
              </div>
            </div>
          </FormSection>

          {/* Category Image */}
          <FormSection icon={ImageIcon} title="Category Image" description="Add a visual representation">
            <ImageUpload
              value={imageUrl || undefined}
              onChange={(url) => setValue('imageUrl', url)}
            />
          </FormSection>

          {/* SEO Settings */}
          <FormSection icon={Globe} title="SEO Settings" description="Optimize for search engines">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Custom SEO</p>
                  <p className="text-xs text-white/40">Override default meta tags</p>
                </div>
                <Switch
                  checked={showSeo}
                  onCheckedChange={setShowSeo}
                />
              </div>

              {showSeo && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle" className="text-white/70 text-sm font-medium">
                      Meta Title
                    </Label>
                    <Input
                      id="seoTitle"
                      placeholder="Category title for search results"
                      {...register('seoTitle')}
                      className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50 h-11"
                    />
                    <p className="text-xs text-white/40">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoDescription" className="text-white/70 text-sm font-medium">
                      Meta Description
                    </Label>
                    <Textarea
                      id="seoDescription"
                      placeholder="Brief description for search engine results..."
                      rows={3}
                      {...register('seoDescription')}
                      className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50 resize-none"
                    />
                    <p className="text-xs text-white/40">
                      Recommended: 150-160 characters
                    </p>
                  </div>
                </>
              )}
            </div>
          </FormSection>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Parent Category */}
          <FormSection icon={FolderTree} title="Organization">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm font-medium">
                  Parent Category
                </Label>
                <Select
                  value={parentId || 'none'}
                  onValueChange={(value) => setValue('parentId', value === 'none' ? null : value)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-violet-500/50 h-11">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151515] border-white/[0.1]">
                    <SelectItem value="none" className="text-white/70 focus:bg-white/[0.08] focus:text-white">
                      None (Top Level)
                    </SelectItem>
                    {availableParents.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-white/70 focus:bg-white/[0.08] focus:text-white"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-white/40">
                  Nest this category under another category
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-white/70 text-sm font-medium">
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  {...register('sortOrder', { valueAsNumber: true })}
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:ring-violet-500/50 h-11"
                />
                <p className="text-xs text-white/40">
                  Lower numbers appear first
                </p>
              </div>
            </div>
          </FormSection>

          {/* Preview Card */}
          <FormSection icon={Eye} title="Preview">
            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FolderTree className="h-5 w-5 text-white/30" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {name || 'Category Name'}
                  </h4>
                  <p className="text-xs text-white/40 mt-0.5">
                    /{slug || 'category-slug'}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-violet-500 hover:bg-violet-400 text-white font-semibold shadow-lg shadow-violet-500/20 h-11"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {isEditing ? 'Save Changes' : 'Create Category'}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/categories')}
              className="w-full border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white h-11"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

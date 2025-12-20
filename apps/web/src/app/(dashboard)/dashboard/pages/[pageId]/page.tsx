'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Navigation,
  LayoutTemplate,
  Copy,
  FolderTree,
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
import { usePage, useDeletePage, useDuplicatePage, PageStatus, PageTemplate } from '@/hooks/use-pages';
import { formatDate } from '@rendrix/utils';

const statusStyles: Record<PageStatus, { label: string; variant: 'default' | 'secondary' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'default' },
};

const templateLabels: Record<PageTemplate, string> = {
  default: 'Default',
  'full-width': 'Full Width',
  sidebar: 'With Sidebar',
  landing: 'Landing Page',
  contact: 'Contact Page',
  faq: 'FAQ Page',
};

export default function PageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageId = params.pageId as string;

  const { data: page, isLoading, error } = usePage(pageId);
  const deletePage = useDeletePage();
  const duplicatePage = useDuplicatePage();

  const handleDelete = async () => {
    try {
      await deletePage.mutateAsync(pageId);
      toast({
        title: 'Page deleted',
        description: 'The page has been deleted successfully.',
      });
      router.push('/dashboard/pages');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete page. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async () => {
    try {
      const newPage = await duplicatePage.mutateAsync(pageId);
      toast({
        title: 'Page duplicated',
        description: 'The page has been duplicated successfully.',
      });
      router.push(`/dashboard/pages/${newPage.id}/edit`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate page. Please try again.',
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

  if (error || !page) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
        <p className="text-white/50 mb-4">The page you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/pages">Back to Pages</Link>
        </Button>
      </div>
    );
  }

  const hasChildren = page.children && page.children.length > 0;

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
            <Link href="/dashboard/pages">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{page.title}</h1>
              <Badge variant={statusStyles[page.status].variant}>
                {statusStyles[page.status].label}
              </Badge>
              {page.showInNav && (
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  <Navigation className="mr-1 h-3 w-3" />
                  In Menu
                </Badge>
              )}
            </div>
            <p className="text-white/50 mt-1">/{page.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDuplicate}
            className="border-white/[0.08] text-white/70 hover:text-white"
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-white/[0.08] text-white/70 hover:text-white"
          >
            <Link href={`/dashboard/pages/${page.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:text-red-300"
                disabled={hasChildren}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Page</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{page.title}"? This action cannot be undone.
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
          {page.featuredImage && (
            <Card className="bg-white/[0.02] border-white/[0.08] overflow-hidden">
              <img
                src={page.featuredImage}
                alt={page.title}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Content */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Content</CardTitle>
            </CardHeader>
            <CardContent>
              {page.content ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-white/70 font-sans">
                    {page.content}
                  </pre>
                </div>
              ) : (
                <p className="text-white/50 italic">No content yet</p>
              )}
            </CardContent>
          </Card>

          {/* SEO Preview */}
          {(page.seoTitle || page.seoDescription) && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">SEO Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-blue-400 text-lg">
                    {page.seoTitle || page.title}
                  </h3>
                  <p className="text-green-400 text-sm">
                    yourstore.com/{page.slug}
                  </p>
                  <p className="text-white/50 text-sm">
                    {page.seoDescription || 'No description'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Child Pages */}
          {hasChildren && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Child Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {page.children?.map((child) => (
                    <Link
                      key={child.id}
                      href={`/dashboard/pages/${child.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div>
                        <span className="text-white font-medium">{child.title}</span>
                        <span className="text-white/40 ml-2">/{child.slug}</span>
                      </div>
                      <Badge variant={statusStyles[child.status].variant}>
                        {statusStyles[child.status].label}
                      </Badge>
                    </Link>
                  ))}
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
                <LayoutTemplate className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Template</p>
                  <p className="text-white">{templateLabels[page.template]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Visibility</p>
                  <p className="text-white capitalize">{page.visibility}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Created</p>
                  <p className="text-white">{formatDate(page.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-sm text-white/50">Updated</p>
                  <p className="text-white">{formatDate(page.updatedAt)}</p>
                </div>
              </div>
              {page.publishedAt && (
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-white/40" />
                  <div>
                    <p className="text-sm text-white/50">Published</p>
                    <p className="text-white">{formatDate(page.publishedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Show in Menu</span>
                <span className="text-white">{page.showInNav ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Menu Order</span>
                <span className="text-white">{page.navOrder}</span>
              </div>
            </CardContent>
          </Card>

          {/* Parent */}
          {page.parent && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white">Parent Page</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/dashboard/pages/${page.parent.id}`}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <FolderTree className="h-4 w-4" />
                  {page.parent.title}
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

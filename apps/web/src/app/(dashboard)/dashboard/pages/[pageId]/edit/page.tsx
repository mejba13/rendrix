'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { usePage, useUpdatePage, UpdatePageInput } from '@/hooks/use-pages';
import { PageForm } from '@/components/pages/page-form';

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageId = params.pageId as string;

  const { data: page, isLoading, error } = usePage(pageId);
  const updatePage = useUpdatePage();

  const handleSubmit = async (data: UpdatePageInput) => {
    try {
      await updatePage.mutateAsync({ pageId, data });
      toast({
        title: 'Page updated',
        description: 'Your page has been updated successfully.',
      });
      router.push(`/dashboard/pages/${pageId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update page. Please try again.',
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
          <Link href={`/dashboard/pages/${pageId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit Page</h1>
          <p className="text-white/50 mt-1">{page.title}</p>
        </div>
      </div>

      <PageForm page={page} onSubmit={handleSubmit} isSubmitting={updatePage.isPending} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreatePage, CreatePageInput } from '@/hooks/use-pages';
import { PageForm } from '@/components/pages/page-form';

export default function NewPagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const createPage = useCreatePage();

  const handleSubmit = async (data: CreatePageInput) => {
    try {
      const page = await createPage.mutateAsync(data);
      toast({
        title: 'Page created',
        description: 'Your page has been created successfully.',
      });
      router.push(`/dashboard/pages/${page.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create page. Please try again.',
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
          <Link href="/dashboard/pages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-white">New Page</h1>
          <p className="text-white/50 mt-1">Create a new page for your store</p>
        </div>
      </div>

      <PageForm onSubmit={handleSubmit} isSubmitting={createPage.isPending} />
    </div>
  );
}

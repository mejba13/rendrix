'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BannerForm } from '@/components/banners/banner-form';
import { useBanner } from '@/hooks/use-banners';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-lg bg-white/[0.06]" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-white/[0.06]" />
          <Skeleton className="h-4 w-64 bg-white/[0.04]" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-4">
            <Skeleton className="h-6 w-32 bg-white/[0.06]" />
            <Skeleton className="h-11 w-full bg-white/[0.04]" />
            <Skeleton className="h-24 w-full bg-white/[0.04]" />
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-4">
            <Skeleton className="h-6 w-32 bg-white/[0.06]" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="aspect-video bg-white/[0.04]" />
              <Skeleton className="aspect-video bg-white/[0.04]" />
              <Skeleton className="aspect-video bg-white/[0.04]" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-4">
            <Skeleton className="h-6 w-24 bg-white/[0.06]" />
            <Skeleton className="h-11 w-full bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditBannerPage() {
  const params = useParams();
  const bannerId = params.bannerId as string;
  const { data: banner, isLoading, error } = useBanner(bannerId);

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.02] blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[80px]" />
        </div>
        <div className="relative">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !banner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <ImageIcon className="h-10 w-10 text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">Banner not found</h3>
          <p className="text-white/50 max-w-sm">
            The banner you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-black font-semibold">
          <Link href="/dashboard/banners">Back to banners</Link>
        </Button>
      </div>
    );
  }

  return <BannerForm banner={banner} />;
}

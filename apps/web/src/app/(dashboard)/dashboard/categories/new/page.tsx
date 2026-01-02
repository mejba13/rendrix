'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/components/categories/category-form';
import { useStoreStore } from '@/store/store';

export default function NewCategoryPage() {
  const { currentStore } = useStoreStore();
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
          <FolderTree className="h-10 w-10 text-white/30" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">
            Please select a store from the sidebar to create categories.
          </p>
        </div>
        <Button asChild className="bg-violet-500 hover:bg-violet-400 text-white font-semibold">
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/[0.02] blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[80px]" />
      </div>

      <div className="relative space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white/50 hover:text-white hover:bg-white/[0.08]"
          >
            <Link href="/dashboard/categories">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center border border-violet-500/20">
              <FolderTree className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Add Category</h1>
              <p className="text-white/50 text-sm mt-0.5">
                Create a new product category for {currentStore.name}
              </p>
            </div>
          </div>
        </div>

        {/* Category Form */}
        <CategoryForm defaultParentId={parentId} />
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStoreStore } from '@/store/store';
import { api } from '@/lib/api';
import Link from 'next/link';

export function StoreSelector() {
  const { stores, currentStore, setStores, switchStore } = useStoreStore();

  // Fetch stores
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await api.fetch<{
        success: boolean;
        data: Array<{
          id: string;
          name: string;
          slug: string;
          subdomain: string | null;
          industry: string;
          logoUrl: string | null;
          status: string;
        }>;
      }>('/api/v1/stores');
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setStores(data);
    }
  }, [data, setStores]);

  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        <span className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          Loading...
        </span>
      </Button>
    );
  }

  if (stores.length === 0) {
    return (
      <Link href="/dashboard/stores/new">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          Create your first store
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2 truncate">
          {currentStore?.logoUrl ? (
            <img
              src={currentStore.logoUrl}
              alt={currentStore.name}
              className="h-4 w-4 rounded"
            />
          ) : (
            <Store className="h-4 w-4" />
          )}
          <span className="truncate">{currentStore?.name || 'Select store'}</span>
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => {
                switchStore(store.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent',
                currentStore?.id === store.id && 'bg-accent'
              )}
            >
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-4 w-4 rounded" />
              ) : (
                <Store className="h-4 w-4" />
              )}
              <span className="flex-1 truncate text-left">{store.name}</span>
              {currentStore?.id === store.id && <Check className="h-4 w-4" />}
            </button>
          ))}
          <div className="mt-1 border-t pt-1">
            <Link
              href="/dashboard/stores/new"
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <Plus className="h-4 w-4" />
              Create new store
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';

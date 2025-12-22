'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStoreStore } from '@/store/store';
import { api } from '@/lib/api';
import Link from 'next/link';

export function StoreSelector() {
  const { stores, currentStore, setStores, switchStore } = useStoreStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, handleClickOutside]);

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

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className="w-full justify-between bg-white/[0.04] border-white/[0.08] text-white/50 hover:bg-white/[0.08]"
        disabled
      >
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
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
        >
          <Plus className="h-4 w-4" />
          Create your first store
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08] hover:text-white"
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
            <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
              <Store className="h-3 w-3 text-primary" />
            </div>
          )}
          <span className="truncate">{currentStore?.name || 'Select store'}</span>
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-white/40" />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-1 shadow-elevated">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => {
                switchStore(store.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors',
                currentStore?.id === store.id
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-4 w-4 rounded" />
              ) : (
                <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                  <Store className="h-3 w-3 text-primary" />
                </div>
              )}
              <span className="flex-1 truncate text-left">{store.name}</span>
              {currentStore?.id === store.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
          <div className="mt-1 border-t border-white/[0.08] pt-1">
            <Link
              href="/dashboard/stores/new"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 outline-none hover:bg-white/[0.04] hover:text-white transition-colors"
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

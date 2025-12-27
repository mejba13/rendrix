'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronsUpDown,
  Plus,
  Store,
  Package,
  ShoppingCart,
  Users,
  Globe,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useStoreStore } from '@/store/store';
import { api } from '@/lib/api';
import Link from 'next/link';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  industry: string;
  logoUrl: string | null;
  status: string;
  stats?: {
    products: number;
    orders: number;
    customers: number;
  };
}

// Industry labels and colors
const industryConfig: Record<string, { label: string; color: string; bg: string }> = {
  toys: { label: 'Toys & Games', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  kitchen: { label: 'Kitchen & Dining', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  nail_care: { label: 'Nail Care', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20' },
  home_decor: { label: 'Home Decor', color: 'text-teal-400', bg: 'bg-teal-500/20' },
  garments: { label: 'Fashion & Apparel', color: 'text-violet-400', bg: 'bg-violet-500/20' },
  beauty: { label: 'Beauty & Cosmetics', color: 'text-rose-400', bg: 'bg-rose-500/20' },
  sports: { label: 'Sports & Fitness', color: 'text-green-400', bg: 'bg-green-500/20' },
  gadgets: { label: 'Electronics', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  home_appliances: { label: 'Appliances', color: 'text-slate-400', bg: 'bg-slate-500/20' },
  general: { label: 'General Store', color: 'text-orange-400', bg: 'bg-orange-500/20' },
};

export function StoreSelector() {
  const router = useRouter();
  const { stores, currentStore, setStores, switchStore } = useStoreStore();
  const [open, setOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
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

  // Fetch stores with stats
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await api.fetch<{
        success: boolean;
        data: StoreData[];
      }>('/api/v1/stores');
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setStores(data);
    }
  }, [data, setStores]);

  const handleStoreClick = (store: StoreData) => {
    // If clicking on the current store, just close the dropdown
    if (currentStore?.id === store.id) {
      setOpen(false);
      return;
    }
    // Show confirmation modal for switching to a different store
    setSelectedStore(store);
    setOpen(false);
    setShowSwitchModal(true);
  };

  const handleConfirmSwitch = async () => {
    if (!selectedStore) return;

    setIsSwitching(true);

    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    switchStore(selectedStore.id);
    router.push(`/dashboard/stores/${selectedStore.id}`);

    setShowSwitchModal(false);
    setIsSwitching(false);
    setSelectedStore(null);
  };

  const handleCancelSwitch = () => {
    setShowSwitchModal(false);
    setSelectedStore(null);
  };

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

  const config = selectedStore
    ? industryConfig[selectedStore.industry] || industryConfig.general
    : industryConfig.general;

  return (
    <>
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
                onClick={() => handleStoreClick(store)}
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

      {/* Store Switching Modal */}
      <Dialog open={showSwitchModal} onOpenChange={handleCancelSwitch}>
        <DialogContent className="bg-[#0a0a0a] border-white/[0.08] sm:max-w-md overflow-hidden p-0">
          {/* Gradient background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-orange-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl opacity-40" />
          </div>

          <div className="relative">
            {/* Header */}
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-white text-xl font-semibold text-center">
                Switch to Store
              </DialogTitle>
              <DialogDescription className="text-white/50 text-center">
                You&apos;re about to switch your active workspace
              </DialogDescription>
            </DialogHeader>

            {/* Store Card Preview */}
            {selectedStore && (
              <div className="px-6 py-6">
                <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 overflow-hidden">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

                  <div className="relative">
                    {/* Store Identity */}
                    <div className="flex items-center gap-4 mb-4">
                      {selectedStore.logoUrl ? (
                        <img
                          src={selectedStore.logoUrl}
                          alt={selectedStore.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30"
                        />
                      ) : (
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center ring-2 ring-primary/30",
                          config.bg
                        )}>
                          <Store className={cn("w-8 h-8", config.color)} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {selectedStore.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            config.bg,
                            config.color
                          )}>
                            {config.label}
                          </span>
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs",
                            selectedStore.status === 'active'
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          )}>
                            {selectedStore.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Store Stats */}
                    {selectedStore.stats && (
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
                        <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                          <Package className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{selectedStore.stats.products}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">Products</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                          <ShoppingCart className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{selectedStore.stats.orders}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">Orders</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                          <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{selectedStore.stats.customers}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">Customers</p>
                        </div>
                      </div>
                    )}

                    {/* Store URL */}
                    <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-white/[0.04]">
                      <Globe className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/60 font-mono truncate">
                        {selectedStore.subdomain || selectedStore.slug}.rendrix.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 pt-0 space-y-3">
              <Button
                onClick={handleConfirmSwitch}
                disabled={isSwitching}
                className="w-full h-12 bg-gradient-to-r from-primary to-orange-600 hover:opacity-90 text-black font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-200"
              >
                {isSwitching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Switching...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Switch & Manage Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
              <Button
                onClick={handleCancelSwitch}
                disabled={isSwitching}
                variant="ghost"
                className="w-full h-10 text-white/60 hover:text-white hover:bg-white/[0.06]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

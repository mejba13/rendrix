'use client';

import React, { useEffect, useState } from 'react';
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  Globe,
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  customDomain?: string | null;
  industry: string;
  logoUrl: string | null;
  status: string;
  stats?: {
    products: number;
    orders: number;
    customers: number;
  };
}

interface StoreSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  store: StoreData | null;
  isLoading?: boolean;
}

// Industry configuration with gradients
const industryConfig: Record<string, { label: string; gradient: string; iconBg: string; accent: string }> = {
  toys: { label: 'Toys & Games', gradient: 'from-pink-500/20 via-fuchsia-500/10', iconBg: 'bg-pink-500/20', accent: 'text-pink-400' },
  kitchen: { label: 'Kitchen & Dining', gradient: 'from-amber-500/20 via-orange-500/10', iconBg: 'bg-amber-500/20', accent: 'text-amber-400' },
  nail_care: { label: 'Nail Care', gradient: 'from-fuchsia-500/20 via-purple-500/10', iconBg: 'bg-fuchsia-500/20', accent: 'text-fuchsia-400' },
  home_decor: { label: 'Home Decor', gradient: 'from-teal-500/20 via-cyan-500/10', iconBg: 'bg-teal-500/20', accent: 'text-teal-400' },
  garments: { label: 'Fashion & Apparel', gradient: 'from-violet-500/20 via-purple-500/10', iconBg: 'bg-violet-500/20', accent: 'text-violet-400' },
  beauty: { label: 'Beauty & Cosmetics', gradient: 'from-rose-500/20 via-pink-500/10', iconBg: 'bg-rose-500/20', accent: 'text-rose-400' },
  sports: { label: 'Sports & Fitness', gradient: 'from-green-500/20 via-emerald-500/10', iconBg: 'bg-green-500/20', accent: 'text-green-400' },
  gadgets: { label: 'Electronics', gradient: 'from-blue-500/20 via-cyan-500/10', iconBg: 'bg-blue-500/20', accent: 'text-blue-400' },
  home_appliances: { label: 'Appliances', gradient: 'from-slate-500/20 via-gray-500/10', iconBg: 'bg-slate-500/20', accent: 'text-slate-400' },
  general: { label: 'General Store', gradient: 'from-orange-500/20 via-amber-500/10', iconBg: 'bg-orange-500/20', accent: 'text-orange-400' },
};

// Animated counter component
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Stat card component
function StatCard({
  icon: Icon,
  value,
  label,
  delay,
  accentColor
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  delay: number;
  accentColor: string;
}) {
  return (
    <div
      className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden hover:scale-105 hover:-translate-y-0.5 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
        <div className="relative mb-3">
          <div className={cn("absolute inset-0 blur-lg opacity-50", accentColor.replace('text-', 'bg-'))} style={{ transform: 'scale(0.5)' }} />
          <Icon className={cn("w-5 h-5 relative", accentColor)} />
        </div>
        <p className="text-2xl font-bold text-white tracking-tight relative">
          <AnimatedCounter value={value} duration={1200} />
        </p>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}

export function StoreSwitchModal({ isOpen, onClose, onConfirm, store, isLoading = false }: StoreSwitchModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = store ? (industryConfig[store.industry] || industryConfig.general) : industryConfig.general;
  const storeUrl = store?.customDomain || `${store?.subdomain || store?.slug}.rendrix.com`;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg transition-all duration-300",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="relative mx-4">
          {/* Outer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-500/30 rounded-[28px] blur-xl opacity-60 animate-pulse" />

          {/* Main modal container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Background layers */}
            <div className="absolute inset-0 bg-[#080808]" />
            <div className={cn("absolute inset-0 bg-gradient-to-br", config.gradient, "to-transparent")} />

            {/* Animated gradient orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-500/40 to-orange-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-orange-500/30 to-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Floating particles */}
            <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-amber-400/60 rounded-full blur-sm animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-[15%] right-[20%] w-1.5 h-1.5 bg-orange-400/50 rounded-full blur-sm animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-[25%] right-[30%] w-2.5 h-2.5 bg-amber-500/40 rounded-full blur-sm animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }} />
            <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 bg-orange-300/50 rounded-full blur-sm animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />

            {/* Content */}
            {store && (
              <div className="relative z-20 p-8">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors group animate-in fade-in duration-300"
                  style={{ animationDelay: '300ms' }}
                >
                  <X className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                </button>

                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400/90 tracking-wide">SWITCH WORKSPACE</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Ready to switch?
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    You&apos;re about to enter a new workspace
                  </p>
                </div>

                {/* Store Identity - Bento Style */}
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />

                    <div className="relative flex items-center gap-5">
                      {/* Store Logo with animated ring */}
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/50 to-orange-500/50 blur-lg animate-pulse" />
                        <div
                          className="absolute -inset-0.5 rounded-2xl animate-spin"
                          style={{
                            background: 'conic-gradient(from 0deg, #f59e0b, #ea580c, #f59e0b)',
                            opacity: 0.6,
                            animationDuration: '8s',
                          }}
                        />
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="relative w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className={cn(
                            "relative w-16 h-16 rounded-xl flex items-center justify-center",
                            config.iconBg
                          )}>
                            <Store className={cn("w-8 h-8", config.accent)} />
                          </div>
                        )}
                      </div>

                      {/* Store Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white truncate mb-2">
                          {store.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium",
                            config.iconBg, config.accent
                          )}>
                            {config.label}
                          </span>
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium",
                            store.status === 'active'
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              store.status === 'active' ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                            )} />
                            {store.status === 'active' ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid - Bento Layout */}
                {store.stats && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <StatCard
                      icon={Package}
                      value={store.stats.products}
                      label="Products"
                      delay={200}
                      accentColor="text-amber-400"
                    />
                    <StatCard
                      icon={ShoppingCart}
                      value={store.stats.orders}
                      label="Orders"
                      delay={300}
                      accentColor="text-orange-400"
                    />
                    <StatCard
                      icon={Users}
                      value={store.stats.customers}
                      label="Customers"
                      delay={400}
                      accentColor="text-amber-500"
                    />
                  </div>
                )}

                {/* Store URL */}
                <div
                  className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white/40" />
                    </div>
                    <span className="text-sm text-white/50 font-mono truncate flex-1">
                      {storeUrl}
                    </span>
                    <Zap className="w-4 h-4 text-amber-400/60" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
                >
                  {/* Primary CTA */}
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="relative w-full h-14 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-black font-bold rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {/* Button shine effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />

                    {isLoading ? (
                      <span className="flex items-center gap-3 relative">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="tracking-wide">Switching workspace...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-3 relative">
                        <TrendingUp className="w-5 h-5" />
                        <span className="tracking-wide">Switch & Manage Store</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {/* Cancel button */}
                  <Button
                    onClick={onClose}
                    disabled={isLoading}
                    variant="ghost"
                    className="w-full h-11 text-white/50 hover:text-white hover:bg-white/[0.05] rounded-xl font-medium transition-all"
                  >
                    Stay in current workspace
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

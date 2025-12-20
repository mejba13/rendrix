'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  CreditCard,
  Paintbrush,
  ChevronRight,
  Sparkles,
  Image,
  FileText,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreSelector } from './store-selector';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Coupons', href: '/dashboard/coupons', icon: Tag },
  { name: 'Blog', href: '/dashboard/blog', icon: BookOpen },
  { name: 'Pages', href: '/dashboard/pages', icon: FileText },
  { name: 'Media', href: '/dashboard/media', icon: Image },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Theme', href: '/dashboard/theme', icon: Paintbrush },
];

const bottomNavigation = [
  { name: 'Billing', href: '/settings/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-black border-r border-white/[0.08]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
          <Store className="h-4 w-4 text-black" />
        </div>
        <span className="text-lg font-semibold text-white">Rendrix</span>
      </div>

      {/* Store Selector */}
      <div className="border-b border-white/[0.08] p-4">
        <StoreSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-custom">
        <div className="mb-2 px-3 py-2">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Main Menu
          </span>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-white/[0.04] text-white/50 group-hover:bg-white/[0.08] group-hover:text-white/70'
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 via-orange-500/10 to-transparent border border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-white">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-white/50 mb-3">
            Unlock unlimited stores and advanced features
          </p>
          <Link
            href="/settings/billing"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Learn more
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-white/[0.08] p-3 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-white/[0.04] text-white/50 group-hover:bg-white/[0.08] group-hover:text-white/70'
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

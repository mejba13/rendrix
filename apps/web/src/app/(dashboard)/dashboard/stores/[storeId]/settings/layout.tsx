'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ArrowLeft, Settings, Palette, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/use-stores';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const settingsNavItems = [
  {
    title: 'General',
    href: '',
    icon: Settings,
    description: 'Basic store settings',
  },
  {
    title: 'Branding',
    href: '/branding',
    icon: Palette,
    description: 'Logo and visual identity',
  },
  {
    title: 'Domains',
    href: '/domains',
    icon: Globe,
    description: 'Subdomain and custom domain',
  },
  {
    title: 'SEO',
    href: '/seo',
    icon: Search,
    description: 'Search engine optimization',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const storeId = params.storeId as string;
  const { data: store, isLoading } = useStore(storeId);

  const basePath = `/dashboard/stores/${storeId}/settings`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[150px] mt-2" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-semibold tracking-tight">
                Store Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage settings for {store?.name || 'your store'}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {settingsNavItems.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive = pathname === href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex-1">
                    <p>{item.title}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

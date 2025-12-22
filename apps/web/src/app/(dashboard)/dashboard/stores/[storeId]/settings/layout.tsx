'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Globe,
  Search,
  MapPin,
  ShoppingBag,
  Bell,
  FileText,
  AlertTriangle,
  Check,
  Loader2,
  Store,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/use-stores';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ViewStoreButton } from '@/components/store/view-store-button';
import { StorePreviewModal } from '@/components/store/store-preview-modal';

// Settings navigation structure
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
  variant?: 'danger';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const settingsNav: NavSection[] = [
  {
    title: 'Store',
    items: [
      {
        title: 'General',
        href: '',
        icon: Settings,
        description: 'Store name, description & status',
      },
      {
        title: 'Domains',
        href: '/domains',
        icon: Globe,
        description: 'URLs & custom domains',
      },
      {
        title: 'Regional',
        href: '/regional',
        icon: MapPin,
        description: 'Currency, timezone & units',
      },
    ],
  },
  {
    title: 'Commerce',
    items: [
      {
        title: 'Store Settings',
        href: '/commerce',
        icon: ShoppingBag,
        description: 'Tax, shipping & checkout',
      },
      {
        title: 'SEO',
        href: '/seo',
        icon: Search,
        description: 'Meta tags & social sharing',
      },
    ],
  },
  {
    title: 'Notifications',
    items: [
      {
        title: 'Alerts',
        href: '/notifications',
        icon: Bell,
        description: 'Email & push notifications',
      },
    ],
  },
  {
    title: 'Legal',
    items: [
      {
        title: 'Policies',
        href: '/legal',
        icon: FileText,
        description: 'Terms, privacy & refunds',
      },
    ],
  },
  {
    title: 'Advanced',
    items: [
      {
        title: 'Danger Zone',
        href: '/danger',
        icon: AlertTriangle,
        description: 'Delete or deactivate store',
        variant: 'danger',
      },
    ],
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

// Save status indicator
function SaveStatus({ isSaving, lastSaved }: { isSaving: boolean; lastSaved?: Date }) {
  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      {isSaving ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <Check className="w-3 h-3 text-emerald-400" />
          <span>All changes saved</span>
        </>
      ) : null}
    </div>
  );
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const storeId = params.storeId as string;
  const { data: store, isLoading } = useStore(storeId);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const basePath = `/dashboard/stores/${storeId}/settings`;

  // In development, use localhost:3001 for storefront preview
  const isDev = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const productionUrl = store?.customDomain || (store?.subdomain ? `${store.subdomain}.rendrix.com` : `${store?.slug}.rendrix.com`);
  const storeUrl = isDev ? `localhost:3001?store=${store?.slug}` : productionUrl;
  const storeUrlProtocol = isDev ? 'http' : 'https';

  // Find current page info
  const currentPage = React.useMemo(() => {
    for (const section of settingsNav) {
      for (const item of section.items) {
        const href = `${basePath}${item.href}`;
        if (pathname === href) {
          return item;
        }
      }
    }
    return settingsNav[0].items[0];
  }, [pathname, basePath]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="border-b border-white/[0.06] bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="shrink-0 hover:bg-white/[0.08] rounded-xl"
              >
                <Link href={`/dashboard/stores/${storeId}`}>
                  <ArrowLeft className="h-5 w-5 text-white/70" />
                </Link>
              </Button>

              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Skeleton className="w-10 h-10 rounded-xl" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center border border-primary/20">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-white">
                          Store Settings
                        </h1>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                        <span className="text-lg text-white/60">{currentPage?.title}</span>
                      </div>
                      <p className="text-sm text-white/40">
                        {store?.name || 'Loading...'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SaveStatus isSaving={false} lastSaved={new Date()} />

              {store && (
                <ViewStoreButton
                  storeUrl={`${storeUrlProtocol}://${storeUrl}`}
                  storeName={store.name}
                  size="sm"
                  onPreview={(device) => {
                    setPreviewDevice(device);
                    setShowPreview(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-72 shrink-0 border-r border-white/[0.06] min-h-[calc(100vh-8rem)] bg-black/20">
          <nav className="p-4 space-y-6">
            {settingsNav.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const href = `${basePath}${item.href}`;
                    const isActive = pathname === href;
                    const Icon = item.icon;
                    const isDanger = item.variant === 'danger';

                    return (
                      <Link
                        key={item.title}
                        href={href}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                          isActive
                            ? isDanger
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-primary/10 text-primary'
                            : isDanger
                              ? 'text-red-400/60 hover:bg-red-500/5 hover:text-red-400'
                              : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                            isActive
                              ? isDanger
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-primary/20 text-primary'
                              : isDanger
                                ? 'bg-red-500/10 text-red-400/60 group-hover:bg-red-500/10'
                                : 'bg-white/[0.04] text-white/50 group-hover:bg-white/[0.08] group-hover:text-white/70'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p
                            className={cn(
                              'text-xs truncate',
                              isActive
                                ? isDanger
                                  ? 'text-red-400/60'
                                  : 'text-primary/60'
                                : 'text-white/30'
                            )}
                          >
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <div
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isDanger ? 'bg-red-400' : 'bg-primary'
                            )}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-8">
          <div className="max-w-3xl">{children}</div>
        </main>
      </div>

      {/* Store Preview Modal */}
      {showPreview && store && (
        <StorePreviewModal
          url={`${storeUrlProtocol}://${storeUrl}`}
          storeName={store.name}
          initialDevice={previewDevice}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

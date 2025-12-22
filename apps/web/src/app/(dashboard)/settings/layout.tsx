'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Palette,
  CreditCard,
  Users,
  Settings,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const settingsNavItems = [
  {
    title: 'Profile',
    href: '/settings',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    title: 'Account & Security',
    href: '/settings/account',
    icon: Shield,
    description: 'Password, 2FA, and sessions',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: Bell,
    description: 'Email and push preferences',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: Palette,
    description: 'Theme and display settings',
  },
  {
    title: 'Billing',
    href: '/settings/billing',
    icon: CreditCard,
    description: 'Manage subscription and invoices',
  },
  {
    title: 'Team',
    href: '/settings/team',
    icon: Users,
    description: 'Invite and manage team members',
  },
  {
    title: 'Chat Assistant',
    href: '/settings/chatbot',
    icon: MessageCircle,
    description: 'Configure AI assistant settings',
  },
];

// Ambient Background Component
function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px] animate-float" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[80px] animate-float" style={{ animationDelay: '-3s' }} />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <div className="relative space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center border border-primary/20">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="text-sm text-white/50">
                  Manage your account preferences and configurations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <nav className="sticky top-6 space-y-1">
              {settingsNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200',
                      isActive
                        ? 'bg-white/[0.08] border border-white/[0.08]'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/[0.04] text-white/50 group-hover:bg-white/[0.08] group-hover:text-white/70'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium transition-colors',
                        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                      )}>
                        {item.title}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            <nav className="flex gap-2 min-w-max">
              {settingsNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-primary text-black'
                        : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

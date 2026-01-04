'use client';

import {
  Truck,
  RefreshCcw,
  CreditCard,
  Award,
  Shield,
  Clock,
  Headphones,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadge {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface TrustBadgesProps {
  badges?: TrustBadge[];
  variant?: 'strip' | 'cards';
  className?: string;
}

const defaultBadges: TrustBadge[] = [
  {
    icon: Truck,
    title: 'Fast Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: RefreshCcw,
    title: 'Next Day Delivery',
    description: 'Free, 1-2 paid zone 30%',
  },
  {
    icon: CreditCard,
    title: 'Low Price Guarantee',
    description: 'We offer competitive prices',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'We Guarantee Our Products',
  },
];

export function TrustBadges({
  badges = defaultBadges,
  variant = 'strip',
  className,
}: TrustBadgesProps) {
  if (variant === 'cards') {
    return (
      <section className={cn('py-8 lg:py-12 bg-[var(--theme-surface)] theme-transition', className)}>
        <div className="container-theme">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {badges.map((badge, index) => (
              <div
                key={badge.title}
                className="group flex flex-col items-center rounded-[var(--theme-radius-lg)] border border-[var(--theme-border)] bg-[var(--theme-background)] p-6 text-center transition-all duration-300 hover:border-[var(--theme-accent)] hover:shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-muted)] transition-colors group-hover:bg-[var(--theme-accent)]/10">
                  <badge.icon className="h-6 w-6 text-[var(--theme-foreground)] group-hover:text-[var(--theme-accent)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--theme-foreground)]">
                  {badge.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--theme-secondary)]">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('border-y border-[var(--theme-border)] bg-[var(--theme-background)] theme-transition', className)}>
      <div className="container-theme">
        <div className="grid grid-cols-2 divide-x divide-y divide-[var(--theme-border)] lg:grid-cols-4 lg:divide-y-0">
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className="group flex items-center gap-4 px-4 py-6 transition-colors hover:bg-[var(--theme-muted)]/50 sm:px-6 lg:px-8"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--theme-muted)] transition-all duration-300 group-hover:bg-[var(--theme-accent)]/10 group-hover:scale-110">
                <badge.icon className="h-5 w-5 text-[var(--theme-foreground)] group-hover:text-[var(--theme-accent)]" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[var(--theme-foreground)]">
                  {badge.title}
                </h3>
                <p className="truncate text-xs text-[var(--theme-secondary)]">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

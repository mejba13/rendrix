'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllText?: string;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  label,
  title,
  description,
  viewAllHref,
  viewAllText = 'See All Products',
  align = 'left',
  size = 'md',
  className,
  children,
}: SectionHeaderProps) {
  const titleSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl lg:text-4xl',
    lg: 'text-3xl sm:text-4xl lg:text-5xl',
  };

  return (
    <div
      className={cn(
        'mb-8 lg:mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-end gap-4',
          align === 'center' ? 'justify-center' : 'justify-between'
        )}
      >
        <div className={cn(align === 'center' && 'max-w-2xl')}>
          {label && (
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-[var(--theme-accent)]">
              {label}
            </span>
          )}
          <h2
            className={cn(
              'font-bold tracking-tight text-[var(--theme-foreground)]',
              titleSizes[size]
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-base text-[var(--theme-secondary)] lg:text-lg">
              {description}
            </p>
          )}
        </div>

        {viewAllHref && align === 'left' && (
          <Link
            href={viewAllHref}
            className="group hidden items-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:flex"
          >
            {viewAllText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {children}
      </div>

      {viewAllHref && align === 'center' && (
        <Link
          href={viewAllHref}
          className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)]"
        >
          {viewAllText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

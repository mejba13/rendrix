'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  phone?: string;
  dismissible?: boolean;
  className?: string;
}

export function AnnouncementBar({
  message = 'Free shipping on orders over $100',
  linkText = 'Shop Now',
  linkHref = '/products',
  phone,
  dismissible = true,
  className,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative z-50 bg-[var(--theme-foreground)] text-[var(--theme-background)]',
        'transition-all duration-300',
        className
      )}
    >
      <div className="container-theme">
        <div className="flex h-10 items-center justify-between gap-4 text-xs sm:text-sm">
          {/* Left side - Contact info (hidden on mobile) */}
          {phone && (
            <div className="hidden items-center gap-2 lg:flex">
              <Phone className="h-3.5 w-3.5" />
              <span className="font-medium">{phone}</span>
            </div>
          )}

          {/* Center - Main message */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <span className="truncate font-medium">{message}</span>
            {linkText && linkHref && (
              <Link
                href={linkHref}
                className="group inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
              >
                {linkText}
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Right side - Dismiss button */}
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

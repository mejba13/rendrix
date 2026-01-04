'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { SectionHeader } from './section-header';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface CountdownTimerProps {
  endTime: Date;
  className?: string;
}

function CountdownTimer({ endTime, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = endTime.getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-[var(--theme-secondary)]">Ends in</span>
      <div className="flex items-center gap-1">
        <TimeBlock value={formatNumber(timeLeft.hours)} />
        <span className="text-[var(--theme-accent)] font-bold">:</span>
        <TimeBlock value={formatNumber(timeLeft.minutes)} />
        <span className="text-[var(--theme-accent)] font-bold">:</span>
        <TimeBlock value={formatNumber(timeLeft.seconds)} />
      </div>
    </div>
  );
}

function TimeBlock({ value }: { value: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[var(--theme-radius-sm)] bg-[var(--theme-accent)] text-sm font-bold text-white">
      {value}
    </span>
  );
}

interface DealsSectionProps {
  products: Product[];
  title?: string;
  dealEndTime?: Date;
  className?: string;
}

export function DealsSection({
  products,
  title = "Today's Best Deals",
  dealEndTime,
  className,
}: DealsSectionProps) {
  // Default end time: end of today
  const defaultEndTime = new Date();
  defaultEndTime.setHours(23, 59, 59, 999);
  const endTime = dealEndTime || defaultEndTime;

  // Only show products with discounts
  const dealProducts = products
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .slice(0, 6);

  if (dealProducts.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-12 lg:py-16 bg-[var(--theme-background)] theme-transition', className)}>
      <div className="container-theme">
        {/* Header with Timer */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-12">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--theme-accent)]">
              <Clock className="h-3.5 w-3.5" />
              Limited Time
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--theme-foreground)] sm:text-3xl lg:text-4xl">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <CountdownTimer endTime={endTime} />
            <Link
              href="/products?sale=true"
              className="group hidden items-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:flex"
            >
              See All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Products Grid - Horizontal scroll on mobile */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 xl:grid-cols-6">
            {dealProducts.map((product, index) => (
              <div
                key={product.id}
                className="w-[260px] flex-shrink-0 lg:w-auto"
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>

          {/* Scroll indicators for mobile */}
          <div className="mt-4 flex justify-center gap-2 lg:hidden">
            {dealProducts.map((_, index) => (
              <span
                key={index}
                className={cn(
                  'h-1.5 rounded-full bg-[var(--theme-border)]',
                  index === 0 ? 'w-6 bg-[var(--theme-accent)]' : 'w-1.5'
                )}
              />
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <Link
          href="/products?sale=true"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] lg:hidden"
        >
          See All Deals
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

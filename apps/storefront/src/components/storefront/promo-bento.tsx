'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PromoCard {
  id: string;
  label?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'light' | 'dark';
}

interface PromoBentoProps {
  cards: PromoCard[];
  className?: string;
}

export function PromoBento({ cards, className }: PromoBentoProps) {
  if (!cards || cards.length === 0) return null;

  const displayCards = cards.slice(0, 2);

  return (
    <section className={cn('py-8 lg:py-12 bg-[var(--theme-background)] theme-transition', className)}>
      <div className="container-theme">
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
          {displayCards.map((card, index) => (
            <Link
              key={card.id}
              href={card.ctaUrl || '/products'}
              className={cn(
                'group relative flex min-h-[280px] overflow-hidden rounded-[var(--theme-radius-xl)] transition-all duration-500 hover:shadow-xl lg:min-h-[320px]',
                card.variant === 'dark'
                  ? 'bg-[var(--theme-foreground)] text-[var(--theme-background)]'
                  : 'bg-[var(--theme-surface)]'
              )}
              style={{ backgroundColor: card.backgroundColor }}
            >
              {/* Content Side */}
              <div className="relative z-10 flex w-1/2 flex-col justify-center p-6 lg:p-8">
                {card.label && (
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      card.variant === 'dark'
                        ? 'text-[var(--theme-background)]/60'
                        : 'text-[var(--theme-secondary)]'
                    )}
                  >
                    {card.label}
                  </span>
                )}

                <h3
                  className={cn(
                    'mt-2 text-xl font-bold lg:text-2xl xl:text-3xl',
                    card.variant === 'dark'
                      ? 'text-[var(--theme-background)]'
                      : 'text-[var(--theme-foreground)]'
                  )}
                  style={{ color: card.textColor }}
                >
                  {card.title}
                </h3>

                {card.subtitle && (
                  <p
                    className={cn(
                      'mt-2 text-sm lg:text-base',
                      card.variant === 'dark'
                        ? 'text-[var(--theme-background)]/70'
                        : 'text-[var(--theme-secondary)]'
                    )}
                  >
                    {card.subtitle}
                  </p>
                )}

                {card.ctaText && (
                  <div className="mt-6">
                    <Button
                      variant={card.variant === 'dark' ? 'outline' : 'default'}
                      size="sm"
                      className={cn(
                        'group/btn rounded-[var(--theme-radius-sm)] font-semibold',
                        card.variant === 'dark'
                          ? 'border-[var(--theme-background)]/30 text-[var(--theme-background)] hover:bg-[var(--theme-background)] hover:text-[var(--theme-foreground)]'
                          : 'bg-[var(--theme-foreground)] text-[var(--theme-background)]'
                      )}
                    >
                      {card.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Image Side */}
              <div className="relative w-1/2">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-contain object-right-bottom p-4 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={cn(
                        'text-[8rem] font-bold opacity-5 transition-transform duration-500 group-hover:scale-110',
                        card.variant === 'dark'
                          ? 'text-[var(--theme-background)]'
                          : 'text-[var(--theme-foreground)]'
                      )}
                    >
                      {card.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 rounded-[var(--theme-radius-xl)] opacity-0 ring-2 ring-inset transition-opacity duration-300 group-hover:opacity-100',
                  card.variant === 'dark'
                    ? 'ring-[var(--theme-background)]/20'
                    : 'ring-[var(--theme-foreground)]/10'
                )}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

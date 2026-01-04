'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
}

interface PromoCardsProps {
  cards: PromoCard[];
  className?: string;
}

const defaultCards: PromoCard[] = [
  {
    id: '1',
    label: 'Best Sellers',
    title: 'New Collection Armchair',
    ctaText: 'View more',
    ctaUrl: '/products?category=furniture',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
  },
  {
    id: '2',
    label: 'Powerful Cleaner',
    title: 'Perfect Cream only $85',
    ctaText: 'Shop now',
    ctaUrl: '/products?category=beauty',
    backgroundColor: '#dc2626',
    textColor: '#ffffff',
  },
  {
    id: '3',
    label: 'On September',
    title: 'Coming Soon Note Pro',
    ctaText: 'View more',
    ctaUrl: '/products?category=electronics',
    backgroundColor: '#f5f5f5',
    textColor: '#1a1a1a',
  },
];

export function PromoCards({ cards = defaultCards, className }: PromoCardsProps) {
  const displayCards = cards.slice(0, 3);

  return (
    <section className={cn('py-8 lg:py-12 bg-[var(--theme-background)] theme-transition', className)}>
      <div className="container-theme">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {displayCards.map((card) => (
            <Link
              key={card.id}
              href={card.ctaUrl || '/products'}
              className="group relative flex min-h-[220px] overflow-hidden rounded-[var(--theme-radius-xl)] transition-all duration-500 hover:shadow-xl lg:min-h-[260px]"
              style={{ backgroundColor: card.backgroundColor }}
            >
              {/* Content */}
              <div className="relative z-10 flex w-3/5 flex-col justify-between p-6 lg:p-8">
                <div>
                  {card.label && (
                    <span
                      className="text-xs font-semibold uppercase tracking-wider opacity-70"
                      style={{ color: card.textColor }}
                    >
                      {card.label}
                    </span>
                  )}
                  <h3
                    className="mt-2 text-lg font-bold lg:text-xl"
                    style={{ color: card.textColor }}
                  >
                    {card.title}
                  </h3>
                </div>

                {card.ctaText && (
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group-hover:underline"
                    style={{ color: card.textColor }}
                  >
                    {card.ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </div>

              {/* Image */}
              <div className="absolute bottom-0 right-0 h-full w-2/5">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-contain object-right-bottom p-4 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 40vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span
                      className="text-[6rem] font-bold"
                      style={{ color: card.textColor }}
                    >
                      {card.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-[var(--theme-radius-xl)] ring-2 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-white/20" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: React.ReactNode;
  productCount?: number;
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  badge?: string;
  priceTag?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface HeroSectionProps {
  categories: Category[];
  banners: Banner[];
  storeName?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  fashion: '👗',
  electronics: '📱',
  'smartphone-tablets': '📱',
  'laptop-computer': '💻',
  'camera-photo': '📷',
  'home-decor': '🏠',
  'beauty-health': '💄',
  'game-accessories': '🎮',
  autopart: '🚗',
  default: '📦',
};

export function HeroSection({
  categories,
  banners,
  storeName = 'Store',
}: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const activeBanner = banners[activeSlide] || banners[0];

  return (
    <section className="bg-[var(--theme-background)] py-4 lg:py-6 theme-transition">
      <div className="container-theme">
        <div className="flex gap-4 lg:gap-6">
          {/* Category Sidebar - Desktop Only */}
          <div className="hidden w-[260px] flex-shrink-0 lg:block">
            <div className="rounded-[var(--theme-radius-lg)] border border-[var(--theme-border)] bg-[var(--theme-background)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-muted)] px-4 py-3">
                <LayoutGrid className="h-5 w-5 text-[var(--theme-foreground)]" />
                <span className="font-semibold text-[var(--theme-foreground)]">
                  Shop by Categories
                </span>
              </div>

              {/* Category List */}
              <nav className="py-2">
                {categories.slice(0, 10).map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className={cn(
                      'group flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                      'hover:bg-[var(--theme-muted)] hover:text-[var(--theme-accent)]',
                      hoveredCategory === category.id && 'bg-[var(--theme-muted)] text-[var(--theme-accent)]'
                    )}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-base">
                        {categoryIcons[category.slug] || categoryIcons.default}
                      </span>
                      <span className="text-[var(--theme-foreground)] group-hover:text-[var(--theme-accent)]">
                        {category.name}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[var(--theme-secondary)] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Banner Area */}
          <div className="flex-1">
            <div className="relative aspect-[16/9] lg:aspect-[2.5/1] overflow-hidden rounded-[var(--theme-radius-xl)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBanner?.id || 'default'}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {/* Background Image */}
                  {activeBanner?.imageUrl ? (
                    <Image
                      src={activeBanner.imageUrl}
                      alt={activeBanner.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[var(--theme-muted)] to-[var(--theme-surface)]"
                      style={{
                        backgroundColor: activeBanner?.backgroundColor,
                      }}
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-8 lg:px-12 max-w-xl">
                      {activeBanner?.badge && (
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-accent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
                        >
                          <Sparkles className="h-3 w-3" />
                          {activeBanner.badge}
                        </motion.span>
                      )}

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl"
                        style={{ color: activeBanner?.textColor }}
                      >
                        {activeBanner?.title || storeName}
                      </motion.h1>

                      {activeBanner?.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-2 text-xl font-semibold text-white/90 lg:text-2xl"
                        >
                          {activeBanner.subtitle}
                        </motion.p>
                      )}

                      {activeBanner?.priceTag && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 }}
                          className="mt-4 inline-flex items-center rounded-full bg-[var(--theme-accent)] px-5 py-2 text-2xl font-bold text-white"
                        >
                          {activeBanner.priceTag}
                        </motion.div>
                      )}

                      {activeBanner?.ctaText && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="mt-6"
                        >
                          <Button
                            asChild
                            size="lg"
                            className="group h-12 rounded-[var(--theme-radius-sm)] bg-[var(--theme-foreground)] px-8 font-semibold text-[var(--theme-background)] transition-all hover:scale-[1.02] hover:bg-[var(--theme-foreground)]/90"
                          >
                            <Link href={activeBanner.ctaUrl || '/products'}>
                              {activeBanner.ctaText}
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-8 lg:left-12 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        index === activeSlide
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/50 hover:bg-white/70'
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

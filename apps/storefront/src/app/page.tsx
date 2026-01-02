'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Truck,
  RotateCcw,
  Shield,
  Headphones,
  Sparkles,
  Star,
  Zap,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { useStore } from '@/lib/store-context';
import { getProducts, type Product } from '@/lib/api';
import { cn } from '@/lib/utils';

// Animation Variants with proper typing for Framer Motion
const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function HomePage() {
  const { store, categories, isLoading } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Fetch products when store is available
  useEffect(() => {
    if (!store?.id) {
      setProductsLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setProductsLoading(true);
        const response = await getProducts(store!.id, { limit: 8 });
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [store?.id]);

  const featuredProducts = products.slice(0, 8);
  const displayCategories = categories.slice(0, 4).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    href: `/products?category=${cat.slug}`,
    image: cat.image,
    productCount: cat.productCount,
  }));

  const storeName = store?.name || 'Our Store';
  const storeDescription =
    store?.description ||
    "Discover our curated collection of premium products. Quality you can trust, style you'll love.";

  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders over $100' },
    { icon: RotateCcw, title: 'Easy Returns', description: '30-day hassle-free' },
    { icon: Shield, title: 'Secure Checkout', description: 'Protected payments' },
    { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: Star },
    { value: '50+', label: 'Product Categories', icon: Award },
    { value: '99%', label: 'Satisfaction Rate', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col overflow-x-hidden theme-transition">
      {/* ═══════════════════════════════════════════════════════════
          PREMIUM HERO SECTION - Dramatic Bento Grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] bg-[var(--theme-background)] pt-8 lg:pt-12 theme-transition">
        {/* Background Mesh Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-50" />

        <div className="container-theme relative z-10">
          <div
            className="grid gap-4 lg:grid-cols-12 lg:gap-6"
          >
            {/* Main Hero Card - Large */}
            <div
              className="relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-[var(--theme-radius-xl)] bg-[var(--theme-muted)] p-8 lg:col-span-7 lg:min-h-[600px] lg:p-12"
            >
              {/* Animated Background Elements */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[var(--theme-accent)]/20 to-transparent blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[var(--theme-primary)]/10 to-transparent blur-3xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                />
              </div>

              {/* Badge */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--theme-foreground)] shadow-sm backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  {new Date().getFullYear()} Collection
                </span>
              </div>

              {/* Main Content */}
              <div className="relative z-10 max-w-xl">
                <h1
                  className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--theme-foreground)] sm:text-5xl lg:text-6xl"
                >
                  {storeName}
                </h1>
                <p
                  className="mt-6 text-lg leading-relaxed text-[var(--theme-secondary)] lg:text-xl"
                >
                  {storeDescription}
                </p>
                <div
                  className="mt-10 flex flex-wrap gap-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="group h-14 rounded-full bg-[var(--theme-primary)] px-10 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    <Link href="/products">
                      Shop Collection
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="h-14 rounded-full border-2 border-[var(--theme-foreground)]/20 bg-white/80 px-8 text-base font-semibold text-[var(--theme-foreground)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--theme-foreground)] hover:bg-white"
                  >
                    <Link href="/products?sort=newest">New Arrivals</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Stacked Bento Cards */}
            <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-6">
              {/* Featured Category Card */}
              <div>
                <Link
                  href={displayCategories[0]?.href || '/products'}
                  className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-[var(--theme-radius-xl)] bg-gradient-to-br from-slate-800 to-slate-900 p-6 transition-all duration-500 hover:shadow-2xl lg:min-h-[280px] lg:p-8"
                >
                  {/* Category Image or Initial */}
                  <div className="absolute inset-0">
                    {displayCategories[0]?.image ? (
                      <Image
                        src={displayCategories[0].image}
                        alt={displayCategories[0].name}
                        fill
                        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[10rem] font-bold text-white/5 transition-transform duration-700 group-hover:scale-110">
                          {displayCategories[0]?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="overlay-dark-strong absolute inset-0" />

                  {/* Content */}
                  <div className="relative z-10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Featured
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-white lg:text-3xl">
                      {displayCategories[0]?.name || 'Shop Now'}
                    </h3>
                    {displayCategories[0]?.productCount > 0 && (
                      <p className="mt-1 text-sm text-white/70">
                        {displayCategories[0].productCount} products
                      </p>
                    )}
                  </div>

                  {/* Arrow Button */}
                  <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                    <ArrowUpRight className="h-5 w-5 text-white transition-colors group-hover:text-[var(--theme-foreground)]" />
                  </div>
                </Link>
              </div>

              {/* Stats Row */}
              <div
                className="grid grid-cols-3 gap-4 lg:gap-6"
              >
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[var(--theme-radius-lg)] bg-[var(--theme-foreground)] p-4 text-center text-[var(--theme-background)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 lg:p-6 dark:bg-[var(--theme-surface)] dark:text-[var(--theme-foreground)] dark:ring-1 dark:ring-[var(--theme-border)] dark:hover:shadow-glow"
                  >
                    <stat.icon className="mb-2 h-5 w-5 text-[var(--theme-accent)]" />
                    <p className="text-2xl font-bold tracking-tight lg:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--theme-background)]/60 dark:text-[var(--theme-foreground)]/60 lg:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Accent Card */}
              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[var(--theme-radius-xl)] bg-gradient-to-br from-[var(--theme-accent)] to-orange-600 p-6 text-white lg:p-8 transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Background Pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-20">
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="1" cy="1" r="1" fill="white" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="relative z-10 text-center">
                  <Zap className="mx-auto mb-3 h-8 w-8" />
                  <p className="text-xl font-bold lg:text-2xl">Flash Sale</p>
                  <p className="mt-1 text-sm text-white/80">Up to 50% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST FEATURES - Premium Horizontal Strip
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="border-y border-[var(--theme-border)] bg-[var(--theme-background)] py-2 theme-transition"
      >
        <div className="container-theme">
          <div className="grid grid-cols-2 divide-x divide-[var(--theme-border)] lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group flex items-center gap-4 px-4 py-6 transition-colors hover:bg-[var(--theme-muted)]/50 sm:px-6 lg:px-8"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--theme-muted)] transition-all duration-300 group-hover:bg-[var(--theme-primary)] group-hover:text-white group-hover:scale-110">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[var(--theme-foreground)]">
                    {feature.title}
                  </h3>
                  <p className="truncate text-xs text-[var(--theme-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORIES - Premium Bento Grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-[var(--theme-background)] theme-transition">
        <div className="container-theme">
          {/* Section Header */}
          <div
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--theme-accent)]">
                Explore
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-foreground)] sm:text-4xl lg:text-5xl">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/products"
              className="group hidden items-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:flex"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Category Bento Grid */}
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {displayCategories.map((category, index) => (
              <div
                key={category.slug || category.name}
                className={index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
              >
                <Link
                  href={category.href}
                  className={cn(
                    'group relative block overflow-hidden rounded-[var(--theme-radius-xl)] transition-all duration-500 hover:shadow-2xl',
                    index === 0
                      ? 'aspect-square sm:aspect-auto sm:h-full sm:min-h-[500px]'
                      : 'aspect-[4/5]'
                  )}
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-[var(--theme-muted)]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes={
                          index === 0
                            ? '(max-width: 640px) 100vw, 50vw'
                            : '(max-width: 640px) 50vw, 25vw'
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-muted)]">
                        <span
                          className={cn(
                            'font-bold text-[var(--theme-foreground)]/5 transition-transform duration-700 group-hover:scale-110',
                            index === 0 ? 'text-[12rem]' : 'text-[6rem]'
                          )}
                        >
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="overlay-dark-strong absolute inset-0 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3
                          className={cn(
                            'font-bold text-white',
                            index === 0 ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'
                          )}
                        >
                          {category.name}
                        </h3>
                        {category.productCount > 0 && (
                          <p className="mt-1 text-sm text-white/70">
                            {category.productCount}{' '}
                            {category.productCount === 1 ? 'product' : 'products'}
                          </p>
                        )}
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                        <ArrowUpRight className="h-5 w-5 text-white transition-colors group-hover:text-[var(--theme-foreground)]" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Border */}
                  <div className="pointer-events-none absolute inset-0 rounded-[var(--theme-radius-xl)] ring-2 ring-inset ring-transparent transition-all duration-300 group-hover:ring-white/30" />
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <Link
            href="/products"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:hidden"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-[var(--theme-surface)] theme-transition">
        <div className="container-theme">
          {/* Section Header */}
          <div
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--theme-accent)]">
                Curated Selection
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-foreground)] sm:text-4xl lg:text-5xl">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="group hidden items-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:flex"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product Grid */}
          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} index={i} />
              ))}
            </div>
          ) : (
            <div
              className="flex min-h-[300px] items-center justify-center rounded-[var(--theme-radius-xl)] border-2 border-dashed border-[var(--theme-border)]"
            >
              <div className="text-center">
                <p className="text-lg font-medium text-[var(--theme-secondary)]">
                  No products available yet
                </p>
                <p className="mt-1 text-sm text-[var(--theme-secondary)]/70">
                  Check back soon for new arrivals
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div
            className="mt-16 text-center"
          >
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full bg-[var(--theme-primary)] px-12 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <Link href="/products">
                Explore All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEWSLETTER - Premium Dark Card
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-[var(--theme-background)] theme-transition">
        <div className="container-theme">
          <div
            className="relative overflow-hidden rounded-[var(--theme-radius-2xl)] bg-gradient-premium p-10 text-white lg:p-16 dark:ring-1 dark:ring-[var(--theme-accent)]/20 dark:shadow-glow"
          >
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[var(--theme-accent)]/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </div>

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <span
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Stay Connected
              </span>

              <h2
                className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              >
                Join Our Newsletter
              </h2>
              <p
                className="mt-4 text-lg text-white/70"
              >
                Be the first to know about new arrivals, exclusive offers, and style inspiration.
              </p>

              {/* Form */}
              <form
                className="mt-10"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-14 flex-1 rounded-full border border-white/20 bg-white/10 px-6 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 focus:border-white focus:bg-white/20 focus:outline-none focus:ring-0"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="group h-14 rounded-full bg-white px-10 text-base font-semibold text-[var(--theme-foreground)] shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/90"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                <p className="mt-4 text-xs text-white/50">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BRAND STORY - Premium Split Layout
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-padding-lg border-t border-[var(--theme-border)] bg-[var(--theme-background)] theme-transition">
        <div className="container-theme">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Text Content */}
            <div
              className="order-2 lg:order-1"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--theme-accent)]">
                Our Philosophy
              </span>
              <blockquote className="mt-6 text-2xl font-light leading-relaxed tracking-tight text-[var(--theme-foreground)] sm:text-3xl lg:text-4xl">
                "Quality over quantity. Timeless over trendy. Craftsmanship over convenience."
              </blockquote>
              <p className="mt-8 text-lg leading-relaxed text-[var(--theme-secondary)]">
                We believe in creating products that stand the test of time, both in quality and
                design. Every piece in our collection is thoughtfully curated to bring lasting
                value to your life.
              </p>
              <div className="mt-10">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group h-14 rounded-full border-2 border-[var(--theme-foreground)] px-10 text-base font-semibold text-[var(--theme-foreground)] transition-all duration-300 hover:bg-[var(--theme-foreground)] hover:text-white"
                >
                  <Link href="/about">
                    Our Story
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Element */}
            <div
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--theme-radius-2xl)] bg-[var(--theme-muted)]">
                {/* Large Initial */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[12rem] font-extrabold text-[var(--theme-foreground)]/5 lg:text-[16rem]"
                  >
                    {storeName.charAt(0)}
                  </span>
                </div>

                {/* Decorative Lines */}
                <div className="absolute inset-4 rounded-[var(--theme-radius-xl)] border border-[var(--theme-foreground)]/10" />
                <div className="absolute inset-8 rounded-[var(--theme-radius-lg)] border border-[var(--theme-foreground)]/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

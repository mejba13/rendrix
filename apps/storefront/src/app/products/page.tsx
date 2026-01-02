'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Loader2, Grid3X3, LayoutGrid, Search, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/products/product-grid';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store-context';
import { getProducts, getCategories, type Product, type Category } from '@/lib/api';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const filterPillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store, categories: storeCategories, isLoading: storeLoading } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(storeCategories);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [gridView, setGridView] = useState<'compact' | 'spacious'>('spacious');

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');

  // Fetch products when store or filters change
  const fetchProducts = useCallback(async () => {
    if (!store?.id) return;

    setLoading(true);
    try {
      const response = await getProducts(store.id, {
        category: categoryParam || undefined,
        search: searchParam || undefined,
        sort: sortParam,
        minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
        maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
        limit: 50,
      });

      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [store?.id, categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam]);

  // Fetch categories if not already loaded
  useEffect(() => {
    async function fetchCategories() {
      if (!store?.id || storeCategories.length > 0) {
        setCategories(storeCategories);
        return;
      }

      try {
        const response = await getCategories(store.id);
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    fetchCategories();
  }, [store?.id, storeCategories]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const activeFiltersCount = [categoryParam, minPriceParam, maxPriceParam].filter(
    Boolean
  ).length;

  const currentCategory = categories.find((c) => c.slug === categoryParam);

  // Show loading state while store is loading
  if (storeLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-10 w-10 text-[var(--theme-primary)]" />
          </motion.div>
          <p className="text-sm text-[var(--theme-secondary)]">Loading store...</p>
        </motion.div>
      </div>
    );
  }

  // Show message if no store found
  if (!store) {
    return (
      <div className="container-theme section-padding">
        <motion.div
          className="mx-auto max-w-md rounded-2xl bg-[var(--theme-surface)] p-12 text-center shadow-xl ring-1 ring-[var(--theme-muted)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-[var(--theme-foreground)]">Store Not Found</h2>
          <p className="mt-2 text-[var(--theme-secondary)]">
            Please access this page through a valid store subdomain.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[var(--theme-background)]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div
        className="relative overflow-hidden border-b border-[var(--theme-muted)] bg-gradient-to-br from-[var(--theme-muted)]/30 via-transparent to-[var(--theme-primary)]/5"
        variants={headerVariants}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--theme-primary)]/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--theme-accent)]/5 blur-3xl" />
        </div>

        <div className="container-theme relative py-12 sm:py-16">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--theme-primary)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-3 w-3" />
            {currentCategory ? 'Category' : 'Collection'}
          </motion.span>
          <motion.h1
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--theme-foreground)] sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {currentCategory?.name || 'All Products'}
          </motion.h1>
          {currentCategory?.description && (
            <motion.p
              className="mt-4 max-w-2xl text-lg text-[var(--theme-secondary)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentCategory.description}
            </motion.p>
          )}
        </div>
      </motion.div>

      <div className="container-theme py-8">
        {/* Toolbar */}
        <motion.div
          className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--theme-surface)] p-4 shadow-sm ring-1 ring-[var(--theme-muted)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            {/* Filter toggle - Mobile */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="rounded-xl border-[var(--theme-muted)] text-[var(--theme-foreground)] lg:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <motion.span
                    className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--theme-primary)] text-xs font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {activeFiltersCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* Product count */}
            <p className="text-sm text-[var(--theme-secondary)]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="h-3 w-3" />
                  </motion.div>
                  Loading...
                </span>
              ) : (
                <span>
                  <span className="font-semibold text-[var(--theme-foreground)]">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Grid view toggle - Desktop */}
            <div className="hidden items-center gap-1 rounded-xl bg-[var(--theme-muted)]/50 p-1 sm:flex">
              <motion.button
                onClick={() => setGridView('compact')}
                className={cn(
                  'rounded-lg p-2 transition-all duration-200',
                  gridView === 'compact'
                    ? 'bg-white text-[var(--theme-foreground)] shadow-sm'
                    : 'text-[var(--theme-secondary)] hover:text-[var(--theme-foreground)]'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 className="h-4 w-4" />
              </motion.button>
              <motion.button
                onClick={() => setGridView('spacious')}
                className={cn(
                  'rounded-lg p-2 transition-all duration-200',
                  gridView === 'spacious'
                    ? 'bg-white text-[var(--theme-foreground)] shadow-sm'
                    : 'text-[var(--theme-secondary)] hover:text-[var(--theme-foreground)]'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <LayoutGrid className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="min-w-[160px] justify-between rounded-xl border-[var(--theme-muted)] text-[var(--theme-foreground)]"
                >
                  <span className="text-[var(--theme-secondary)]">Sort:</span>
                  <span className="ml-2 truncate font-medium">
                    {sortOptions.find((o) => o.value === sortParam)?.label}
                  </span>
                  <motion.div
                    animate={{ rotate: sortOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                  </motion.div>
                </Button>
              </motion.div>
              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSortOpen(false)}
                    />
                    <motion.div
                      className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--theme-muted)] bg-white shadow-xl"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {sortOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          className={cn(
                            'block w-full px-4 py-3 text-left text-sm transition-colors',
                            sortParam === option.value
                              ? 'bg-[var(--theme-primary)]/5 font-medium text-[var(--theme-primary)]'
                              : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-muted)]/50 hover:text-[var(--theme-foreground)]'
                          )}
                          onClick={() => {
                            updateParams('sort', option.value);
                            setSortOpen(false);
                          }}
                          whileHover={{ x: 4 }}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Active filters */}
        <AnimatePresence>
          {(categoryParam || minPriceParam || maxPriceParam) && (
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="text-sm text-[var(--theme-secondary)]">Active:</span>
              <AnimatePresence mode="popLayout">
                {categoryParam && (
                  <motion.button
                    key="category"
                    onClick={() => updateParams('category', null)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-primary)]/10 px-3 py-1.5 text-sm font-medium text-[var(--theme-primary)] transition-colors hover:bg-[var(--theme-primary)]/20"
                    variants={filterPillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    {categories.find((c) => c.slug === categoryParam)?.name}
                    <X className="h-3 w-3 transition-transform group-hover:rotate-90" />
                  </motion.button>
                )}
                {minPriceParam && (
                  <motion.button
                    key="minPrice"
                    onClick={() => updateParams('minPrice', null)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-accent)]/20"
                    variants={filterPillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    Min: ${minPriceParam}
                    <X className="h-3 w-3 transition-transform group-hover:rotate-90" />
                  </motion.button>
                )}
                {maxPriceParam && (
                  <motion.button
                    key="maxPrice"
                    onClick={() => updateParams('maxPrice', null)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-accent)]/20"
                    variants={filterPillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    Max: ${maxPriceParam}
                    <X className="h-3 w-3 transition-transform group-hover:rotate-90" />
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.button
                className="text-sm text-[var(--theme-secondary)] underline-offset-4 transition-colors hover:text-[var(--theme-foreground)] hover:underline"
                onClick={clearFilters}
                whileHover={{ scale: 1.02 }}
              >
                Clear all
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Filters sidebar - Desktop */}
          <motion.aside
            className="hidden lg:block"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="sticky top-24 space-y-6 rounded-2xl bg-[var(--theme-surface)] p-6 shadow-sm ring-1 ring-[var(--theme-muted)]">
              {/* Search */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-foreground)]">
                  <Search className="h-3.5 w-3.5 text-[var(--theme-primary)]" />
                  Search
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-secondary)]" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="rounded-xl border-[var(--theme-muted)] bg-white pl-9 text-[var(--theme-foreground)] placeholder:text-[var(--theme-secondary)]/50 focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10"
                    defaultValue={searchParam || ''}
                    onChange={(e) => updateParams('search', e.target.value || null)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-foreground)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  Categories
                </h3>
                <ul className="space-y-1">
                  <li>
                    <motion.button
                      className={cn(
                        'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                        !categoryParam
                          ? 'bg-[var(--theme-primary)] font-medium text-white shadow-lg shadow-[var(--theme-primary)]/20'
                          : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)]'
                      )}
                      onClick={() => updateParams('category', null)}
                      whileHover={{ x: !categoryParam ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      All Products
                      {!categoryParam && <ArrowRight className="h-4 w-4" />}
                    </motion.button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <motion.button
                        className={cn(
                          'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                          categoryParam === category.slug
                            ? 'bg-[var(--theme-primary)] font-medium text-white shadow-lg shadow-[var(--theme-primary)]/20'
                            : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)]'
                        )}
                        onClick={() => updateParams('category', category.slug)}
                        whileHover={{ x: categoryParam === category.slug ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{category.name}</span>
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-xs',
                          categoryParam === category.slug
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--theme-muted)] text-[var(--theme-secondary)]'
                        )}>
                          {category.productCount}
                        </span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-foreground)]">
                  Price Range
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs text-[var(--theme-secondary)]">Min</label>
                    <Input
                      type="number"
                      placeholder="$0"
                      className="rounded-xl border-[var(--theme-muted)] bg-white text-[var(--theme-foreground)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10"
                      defaultValue={minPriceParam || ''}
                      onBlur={(e) =>
                        updateParams('minPrice', e.target.value || null)
                      }
                    />
                  </div>
                  <span className="mt-5 text-[var(--theme-secondary)]">—</span>
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs text-[var(--theme-secondary)]">Max</label>
                    <Input
                      type="number"
                      placeholder="$999"
                      className="rounded-xl border-[var(--theme-muted)] bg-white text-[var(--theme-foreground)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10"
                      defaultValue={maxPriceParam || ''}
                      onBlur={(e) =>
                        updateParams('maxPrice', e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Clear filters */}
              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-[var(--theme-muted)]"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>

          {/* Mobile filters drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFiltersOpen(false)}
                />
                <motion.div
                  className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-[var(--theme-background)] shadow-2xl"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[var(--theme-muted)] px-6 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--theme-foreground)]">
                      <Filter className="h-5 w-5 text-[var(--theme-primary)]" />
                      Filters
                    </h2>
                    <motion.button
                      onClick={() => setFiltersOpen(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-secondary)] transition-colors hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)]"
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                      {/* Search */}
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--theme-foreground)]">
                          Search
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-secondary)]" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            className="rounded-xl border-[var(--theme-muted)] pl-9"
                            defaultValue={searchParam || ''}
                            onChange={(e) =>
                              updateParams('search', e.target.value || null)
                            }
                          />
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--theme-foreground)]">
                          Categories
                        </h3>
                        <ul className="space-y-1">
                          <li>
                            <button
                              className={cn(
                                'w-full rounded-xl px-3 py-3 text-left text-sm transition-all',
                                !categoryParam
                                  ? 'bg-[var(--theme-primary)] font-medium text-white'
                                  : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-muted)]'
                              )}
                              onClick={() => {
                                updateParams('category', null);
                                setFiltersOpen(false);
                              }}
                            >
                              All Products
                            </button>
                          </li>
                          {categories.map((category) => (
                            <li key={category.id}>
                              <button
                                className={cn(
                                  'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-all',
                                  categoryParam === category.slug
                                    ? 'bg-[var(--theme-primary)] font-medium text-white'
                                    : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-muted)]'
                                )}
                                onClick={() => {
                                  updateParams('category', category.slug);
                                  setFiltersOpen(false);
                                }}
                              >
                                <span>{category.name}</span>
                                <span className="text-xs">{category.productCount}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price */}
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--theme-foreground)]">
                          Price Range
                        </h3>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            placeholder="Min"
                            className="rounded-xl border-[var(--theme-muted)]"
                            defaultValue={minPriceParam || ''}
                            onBlur={(e) =>
                              updateParams('minPrice', e.target.value || null)
                            }
                          />
                          <span className="text-[var(--theme-secondary)]">—</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            className="rounded-xl border-[var(--theme-muted)]"
                            defaultValue={maxPriceParam || ''}
                            onBlur={(e) =>
                              updateParams('maxPrice', e.target.value || null)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-[var(--theme-muted)] p-4">
                    <div className="space-y-3">
                      <Button
                        className="w-full rounded-xl bg-[var(--theme-primary)] text-white hover:opacity-90"
                        onClick={() => setFiltersOpen(false)}
                      >
                        Apply Filters
                      </Button>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-[var(--theme-muted)]"
                          onClick={() => {
                            clearFilters();
                            setFiltersOpen(false);
                          }}
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProductGrid
              products={products}
              loading={loading}
              className={gridView === 'compact' ? 'lg:grid-cols-4' : ''}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

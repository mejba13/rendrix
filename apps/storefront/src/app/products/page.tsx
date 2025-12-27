'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/products/product-grid';
import { Badge } from '@/components/ui/badge';
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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store, categories: storeCategories, isLoading: storeLoading } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(storeCategories);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

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

  // Show loading state while store is loading
  if (storeLoading) {
    return (
      <div className="container-wide py-8">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show message if no store found
  if (!store) {
    return (
      <div className="container-wide py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold">Store Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            Please access this page through a valid store subdomain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {categoryParam
              ? categories.find((c) => c.slug === categoryParam)?.name || 'Products'
              : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Sort dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOpen(!sortOpen)}
            >
              Sort
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border bg-background shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={cn(
                        'block w-full px-4 py-2 text-left text-sm hover:bg-accent',
                        sortParam === option.value && 'bg-accent'
                      )}
                      onClick={() => {
                        updateParams('sort', option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Active filters */}
      {(categoryParam || minPriceParam || maxPriceParam) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {categoryParam && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.slug === categoryParam)?.name}
              <button onClick={() => updateParams('category', null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {minPriceParam && (
            <Badge variant="secondary" className="gap-1">
              Min: ${minPriceParam}
              <button onClick={() => updateParams('minPrice', null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {maxPriceParam && (
            <Badge variant="secondary" className="gap-1">
              Max: ${maxPriceParam}
              <button onClick={() => updateParams('maxPrice', null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters sidebar - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <h3 className="text-sm font-semibold">Search</h3>
              <Input
                type="search"
                placeholder="Search products..."
                className="mt-2"
                defaultValue={searchParam || ''}
                onChange={(e) => updateParams('search', e.target.value || null)}
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold">Categories</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <button
                    className={cn(
                      'text-sm hover:text-foreground',
                      !categoryParam
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => updateParams('category', null)}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={cn(
                        'text-sm hover:text-foreground',
                        categoryParam === category.slug
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground'
                      )}
                      onClick={() => updateParams('category', category.slug)}
                    >
                      {category.name}
                      <span className="ml-1 text-xs">({category.productCount})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-semibold">Price Range</h3>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="w-24"
                  defaultValue={minPriceParam || ''}
                  onBlur={(e) =>
                    updateParams('minPrice', e.target.value || null)
                  }
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-24"
                  defaultValue={maxPriceParam || ''}
                  onBlur={(e) =>
                    updateParams('maxPrice', e.target.value || null)
                  }
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/20"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* Search */}
                <div>
                  <h3 className="text-sm font-semibold">Search</h3>
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="mt-2"
                    defaultValue={searchParam || ''}
                    onChange={(e) =>
                      updateParams('search', e.target.value || null)
                    }
                  />
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold">Categories</h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <button
                        className={cn(
                          'text-sm',
                          !categoryParam
                            ? 'font-medium'
                            : 'text-muted-foreground'
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
                            'text-sm',
                            categoryParam === category.slug
                              ? 'font-medium'
                              : 'text-muted-foreground'
                          )}
                          onClick={() => {
                            updateParams('category', category.slug);
                            setFiltersOpen(false);
                          }}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-sm font-semibold">Price Range</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      defaultValue={minPriceParam || ''}
                      onBlur={(e) =>
                        updateParams('minPrice', e.target.value || null)
                      }
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      defaultValue={maxPriceParam || ''}
                      onBlur={(e) =>
                        updateParams('maxPrice', e.target.value || null)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full"
                  onClick={() => setFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store-context';
import { getProducts, type Product } from '@/lib/api';
import {
  AnnouncementBar,
  HeroSection,
  BrandLogos,
  PromoBento,
  DealsSection,
  PromoBanner,
  BestSelling,
  NewArrivals,
  TrustBadges,
  PromoCards,
} from '@/components/storefront';

export default function HomePage() {
  const { store, categories, isLoading } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products when store is available
  useEffect(() => {
    if (!store?.id) {
      setProductsLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setProductsLoading(true);
        const response = await getProducts(store!.id, { limit: 20 });
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

  const storeName = store?.name || 'Our Store';
  const storeDescription =
    store?.description ||
    "Discover our curated collection of premium products. Quality you can trust, style you'll love.";

  // Transform categories for hero sidebar
  const heroCategories = categories.slice(0, 8).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: undefined, // Could map based on category name
  }));

  // Create hero banners from store info
  const heroBanners = [
    {
      id: '1',
      title: storeName,
      subtitle: storeDescription,
      ctaText: 'Shop Collection',
      ctaUrl: '/products',
      secondaryCtaText: 'New Arrivals',
      secondaryCtaUrl: '/products?sort=newest',
    },
    {
      id: '2',
      title: 'Premium Quality',
      subtitle: 'Experience excellence with our carefully curated selection of products designed for modern living.',
      ctaText: 'Explore Now',
      ctaUrl: '/products',
    },
    {
      id: '3',
      title: 'Exclusive Deals',
      subtitle: 'Save up to 50% on selected items. Limited time offer.',
      ctaText: 'View Deals',
      ctaUrl: '/products?sale=true',
    },
  ];

  // Filter products with discounts for deals section
  const dealProducts = products.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.price
  );

  // Get featured/best selling products (you can filter by a flag or use all products)
  const bestSellingProducts = products.slice(0, 10);

  // Get new arrivals (you can sort by date or use products marked as new)
  const newArrivalProducts = products.slice(0, 10);

  // Dynamic promo bento cards based on categories
  const promoBentoCards = categories.slice(0, 2).map((cat, index) => ({
    id: cat.id,
    label: index === 0 ? 'Featured Collection' : 'New Season',
    title: cat.name,
    subtitle: cat.description || `Explore our ${cat.name.toLowerCase()} collection`,
    ctaText: 'Shop Now',
    ctaUrl: `/products?category=${cat.slug}`,
    imageUrl: cat.image || undefined,
    variant: index === 0 ? ('dark' as const) : ('light' as const),
  }));

  // Dynamic promo cards
  const promoCards = categories.slice(0, 3).map((cat, index) => {
    const colors = [
      { bg: '#1a1a1a', text: '#ffffff' },
      { bg: '#dc2626', text: '#ffffff' },
      { bg: '#f5f5f5', text: '#1a1a1a' },
    ];
    const color = colors[index % 3];
    return {
      id: cat.id,
      label: ['Best Sellers', 'Hot Deals', 'Coming Soon'][index % 3],
      title: cat.name,
      ctaText: 'View more',
      ctaUrl: `/products?category=${cat.slug}`,
      imageUrl: cat.image || undefined,
      backgroundColor: color.bg,
      textColor: color.text,
    };
  });

  // Transform categories for best selling section
  const bestSellingCategories = categories.slice(0, 5).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  return (
    <div className="flex flex-col overflow-x-hidden theme-transition">
      {/* Announcement Bar */}
      <AnnouncementBar
        message="Free shipping on orders over $100"
        linkText="Shop Now"
        linkHref="/products"
      />

      {/* Hero Section with Category Sidebar */}
      <HeroSection
        categories={heroCategories}
        banners={heroBanners}
      />

      {/* Trust Badges Strip */}
      <TrustBadges variant="strip" />

      {/* Brand Logos */}
      <BrandLogos />

      {/* Promotional Bento Cards */}
      {promoBentoCards.length >= 2 && (
        <PromoBento cards={promoBentoCards} />
      )}

      {/* Today's Best Deals with Countdown */}
      {dealProducts.length > 0 && (
        <DealsSection
          products={dealProducts}
          title="Today's Best Deals"
          dealEndTime={new Date(Date.now() + 24 * 60 * 60 * 1000)} // 24 hours from now
        />
      )}

      {/* Promotional Banner */}
      <PromoBanner
        title="Exclusive Member Benefits"
        subtitle="Join our rewards program and get 20% off your first order"
        ctaText="Join Now"
        ctaUrl="/account/register"
      />

      {/* Best Selling Products with Category Tabs */}
      {bestSellingProducts.length > 0 && (
        <BestSelling
          products={bestSellingProducts}
          categories={bestSellingCategories}
          title="Best Selling"
        />
      )}

      {/* Promo Cards Row */}
      {promoCards.length >= 3 && (
        <PromoCards cards={promoCards} />
      )}

      {/* New Arrivals Grid */}
      {newArrivalProducts.length > 0 && (
        <NewArrivals
          products={newArrivalProducts}
          title="New Arrivals"
          columns={5}
        />
      )}

      {/* Trust Badges Cards */}
      <TrustBadges variant="cards" />
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';

// Demo data - in production, this would come from the API
const featuredProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    slug: 'classic-white-tshirt',
    description: 'A comfortable everyday essential',
    price: 29.99,
    compareAtPrice: null,
    images: [],
    status: 'active',
    quantity: 100,
    sku: 'TSHIRT-001',
    categories: [{ id: 'cat-1', name: 'Clothing' }],
    variants: [],
  },
  {
    id: '2',
    name: 'Premium Leather Wallet',
    slug: 'premium-leather-wallet',
    description: 'Handcrafted genuine leather',
    price: 79.99,
    compareAtPrice: 99.99,
    images: [],
    status: 'active',
    quantity: 50,
    sku: 'WALLET-001',
    categories: [{ id: 'cat-2', name: 'Accessories' }],
    variants: [],
  },
  {
    id: '3',
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'Crystal clear sound, all day comfort',
    price: 149.99,
    compareAtPrice: null,
    images: [],
    status: 'active',
    quantity: 25,
    sku: 'EARBUDS-001',
    categories: [{ id: 'cat-3', name: 'Electronics' }],
    variants: [],
  },
  {
    id: '4',
    name: 'Organic Face Cream',
    slug: 'organic-face-cream',
    description: 'Natural ingredients for radiant skin',
    price: 45.00,
    compareAtPrice: 55.00,
    images: [],
    status: 'active',
    quantity: 75,
    sku: 'CREAM-001',
    categories: [{ id: 'cat-4', name: 'Beauty' }],
    variants: [],
  },
];

const categories = [
  { name: 'Clothing', href: '/products?category=clothing', image: null },
  { name: 'Accessories', href: '/products?category=accessories', image: null },
  { name: 'Electronics', href: '/products?category=electronics', image: null },
  { name: 'Beauty', href: '/products?category=beauty', image: null },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container-wide py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to Our Store
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Discover our curated collection of premium products. Quality you can
              trust, style you'll love.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/products?sort=newest">New Arrivals</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-24">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium hover:underline"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg bg-muted"
              >
                <div className="aspect-square">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <span className="text-4xl font-bold text-slate-400">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-lg font-semibold text-white">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t py-16 sm:py-24">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium hover:underline"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="border-t bg-muted/50 py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Free Shipping',
                description: 'On orders over $100',
              },
              {
                title: 'Easy Returns',
                description: '30-day return policy',
              },
              {
                title: 'Secure Checkout',
                description: 'Protected payments',
              },
              {
                title: '24/7 Support',
                description: 'We\'re here to help',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t py-16 sm:py-24">
        <div className="container-wide">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Subscribe to our newsletter
            </h2>
            <p className="mt-2 text-muted-foreground">
              Get the latest updates on new products and upcoming sales.
            </p>
            <form className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

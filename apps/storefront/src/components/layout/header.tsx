'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';

interface HeaderProps {
  storeName?: string;
  logo?: string | null;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

export function Header({ storeName = 'Store', logo, categories = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-wide">
        {/* Main header row */}
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              {logo ? (
                <img className="h-8 w-auto" src={logo} alt={storeName} />
              ) : (
                <span className="text-xl font-bold">{storeName}</span>
              )}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              All Products
            </Link>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex flex-1 items-center justify-end gap-4">
            {/* Search */}
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Mobile search button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:block -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Account</span>
            </Link>

            {/* Cart */}
            <button
              type="button"
              className="group relative -m-2.5 p-2.5"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileMenuOpen ? 'visible' : 'invisible'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-background px-6 py-6 shadow-lg transition-transform',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              {logo ? (
                <img className="h-8 w-auto" src={logo} alt={storeName} />
              ) : (
                <span className="text-xl font-bold">{storeName}</span>
              )}
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                <Link
                  href="/products"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="py-6">
                <Link
                  href="/account"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, Search, User, X, ChevronRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle, ThemeToggleCompact } from '@/components/ui/theme-toggle';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';

interface HeaderProps {
  storeName?: string;
  logo?: string | null;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

// Animation variants
const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: '-100%', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

const searchVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0, paddingBottom: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 0,
    paddingBottom: 16,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.2 },
  },
};

export function Header({ storeName = 'Store', logo, categories = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'All Products', href: '/products', id: 'all' },
    ...categories.slice(0, 5).map((cat) => ({
      name: cat.name,
      href: `/products?category=${cat.slug}`,
      id: cat.id,
    })),
  ];

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 w-full theme-transition',
        scrolled
          ? 'border-b border-[var(--theme-border)] bg-[var(--theme-background)]/90 shadow-sm backdrop-blur-xl dark:bg-[var(--theme-background)]/80 dark:shadow-none dark:border-[var(--theme-border)]'
          : 'border-b border-transparent bg-[var(--theme-background)]'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="container-theme">
        {/* Main header row */}
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <motion.button
              type="button"
              className="lg:hidden -m-2 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-foreground)] transition-colors hover:bg-[var(--theme-muted)]"
              onClick={() => setMobileMenuOpen(true)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </motion.button>

            {/* Logo */}
            <motion.div variants={logoVariants} initial="hidden" animate="visible">
              <Link href="/" className="group flex items-center gap-2">
                {logo ? (
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Image
                      src={logo}
                      alt={storeName}
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  </motion.div>
                ) : (
                  <motion.span
                    className="text-xl font-bold tracking-tight text-[var(--theme-foreground)]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {storeName}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          </div>

          {/* Center: Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300',
                    index === 0
                      ? 'text-[var(--theme-foreground)]'
                      : 'text-[var(--theme-secondary)] hover:text-[var(--theme-foreground)]'
                  )}
                >
                  {item.name}
                  {/* Hover indicator */}
                  <AnimatePresence>
                    {hoveredNav === item.id && (
                      <motion.span
                        className="absolute inset-0 -z-10 rounded-xl bg-[var(--theme-muted)]"
                        layoutId="navHover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Desktop Search */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-secondary)] transition-colors group-focus-within:text-[var(--theme-primary)]" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="h-10 w-56 rounded-xl border-transparent bg-[var(--theme-muted)]/60 pl-10 text-sm text-[var(--theme-foreground)] placeholder:text-[var(--theme-secondary)]/60 transition-all duration-300 focus:w-72 focus:border-[var(--theme-primary)]/30 focus:bg-white focus:shadow-lg focus:shadow-[var(--theme-primary)]/5"
                />
              </div>
            </motion.div>

            {/* Mobile search button */}
            <motion.button
              type="button"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-foreground)] transition-colors hover:bg-[var(--theme-muted)]"
              onClick={() => setSearchOpen(!searchOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Search</span>
            </motion.button>

            {/* Theme Toggle - Desktop */}
            <motion.div
              className="hidden sm:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ThemeToggle variant="switch" />
            </motion.div>

            {/* Account */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/account"
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-foreground)] transition-all duration-300 hover:bg-[var(--theme-muted)] hover:scale-105"
              >
                <User className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Account</span>
              </Link>
            </motion.div>

            {/* Cart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                type="button"
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-foreground)] transition-all duration-300 hover:bg-[var(--theme-muted)]"
                onClick={openCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                <AnimatePresence mode="wait">
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--theme-primary)] text-[10px] font-bold text-white shadow-lg shadow-[var(--theme-primary)]/30 ring-2 ring-[var(--theme-background)]"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="sr-only">Cart</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="lg:hidden overflow-hidden"
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-secondary)]" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full rounded-xl border-transparent bg-[var(--theme-muted)]/60 pl-10 text-[var(--theme-foreground)] placeholder:text-[var(--theme-secondary)]/60 focus:border-[var(--theme-primary)]/30 focus:bg-white"
                  autoFocus={searchOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-[var(--theme-background)] shadow-2xl"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--theme-muted)] px-6 py-4">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  {logo ? (
                    <Image
                      src={logo}
                      alt={storeName}
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xl font-bold tracking-tight text-[var(--theme-foreground)]">
                      {storeName}
                    </span>
                  )}
                </Link>
                <motion.button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--theme-secondary)] transition-colors hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)]"
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-4 text-base font-medium transition-all duration-300',
                          index === 0
                            ? 'bg-[var(--theme-primary)]/5 text-[var(--theme-primary)]'
                            : 'text-[var(--theme-secondary)] hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)]'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          {index === 0 && <Sparkles className="h-4 w-4" />}
                          {item.name}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--theme-secondary)]" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                className="border-t border-[var(--theme-muted)] p-4 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {/* Theme Toggle Row */}
                <div className="flex items-center justify-between rounded-xl bg-[var(--theme-muted)]/50 px-4 py-3">
                  <span className="text-sm font-medium text-[var(--theme-secondary)]">Theme</span>
                  <ThemeToggle variant="switch" />
                </div>

                <Link
                  href="/account"
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-[var(--theme-foreground)] transition-all duration-300 hover:bg-[var(--theme-muted)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-accent)] text-white shadow-lg">
                    <User className="h-5 w-5" />
                  </div>
                  My Account
                </Link>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

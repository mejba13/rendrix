'use client';

import Link from 'next/link';
import { Mail, ArrowRight, MapPin, Phone, Instagram, Twitter, Facebook, Youtube, Heart, Sparkles, Send } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  type: string;
  title: string;
  url: string | null;
  target: '_self' | '_blank';
  page?: { slug: string; title: string } | null;
  category?: { slug: string; name: string } | null;
  product?: { slug: string; name: string } | null;
  children: MenuItem[];
}

interface FooterProps {
  storeName?: string;
  menuItems?: MenuItem[];
}

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Best Sellers', href: '/products?sort=popular' },
    { name: 'Sale', href: '/products?sale=true' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
  { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:bg-red-600' },
];

// Animation easing curve
const easeOut = [0.22, 1, 0.36, 1] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: easeOut,
    },
  }),
};

// Helper to get href from menu item
function getMenuItemHref(item: MenuItem): string {
  if (item.url) return item.url;
  if (item.page) return `/${item.page.slug}`;
  if (item.category) return `/products?category=${item.category.slug}`;
  if (item.product) return `/products/${item.product.slug}`;
  return '#';
}

export function Footer({ storeName = 'Store', menuItems }: FooterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Use dynamic menu items if provided
  const dynamicLinks = menuItems && menuItems.length > 0
    ? menuItems.map((item) => ({
        name: item.title,
        href: getMenuItemHref(item),
        target: item.target,
      }))
    : null;

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-[var(--theme-border)] bg-[var(--theme-surface)] theme-transition">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[var(--theme-primary)]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[var(--theme-accent)]/5 blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <motion.div
        className="container-theme relative section-padding"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Bento Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter - Large Card */}
          <motion.div
            className="lg:col-span-5"
            variants={itemVariants}
          >
            <div className="h-full rounded-2xl bg-gradient-to-br from-[var(--theme-background)] to-[var(--theme-muted)]/30 p-8 shadow-sm ring-1 ring-[var(--theme-border)] dark:from-[var(--theme-surface)] dark:to-[var(--theme-muted)]/20 dark:ring-[var(--theme-border)]">
              {/* Logo/Brand */}
              <Link href="/" className="inline-block group">
                <motion.span
                  className="text-2xl font-bold tracking-tight text-[var(--theme-foreground)]"
                  whileHover={{ scale: 1.02 }}
                >
                  {storeName}
                </motion.span>
              </Link>

              <p className="mt-4 max-w-sm text-[var(--theme-secondary)] leading-relaxed">
                Quality products, exceptional service. Curated with care for those who appreciate the finer things in life.
              </p>

              {/* Newsletter */}
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--theme-primary)]" />
                  <h4 className="text-sm font-semibold text-[var(--theme-foreground)]">
                    Join our newsletter
                  </h4>
                </div>
                <p className="mt-2 text-sm text-[var(--theme-secondary)]">
                  Get exclusive offers and early access to new products.
                </p>
                <form onSubmit={handleSubscribe} className="mt-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-secondary)]" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl border-[var(--theme-border)] bg-[var(--theme-background)] pl-10 text-[var(--theme-foreground)] placeholder:text-[var(--theme-secondary)]/50 focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 dark:bg-[var(--theme-muted)] dark:border-[var(--theme-border)] dark:focus:border-[var(--theme-accent)]"
                        required
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className={cn(
                          'h-12 rounded-xl px-5 font-medium shadow-lg transition-all duration-300',
                          subscribed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[var(--theme-primary)] text-white hover:shadow-xl hover:shadow-[var(--theme-primary)]/20'
                        )}
                      >
                        {subscribed ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </motion.span>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </div>

              {/* Social Links */}
              <div className="mt-8 flex items-center gap-2">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--theme-muted)]/50 text-[var(--theme-secondary)] transition-all duration-300 hover:text-white',
                      social.color
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Links Grid - Bento Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-7 lg:grid-cols-4">
            {/* Shop */}
            <motion.div
              className="rounded-2xl bg-[var(--theme-background)] p-6 shadow-sm ring-1 ring-[var(--theme-border)] dark:bg-[var(--theme-surface)] dark:ring-[var(--theme-border)]"
              variants={itemVariants}
            >
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
                Shop
              </h4>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.shop.map((link, i) => (
                  <motion.li
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-[var(--theme-secondary)] transition-all duration-300 hover:text-[var(--theme-foreground)]"
                    >
                      <span className="mr-0 w-0 opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-2 group-hover:opacity-100">
                        →
                      </span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              className="rounded-2xl bg-[var(--theme-background)] p-6 shadow-sm ring-1 ring-[var(--theme-border)] dark:bg-[var(--theme-surface)] dark:ring-[var(--theme-border)]"
              variants={itemVariants}
            >
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                Company
              </h4>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.company.map((link, i) => (
                  <motion.li
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-[var(--theme-secondary)] transition-all duration-300 hover:text-[var(--theme-foreground)]"
                    >
                      <span className="mr-0 w-0 opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-2 group-hover:opacity-100">
                        →
                      </span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              className="rounded-2xl bg-[var(--theme-background)] p-6 shadow-sm ring-1 ring-[var(--theme-border)] dark:bg-[var(--theme-surface)] dark:ring-[var(--theme-border)]"
              variants={itemVariants}
            >
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                Support
              </h4>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.support.map((link, i) => (
                  <motion.li
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-[var(--theme-secondary)] transition-all duration-300 hover:text-[var(--theme-foreground)]"
                    >
                      <span className="mr-0 w-0 opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-2 group-hover:opacity-100">
                        →
                      </span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              className="rounded-2xl bg-[var(--theme-background)] p-6 shadow-sm ring-1 ring-[var(--theme-border)] dark:bg-[var(--theme-surface)] dark:ring-[var(--theme-border)]"
              variants={itemVariants}
            >
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-secondary)]">
                Legal
              </h4>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.legal.map((link, i) => (
                  <motion.li
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-[var(--theme-secondary)] transition-all duration-300 hover:text-[var(--theme-foreground)]"
                    >
                      <span className="mr-0 w-0 opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-2 group-hover:opacity-100">
                        →
                      </span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="relative border-t border-[var(--theme-border)] theme-transition"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container-theme flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-[var(--theme-secondary)]">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-sm text-[var(--theme-secondary)]">
            <span>Powered by</span>
            <motion.a
              href="https://rendrix.com"
              className="inline-flex items-center gap-1.5 font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-primary)]"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
            >
              <span className="relative">
                Rendrix
                <span className="absolute -bottom-0.5 left-0 h-px w-full scale-x-0 bg-[var(--theme-primary)] transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <Sparkles className="h-3 w-3 text-[var(--theme-primary)]" />
            </motion.a>
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

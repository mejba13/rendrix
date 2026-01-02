'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Code2,
  Sparkles,
  Video,
  FileText,
  Rocket,
  Store,
  Package,
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Command,
  ChevronRight,
  Layers,
  Brain,
  Palette,
  Play,
  ExternalLink,
  Hash,
  ArrowUpRight,
} from 'lucide-react';
import { SharedHeader } from '@/components/landing/shared-header';
import { SharedFooter } from '@/components/landing/shared-footer';

// Types
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'docs' | 'help' | 'features' | 'api' | 'resources';
  href: string;
  icon: React.ElementType;
  badge?: string;
  readTime?: string;
  tags?: string[];
}

interface SearchCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  count: number;
}

// Search categories
const searchCategories: SearchCategory[] = [
  { id: 'all', label: 'All', icon: Layers, color: 'primary', gradient: 'from-primary/20 to-orange-500/10', count: 0 },
  { id: 'docs', label: 'Documentation', icon: BookOpen, color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/10', count: 12 },
  { id: 'help', label: 'Help Center', icon: MessageSquare, color: 'blue', gradient: 'from-blue-500/20 to-cyan-500/10', count: 8 },
  { id: 'features', label: 'Features', icon: Sparkles, color: 'purple', gradient: 'from-purple-500/20 to-violet-500/10', count: 10 },
  { id: 'api', label: 'API', icon: Code2, color: 'amber', gradient: 'from-amber-500/20 to-yellow-500/10', count: 6 },
  { id: 'resources', label: 'Resources', icon: Video, color: 'pink', gradient: 'from-pink-500/20 to-rose-500/10', count: 5 },
];

// Comprehensive search data
const searchData: SearchResult[] = [
  // Documentation
  { id: 'd1', title: 'Getting Started with Rendrix', description: 'Learn the fundamentals and set up your first store in under 5 minutes. Perfect for new users.', category: 'docs', href: '/docs/getting-started', icon: Rocket, badge: 'Popular', readTime: '5 min', tags: ['beginner', 'setup'] },
  { id: 'd2', title: 'Store Configuration Guide', description: 'Deep dive into store settings, branding options, and customization features.', category: 'docs', href: '/docs/store-management', icon: Store, readTime: '8 min', tags: ['configuration', 'settings'] },
  { id: 'd3', title: 'Product Catalog Management', description: 'Master inventory management, variants, pricing strategies, and bulk operations.', category: 'docs', href: '/docs/product-catalog', icon: Package, readTime: '12 min', tags: ['products', 'inventory'] },
  { id: 'd4', title: 'Order Processing Workflows', description: 'Automate fulfillment, handle returns, and manage order lifecycles efficiently.', category: 'docs', href: '/docs/order-management', icon: FileText, readTime: '10 min', tags: ['orders', 'fulfillment'] },
  { id: 'd5', title: 'Multi-tenant Architecture', description: 'Understand organization structure, permissions, and tenant isolation.', category: 'docs', href: '/docs/multi-tenant', icon: Users, badge: 'Advanced', readTime: '15 min', tags: ['architecture', 'tenants'] },
  { id: 'd6', title: 'Theme Customization', description: 'Create stunning storefronts with our theme engine and CSS customization.', category: 'docs', href: '/docs/themes', icon: Palette, readTime: '7 min', tags: ['themes', 'design'] },
  { id: 'd7', title: 'Payment Integration Guide', description: 'Set up Stripe, configure payment methods, and handle transactions securely.', category: 'docs', href: '/docs/payments', icon: CreditCard, readTime: '9 min', tags: ['payments', 'stripe'] },
  { id: 'd8', title: 'Security Best Practices', description: 'Implement authentication, authorization, and protect customer data.', category: 'docs', href: '/docs/security', icon: Shield, readTime: '11 min', tags: ['security', 'auth'] },
  { id: 'd9', title: 'Analytics Dashboard Guide', description: 'Track sales, understand customer behavior, and make data-driven decisions.', category: 'docs', href: '/docs/analytics', icon: BarChart3, readTime: '8 min', tags: ['analytics', 'metrics'] },
  { id: 'd10', title: 'International Commerce Setup', description: 'Configure multi-currency, localization, and cross-border selling.', category: 'docs', href: '/docs/international', icon: Globe, readTime: '10 min', tags: ['international', 'localization'] },
  { id: 'd11', title: 'Shipping & Fulfillment', description: 'Integrate carriers, set up rates, and automate shipping workflows.', category: 'docs', href: '/docs/shipping', icon: Package, readTime: '9 min', tags: ['shipping', 'carriers'] },
  { id: 'd12', title: 'Customer Management', description: 'Build customer profiles, segments, and personalized experiences.', category: 'docs', href: '/docs/customers', icon: Users, readTime: '7 min', tags: ['customers', 'crm'] },

  // Help Center
  { id: 'h1', title: 'How to Reset Your Password', description: 'Step-by-step guide to recover or change your account password securely.', category: 'help', href: '/help/account/reset-password', icon: Shield, readTime: '2 min', tags: ['account', 'password'] },
  { id: 'h2', title: 'Understanding Your Invoice', description: 'Breakdown of billing items, charges, and how to manage payment methods.', category: 'help', href: '/help/billing/invoices', icon: CreditCard, readTime: '3 min', tags: ['billing', 'invoices'] },
  { id: 'h3', title: 'Connecting a Custom Domain', description: 'Point your domain to Rendrix and configure SSL certificates.', category: 'help', href: '/help/stores/custom-domain', icon: Globe, readTime: '4 min', tags: ['domain', 'ssl'] },
  { id: 'h4', title: 'Refund Processing Guide', description: 'Handle customer refunds, partial returns, and payment reversals.', category: 'help', href: '/help/orders/refunds', icon: FileText, readTime: '3 min', tags: ['refunds', 'returns'] },
  { id: 'h5', title: 'Team Member Permissions', description: 'Invite team members and configure role-based access control.', category: 'help', href: '/help/account/team', icon: Users, readTime: '4 min', tags: ['team', 'permissions'] },
  { id: 'h6', title: 'Troubleshooting Payment Failures', description: 'Common payment issues and how to resolve them quickly.', category: 'help', href: '/help/payments/troubleshooting', icon: CreditCard, readTime: '5 min', tags: ['payments', 'troubleshooting'] },
  { id: 'h7', title: 'Exporting Your Data', description: 'Download products, orders, and customer data in various formats.', category: 'help', href: '/help/data/export', icon: FileText, readTime: '3 min', tags: ['export', 'data'] },
  { id: 'h8', title: 'Upgrading Your Plan', description: 'Compare plans, upgrade process, and billing prorations explained.', category: 'help', href: '/help/billing/upgrade', icon: Sparkles, badge: 'Updated', readTime: '3 min', tags: ['upgrade', 'plans'] },

  // Features
  { id: 'f1', title: 'AI-Powered Product Descriptions', description: 'Generate compelling product copy with our advanced AI writing assistant.', category: 'features', href: '/features#ai-descriptions', icon: Brain, badge: 'New', tags: ['ai', 'copywriting'] },
  { id: 'f2', title: 'Storefront Builder', description: 'Drag-and-drop editor to create stunning, conversion-optimized storefronts.', category: 'features', href: '/features#storefront', icon: Store, badge: 'Popular', tags: ['builder', 'design'] },
  { id: 'f3', title: 'Advanced Analytics', description: 'Real-time insights, cohort analysis, and predictive revenue forecasting.', category: 'features', href: '/features#analytics', icon: BarChart3, tags: ['analytics', 'insights'] },
  { id: 'f4', title: 'Multi-Store Management', description: 'Run multiple brands from a single dashboard with unified reporting.', category: 'features', href: '/features#multi-store', icon: Layers, tags: ['multi-store', 'brands'] },
  { id: 'f5', title: 'Smart Inventory Sync', description: 'Automatic stock updates across all sales channels in real-time.', category: 'features', href: '/features#inventory', icon: Package, tags: ['inventory', 'sync'] },
  { id: 'f6', title: 'Abandoned Cart Recovery', description: 'Automated email sequences to recover lost sales and boost revenue.', category: 'features', href: '/features#cart-recovery', icon: Zap, tags: ['recovery', 'email'] },
  { id: 'f7', title: 'Customer Segmentation', description: 'Build dynamic segments based on behavior, purchases, and engagement.', category: 'features', href: '/features#segmentation', icon: Users, tags: ['segments', 'targeting'] },
  { id: 'f8', title: 'Headless Commerce API', description: 'Build custom experiences with our flexible, developer-first API.', category: 'features', href: '/features#headless', icon: Code2, tags: ['headless', 'api'] },
  { id: 'f9', title: 'Subscription Commerce', description: 'Launch recurring revenue with subscription boxes and memberships.', category: 'features', href: '/features#subscriptions', icon: TrendingUp, tags: ['subscriptions', 'recurring'] },
  { id: 'f10', title: 'Enterprise Security', description: 'SOC 2 certified, GDPR compliant, with advanced fraud protection.', category: 'features', href: '/features#security', icon: Shield, tags: ['security', 'compliance'] },

  // API
  { id: 'a1', title: 'REST API Overview', description: 'Complete API reference with authentication, endpoints, and examples.', category: 'api', href: '/api-docs', icon: Code2, badge: 'Reference', tags: ['rest', 'reference'] },
  { id: 'a2', title: 'Products API', description: 'Create, update, and manage products programmatically.', category: 'api', href: '/api-docs#products', icon: Package, readTime: '6 min', tags: ['products', 'crud'] },
  { id: 'a3', title: 'Orders API', description: 'Process orders, update fulfillment, and manage transactions.', category: 'api', href: '/api-docs#orders', icon: FileText, readTime: '8 min', tags: ['orders', 'transactions'] },
  { id: 'a4', title: 'Customers API', description: 'Access customer profiles, addresses, and purchase history.', category: 'api', href: '/api-docs#customers', icon: Users, readTime: '5 min', tags: ['customers', 'profiles'] },
  { id: 'a5', title: 'Webhooks Integration', description: 'Subscribe to real-time events and build reactive integrations.', category: 'api', href: '/api-docs#webhooks', icon: Zap, badge: 'Updated', readTime: '7 min', tags: ['webhooks', 'events'] },
  { id: 'a6', title: 'Authentication & Security', description: 'JWT tokens, API keys, OAuth flows, and security best practices.', category: 'api', href: '/api-docs#authentication', icon: Shield, readTime: '6 min', tags: ['auth', 'jwt'] },

  // Resources
  { id: 'r1', title: 'Video: Complete Store Setup', description: 'Watch our comprehensive tutorial on building your first store.', category: 'resources', href: '/resources/videos/store-setup', icon: Video, readTime: '18 min', tags: ['video', 'tutorial'] },
  { id: 'r2', title: 'Ecommerce Growth Playbook', description: 'Strategies and tactics from top-performing Rendrix merchants.', category: 'resources', href: '/resources/playbook', icon: BookOpen, badge: 'Free', tags: ['guide', 'growth'] },
  { id: 'r3', title: 'Changelog & Updates', description: 'Stay updated with the latest features, improvements, and fixes.', category: 'resources', href: '/changelog', icon: FileText, badge: 'Weekly', tags: ['changelog', 'updates'] },
  { id: 'r4', title: 'Community Forum', description: 'Connect with other merchants, share tips, and get peer support.', category: 'resources', href: '/community', icon: Users, tags: ['community', 'forum'] },
  { id: 'r5', title: 'Integration Partners', description: 'Browse our ecosystem of apps, plugins, and service partners.', category: 'resources', href: '/integrations', icon: Layers, tags: ['integrations', 'partners'] },
];

// Quick access sections for empty state
const quickAccessSections = [
  {
    title: 'Getting Started',
    description: 'Launch your commerce empire in minutes',
    href: '/docs/getting-started',
    icon: Rocket,
    gradient: 'from-primary to-orange-600',
    large: true,
  },
  {
    title: 'API Reference',
    description: 'Build powerful integrations',
    href: '/api-docs',
    icon: Code2,
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    title: 'Help Center',
    description: 'Get answers fast',
    href: '/help',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Video Tutorials',
    description: 'Learn by watching',
    href: '/resources/videos',
    icon: Play,
    gradient: 'from-purple-500 to-violet-500',
  },
];

const popularSearches = ['getting started', 'payments', 'api', 'themes', 'analytics', 'shipping'];
const trendingTopics = ['AI features', 'multi-store', 'headless commerce', 'subscriptions'];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-focus search input
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  // Debounced search simulation
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim()) {
      setIsSearching(true);
      debounceRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } else {
      setIsSearching(false);
    }
  }, []);

  // Filter results
  const filteredResults = useMemo(() => {
    let results = searchData;

    if (activeCategory !== 'all') {
      results = results.filter(r => r.category === activeCategory);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        r =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.description.toLowerCase().includes(lowerQuery) ||
          r.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return results;
  }, [query, activeCategory]);

  // Update category counts
  const categoriesWithCounts = useMemo(() => {
    return searchCategories.map(cat => ({
      ...cat,
      count: cat.id === 'all'
        ? searchData.length
        : searchData.filter(r => r.category === cat.id).length,
    }));
  }, []);

  // Get category styling
  const getCategoryStyle = (categoryId: string) => {
    const category = searchCategories.find(c => c.id === categoryId);
    return category || searchCategories[0];
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-white rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SharedHeader />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Mesh */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,145,0,0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 100% 50%, rgba(255,107,0,0.05) 0%, transparent 50%),
              radial-gradient(ellipse 50% 50% at 0% 80%, rgba(255,184,77,0.05) 0%, transparent 50%)
            `,
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating Particles */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${100 + Math.random() * 20}%`,
                  opacity: 0,
                }}
                animate={{
                  y: [`${100 + Math.random() * 20}%`, `-10%`],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="relative pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Search{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 50%, #FF6B00 100%)',
                }}
              >
                Rendrix
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Find documentation, guides, features, and resources
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            {/* Glow Effect */}
            <div
              className={`absolute -inset-1 rounded-2xl transition-all duration-500 ${
                isFocused
                  ? 'opacity-100 blur-xl'
                  : 'opacity-0'
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,107,0,0.1) 100%)',
              }}
            />

            {/* Input Container */}
            <div
              className={`relative flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 ${
                isFocused
                  ? 'bg-white/[0.06] border-primary/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]'
              }`}
              style={{
                border: '1px solid',
                borderColor: isFocused ? 'rgba(255,145,0,0.4)' : 'rgba(255,255,255,0.06)',
              }}
            >
              {/* Search Icon */}
              <motion.div
                animate={isFocused ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Search
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isFocused ? 'text-primary' : 'text-white/40'
                  }`}
                />
              </motion.div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search documentation, features, API..."
                className="flex-1 bg-transparent text-white text-xl font-light placeholder:text-white/30 focus:outline-none"
              />

              {/* Right Side */}
              <div className="flex items-center gap-3">
                {/* Loading Indicator */}
                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                    />
                  )}
                </AnimatePresence>

                {/* Clear Button */}
                <AnimatePresence>
                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => {
                        setQuery('');
                        inputRef.current?.focus();
                      }}
                      className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Keyboard Shortcut */}
                <kbd className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm font-medium">
                  <Command className="w-3.5 h-3.5" />
                  <span>K</span>
                </kbd>
              </div>
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide"
          >
            {categoriesWithCounts.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap group ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${category.gradient} border border-white/[0.1]`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {/* Hover Background */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                  <Icon className="relative w-4 h-4" />
                  <span className="relative">{category.label}</span>
                  <span className={`relative text-xs px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20' : 'bg-white/[0.06]'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {query.trim() ? (
              // Search Results
              filteredResults.length > 0 ? (
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid gap-4"
                >
                  {/* Results Count */}
                  <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-white/40 mb-2">
                    <Hash className="w-4 h-4" />
                    <span>
                      {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                    </span>
                  </motion.div>

                  {/* Results Grid */}
                  <div className="grid gap-3">
                    {filteredResults.map((result) => {
                      const Icon = result.icon;
                      const style = getCategoryStyle(result.category);

                      return (
                        <motion.div
                          key={result.id}
                          variants={itemVariants}
                          initial="rest"
                          whileHover="hover"
                          animate="rest"
                        >
                          <motion.div variants={cardHover}>
                            <Link
                              href={result.href}
                              className="group block p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                            >
                              <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div
                                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
                                >
                                  <Icon
                                    className={`w-6 h-6 ${
                                      style.color === 'primary' ? 'text-primary' :
                                      style.color === 'emerald' ? 'text-emerald-400' :
                                      style.color === 'blue' ? 'text-blue-400' :
                                      style.color === 'purple' ? 'text-purple-400' :
                                      style.color === 'amber' ? 'text-amber-400' :
                                      'text-pink-400'
                                    }`}
                                  />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                                      {highlightMatch(result.title, query)}
                                    </h3>
                                    {result.badge && (
                                      <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                          result.badge === 'New'
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : result.badge === 'Popular'
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : result.badge === 'Updated'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : 'bg-white/10 text-white/60 border border-white/10'
                                        }`}
                                      >
                                        {result.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-white/50 line-clamp-2 mb-2">
                                    {highlightMatch(result.description, query)}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-white/30">
                                    <span className="flex items-center gap-1.5">
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          style.color === 'primary' ? 'bg-primary' :
                                          style.color === 'emerald' ? 'bg-emerald-400' :
                                          style.color === 'blue' ? 'bg-blue-400' :
                                          style.color === 'purple' ? 'bg-purple-400' :
                                          style.color === 'amber' ? 'bg-amber-400' :
                                          'bg-pink-400'
                                        }`}
                                      />
                                      {searchCategories.find(c => c.id === result.category)?.label}
                                    </span>
                                    {result.readTime && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {result.readTime}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Arrow */}
                                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                              </div>
                            </Link>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                // No Results
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-white/40 mb-8 max-w-md mx-auto">
                    We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or browse categories.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 rounded-xl bg-white/[0.04] text-white/60 text-sm hover:bg-white/[0.08] hover:text-white transition-all border border-white/[0.06]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )
            ) : (
              // Empty State - Quick Access
              <motion.div
                key="empty"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Quick Access Grid */}
                <div>
                  <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-white/40 mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium uppercase tracking-wider">Quick Access</span>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickAccessSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <motion.div
                          key={section.title}
                          variants={itemVariants}
                          className={section.large ? 'md:col-span-2' : ''}
                        >
                          <Link
                            href={section.href}
                            className="group relative block p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                          >
                            {/* Gradient Background */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            {/* Border */}
                            <div className="absolute inset-0 rounded-2xl border border-white/[0.08] group-hover:border-white/[0.15] transition-colors duration-300" />
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            <div className="relative flex items-center gap-4">
                              <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                              >
                                <Icon className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                                  {section.title}
                                </h3>
                                <p className="text-sm text-white/50">{section.description}</p>
                              </div>
                              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Popular & Trending Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Popular Searches */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium uppercase tracking-wider">Popular Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-4 py-2.5 rounded-xl bg-white/[0.03] text-white/60 text-sm hover:bg-white/[0.08] hover:text-white transition-all border border-white/[0.06] hover:border-white/[0.12]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Trending Topics */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                      <Zap className="w-4 h-4" />
                      <span className="font-medium uppercase tracking-wider">Trending Topics</span>
                    </div>
                    <div className="space-y-2">
                      {trendingTopics.map((topic, index) => (
                        <button
                          key={topic}
                          onClick={() => handleSearch(topic)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm text-white/50 hover:bg-white/[0.04] hover:text-white transition-all group"
                        >
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="flex-1">{topic}</span>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Browse All Categories */}
                <motion.div variants={itemVariants} className="pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                    <Layers className="w-4 h-4" />
                    <span className="font-medium uppercase tracking-wider">Browse by Category</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {categoriesWithCounts.slice(1).map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                        >
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                category.color === 'emerald' ? 'text-emerald-400' :
                                category.color === 'blue' ? 'text-blue-400' :
                                category.color === 'purple' ? 'text-purple-400' :
                                category.color === 'amber' ? 'text-amber-400' :
                                'text-pink-400'
                              }`}
                            />
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                              {category.label}
                            </span>
                            <span className="text-xs text-white/30">{category.count} items</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Need Help CTA */}
                <motion.div variants={itemVariants}>
                  <div className="relative p-8 rounded-2xl overflow-hidden">
                    {/* Background */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,107,0,0.05) 100%)',
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl border border-primary/20" />

                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Can&apos;t find what you&apos;re looking for?
                        </h3>
                        <p className="text-white/50">
                          Our support team is here to help 24/7
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/help"
                          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                        >
                          Help Center
                        </Link>
                        <Link
                          href="/contact"
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
                        >
                          Contact Support
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}

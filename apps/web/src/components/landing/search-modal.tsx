'use client';

import * as React from 'react';
import { useEffect, useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  Store,
  Package,
  CreditCard,
  Truck,
  Globe,
  BookOpen,
  Code2,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Command,
  FileText,
  Users,
  Settings,
  Zap,
  LayoutGrid,
  Palette,
  Shield,
  BarChart3,
  ArrowUpRight,
  Hash,
  Layers,
} from 'lucide-react';

// Types
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface SearchCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

// Search categories with gradients
const searchCategories: SearchCategory[] = [
  { id: 'all', label: 'All', icon: LayoutGrid, color: 'primary', gradient: 'from-primary/20 to-orange-500/10' },
  { id: 'platform', label: 'Platform', icon: Store, color: 'blue', gradient: 'from-blue-500/20 to-cyan-500/10' },
  { id: 'docs', label: 'Documentation', icon: BookOpen, color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/10' },
  { id: 'api', label: 'API', icon: Code2, color: 'purple', gradient: 'from-purple-500/20 to-violet-500/10' },
  { id: 'solutions', label: 'Solutions', icon: Target, color: 'amber', gradient: 'from-amber-500/20 to-yellow-500/10' },
];

// Mock search data
const searchData: SearchResult[] = [
  // Platform
  { id: '1', title: 'Storefront Builder', description: 'Create beautiful, customizable storefronts', category: 'platform', href: '/platform/storefront', icon: Store },
  { id: '2', title: 'Product Management', description: 'Manage inventory and catalogs', category: 'platform', href: '/platform/products', icon: Package },
  { id: '3', title: 'Payment Processing', description: 'Accept payments globally with Stripe', category: 'platform', href: '/platform/payments', icon: CreditCard, badge: 'Popular' },
  { id: '4', title: 'Shipping & Fulfillment', description: 'Automate your shipping workflows', category: 'platform', href: '/platform/shipping', icon: Truck },
  { id: '5', title: 'Analytics Dashboard', description: 'Track sales and customer behavior', category: 'platform', href: '/platform/analytics', icon: BarChart3 },
  { id: '6', title: 'Theme Customization', description: 'Design your perfect store look', category: 'platform', href: '/platform/themes', icon: Palette },
  // Documentation
  { id: '7', title: 'Getting Started Guide', description: 'Set up your first store in minutes', category: 'docs', href: '/docs/getting-started', icon: BookOpen, badge: 'New' },
  { id: '8', title: 'Store Configuration', description: 'Configure your store settings', category: 'docs', href: '/docs/configuration', icon: Settings },
  { id: '9', title: 'Multi-tenant Setup', description: 'Learn about organization structure', category: 'docs', href: '/docs/multi-tenant', icon: Users },
  { id: '10', title: 'Security Best Practices', description: 'Keep your store secure', category: 'docs', href: '/docs/security', icon: Shield },
  // API
  { id: '11', title: 'REST API Overview', description: 'Complete API reference documentation', category: 'api', href: '/api-docs', icon: Code2 },
  { id: '12', title: 'Authentication', description: 'JWT tokens and API keys', category: 'api', href: '/api-docs#authentication', icon: Shield },
  { id: '13', title: 'Products API', description: 'Create and manage products', category: 'api', href: '/api-docs#products', icon: Package },
  { id: '14', title: 'Orders API', description: 'Process and track orders', category: 'api', href: '/api-docs#orders', icon: FileText },
  { id: '15', title: 'Webhooks', description: 'Real-time event notifications', category: 'api', href: '/api-docs#webhooks', icon: Zap, badge: 'Updated' },
  // Solutions
  { id: '16', title: 'Enterprise Solutions', description: 'Scale your business globally', category: 'solutions', href: '/solutions/enterprise', icon: Sparkles },
  { id: '17', title: 'Startup Program', description: 'Special pricing for startups', category: 'solutions', href: '/solutions/startups', icon: Target },
  { id: '18', title: 'International Commerce', description: 'Sell across borders seamlessly', category: 'solutions', href: '/solutions/international', icon: Globe },
  { id: '19', title: 'B2B Commerce', description: 'Wholesale and B2B features', category: 'solutions', href: '/solutions/b2b', icon: Users },
];

// Quick actions - featured and regular
const featuredAction = {
  label: 'Start Free Trial',
  href: '/register',
  icon: Sparkles,
  description: 'Create your commerce empire in minutes',
  gradient: 'from-primary via-orange-500 to-amber-500',
};

const quickActions = [
  { label: 'View Pricing', href: '/pricing', icon: CreditCard, description: 'Find the perfect plan', color: 'emerald' },
  { label: 'Read Documentation', href: '/docs', icon: BookOpen, description: 'Learn Rendrix', color: 'blue' },
  { label: 'API Reference', href: '/api-docs', icon: Code2, description: 'Build integrations', color: 'purple' },
];

// Recent & trending
const recentSearches = ['storefront', 'payments api', 'shipping'];
const trendingSearches = ['headless commerce', 'multi-store', 'analytics', 'themes'];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter results
  const filteredResults = React.useMemo(() => {
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
          r.category.toLowerCase().includes(lowerQuery)
      );
    }
    return results;
  }, [query, activeCategory]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setIsFocused(true);
      }, 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      setIsFocused(false);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            window.location.href = filteredResults[selectedIndex].href;
            onClose();
          }
          break;
      }
    },
    [isOpen, onClose, filteredResults, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && filteredResults.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, filteredResults.length]);

  // Get category styling
  const getCategoryStyle = (categoryId: string) => {
    const category = searchCategories.find(c => c.id === categoryId);
    return category || searchCategories[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Centered Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl pointer-events-auto"
            >
              <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient border effect */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent pointer-events-none" />

                {/* Main container */}
                <div className="relative rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_0_80px_-20px_rgba(255,145,0,0.3)] overflow-hidden">

                  {/* Ambient background effects */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating orbs */}
                    <motion.div
                      animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(255,145,0,0.15) 0%, transparent 70%)' }}
                    />
                    <motion.div
                      animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
                    />
                    {/* Subtle grid pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                      }}
                    />
                  </div>

                  {/* Search Input Section */}
                  <div className="relative border-b border-white/[0.06]">
                    <div className="relative px-5 py-5">
                      {/* Glowing border effect on focus */}
                      <div className={`absolute inset-x-5 inset-y-3 rounded-xl transition-all duration-500 ${
                        isFocused
                          ? 'opacity-100 shadow-[0_0_20px_rgba(255,145,0,0.15),inset_0_0_20px_rgba(255,145,0,0.05)]'
                          : 'opacity-0'
                      }`} />

                      <div className={`relative flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-300 ${
                        isFocused
                          ? 'bg-white/[0.04] border-primary/30'
                          : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]'
                      }`}>
                        {/* Animated search icon */}
                        <motion.div
                          animate={isFocused ? { scale: [1, 1.1, 1], rotate: [0, -10, 0] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Search className={`w-5 h-5 transition-colors duration-300 ${
                            isFocused ? 'text-primary' : 'text-white/40'
                          }`} />
                        </motion.div>

                        <input
                          ref={inputRef}
                          type="text"
                          value={query}
                          onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                          }}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="Search features, docs, API..."
                          className="flex-1 bg-transparent text-white text-lg font-light placeholder:text-white/30 focus:outline-none tracking-wide"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        />

                        <div className="flex items-center gap-2">
                          {query && (
                            <motion.button
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              onClick={() => setQuery('')}
                              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          )}
                          <kbd className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 text-xs font-medium tracking-wider">
                            ESC
                          </kbd>
                        </div>
                      </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
                      {searchCategories.map((category, index) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;
                        return (
                          <motion.button
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setActiveCategory(category.id);
                              setSelectedIndex(0);
                            }}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap group ${
                              isActive
                                ? 'text-white'
                                : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            {/* Active background with gradient */}
                            {isActive && (
                              <motion.div
                                layoutId="activePill"
                                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${category.gradient} border border-white/[0.1]`}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            {/* Hover effect */}
                            {!isActive && (
                              <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            )}
                            <Icon className="relative w-4 h-4" />
                            <span className="relative">{category.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="relative max-h-[55vh] overflow-y-auto overscroll-contain">
                    {query.trim() ? (
                      // Search Results
                      filteredResults.length > 0 ? (
                        <div ref={resultsRef} className="p-3">
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                              visible: { transition: { staggerChildren: 0.03 } }
                            }}
                            className="space-y-1"
                          >
                            {filteredResults.map((result, index) => {
                              const Icon = result.icon;
                              const style = getCategoryStyle(result.category);
                              const isSelected = index === selectedIndex;

                              return (
                                <motion.div
                                  key={result.id}
                                  variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    visible: { opacity: 1, x: 0 }
                                  }}
                                >
                                  <Link
                                    href={result.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group ${
                                      isSelected
                                        ? 'bg-white/[0.08]'
                                        : 'hover:bg-white/[0.04]'
                                    }`}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                  >
                                    {/* Icon with gradient background */}
                                    <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                      <Icon className={`relative w-5 h-5 ${
                                        style.color === 'primary' ? 'text-primary' :
                                        style.color === 'blue' ? 'text-blue-400' :
                                        style.color === 'emerald' ? 'text-emerald-400' :
                                        style.color === 'purple' ? 'text-purple-400' :
                                        'text-amber-400'
                                      }`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-[15px] font-medium text-white truncate">
                                          {result.title}
                                        </span>
                                        {result.badge && (
                                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            result.badge === 'New'
                                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                              : result.badge === 'Popular'
                                              ? 'bg-primary/20 text-primary border border-primary/30'
                                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                          }`}>
                                            {result.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-white/40 truncate mt-0.5">
                                        {result.description}
                                      </p>
                                    </div>

                                    <div className={`flex items-center gap-2 transition-all duration-200 ${
                                      isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                    }`}>
                                      <span className="text-xs text-white/30 font-medium">Open</span>
                                      <ArrowRight className="w-4 h-4 text-white/40" />
                                    </div>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        </div>
                      ) : (
                        // No Results
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-10 text-center"
                        >
                          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-5">
                            <Search className="w-9 h-9 text-white/20" />
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                          <p className="text-sm text-white/40 mb-6 max-w-xs mx-auto">
                            We couldn't find anything matching "{query}". Try different keywords.
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {trendingSearches.map((term) => (
                              <button
                                key={term}
                                onClick={() => setQuery(term)}
                                className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/60 text-sm hover:bg-white/[0.08] hover:text-white transition-all duration-200 border border-white/[0.06]"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )
                    ) : (
                      // Empty State - Premium Bento Layout
                      <div className="p-5 space-y-5">
                        {/* Featured Action */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            href={featuredAction.href}
                            onClick={onClose}
                            className="group relative block p-5 rounded-2xl overflow-hidden"
                          >
                            {/* Gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${featuredAction.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {/* Border gradient */}
                            <div className="absolute inset-0 rounded-2xl border border-primary/30 group-hover:border-primary/50 transition-colors duration-300" />
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            <div className="relative flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30">
                                <Sparkles className="w-7 h-7 text-black" />
                              </div>
                              <div className="flex-1">
                                <p className="text-lg font-semibold text-white mb-0.5">{featuredAction.label}</p>
                                <p className="text-sm text-white/50">{featuredAction.description}</p>
                              </div>
                              <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                            </div>
                          </Link>
                        </motion.div>

                        {/* Quick Actions Grid */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <div className="flex items-center gap-2 px-1 mb-3">
                            <Hash className="w-3.5 h-3.5 text-white/30" />
                            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Quick Actions</h3>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {quickActions.map((action, index) => {
                              const Icon = action.icon;
                              return (
                                <motion.div
                                  key={action.label}
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                  <Link
                                    href={action.href}
                                    onClick={onClose}
                                    className="group block p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                                  >
                                    <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center transition-all duration-300 ${
                                      action.color === 'emerald'
                                        ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                                        : action.color === 'blue'
                                        ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'
                                        : 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                                    }`}>
                                      <Icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-white mb-0.5">{action.label}</p>
                                    <p className="text-xs text-white/40">{action.description}</p>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>

                        {/* Recent & Trending Row */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="grid grid-cols-2 gap-5"
                        >
                          {/* Recent */}
                          <div>
                            <div className="flex items-center gap-2 px-1 mb-3">
                              <Clock className="w-3.5 h-3.5 text-white/30" />
                              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Recent</h3>
                            </div>
                            <div className="space-y-1">
                              {recentSearches.map((term) => (
                                <button
                                  key={term}
                                  onClick={() => setQuery(term)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-white/50 hover:bg-white/[0.04] hover:text-white transition-all duration-200 group"
                                >
                                  <Clock className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                                  <span className="truncate">{term}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Trending */}
                          <div>
                            <div className="flex items-center gap-2 px-1 mb-3">
                              <TrendingUp className="w-3.5 h-3.5 text-white/30" />
                              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Trending</h3>
                            </div>
                            <div className="space-y-1">
                              {trendingSearches.map((term) => (
                                <button
                                  key={term}
                                  onClick={() => setQuery(term)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-white/50 hover:bg-white/[0.04] hover:text-white transition-all duration-200 group"
                                >
                                  <TrendingUp className="w-4 h-4 text-white/20 group-hover:text-primary/70 transition-colors" />
                                  <span className="truncate">{term}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Browse Categories */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="pt-4 border-t border-white/[0.06]"
                        >
                          <div className="flex items-center gap-2 px-1 mb-3">
                            <Layers className="w-3.5 h-3.5 text-white/30" />
                            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Browse Categories</h3>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {searchCategories.slice(1).map((category, index) => {
                              const Icon = category.icon;
                              return (
                                <motion.button
                                  key={category.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4 + index * 0.05 }}
                                  onClick={() => setActiveCategory(category.id)}
                                  className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                                >
                                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                    <Icon className={`w-5 h-5 ${
                                      category.color === 'blue' ? 'text-blue-400' :
                                      category.color === 'emerald' ? 'text-emerald-400' :
                                      category.color === 'purple' ? 'text-purple-400' :
                                      'text-amber-400'
                                    }`} />
                                  </div>
                                  <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">{category.label}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="relative border-t border-white/[0.06] px-5 py-3.5 bg-gradient-to-r from-white/[0.02] to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 text-xs text-white/35">
                        <span className="flex items-center gap-2">
                          <kbd className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">↑</kbd>
                          <kbd className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">↓</kbd>
                          <span className="ml-1 font-medium">Navigate</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <kbd className="inline-flex items-center justify-center px-2 h-6 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">Enter</kbd>
                          <span className="font-medium">Select</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <kbd className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] border border-white/[0.08]">
                          <Command className="w-3 h-3" />
                        </kbd>
                        <span className="font-medium">K anywhere</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for keyboard shortcut
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false),
  };
}

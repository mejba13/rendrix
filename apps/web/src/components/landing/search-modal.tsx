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
  Play,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Command,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Zap,
  LayoutGrid,
  Palette,
  Shield,
  BarChart3,
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
}

// Search categories
const searchCategories: SearchCategory[] = [
  { id: 'all', label: 'All', icon: LayoutGrid, color: 'primary' },
  { id: 'platform', label: 'Platform', icon: Store, color: 'blue' },
  { id: 'docs', label: 'Documentation', icon: BookOpen, color: 'emerald' },
  { id: 'api', label: 'API', icon: Code2, color: 'purple' },
  { id: 'solutions', label: 'Solutions', icon: Target, color: 'amber' },
];

// Mock search data - in real implementation this would come from an API
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

// Quick actions for empty state
const quickActions = [
  { label: 'Create a store', href: '/register', icon: Store, description: 'Start your commerce journey' },
  { label: 'View pricing', href: '/pricing', icon: CreditCard, description: 'Find the perfect plan' },
  { label: 'Read docs', href: '/docs', icon: BookOpen, description: 'Learn how Rendrix works' },
  { label: 'API reference', href: '/api-docs', icon: Code2, description: 'Build custom integrations' },
];

// Recent searches (mock - would be stored in localStorage in real implementation)
const recentSearches = ['storefront', 'payments api', 'shipping'];

// Trending searches
const trendingSearches = ['headless commerce', 'multi-store', 'analytics', 'themes'];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter results based on query and category
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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
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
          setSelectedIndex(prev =>
            Math.min(prev + 1, filteredResults.length - 1)
          );
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

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = searchCategories.find(c => c.id === categoryId);
    return category?.color || 'primary';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[101] max-h-[80vh] overflow-hidden"
          >
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

              {/* Search Input */}
              <div className="relative border-b border-white/[0.06]">
                <div className="flex items-center px-4 py-4">
                  <Search className="w-5 h-5 text-white/40 mr-3 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Search documentation, features, API..."
                    className="flex-1 bg-transparent text-white text-lg placeholder:text-white/30 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 ml-3">
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/40 text-xs font-medium">
                      <span>ESC</span>
                    </kbd>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
                  {searchCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setSelectedIndex(0);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                          isActive
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-white/[0.04] text-white/60 border border-transparent hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="relative max-h-[calc(80vh-140px)] overflow-y-auto">
                {query.trim() ? (
                  // Search Results
                  filteredResults.length > 0 ? (
                    <div ref={resultsRef} className="p-2">
                      {filteredResults.map((result, index) => {
                        const Icon = result.icon;
                        const color = getCategoryColor(result.category);
                        const isSelected = index === selectedIndex;

                        return (
                          <Link
                            key={result.id}
                            href={result.href}
                            onClick={onClose}
                            className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-200 group ${
                              isSelected
                                ? 'bg-white/[0.08]'
                                : 'hover:bg-white/[0.04]'
                            }`}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                color === 'primary'
                                  ? 'bg-primary/20 text-primary'
                                  : color === 'blue'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : color === 'emerald'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : color === 'purple'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium truncate">
                                  {result.title}
                                </span>
                                {result.badge && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                    {result.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-white/50 truncate mt-0.5">
                                {result.description}
                              </p>
                            </div>
                            <ArrowRight
                              className={`w-4 h-4 text-white/30 flex-shrink-0 transition-all duration-200 ${
                                isSelected
                                  ? 'opacity-100 translate-x-0'
                                  : 'opacity-0 -translate-x-2'
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    // No Results
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-white/20" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-sm text-white/50 mb-6">
                        Try adjusting your search or browse categories
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {trendingSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/60 text-sm hover:bg-white/[0.08] hover:text-white transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  // Empty State - Quick Actions & Suggestions
                  <div className="p-4 space-y-6">
                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-3">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Link
                              key={action.label}
                              href={action.href}
                              onClick={onClose}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {action.label}
                                </p>
                                <p className="text-xs text-white/40 truncate">
                                  {action.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent & Trending */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Recent Searches */}
                      <div>
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-3 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          Recent
                        </h3>
                        <div className="space-y-1">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => setQuery(term)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5 text-white/30" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Trending */}
                      <div>
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Trending
                        </h3>
                        <div className="space-y-1">
                          {trendingSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => setQuery(term)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              <TrendingUp className="w-3.5 h-3.5 text-white/30" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Browse All Categories */}
                    <div className="pt-4 border-t border-white/[0.06]">
                      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-3">
                        Browse Categories
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {searchCategories.slice(1).map((category) => {
                          const Icon = category.icon;
                          return (
                            <button
                              key={category.id}
                              onClick={() => setActiveCategory(category.id)}
                              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                  category.color === 'blue'
                                    ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'
                                    : category.color === 'emerald'
                                    ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                                    : category.color === 'purple'
                                    ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                                    : 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                                {category.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.06] px-4 py-3 bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">↑</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">↓</kbd>
                      <span className="ml-1">Navigate</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">↵</kbd>
                      <span className="ml-1">Select</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <Command className="w-3 h-3" />
                    <span>K to search anytime</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
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
      // Cmd/Ctrl + K to open search
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

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Store,
  BookOpen,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Rocket,
  Package,
  CreditCard,
  Send,
  LayoutDashboard,
  Settings,
  Palette,
  ShoppingCart,
  Truck,
  RotateCcw,
  Users,
  Receipt,
  Brain,
  Sparkles,
  Bot,
  LineChart,
  Code,
  Webhook,
  FileCode,
  Key,
  Database,
  Play,
  MessageSquare,
  Clock,
  FileText,
  Zap,
  Shield,
  Lock,
  Globe,
  ExternalLink,
  Terminal,
  Mail,
  Command,
  CheckCircle2,
  Video,
  MessagesSquare,
  History,
  HelpCircle,
  Activity,
  Home,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SharedHeader } from '@/components/landing/shared-header';
import { SharedFooter } from '@/components/landing/shared-footer';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

// Category definitions with articles
const categoryData: Record<string, {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  articles: Array<{
    slug: string;
    title: string;
    description: string;
    readTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    updatedAt: string;
  }>;
}> = {
  'getting-started': {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Quick start guides and onboarding tutorials to help you set up your first store.',
    icon: Rocket,
    color: 'from-emerald-500/20 via-green-500/10 to-primary/5',
    articles: [
      { slug: 'create-store', title: 'Create Your First Store', description: 'Learn how to set up your online store in minutes with our step-by-step guide.', readTime: '5 min', difficulty: 'beginner', tags: ['setup', 'basics'], updatedAt: '2024-01-15' },
      { slug: 'add-products', title: 'Add Products', description: 'Upload and manage your product catalog with variants, images, and pricing.', readTime: '3 min', difficulty: 'beginner', tags: ['products', 'catalog'], updatedAt: '2024-01-14' },
      { slug: 'payments', title: 'Configure Payments', description: 'Connect payment gateways and start accepting payments from customers.', readTime: '4 min', difficulty: 'beginner', tags: ['payments', 'stripe'], updatedAt: '2024-01-13' },
      { slug: 'launch', title: 'Launch Your Store', description: 'Go live and start selling to customers worldwide.', readTime: '2 min', difficulty: 'beginner', tags: ['launch', 'go-live'], updatedAt: '2024-01-12' },
      { slug: 'dashboard-overview', title: 'Dashboard Overview', description: 'Navigate your store dashboard and understand key metrics.', readTime: '6 min', difficulty: 'beginner', tags: ['dashboard', 'analytics'], updatedAt: '2024-01-11' },
      { slug: 'first-sale', title: 'Making Your First Sale', description: 'Tips and strategies to land your first customer and sale.', readTime: '8 min', difficulty: 'beginner', tags: ['sales', 'marketing'], updatedAt: '2024-01-10' },
      { slug: 'store-settings', title: 'Store Settings Guide', description: 'Configure essential store settings for optimal performance.', readTime: '5 min', difficulty: 'beginner', tags: ['settings', 'configuration'], updatedAt: '2024-01-09' },
      { slug: 'mobile-app', title: 'Using the Mobile App', description: 'Manage your store on the go with our mobile application.', readTime: '4 min', difficulty: 'beginner', tags: ['mobile', 'app'], updatedAt: '2024-01-08' },
    ],
  },
  'platform': {
    id: 'platform',
    title: 'Platform Overview',
    description: 'Core concepts, architecture, and terminology to understand how Rendrix works.',
    icon: LayoutDashboard,
    color: 'from-primary/20 via-orange-500/10 to-amber-500/5',
    articles: [
      { slug: 'architecture', title: 'Platform Architecture', description: 'Understand the technical architecture and infrastructure behind Rendrix.', readTime: '10 min', difficulty: 'intermediate', tags: ['architecture', 'technical'], updatedAt: '2024-01-15' },
      { slug: 'multi-tenant', title: 'Multi-Tenant System', description: 'Learn how organizations and stores work in our multi-tenant platform.', readTime: '8 min', difficulty: 'intermediate', tags: ['multi-tenant', 'organizations'], updatedAt: '2024-01-14' },
      { slug: 'data-model', title: 'Data Model', description: 'Explore the core data models and relationships in Rendrix.', readTime: '12 min', difficulty: 'advanced', tags: ['data', 'models'], updatedAt: '2024-01-13' },
      { slug: 'security', title: 'Security Overview', description: 'Security measures and best practices implemented in Rendrix.', readTime: '7 min', difficulty: 'intermediate', tags: ['security', 'compliance'], updatedAt: '2024-01-12' },
      { slug: 'terminology', title: 'Glossary & Terminology', description: 'Key terms and definitions used throughout the platform.', readTime: '5 min', difficulty: 'beginner', tags: ['glossary', 'terms'], updatedAt: '2024-01-11' },
    ],
  },
  'dashboard': {
    id: 'dashboard',
    title: 'Dashboard Guide',
    description: 'Navigation, settings, and preferences for your store dashboard.',
    icon: Settings,
    color: 'from-blue-500/15 via-cyan-500/10 to-primary/5',
    articles: [
      { slug: 'navigation', title: 'Dashboard Navigation', description: 'Master the dashboard interface and find features quickly.', readTime: '5 min', difficulty: 'beginner', tags: ['navigation', 'ui'], updatedAt: '2024-01-15' },
      { slug: 'analytics', title: 'Analytics & Reports', description: 'Understand your store performance with built-in analytics.', readTime: '8 min', difficulty: 'intermediate', tags: ['analytics', 'reports'], updatedAt: '2024-01-14' },
      { slug: 'settings', title: 'Account Settings', description: 'Configure your account preferences and security settings.', readTime: '6 min', difficulty: 'beginner', tags: ['settings', 'account'], updatedAt: '2024-01-13' },
      { slug: 'notifications', title: 'Notification Preferences', description: 'Manage how and when you receive notifications.', readTime: '4 min', difficulty: 'beginner', tags: ['notifications', 'alerts'], updatedAt: '2024-01-12' },
    ],
  },
  'stores': {
    id: 'stores',
    title: 'Store Management',
    description: 'Create stores, themes, domains, and settings.',
    icon: Palette,
    color: 'from-purple-500/15 via-violet-500/10 to-primary/5',
    articles: [
      { slug: 'create-store', title: 'Creating a New Store', description: 'Step-by-step guide to creating and configuring a new store.', readTime: '6 min', difficulty: 'beginner', tags: ['create', 'setup'], updatedAt: '2024-01-15' },
      { slug: 'themes', title: 'Store Themes', description: 'Customize your store appearance with themes and styling.', readTime: '8 min', difficulty: 'intermediate', tags: ['themes', 'design'], updatedAt: '2024-01-14' },
      { slug: 'domains', title: 'Custom Domains', description: 'Connect and manage custom domains for your store.', readTime: '5 min', difficulty: 'intermediate', tags: ['domains', 'dns'], updatedAt: '2024-01-13' },
      { slug: 'seo', title: 'SEO Settings', description: 'Optimize your store for search engines.', readTime: '10 min', difficulty: 'intermediate', tags: ['seo', 'marketing'], updatedAt: '2024-01-12' },
      { slug: 'multi-store', title: 'Managing Multiple Stores', description: 'Best practices for running multiple stores from one account.', readTime: '7 min', difficulty: 'advanced', tags: ['multi-store', 'management'], updatedAt: '2024-01-11' },
    ],
  },
  'products': {
    id: 'products',
    title: 'Product Catalog',
    description: 'Products, variants, categories, inventory management, and media uploads.',
    icon: Package,
    color: 'from-primary/20 via-amber-500/10 to-orange-500/5',
    articles: [
      { slug: 'add-products', title: 'Adding Products', description: 'Create and publish products with all essential details.', readTime: '6 min', difficulty: 'beginner', tags: ['products', 'create'], updatedAt: '2024-01-15' },
      { slug: 'variants', title: 'Product Variants', description: 'Set up size, color, and other product variations.', readTime: '8 min', difficulty: 'intermediate', tags: ['variants', 'options'], updatedAt: '2024-01-14' },
      { slug: 'categories', title: 'Categories & Collections', description: 'Organize products into categories and collections.', readTime: '5 min', difficulty: 'beginner', tags: ['categories', 'organization'], updatedAt: '2024-01-13' },
      { slug: 'inventory', title: 'Inventory Management', description: 'Track stock levels and manage inventory across locations.', readTime: '10 min', difficulty: 'intermediate', tags: ['inventory', 'stock'], updatedAt: '2024-01-12' },
      { slug: 'media', title: 'Product Media', description: 'Upload and manage product images and videos.', readTime: '4 min', difficulty: 'beginner', tags: ['media', 'images'], updatedAt: '2024-01-11' },
      { slug: 'bulk-import', title: 'Bulk Import Products', description: 'Import large product catalogs via CSV or API.', readTime: '7 min', difficulty: 'intermediate', tags: ['import', 'bulk'], updatedAt: '2024-01-10' },
    ],
  },
  'orders': {
    id: 'orders',
    title: 'Order Management',
    description: 'Orders, fulfillment, shipping, and returns.',
    icon: ShoppingCart,
    color: 'from-sky-500/15 via-blue-500/10 to-primary/5',
    articles: [
      { slug: 'overview', title: 'Order Management Overview', description: 'Understand the order lifecycle and management tools.', readTime: '6 min', difficulty: 'beginner', tags: ['orders', 'overview'], updatedAt: '2024-01-15' },
      { slug: 'processing', title: 'Processing Orders', description: 'Step-by-step guide to processing and fulfilling orders.', readTime: '8 min', difficulty: 'beginner', tags: ['processing', 'fulfillment'], updatedAt: '2024-01-14' },
      { slug: 'shipping', title: 'Shipping Configuration', description: 'Set up shipping zones, rates, and carriers.', readTime: '10 min', difficulty: 'intermediate', tags: ['shipping', 'carriers'], updatedAt: '2024-01-13' },
      { slug: 'returns', title: 'Returns & Refunds', description: 'Handle returns and process refunds efficiently.', readTime: '7 min', difficulty: 'intermediate', tags: ['returns', 'refunds'], updatedAt: '2024-01-12' },
      { slug: 'notifications', title: 'Order Notifications', description: 'Configure automated order status notifications.', readTime: '5 min', difficulty: 'beginner', tags: ['notifications', 'email'], updatedAt: '2024-01-11' },
    ],
  },
  'customers': {
    id: 'customers',
    title: 'Customers',
    description: 'Customer data, segments, and communications.',
    icon: Users,
    color: 'from-pink-500/15 via-rose-500/10 to-primary/5',
    articles: [
      { slug: 'overview', title: 'Customer Management', description: 'Overview of customer data and management features.', readTime: '5 min', difficulty: 'beginner', tags: ['customers', 'crm'], updatedAt: '2024-01-15' },
      { slug: 'segments', title: 'Customer Segments', description: 'Create and manage customer segments for targeted marketing.', readTime: '8 min', difficulty: 'intermediate', tags: ['segments', 'targeting'], updatedAt: '2024-01-14' },
      { slug: 'communications', title: 'Customer Communications', description: 'Engage customers with email and messaging tools.', readTime: '6 min', difficulty: 'intermediate', tags: ['email', 'messaging'], updatedAt: '2024-01-13' },
      { slug: 'loyalty', title: 'Loyalty Programs', description: 'Set up rewards and loyalty programs for customers.', readTime: '10 min', difficulty: 'advanced', tags: ['loyalty', 'rewards'], updatedAt: '2024-01-12' },
    ],
  },
  'billing': {
    id: 'billing',
    title: 'Billing & Subscriptions',
    description: 'Plans, invoices, payments, and upgrades.',
    icon: Receipt,
    color: 'from-teal-500/15 via-emerald-500/10 to-primary/5',
    articles: [
      { slug: 'plans', title: 'Subscription Plans', description: 'Understand available plans and features.', readTime: '5 min', difficulty: 'beginner', tags: ['plans', 'pricing'], updatedAt: '2024-01-15' },
      { slug: 'upgrade', title: 'Upgrading Your Plan', description: 'How to upgrade or downgrade your subscription.', readTime: '4 min', difficulty: 'beginner', tags: ['upgrade', 'billing'], updatedAt: '2024-01-14' },
      { slug: 'invoices', title: 'Managing Invoices', description: 'View and download your billing history.', readTime: '3 min', difficulty: 'beginner', tags: ['invoices', 'history'], updatedAt: '2024-01-13' },
      { slug: 'payment-methods', title: 'Payment Methods', description: 'Add and manage payment methods for your account.', readTime: '4 min', difficulty: 'beginner', tags: ['payments', 'cards'], updatedAt: '2024-01-12' },
    ],
  },
  'ai': {
    id: 'ai',
    title: 'AI Features',
    description: 'AI-powered descriptions, recommendations, chatbot, and predictive analytics.',
    icon: Brain,
    color: 'from-primary/25 via-orange-500/15 to-amber-500/5',
    articles: [
      { slug: 'descriptions', title: 'AI Product Descriptions', description: 'Generate compelling product descriptions with AI.', readTime: '5 min', difficulty: 'beginner', tags: ['ai', 'descriptions'], updatedAt: '2024-01-15' },
      { slug: 'recommendations', title: 'Product Recommendations', description: 'Set up AI-powered product recommendations.', readTime: '8 min', difficulty: 'intermediate', tags: ['ai', 'recommendations'], updatedAt: '2024-01-14' },
      { slug: 'chatbot', title: 'AI Chatbot Setup', description: 'Deploy an AI chatbot for customer support.', readTime: '10 min', difficulty: 'intermediate', tags: ['ai', 'chatbot'], updatedAt: '2024-01-13' },
      { slug: 'analytics', title: 'Predictive Analytics', description: 'Use AI to predict sales trends and customer behavior.', readTime: '12 min', difficulty: 'advanced', tags: ['ai', 'analytics'], updatedAt: '2024-01-12' },
      { slug: 'image-generation', title: 'AI Image Enhancement', description: 'Enhance product images with AI tools.', readTime: '6 min', difficulty: 'intermediate', tags: ['ai', 'images'], updatedAt: '2024-01-11' },
    ],
  },
  'api': {
    id: 'api',
    title: 'API & Developer Resources',
    description: 'REST API, GraphQL, Webhooks, SDKs, and authentication guides for developers.',
    icon: Code,
    color: 'from-primary/20 via-orange-500/10 to-amber-500/5',
    articles: [
      { slug: 'authentication', title: 'API Authentication', description: 'Authenticate your API requests with tokens and keys.', readTime: '8 min', difficulty: 'intermediate', tags: ['api', 'auth'], updatedAt: '2024-01-15' },
      { slug: 'reference', title: 'REST API Reference', description: 'Complete reference for all REST API endpoints.', readTime: '15 min', difficulty: 'intermediate', tags: ['api', 'rest'], updatedAt: '2024-01-14' },
      { slug: 'graphql', title: 'GraphQL API', description: 'Query data with our GraphQL API.', readTime: '12 min', difficulty: 'advanced', tags: ['api', 'graphql'], updatedAt: '2024-01-13' },
      { slug: 'webhooks', title: 'Webhooks Guide', description: 'Set up webhooks for real-time event notifications.', readTime: '10 min', difficulty: 'intermediate', tags: ['webhooks', 'events'], updatedAt: '2024-01-12' },
      { slug: 'sdks', title: 'SDKs & Libraries', description: 'Official SDKs for JavaScript, Python, PHP, and Ruby.', readTime: '6 min', difficulty: 'intermediate', tags: ['sdks', 'libraries'], updatedAt: '2024-01-11' },
      { slug: 'rate-limits', title: 'Rate Limits', description: 'Understand API rate limits and best practices.', readTime: '4 min', difficulty: 'beginner', tags: ['api', 'limits'], updatedAt: '2024-01-10' },
    ],
  },
};

// All categories list for sidebar
const allCategories = [
  { id: 'platform', title: 'Platform Overview', icon: LayoutDashboard },
  { id: 'getting-started', title: 'Getting Started', icon: Rocket },
  { id: 'dashboard', title: 'Dashboard Guide', icon: Settings },
  { id: 'stores', title: 'Store Management', icon: Palette },
  { id: 'products', title: 'Product Catalog', icon: Package },
  { id: 'orders', title: 'Order Management', icon: ShoppingCart },
  { id: 'customers', title: 'Customers', icon: Users },
  { id: 'billing', title: 'Billing & Subscriptions', icon: Receipt },
  { id: 'ai', title: 'AI Features', icon: Brain },
  { id: 'api', title: 'API & Developers', icon: Code },
];

// Header Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { label: 'Features', href: '/features', hasDropdown: false, isActive: false },
    { label: 'Pricing', href: '/pricing', hasDropdown: false, isActive: false },
    {
      label: 'Resources',
      href: '#resources',
      hasDropdown: true,
      isActive: true,
      items: [
        { icon: BookOpen, label: 'Documentation', description: 'Guides and API references', href: '/docs' },
        { icon: MessageSquare, label: 'Help Center', description: 'Get support and answers', href: '/help' },
      ],
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isScrolled ? 'bg-black/80 backdrop-blur-2xl' : 'bg-gradient-to-b from-black/50 to-transparent'
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.3) 50%, transparent 100%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 4px 20px rgba(255,145,0,0.35)' }}
                >
                  <Store className="w-5 h-5 text-black" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">Rendrix</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-1.5 px-4 py-2.5 text-[15px] transition-all duration-300 font-medium rounded-lg ${
                      item.isActive ? 'text-primary' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300 rounded-full ${
                          item.isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                        style={{ background: 'linear-gradient(90deg, #FF9100, #FF6B00)' }}
                      />
                    </span>
                    {item.hasDropdown && (
                      <ChevronRight className={`w-3.5 h-3.5 rotate-90 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-[270deg]' : ''}`} />
                    )}
                  </Link>

                  {item.hasDropdown && item.items && (
                    <div
                      className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                        activeDropdown === item.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div
                        className="w-72 p-2 rounded-2xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                      >
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="group/item flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:scale-110"
                              style={{ background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)', border: '1px solid rgba(255,145,0,0.2)' }}
                            >
                              <subItem.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white group-hover/item:text-primary transition-colors">{subItem.label}</div>
                              <div className="text-xs text-white/40 mt-0.5">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 group" aria-label="Search">
                <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </button>
              <Link href="/login">
                <Button variant="ghost" className="relative text-white/70 hover:text-white hover:bg-transparent font-medium h-10 px-4">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="relative text-black font-semibold h-11 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 4px 20px rgba(255,145,0,0.35)' }}
                >
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden"
          >
            <div className="mx-4 p-4 rounded-2xl border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.98) 0%, rgba(5,5,5,0.99) 100%)', backdropFilter: 'blur(20px)' }}>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl transition-colors ${item.isActive ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <Link href="/login" className="block w-full px-4 py-3 text-center rounded-xl text-white/70 hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="block w-full px-4 py-3 text-center rounded-xl text-black font-semibold" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Article Card Component
function ArticleCard({ article, categoryId, index }: { article: typeof categoryData['getting-started']['articles'][0]; categoryId: string; index: number }) {
  const difficultyColors = {
    beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/docs/${categoryId}/${article.slug}`}>
        <div className="relative h-full p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
          {/* Glow effect */}
          <div className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(255, 145, 0, 0.08) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${difficultyColors[article.difficulty]}`}>
                {article.difficulty}
              </span>
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              {article.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs text-white/40 bg-white/[0.03] rounded-md border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-xs text-white/30">Updated {article.updatedAt}</span>
              <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                <span className="text-sm font-medium">Read article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Footer Component
function Footer() {
  const columns = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}>
                <Store className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Rendrix</span>
            </Link>
            <p className="text-sm text-white/40">The complete commerce platform.</p>
          </div>

          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] text-center text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} Rendrix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function DocsCategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const category = categoryData[categoryId];
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // If category not found, show a not found state
  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-white/50 mb-8">The documentation category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/docs">
            <Button className="bg-primary text-black font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Documentation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sort articles
  const sortedArticles = [...category.articles].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  // Filter articles
  const filteredArticles = filterDifficulty === 'all'
    ? sortedArticles
    : sortedArticles.filter(a => a.difficulty === filterDifficulty);

  const CategoryIcon = category.icon;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-primary/[0.08] rounded-full blur-[150px]"
        />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(255,145,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.4) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
      </div>

      <SharedHeader activeNav="resources" />

      <main className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Documentation</h3>
                <nav className="space-y-1">
                  {allCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = cat.id === categoryId;
                    return (
                      <Link
                        key={cat.id}
                        href={`/docs/${cat.id}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{cat.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative p-8 rounded-3xl border border-white/[0.06] bg-gradient-to-br ${category.color} mb-8 overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(255,145,0,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center">
                    <CategoryIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{category.title}</h1>
                    <p className="text-lg text-white/60 leading-relaxed max-w-2xl">{category.description}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> {category.articles.length} articles
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Filters & View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <Filter className="w-4 h-4 text-white/40" />
                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      className="bg-transparent text-sm text-white/70 focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-black">All Levels</option>
                      <option value="beginner" className="bg-black">Beginner</option>
                      <option value="intermediate" className="bg-black">Intermediate</option>
                      <option value="advanced" className="bg-black">Advanced</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <SortAsc className="w-4 h-4 text-white/40" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'recent' | 'title')}
                      className="bg-transparent text-sm text-white/70 focus:outline-none cursor-pointer"
                    >
                      <option value="recent" className="bg-black">Most Recent</option>
                      <option value="title" className="bg-black">Alphabetical</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Articles Grid/List */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {filteredArticles.map((article, index) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    categoryId={categoryId}
                    index={index}
                  />
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-white/50">No articles found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}

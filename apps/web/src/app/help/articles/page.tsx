'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Rocket,
  CreditCard,
  Store,
  ShoppingCart,
  Brain,
  Plug,
  Shield,
  Code,
  ArrowRight,
  ArrowLeft,
  Clock,
  Eye,
  BookOpen,
  Filter,
  ChevronDown,
  Zap,
  TrendingUp,
  Calendar,
  X,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Layers,
} from 'lucide-react';

// Category configuration
const categories = [
  { id: 'all', label: 'All Articles', icon: Layers, color: 'from-white/20 to-white/10' },
  { id: 'getting-started', label: 'Getting Started', icon: Rocket, color: 'from-blue-500 to-blue-600' },
  { id: 'account-billing', label: 'Account & Billing', icon: CreditCard, color: 'from-emerald-500 to-emerald-600' },
  { id: 'stores-products', label: 'Stores & Products', icon: Store, color: 'from-primary to-orange-600' },
  { id: 'orders-payments', label: 'Orders & Payments', icon: ShoppingCart, color: 'from-purple-500 to-purple-600' },
  { id: 'ai-features', label: 'AI Features', icon: Brain, color: 'from-cyan-500 to-cyan-600' },
  { id: 'integrations', label: 'Integrations', icon: Plug, color: 'from-pink-500 to-pink-600' },
  { id: 'security', label: 'Security', icon: Shield, color: 'from-teal-500 to-teal-600' },
  { id: 'api-developers', label: 'API & Developers', icon: Code, color: 'from-amber-500 to-amber-600' },
];

const categoryColors: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  'getting-started': { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.15)', border: 'border-blue-500/20' },
  'account-billing': { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.15)', border: 'border-emerald-500/20' },
  'stores-products': { bg: 'from-primary/20 to-orange-600/10', text: 'text-primary', glow: 'rgba(255, 145, 0, 0.15)', border: 'border-primary/20' },
  'orders-payments': { bg: 'from-purple-500/20 to-purple-600/10', text: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.15)', border: 'border-purple-500/20' },
  'ai-features': { bg: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.15)', border: 'border-cyan-500/20' },
  'integrations': { bg: 'from-pink-500/20 to-pink-600/10', text: 'text-pink-400', glow: 'rgba(236, 72, 153, 0.15)', border: 'border-pink-500/20' },
  'security': { bg: 'from-teal-500/20 to-teal-600/10', text: 'text-teal-400', glow: 'rgba(20, 184, 166, 0.15)', border: 'border-teal-500/20' },
  'api-developers': { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.15)', border: 'border-amber-500/20' },
};

// Comprehensive article data for Rendrix
const allArticles = [
  // Getting Started
  { slug: 'create-first-store', title: 'How to create your first online store in 5 minutes', excerpt: 'Learn the step-by-step process to launch your first Rendrix store, from signing up to publishing your storefront.', category: 'getting-started', views: 15420, readTime: 5, trending: true, date: '2025-01-15' },
  { slug: 'connecting-custom-domain', title: 'Connecting your custom domain to your store', excerpt: 'Configure your own domain name for a professional storefront. Includes DNS setup and SSL certificate automation.', category: 'getting-started', views: 7620, readTime: 3, trending: false, date: '2025-01-12' },
  { slug: 'store-settings-overview', title: 'Understanding your store settings and preferences', excerpt: 'A comprehensive guide to all store configuration options including localization, currencies, and notifications.', category: 'getting-started', views: 5430, readTime: 7, trending: false, date: '2025-01-10' },
  { slug: 'choosing-theme', title: 'Choosing and customizing your store theme', excerpt: 'Browse our theme library and learn how to customize colors, fonts, and layouts to match your brand.', category: 'getting-started', views: 8920, readTime: 6, trending: true, date: '2025-01-08' },
  { slug: 'first-product-guide', title: 'Adding your first product: A complete guide', excerpt: 'Everything you need to know about creating product listings, including images, variants, and pricing.', category: 'getting-started', views: 12100, readTime: 8, trending: true, date: '2025-01-05' },
  { slug: 'navigation-dashboard', title: 'Navigating the Rendrix dashboard', excerpt: 'Get familiar with the dashboard layout, quick actions, and keyboard shortcuts for efficient store management.', category: 'getting-started', views: 4200, readTime: 4, trending: false, date: '2025-01-03' },

  // Account & Billing
  { slug: 'subscription-plans', title: 'Understanding Rendrix subscription plans', excerpt: 'Compare our Starter, Growth, and Enterprise plans to find the perfect fit for your business needs.', category: 'account-billing', views: 6780, readTime: 5, trending: false, date: '2025-01-14' },
  { slug: 'update-payment-method', title: 'How to update your payment method', excerpt: 'Manage your billing information, add new cards, and set up automatic payments securely.', category: 'account-billing', views: 3450, readTime: 2, trending: false, date: '2025-01-11' },
  { slug: 'download-invoices', title: 'Downloading and managing invoices', excerpt: 'Access your billing history, download PDF invoices, and set up automatic invoice emails.', category: 'account-billing', views: 2890, readTime: 3, trending: false, date: '2025-01-09' },
  { slug: 'upgrade-downgrade-plan', title: 'Upgrading or downgrading your plan', excerpt: 'Learn how plan changes work, including prorated billing and feature access during transitions.', category: 'account-billing', views: 4120, readTime: 4, trending: false, date: '2025-01-07' },
  { slug: 'team-members-permissions', title: 'Adding team members and setting permissions', excerpt: 'Invite collaborators to your organization and configure role-based access controls.', category: 'account-billing', views: 5670, readTime: 6, trending: true, date: '2025-01-04' },

  // Stores & Products
  { slug: 'inventory-management', title: 'Managing inventory and stock levels effectively', excerpt: 'Set up stock tracking, low-stock alerts, and automatic inventory sync across multiple sales channels.', category: 'stores-products', views: 9870, readTime: 6, trending: false, date: '2025-01-16' },
  { slug: 'product-variants', title: 'Creating and managing product variants', excerpt: 'Add size, color, and custom options to your products with variant-specific pricing and inventory.', category: 'stores-products', views: 7340, readTime: 5, trending: true, date: '2025-01-13' },
  { slug: 'bulk-product-import', title: 'Bulk importing products via CSV', excerpt: 'Save time by uploading hundreds of products at once using our CSV import tool and templates.', category: 'stores-products', views: 6210, readTime: 7, trending: false, date: '2025-01-10' },
  { slug: 'product-categories', title: 'Organizing products with categories and collections', excerpt: 'Create logical product groupings for better navigation and targeted marketing campaigns.', category: 'stores-products', views: 5890, readTime: 4, trending: false, date: '2025-01-08' },
  { slug: 'product-seo', title: 'Optimizing products for search engines', excerpt: 'Best practices for product titles, descriptions, and meta tags to improve organic traffic.', category: 'stores-products', views: 8450, readTime: 8, trending: true, date: '2025-01-06' },
  { slug: 'analytics-dashboard', title: 'Understanding your analytics dashboard', excerpt: 'Deep dive into sales metrics, visitor analytics, and conversion tracking to grow your business.', category: 'stores-products', views: 6890, readTime: 7, trending: false, date: '2025-01-02' },
  { slug: 'digital-products', title: 'Selling digital products and downloads', excerpt: 'Configure digital product delivery, download limits, and license key generation.', category: 'stores-products', views: 4560, readTime: 5, trending: false, date: '2024-12-28' },

  // Orders & Payments
  { slug: 'stripe-paypal-setup', title: 'Setting up Stripe and PayPal payment gateways', excerpt: 'Connect your payment processors to start accepting credit cards, digital wallets, and more.', category: 'orders-payments', views: 12350, readTime: 8, trending: true, date: '2025-01-17' },
  { slug: 'order-fulfillment', title: 'Processing and fulfilling orders', excerpt: 'Learn the complete order workflow from receipt to shipment, including packing slips and labels.', category: 'orders-payments', views: 8760, readTime: 6, trending: true, date: '2025-01-15' },
  { slug: 'refunds-returns', title: 'Handling refunds and returns', excerpt: 'Set up your return policy, process refunds, and manage customer disputes efficiently.', category: 'orders-payments', views: 6540, readTime: 5, trending: false, date: '2025-01-12' },
  { slug: 'shipping-rates', title: 'Configuring shipping rates and zones', excerpt: 'Set up flat-rate, weight-based, or carrier-calculated shipping for domestic and international orders.', category: 'orders-payments', views: 7890, readTime: 7, trending: true, date: '2025-01-09' },
  { slug: 'tax-configuration', title: 'Setting up taxes and tax exemptions', excerpt: 'Configure automatic tax calculation, VAT handling, and tax-exempt customer groups.', category: 'orders-payments', views: 5430, readTime: 6, trending: false, date: '2025-01-06' },
  { slug: 'abandoned-cart-recovery', title: 'Recovering abandoned carts with email automation', excerpt: 'Set up automated email sequences to recover lost sales and increase conversion rates.', category: 'orders-payments', views: 9120, readTime: 5, trending: true, date: '2025-01-03' },

  // AI Features
  { slug: 'ai-product-descriptions', title: 'Using AI to generate product descriptions', excerpt: 'Leverage our AI writing assistant to create compelling, SEO-optimized product descriptions in seconds.', category: 'ai-features', views: 8540, readTime: 4, trending: true, date: '2025-01-18' },
  { slug: 'ai-image-enhancement', title: 'AI-powered image enhancement and backgrounds', excerpt: 'Automatically improve product photos, remove backgrounds, and create consistent imagery.', category: 'ai-features', views: 6780, readTime: 5, trending: true, date: '2025-01-14' },
  { slug: 'smart-recommendations', title: 'Setting up AI product recommendations', excerpt: 'Enable personalized product suggestions to increase average order value and customer engagement.', category: 'ai-features', views: 5430, readTime: 6, trending: false, date: '2025-01-11' },
  { slug: 'ai-chatbot', title: 'Configuring the AI customer service chatbot', excerpt: 'Deploy an intelligent chatbot to handle common customer queries 24/7 without human intervention.', category: 'ai-features', views: 7210, readTime: 7, trending: true, date: '2025-01-08' },
  { slug: 'predictive-analytics', title: 'Using AI for sales forecasting', excerpt: 'Leverage machine learning to predict demand, optimize inventory, and plan promotions.', category: 'ai-features', views: 4890, readTime: 8, trending: false, date: '2025-01-04' },

  // Integrations
  { slug: 'google-analytics', title: 'Connecting Google Analytics 4', excerpt: 'Set up enhanced ecommerce tracking and conversion goals for comprehensive analytics.', category: 'integrations', views: 6540, readTime: 5, trending: true, date: '2025-01-16' },
  { slug: 'facebook-instagram-shop', title: 'Setting up Facebook and Instagram Shop', excerpt: 'Sync your product catalog with Meta platforms to sell directly on social media.', category: 'integrations', views: 8920, readTime: 7, trending: true, date: '2025-01-13' },
  { slug: 'mailchimp-integration', title: 'Integrating with Mailchimp for email marketing', excerpt: 'Sync customer data and automate email campaigns based on purchase behavior.', category: 'integrations', views: 5670, readTime: 4, trending: false, date: '2025-01-10' },
  { slug: 'quickbooks-sync', title: 'Syncing with QuickBooks for accounting', excerpt: 'Automatically export sales, taxes, and expenses to your accounting software.', category: 'integrations', views: 4320, readTime: 6, trending: false, date: '2025-01-07' },
  { slug: 'zapier-automations', title: 'Creating automations with Zapier', excerpt: 'Connect Rendrix to 5,000+ apps with no-code automation workflows.', category: 'integrations', views: 7890, readTime: 8, trending: true, date: '2025-01-03' },

  // Security
  { slug: 'two-factor-auth', title: 'Enabling two-factor authentication', excerpt: 'Add an extra layer of security to your account with TOTP or SMS verification.', category: 'security', views: 4560, readTime: 3, trending: false, date: '2025-01-15' },
  { slug: 'ssl-certificates', title: 'Understanding SSL certificates and HTTPS', excerpt: 'Learn how Rendrix automatically secures your store with SSL and ensures PCI compliance.', category: 'security', views: 3890, readTime: 4, trending: false, date: '2025-01-12' },
  { slug: 'gdpr-compliance', title: 'GDPR compliance and data privacy', excerpt: 'Configure cookie consent, data export, and right-to-deletion features for EU compliance.', category: 'security', views: 5670, readTime: 6, trending: true, date: '2025-01-09' },
  { slug: 'fraud-prevention', title: 'Setting up fraud prevention rules', excerpt: 'Protect your store from fraudulent orders with address verification and risk scoring.', category: 'security', views: 6210, readTime: 5, trending: true, date: '2025-01-05' },
  { slug: 'access-logs', title: 'Reviewing account access logs', excerpt: 'Monitor login activity, API usage, and identify suspicious account behavior.', category: 'security', views: 2340, readTime: 3, trending: false, date: '2025-01-01' },

  // API & Developers
  { slug: 'api-quickstart', title: 'API quickstart guide', excerpt: 'Get up and running with the Rendrix API in minutes with authentication and your first request.', category: 'api-developers', views: 7890, readTime: 6, trending: true, date: '2025-01-17' },
  { slug: 'webhooks-setup', title: 'Setting up webhooks for real-time events', excerpt: 'Configure webhooks to receive instant notifications when orders, products, or customers change.', category: 'api-developers', views: 6540, readTime: 7, trending: true, date: '2025-01-14' },
  { slug: 'api-authentication', title: 'API authentication and API keys', excerpt: 'Understand OAuth 2.0, API keys, and best practices for secure API integration.', category: 'api-developers', views: 5430, readTime: 5, trending: false, date: '2025-01-11' },
  { slug: 'graphql-api', title: 'Using the GraphQL API', excerpt: 'Query exactly the data you need with our flexible GraphQL endpoint and schema explorer.', category: 'api-developers', views: 4890, readTime: 8, trending: false, date: '2025-01-08' },
  { slug: 'sdk-libraries', title: 'Official SDK libraries and code samples', excerpt: 'Download SDKs for JavaScript, Python, PHP, and Ruby with comprehensive documentation.', category: 'api-developers', views: 5670, readTime: 4, trending: false, date: '2025-01-04' },
  { slug: 'rate-limits', title: 'Understanding API rate limits', excerpt: 'Learn about request quotas, burst limits, and strategies for efficient API usage.', category: 'api-developers', views: 3210, readTime: 3, trending: false, date: '2024-12-30' },
];

// Sort options
const sortOptions = [
  { id: 'popular', label: 'Most Popular', icon: TrendingUp },
  { id: 'recent', label: 'Most Recent', icon: Calendar },
  { id: 'trending', label: 'Trending', icon: Zap },
];

// Article Card Component
function ArticleCard({ article, index }: { article: typeof allArticles[0]; index: number }) {
  const colors = categoryColors[article.category] || categoryColors['getting-started'];
  const category = categories.find(c => c.id === article.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <Link href={`/help/articles/${article.slug}`}>
        {/* Hover gradient border */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors.glow.replace('0.15', '0.5')} 0%, transparent 50%, ${colors.glow.replace('0.15', '0.3')} 100%)`,
          }}
        />

        {/* Card */}
        <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 group-hover:border-transparent group-hover:bg-white/[0.04]">
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Glow effect */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle, ${colors.glow.replace('0.15', '1')} 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-6">
            {/* Top row - badges */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${colors.text} rounded-lg border ${colors.border} bg-white/[0.03] backdrop-blur-sm`}>
                {category && <category.icon className="w-3 h-3" />}
                {article.category.replace('-', ' ')}
              </span>

              {article.trending && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,107,0,0.1) 100%)',
                    border: '1px solid rgba(255,145,0,0.3)',
                  }}
                >
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-primary">Trending</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 leading-snug group-hover:text-white transition-colors line-clamp-2">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-white/50 mb-4 line-clamp-2 flex-grow">
              {article.excerpt}
            </p>

            {/* Bottom meta */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Eye className="w-3.5 h-3.5" />
                {article.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min
              </span>

              {/* Arrow indicator */}
              <ArrowRight className={`w-4 h-4 ml-auto ${colors.text} opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Category Filter Button
function CategoryButton({
  category,
  isActive,
  onClick,
}: {
  category: typeof categories[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = category.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'text-black'
          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {category.label}
      </span>
    </motion.button>
  );
}

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = [...allArticles];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((article) => article.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'trending':
        result = result.filter((a) => a.trending).concat(result.filter((a) => !a.trending));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const currentSort = sortOptions.find((s) => s.id === sortBy);
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-sm font-bold text-black">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Rendrix</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            <Link href="/help" className="text-sm text-primary">Resources</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/40 mb-8"
          >
            <Link href="/help" className="hover:text-white transition-colors flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </Link>
            <span>/</span>
            <span className="text-white/60">All Articles</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            {/* Left side - Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
                  border: '1px solid rgba(255,145,0,0.2)',
                }}
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Knowledge Base</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Help{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 100%)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  Articles
                </span>
              </h1>
              <p className="text-lg text-white/50 max-w-md">
                Browse our comprehensive collection of guides, tutorials, and documentation.
              </p>
            </motion.div>

            {/* Right side - Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:w-auto lg:min-w-[400px]"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </motion.div>

          {/* Results bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between py-4 border-y border-white/[0.06]"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/50">
                <span className="text-white font-medium">{filteredArticles.length}</span> articles
                {selectedCategory !== 'all' && (
                  <> in <span className="text-white">{currentCategory?.label}</span></>
                )}
                {searchQuery && (
                  <> matching &quot;<span className="text-primary">{searchQuery}</span>&quot;</>
                )}
              </span>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-sm"
              >
                {currentSort && <currentSort.icon className="w-4 h-4 text-primary" />}
                <span className="text-white/70">{currentSort?.label}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.id
                            ? 'text-primary bg-primary/10'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                        {sortBy === option.id && <CheckCircle className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.slug} article={article} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-white/50 mb-6">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-medium rounded-xl hover:bg-primary/90 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Back to Help Center CTA */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Can&apos;t find what you need?
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Browse by category or contact our support team for personalized assistance.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Help Center
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-orange-500 text-black font-semibold rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-xs font-bold text-black">R</span>
            </div>
            <span className="text-sm text-white/60">© 2025 Rendrix. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link>
            <Link href="/about" className="text-sm text-white/40 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

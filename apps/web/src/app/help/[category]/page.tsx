'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  ChevronDown,
  Zap,
  TrendingUp,
  Calendar,
  HelpCircle,
  Sparkles,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { SharedHeader } from '@/components/landing/shared-header';
import { SharedFooter } from '@/components/landing/shared-footer';

// Category configuration with Rendrix brand colors
const categoryConfig: Record<string, {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
}> = {
  'getting-started': {
    icon: Rocket,
    label: 'Getting Started',
    description: 'New to Rendrix? Learn the basics and set up your first store in minutes with our comprehensive guides.',
    color: 'from-primary to-orange-600',
    bgGradient: 'from-primary/20 via-orange-500/10 to-amber-500/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'account-billing': {
    icon: CreditCard,
    label: 'Account & Billing',
    description: 'Manage your account settings, subscriptions, invoices, and payment methods with ease.',
    color: 'from-primary to-amber-500',
    bgGradient: 'from-primary/18 via-amber-500/10 to-orange-500/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'stores-products': {
    icon: Store,
    label: 'Stores & Products',
    description: 'Create stores, manage products, set up categories, and organize your entire product catalog.',
    color: 'from-orange-500 to-primary',
    bgGradient: 'from-orange-500/20 via-primary/12 to-amber-500/5',
    glowColor: 'rgba(255, 145, 0, 0.4)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'orders-payments': {
    icon: ShoppingCart,
    label: 'Orders & Payments',
    description: 'Process orders, handle refunds, configure payment gateways, and streamline your operations.',
    color: 'from-primary to-orange-500',
    bgGradient: 'from-primary/22 via-orange-400/10 to-amber-400/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'ai-features': {
    icon: Brain,
    label: 'AI Features',
    description: 'Leverage AI-powered tools for product descriptions, analytics, automation, and smart recommendations.',
    color: 'from-amber-500 to-primary',
    bgGradient: 'from-amber-500/18 via-primary/12 to-orange-500/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'integrations': {
    icon: Plug,
    label: 'Integrations',
    description: 'Connect with third-party apps, marketplaces, shipping carriers, and extend your store capabilities.',
    color: 'from-primary to-amber-400',
    bgGradient: 'from-primary/20 via-amber-400/10 to-orange-400/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'security': {
    icon: Shield,
    label: 'Security & Compliance',
    description: 'Learn about security features, GDPR compliance, data protection, and keeping your store safe.',
    color: 'from-orange-600 to-primary',
    bgGradient: 'from-orange-600/18 via-primary/12 to-amber-500/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
  'api-developers': {
    icon: Code,
    label: 'API & Developers',
    description: 'API documentation, webhooks, SDK guides, and comprehensive developer resources.',
    color: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-500/20 via-orange-500/12 to-primary/5',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
  },
};

// All categories for sidebar navigation
const allCategories = [
  { id: 'getting-started', icon: Rocket, label: 'Getting Started', count: 24 },
  { id: 'account-billing', icon: CreditCard, label: 'Account & Billing', count: 18 },
  { id: 'stores-products', icon: Store, label: 'Stores & Products', count: 42 },
  { id: 'orders-payments', icon: ShoppingCart, label: 'Orders & Payments', count: 35 },
  { id: 'ai-features', icon: Brain, label: 'AI Features', count: 15 },
  { id: 'integrations', icon: Plug, label: 'Integrations', count: 28 },
  { id: 'security', icon: Shield, label: 'Security & Compliance', count: 12 },
  { id: 'api-developers', icon: Code, label: 'API & Developers', count: 45 },
];

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

// Article Card Component with enhanced hover effects
function ArticleCard({ article, index }: { article: typeof allArticles[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative"
    >
      <Link href={`/help/articles/${article.slug}`}>
        {/* Outer glow effect on hover */}
        <div
          className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 145, 0, 0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Animated gradient border */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 50%, #FFB84D 100%)',
          }}
        />

        {/* Card */}
        <div
          className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:border-transparent"
          style={{
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)',
          }}
        >
          {/* Gradient background fill on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 145, 0, 0.12) 0%, rgba(255, 107, 0, 0.08) 50%, rgba(255, 184, 77, 0.04) 100%)',
            }}
          />

          {/* Top-right glow orb */}
          <div
            className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, rgba(255, 145, 0, 0.4) 0%, transparent 70%)',
              filter: 'blur(25px)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-6">
            {/* Top row - badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary rounded-lg border border-primary/25 bg-primary/[0.08] backdrop-blur-sm group-hover:border-primary/40 group-hover:bg-primary/[0.12] transition-all duration-300">
                <BookOpen className="w-3 h-3" />
                {article.category.replace(/-/g, ' ')}
              </span>

              {article.trending && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,145,0,0.25) 0%, rgba(255,107,0,0.15) 100%)',
                    border: '1px solid rgba(255,145,0,0.4)',
                  }}
                >
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-primary">Trending</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 leading-snug transition-colors line-clamp-2">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-white/50 mb-4 line-clamp-2 flex-grow group-hover:text-white/60 transition-colors">
              {article.excerpt}
            </p>

            {/* Bottom meta */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06] group-hover:border-white/[0.1] transition-colors">
              <span className="flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                {article.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min
              </span>

              {/* Arrow indicator */}
              <div className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <span className="text-xs text-primary font-medium">Read</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Featured Article Card (larger, for first article) with enhanced hover effects
function FeaturedArticleCard({ article }: { article: typeof allArticles[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group relative col-span-full lg:col-span-2"
    >
      <Link href={`/help/articles/${article.slug}`} className="block h-full">
        {/* Outer glow effect */}
        <div
          className="absolute -inset-4 rounded-[32px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 145, 0, 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Animated gradient border */}
        <div
          className="absolute -inset-[2px] rounded-3xl opacity-60 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 50%, #FFB84D 100%)',
          }}
        />

        {/* Main card */}
        <div
          className="relative h-full min-h-[320px] overflow-hidden rounded-3xl border-0 backdrop-blur-xl transition-all duration-500"
          style={{
            background: 'linear-gradient(145deg, rgba(40, 25, 5, 0.95) 0%, rgba(30, 20, 5, 0.98) 50%, rgba(25, 15, 5, 1) 100%)',
          }}
        >
          {/* Warm gradient overlay */}
          <div
            className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.15) 0%, rgba(255, 107, 0, 0.1) 30%, rgba(255, 184, 77, 0.05) 60%, transparent 100%)',
            }}
          />

          {/* Top-right glow orb */}
          <div
            className="absolute top-0 right-0 w-[350px] h-[350px] opacity-40 group-hover:opacity-70 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at 100% 0%, rgba(255,145,0,0.35) 0%, rgba(255, 107, 0, 0.15) 40%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          {/* Bottom-left glow orb */}
          <div
            className="absolute bottom-0 left-0 w-[200px] h-[200px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at 0% 100%, rgba(255,184,77,0.3) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Mesh gradient pattern */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-700">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at 20% 30%, rgba(255,145,0,0.5) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 70%, rgba(255,107,0,0.4) 0%, transparent 50%),
                  radial-gradient(ellipse at 60% 20%, rgba(255,184,77,0.3) 0%, transparent 40%)
                `,
              }}
            />
          </div>

          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-8">
            {/* Top badges row */}
            <div className="flex items-center justify-between mb-auto">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full backdrop-blur-md border border-primary/30 group-hover:border-primary/50 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.2) 0%, rgba(255, 145, 0, 0.08) 100%)',
                }}
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-white/80">Featured Guide</span>
              </span>

              {article.trending && (
                <div className="relative">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                      boxShadow: '0 4px 20px rgba(255,145,0,0.4)',
                    }}
                  >
                    <Zap className="w-4 h-4 text-black" />
                    <span className="text-black">Trending</span>
                  </span>
                </div>
              )}
            </div>

            {/* Title & description area */}
            <div className="mt-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight transition-all duration-500 text-white group-hover:text-primary/90">
                {article.title}
              </h3>

              <p className="text-white/50 mb-6 line-clamp-2 max-w-2xl group-hover:text-white/65 transition-colors duration-300">
                {article.excerpt}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/80 font-medium">{article.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/80 font-medium">{article.readTime} min read</span>
                </div>

                {/* Read arrow */}
                <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-sm font-semibold text-primary">Read article</span>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Category Sidebar Card with enhanced hover
function CategorySidebarCard({ category, isActive }: { category: typeof allCategories[0]; isActive: boolean }) {
  return (
    <Link href={`/help/${category.id}`}>
      <div className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-primary/15 border border-primary/40'
          : 'hover:bg-primary/[0.06] border border-transparent hover:border-primary/20'
      }`}>
        {/* Hover glow effect */}
        {!isActive && (
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at left center, rgba(255, 145, 0, 0.08) 0%, transparent 70%)',
            }}
          />
        )}
        <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/30'
            : 'bg-white/[0.05] group-hover:bg-primary/25 group-hover:shadow-md group-hover:shadow-primary/10'
        }`}>
          <category.icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-black' : 'text-white/60 group-hover:text-primary'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`block text-sm font-medium truncate transition-colors duration-300 ${isActive ? 'text-primary' : 'text-white/70 group-hover:text-white'}`}>
            {category.label}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          isActive ? 'bg-primary/20 text-primary' : 'bg-white/[0.05] text-white/40'
        }`}>
          {category.count}
        </span>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.category as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const category = categoryConfig[categoryId];
  const CategoryIcon = category?.icon || HelpCircle;

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let articles = allArticles.filter(a => a.category === categoryId);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        a => a.title.toLowerCase().includes(query) || a.excerpt.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        articles.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
        articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'trending':
        articles.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.views - a.views;
        });
        break;
    }

    return articles;
  }, [categoryId, searchQuery, sortBy]);

  // Get featured article (most viewed trending, or just most viewed)
  const featuredArticle = useMemo(() => {
    const trending = filteredArticles.filter(a => a.trending);
    if (trending.length > 0) {
      return trending.reduce((a, b) => a.views > b.views ? a : b);
    }
    return filteredArticles[0];
  }, [filteredArticles]);

  // Get remaining articles
  const remainingArticles = useMemo(() => {
    return filteredArticles.filter(a => a.slug !== featuredArticle?.slug);
  }, [filteredArticles, featuredArticle]);

  // 404 state
  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-white/30" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Category not found</h1>
          <p className="text-white/50 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Help Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ backgroundColor: category.glowColor }}
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: 'rgba(255, 145, 0, 0.1)' }}
        />
      </div>

      {/* Navigation */}
      <SharedHeader activeNav="resources" />

      {/* Hero Header */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Dynamic gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient}`} />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-32 right-[15%] w-16 h-16 border border-primary/[0.08] rounded-2xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-24 left-[10%] w-3 h-3 bg-primary/30 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main content */}
            <div className="lg:col-span-9 pt-8">
              {/* Breadcrumb */}
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-sm mb-8 flex-wrap"
              >
                <Link href="/help" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-all duration-300 group">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>Help Center</span>
                </Link>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-4 h-px bg-gradient-to-r from-white/20 to-transparent"
                />
                <span className="text-white/60">{category.label}</span>
              </motion.nav>

              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mb-6"
              >
                <div className="relative group inline-block">
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <span className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${category.color} text-white text-sm font-semibold shadow-lg`}>
                    <CategoryIcon className="w-4 h-4" />
                    {category.label}
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
              >
                {category.label}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl text-white/50 font-light leading-relaxed max-w-3xl mb-10"
              >
                {category.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/60 font-medium">
                    {filteredArticles.length} articles
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/60 font-medium">
                    {filteredArticles.filter(a => a.trending).length} trending
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Large floating icon */}
            <div className="hidden lg:flex lg:col-span-3 justify-center items-start pt-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
                className="relative"
              >
                {/* Glow rings */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-3xl"
                  style={{ boxShadow: `0 0 80px 40px ${category.glowColor}` }}
                />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${category.color} p-0.5 shadow-2xl`}>
                    <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-black/20 to-transparent flex items-center justify-center backdrop-blur-sm">
                      <CategoryIcon className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Decorative accents */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-3 -right-3 w-6 h-6 rounded-lg border border-primary/20 bg-primary/[0.05]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gradient separator */}
        <div className="relative mt-12">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            style={{ transformOrigin: 'center' }}
          />
          <div className="h-8 bg-gradient-to-b from-transparent to-black" />
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in this category..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </motion.div>

                {/* Categories */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                      <Grid3X3 className="w-3 h-3 text-primary" />
                    </div>
                    All Categories
                  </h4>
                  <div className="space-y-1">
                    {allCategories.map((cat) => (
                      <CategorySidebarCard
                        key={cat.id}
                        category={cat}
                        isActive={cat.id === categoryId}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Need Help */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6"
                >
                  <h4 className="text-sm font-semibold text-white mb-2">Need more help?</h4>
                  <p className="text-sm text-white/50 mb-4">Our support team is available 24/7.</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Contact Support
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              </div>
            </aside>

            {/* Articles Grid */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              {/* Sort Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between mb-8"
              >
                <p className="text-white/50 text-sm">
                  Showing <span className="text-white font-medium">{filteredArticles.length}</span> articles
                </p>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/70 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm">{sortOptions.find(s => s.id === sortBy)?.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.08] bg-black/90 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                              sortBy === option.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Articles Grid */}
              {filteredArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
                  <p className="text-white/50">Try adjusting your search or browse other categories.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Featured Article */}
                  {featuredArticle && !searchQuery && (
                    <FeaturedArticleCard article={featuredArticle} />
                  )}

                  {/* Regular Articles */}
                  {(searchQuery ? filteredArticles : remainingArticles).map((article, index) => (
                    <ArticleCard key={article.slug} article={article} index={index} />
                  ))}
                </div>
              )}

              {/* View All Articles Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <Link
                  href="/help/articles"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 group"
                >
                  <span className="text-white/70 group-hover:text-white transition-colors">View all articles</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    }}
                  >
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SharedFooter />
    </div>
  );
}

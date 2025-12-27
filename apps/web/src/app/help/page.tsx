'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
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
  Clock,
  Eye,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
  CheckCircle,
  Headphones,
  Zap,
  FileText,
  Video,
  Users,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; glow: string; border: string; iconBg: string }> = {
  'getting-started': { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.15)', border: 'border-blue-500/20', iconBg: 'from-blue-500 to-blue-600' },
  'account-billing': { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.15)', border: 'border-emerald-500/20', iconBg: 'from-emerald-500 to-emerald-600' },
  'stores-products': { bg: 'from-primary/20 to-orange-600/10', text: 'text-primary', glow: 'rgba(255, 145, 0, 0.15)', border: 'border-primary/20', iconBg: 'from-primary to-orange-600' },
  'orders-payments': { bg: 'from-purple-500/20 to-purple-600/10', text: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.15)', border: 'border-purple-500/20', iconBg: 'from-purple-500 to-purple-600' },
  'ai-features': { bg: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.15)', border: 'border-cyan-500/20', iconBg: 'from-cyan-500 to-cyan-600' },
  'integrations': { bg: 'from-pink-500/20 to-pink-600/10', text: 'text-pink-400', glow: 'rgba(236, 72, 153, 0.15)', border: 'border-pink-500/20', iconBg: 'from-pink-500 to-pink-600' },
  'security': { bg: 'from-teal-500/20 to-teal-600/10', text: 'text-teal-400', glow: 'rgba(20, 184, 166, 0.15)', border: 'border-teal-500/20', iconBg: 'from-teal-500 to-teal-600' },
  'api-developers': { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.15)', border: 'border-amber-500/20', iconBg: 'from-amber-500 to-amber-600' },
};

// Help category type
interface HelpCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  articleCount: number;
  popular?: string[];
}

// Article type
interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
  readTime: number;
  trending?: boolean;
}

// FAQ type
interface FAQ {
  question: string;
  answer: string;
}

// Search bar component with animated glow
function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative max-w-2xl mx-auto"
    >
      {/* Animated glow */}
      <motion.div
        animate={{
          opacity: isFocused ? 0.6 : 0.2,
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-orange-500/30 to-primary/50 rounded-2xl blur-xl"
      />

      {/* Search input container */}
      <div className={`relative flex items-center bg-white/[0.03] backdrop-blur-xl border ${isFocused ? 'border-primary/50' : 'border-white/10'} rounded-2xl transition-all duration-300`}>
        <Search className={`w-5 h-5 ml-5 ${isFocused ? 'text-primary' : 'text-white/40'} transition-colors`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for help articles, tutorials, guides..."
          className="flex-1 bg-transparent px-4 py-5 text-white placeholder:text-white/40 focus:outline-none text-lg"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mr-3 px-4 py-2 bg-primary text-black font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Search
          </motion.button>
        )}
      </div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-2 mt-4"
      >
        <span className="text-white/40 text-sm">Popular:</span>
        {['Getting started', 'Payment setup', 'API keys', 'Custom domains'].map((term) => (
          <button
            key={term}
            className="px-3 py-1 text-sm text-white/60 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-all"
          >
            {term}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Category card component
function CategoryCard({ category, index }: { category: HelpCategory; index: number }) {
  const colors = categoryColors[category.id] || categoryColors['getting-started'];
  const Icon = category.icon;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <Link href={`/help/${category.id}`}>
        <div
          className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-white/[0.02] backdrop-blur-sm h-full`}
          style={{ boxShadow: `0 0 40px ${colors.glow}` }}
        >
          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Hover gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-white/50 mb-4 line-clamp-2">
              {category.description}
            </p>

            {/* Article count & Arrow */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${colors.text}`}>
                {category.articleCount} articles
              </span>
              <ArrowRight className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Popular article card
function ArticleCard({ article, index }: { article: Article; index: number }) {
  const colors = categoryColors[article.category] || categoryColors['getting-started'];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/help/articles/${article.id}`}>
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all duration-300">
          {/* Trending badge */}
          {article.trending && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                <Zap className="w-3 h-3" />
                Trending
              </span>
            </div>
          )}

          {/* Category badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${colors.text} bg-white/5 rounded-full mb-3`}>
            <BookOpen className="w-3 h-3" />
            {article.category.replace('-', ' ')}
          </span>

          {/* Title */}
          <h4 className="text-white font-medium mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h4>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min read
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// FAQ Accordion item
function FAQItem({ faq, index, isOpen, onToggle }: { faq: FAQ; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/[0.06] last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-white font-medium pr-8 group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full ${isOpen ? 'bg-primary/20' : 'bg-white/5'} flex items-center justify-center transition-colors`}
        >
          <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-primary' : 'text-white/60'}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/60 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Contact option card
function ContactCard({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  availability,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  actionLabel: string;
  availability: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center"
    >
      {/* Gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30"
      >
        <Icon className="w-8 h-8 text-black" />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/50 text-sm mb-4">{description}</p>

      {/* Availability */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-emerald-400">{availability}</span>
      </div>

      {/* Action */}
      <Link
        href={action}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 group/btn"
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

// Resource card for additional resources section
function ResourceCard({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
            {title}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-sm text-white/50 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function HelpCenterPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  // Help categories data
  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      icon: Rocket,
      title: 'Getting Started',
      description: 'New to Rendrix? Learn the basics and set up your first store in minutes.',
      articleCount: 24,
      popular: ['Quick start guide', 'First store setup'],
    },
    {
      id: 'account-billing',
      icon: CreditCard,
      title: 'Account & Billing',
      description: 'Manage your account settings, subscriptions, invoices, and payment methods.',
      articleCount: 18,
    },
    {
      id: 'stores-products',
      icon: Store,
      title: 'Stores & Products',
      description: 'Create stores, manage products, set up categories, and organize your catalog.',
      articleCount: 42,
    },
    {
      id: 'orders-payments',
      icon: ShoppingCart,
      title: 'Orders & Payments',
      description: 'Process orders, handle refunds, configure payment gateways, and more.',
      articleCount: 35,
    },
    {
      id: 'ai-features',
      icon: Brain,
      title: 'AI Features',
      description: 'Leverage AI-powered tools for product descriptions, analytics, and automation.',
      articleCount: 15,
    },
    {
      id: 'integrations',
      icon: Plug,
      title: 'Integrations',
      description: 'Connect with third-party apps, marketplaces, shipping carriers, and more.',
      articleCount: 28,
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Learn about security features, GDPR compliance, and data protection.',
      articleCount: 12,
    },
    {
      id: 'api-developers',
      icon: Code,
      title: 'API & Developers',
      description: 'API documentation, webhooks, SDK guides, and developer resources.',
      articleCount: 45,
    },
  ];

  // Popular articles data
  const popularArticles: Article[] = [
    { id: '1', title: 'How to create your first online store in 5 minutes', category: 'getting-started', views: 15420, readTime: 5, trending: true },
    { id: '2', title: 'Setting up Stripe and PayPal payment gateways', category: 'orders-payments', views: 12350, readTime: 8, trending: true },
    { id: '3', title: 'Managing inventory and stock levels effectively', category: 'stores-products', views: 9870, readTime: 6 },
    { id: '4', title: 'Using AI to generate product descriptions', category: 'ai-features', views: 8540, readTime: 4, trending: true },
    { id: '5', title: 'Connecting your custom domain to your store', category: 'getting-started', views: 7620, readTime: 3 },
    { id: '6', title: 'Understanding your analytics dashboard', category: 'stores-products', views: 6890, readTime: 7 },
  ];

  // FAQ data
  const faqs: FAQ[] = [
    {
      question: 'How do I get started with Rendrix?',
      answer: 'Getting started is easy! Simply sign up for a free account, complete the onboarding wizard, and you can have your first store live within minutes. Our step-by-step guide will walk you through setting up products, configuring payments, and customizing your storefront.',
    },
    {
      question: 'What payment methods does Rendrix support?',
      answer: 'Rendrix supports all major payment gateways including Stripe, PayPal, Square, and many more. You can accept credit cards, digital wallets (Apple Pay, Google Pay), bank transfers, and even cryptocurrency payments depending on your region and plan.',
    },
    {
      question: 'Can I use my own domain name?',
      answer: 'Yes! All paid plans include custom domain support. You can connect your existing domain or purchase a new one directly through Rendrix. We handle SSL certificates automatically to keep your store secure.',
    },
    {
      question: 'How does pricing work?',
      answer: 'Rendrix offers flexible pricing plans starting with a free tier for small stores. Paid plans are based on the number of products, monthly orders, and features you need. There are no transaction fees on any plan—you only pay your payment processor fees.',
    },
    {
      question: 'Is my data secure on Rendrix?',
      answer: 'Absolutely. We use bank-grade encryption (AES-256), are SOC 2 Type II certified, GDPR compliant, and PCI DSS compliant. Your data is stored in secure, redundant data centers with 99.99% uptime guarantee.',
    },
    {
      question: 'Can I migrate from another platform?',
      answer: 'Yes! We offer free migration assistance from Shopify, WooCommerce, BigCommerce, and other platforms. Our migration tool can import your products, customers, and order history with just a few clicks.',
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'We provide 24/7 support via live chat and email for all users. Business and Enterprise plans include priority phone support and a dedicated account manager. Our average response time is under 2 hours.',
    },
    {
      question: 'Are there any transaction fees?',
      answer: 'No! Unlike other platforms, Rendrix does not charge any transaction fees. You only pay the standard fees from your payment processor (like Stripe or PayPal). This can save you thousands of dollars as your business grows.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
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
            <Link href="/#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
            <Link href="/help" className="text-sm text-primary">Help Center</Link>
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
      <section className="relative pt-32 pb-20 px-6">
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-40 left-[10%] w-16 h-16 border border-primary/20 rounded-xl"
          />
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-60 right-[15%] w-12 h-12 border border-blue-500/20 rounded-full"
          />
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-40 left-[20%] w-8 h-8 bg-purple-500/10 rounded-lg"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-8"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">How can we</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              help you?
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 mb-10 max-w-2xl mx-auto"
          >
            Find answers, explore guides, and get the support you need to succeed with Rendrix.
          </motion.p>

          {/* Search Bar */}
          <SearchBar />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            {[
              { icon: Headphones, label: '24/7 Support', value: 'Always available' },
              { icon: Clock, label: 'Response Time', value: '< 2 hours' },
              { icon: CheckCircle, label: 'Satisfaction', value: '98% rating' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/40">{stat.label}</p>
                  <p className="text-sm font-medium text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Explore our comprehensive knowledge base organized by topic to find exactly what you need.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Articles Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Popular Articles
              </h2>
              <p className="text-white/50">Most viewed help articles this week</p>
            </div>
            <Link
              href="/help/articles"
              className="hidden md:flex items-center gap-2 text-primary hover:underline"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {popularArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-white/50">
              Quick answers to common questions about Rendrix
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10 px-6 md:px-8">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still need help?
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Our support team is here for you. Choose your preferred way to reach us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard
              icon={MessageCircle}
              title="Live Chat"
              description="Get instant help from our support team"
              action="#chat"
              actionLabel="Start Chat"
              availability="Available 24/7"
              delay={0}
            />
            <ContactCard
              icon={Mail}
              title="Email Support"
              description="Send us a detailed message"
              action="mailto:support@rendrix.com"
              actionLabel="Send Email"
              availability="Response in < 2 hours"
              delay={0.1}
            />
            <ContactCard
              icon={Phone}
              title="Phone Support"
              description="Talk to a support specialist"
              action="tel:+1-800-RENDRIX"
              actionLabel="Call Now"
              availability="Mon-Fri, 9AM-6PM EST"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Documentation Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px]" />
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Documentation
              </h3>
              <div className="space-y-1">
                <ResourceCard
                  icon={BookOpen}
                  title="Getting Started Guide"
                  description="Complete walkthrough for new users"
                  href="/docs/getting-started"
                  color="from-blue-500 to-blue-600"
                />
                <ResourceCard
                  icon={Code}
                  title="API Reference"
                  description="Full API documentation with examples"
                  href="/docs/api"
                  color="from-purple-500 to-purple-600"
                />
                <ResourceCard
                  icon={Plug}
                  title="Integration Guides"
                  description="Connect with third-party services"
                  href="/docs/integrations"
                  color="from-pink-500 to-pink-600"
                />
              </div>
            </div>

            {/* Community Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px]" />
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Community & Learning
              </h3>
              <div className="space-y-1">
                <ResourceCard
                  icon={Users}
                  title="Community Forum"
                  description="Connect with other Rendrix users"
                  href="/community"
                  color="from-primary to-orange-600"
                />
                <ResourceCard
                  icon={Video}
                  title="Video Tutorials"
                  description="Step-by-step video guides"
                  href="/tutorials"
                  color="from-red-500 to-red-600"
                />
                <ResourceCard
                  icon={Sparkles}
                  title="What's New"
                  description="Latest features and updates"
                  href="/changelog"
                  color="from-emerald-500 to-emerald-600"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-12 text-center"
          >
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Our team is always ready to help. Reach out and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="#chat"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-black font-semibold rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Live Chat
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  Contact Sales
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
            <Link href="/#contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

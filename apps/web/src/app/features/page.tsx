'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Store,
  Globe,
  Palette,
  Package,
  Sparkles,
  BarChart3,
  ShoppingCart,
  Brain,
  MessageSquare,
  TrendingUp,
  Plug,
  Code,
  Webhook,
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Layers,
  Users,
  CreditCard,
  Truck,
  Tag,
  Search,
  FileCode,
  Database,
  Cloud,
  Boxes,
  RefreshCw,
  Bot,
  LineChart,
  PieChart,
  Activity,
  Settings,
  Check,
  X,
  Play,
  ChevronRight,
  BookOpen,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SharedHeader } from '@/components/landing/shared-header';
import { SharedFooter } from '@/components/landing/shared-footer';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Feature categories for navigation
const featureCategories = [
  { id: 'all', label: 'All Features', icon: Layers },
  { id: 'store', label: 'Store Builder', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'ai', label: 'AI Tools', icon: Brain },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

// Core features data
const coreFeatures = [
  {
    id: 'multi-store',
    title: 'Multi-Store Management',
    description: 'Create and manage unlimited online stores from a single, powerful dashboard. Perfect for agencies, multi-brand retailers, and scaling businesses.',
    icon: Store,
    category: 'store',
    size: 'large',
    gradient: 'from-primary/20 via-orange-500/10 to-amber-500/5',
    highlights: ['Unlimited stores', 'Centralized dashboard', 'Role-based access'],
  },
  {
    id: 'custom-domains',
    title: 'Custom Domains',
    description: 'Connect your own domain with automatic SSL certificates. Professional presence, zero hassle.',
    icon: Globe,
    category: 'store',
    size: 'medium',
    gradient: 'from-blue-500/15 via-cyan-500/10 to-primary/5',
    highlights: ['Auto SSL', 'DNS management', 'Subdomain support'],
  },
  {
    id: 'themes',
    title: 'Theme Customization',
    description: 'Premium themes with intuitive drag-and-drop customization. No coding required.',
    icon: Palette,
    category: 'store',
    size: 'medium',
    gradient: 'from-purple-500/15 via-pink-500/10 to-primary/5',
    highlights: ['50+ themes', 'Visual editor', 'Custom CSS'],
  },
  {
    id: 'products',
    title: 'Product Catalog',
    description: 'Unlimited products with variants, categories, rich media, and advanced inventory tracking.',
    icon: Package,
    category: 'products',
    size: 'medium',
    gradient: 'from-emerald-500/15 via-green-500/10 to-primary/5',
    highlights: ['Unlimited products', 'Variants & options', 'Bulk import'],
  },
  {
    id: 'ai-descriptions',
    title: 'AI-Powered Descriptions',
    description: 'Generate SEO-optimized product descriptions, titles, and meta tags instantly with our advanced AI. Save hours on content creation.',
    icon: Sparkles,
    category: 'ai',
    size: 'large',
    gradient: 'from-primary/25 via-amber-500/15 to-orange-500/5',
    highlights: ['SEO optimized', 'Multiple languages', 'Brand voice'],
  },
  {
    id: 'inventory',
    title: 'Inventory Sync',
    description: 'Real-time inventory tracking across all your sales channels. Never oversell again.',
    icon: RefreshCw,
    category: 'products',
    size: 'medium',
    gradient: 'from-sky-500/15 via-blue-500/10 to-primary/5',
    highlights: ['Multi-channel sync', 'Low stock alerts', 'Auto-reorder'],
  },
  {
    id: 'orders',
    title: 'Order Management',
    description: 'Process, fulfill, and track orders with powerful automation workflows. From checkout to delivery, streamline every step of your fulfillment process.',
    icon: ShoppingCart,
    category: 'orders',
    size: 'full',
    gradient: 'from-primary/20 via-orange-500/10 to-amber-500/5',
    highlights: ['Automation rules', 'Multi-carrier shipping', 'Returns management', 'Order tracking'],
  },
];

// AI Features
const aiFeatures = [
  {
    title: 'AI Product Writer',
    description: 'Generate compelling, SEO-optimized product descriptions in seconds. Supports 25+ languages.',
    icon: FileCode,
    stat: '10x faster',
  },
  {
    title: 'Smart Recommendations',
    description: 'Personalized product suggestions that increase average order value by up to 35%.',
    icon: TrendingUp,
    stat: '+35% AOV',
  },
  {
    title: 'AI Chatbot',
    description: '24/7 intelligent customer support that handles inquiries, tracks orders, and drives sales.',
    icon: Bot,
    stat: '24/7 support',
  },
  {
    title: 'Predictive Analytics',
    description: 'AI-powered sales forecasting and demand planning to optimize inventory and marketing.',
    icon: LineChart,
    stat: '95% accuracy',
  },
];

// Integration logos/names
const integrations = [
  { name: 'Stripe', category: 'Payments' },
  { name: 'PayPal', category: 'Payments' },
  { name: 'Google Analytics', category: 'Analytics' },
  { name: 'Mailchimp', category: 'Marketing' },
  { name: 'Zapier', category: 'Automation' },
  { name: 'Meta', category: 'Marketing' },
  { name: 'QuickBooks', category: 'Accounting' },
  { name: 'Shopify', category: 'Import' },
];

// Developer features
const developerFeatures = [
  { name: 'REST API', description: 'Full CRUD operations for all resources' },
  { name: 'GraphQL', description: 'Flexible queries for complex data needs' },
  { name: 'Webhooks', description: 'Real-time event notifications' },
  { name: 'SDKs', description: 'JavaScript, Python, PHP, Ruby' },
];

// Security features
const securityFeatures = [
  { name: 'SSL Encryption', description: 'All data encrypted in transit' },
  { name: 'PCI-DSS Compliant', description: 'Level 1 payment security' },
  { name: 'GDPR Ready', description: 'Built-in privacy tools' },
  { name: 'SOC 2 Type II', description: 'Enterprise security standards' },
  { name: '2FA Authentication', description: 'Multi-factor security' },
  { name: 'Fraud Detection', description: 'AI-powered threat protection' },
];

// Comparison data
const comparisonFeatures = [
  { feature: 'Multi-store management', rendrix: true, shopify: false, woocommerce: false },
  { feature: 'AI product descriptions', rendrix: true, shopify: false, woocommerce: false },
  { feature: 'Built-in analytics', rendrix: true, shopify: true, woocommerce: false },
  { feature: 'No transaction fees', rendrix: true, shopify: false, woocommerce: true },
  { feature: 'Unlimited products (Free)', rendrix: false, shopify: false, woocommerce: true },
  { feature: 'API access', rendrix: true, shopify: true, woocommerce: true },
  { feature: '24/7 AI support', rendrix: true, shopify: false, woocommerce: false },
  { feature: 'White-label option', rendrix: true, shopify: false, woocommerce: false },
];

// Header Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { label: 'Features', href: '/features', hasDropdown: false, isActive: true },
    { label: 'Pricing', href: '/pricing', hasDropdown: false, isActive: false },
    {
      label: 'Resources',
      href: '#resources',
      hasDropdown: true,
      isActive: false,
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
            isScrolled
              ? 'bg-black/80 backdrop-blur-2xl'
              : 'bg-gradient-to-b from-black/50 to-transparent'
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.3) 50%, transparent 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    boxShadow: '0 4px 20px rgba(255,145,0,0.35)',
                  }}
                >
                  <Store className="w-5 h-5 text-black" />
                </div>
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,145,0,0.4) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                    transform: 'scale(1.5)',
                  }}
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">Rendrix</span>
            </Link>

            {/* Desktop Navigation */}
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
                        style={{
                          background: 'linear-gradient(90deg, #FF9100, #FF6B00)',
                        }}
                      />
                    </span>
                    {item.hasDropdown && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 rotate-90 transition-transform duration-300 ${
                          activeDropdown === item.label ? 'rotate-[270deg]' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {item.hasDropdown && item.items && (
                    <div
                      className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                        activeDropdown === item.label
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div
                        className="w-72 p-2 rounded-2xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,145,0,0.05)',
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
                              style={{
                                background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
                                border: '1px solid rgba(255,145,0,0.2)',
                              }}
                            >
                              <subItem.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white group-hover/item:text-primary transition-colors">
                                {subItem.label}
                              </div>
                              <div className="text-xs text-white/40 mt-0.5">
                                {subItem.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search Button */}
              <button
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </button>

              {/* Login */}
              <Link href="/login" className="group">
                <Button
                  variant="ghost"
                  className="relative text-white/70 hover:text-white hover:bg-transparent font-medium h-10 px-4"
                >
                  <span className="relative">
                    Log in
                    <span
                      className="absolute left-0 -bottom-0.5 h-[1px] w-0 group-hover:w-full transition-all duration-300"
                      style={{ background: 'rgba(255,255,255,0.5)' }}
                    />
                  </span>
                </Button>
              </Link>

              {/* Start Free Trial */}
              <Link href="/register" className="group">
                <Button
                  className="relative text-black font-semibold h-11 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    boxShadow: '0 4px 20px rgba(255,145,0,0.35)',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden"
          >
            <div
              className="mx-4 p-4 rounded-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(10,10,10,0.98) 0%, rgba(5,5,5,0.99) 100%)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl transition-colors ${
                      item.isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 text-center rounded-xl text-white/70 hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 text-center rounded-xl text-black font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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

// Footer Component
function Footer() {
  const [email, setEmail] = useState('');

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

  const socialLinks = [
    {
      name: 'X',
      href: 'https://twitter.com/rendrix',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/rendrix',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  const trustBadges = [
    { label: 'SOC 2 Type II', icon: Shield },
    { label: 'GDPR Compliant', icon: Lock },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.5) 50%, transparent 100%)',
        }}
      />

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #050505 50%, #0a0a0a 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.08) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className="relative rounded-3xl p-8 lg:p-12 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)',
              border: '1px solid rgba(255,145,0,0.2)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-[400px] h-[400px]"
              style={{
                background: 'radial-gradient(circle at 100% 0%, rgba(255,145,0,0.15) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
            />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  Stay ahead of{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 100%)',
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    commerce
                  </span>
                </h3>
                <p className="text-white/50 text-lg mb-2">
                  Get the latest updates, tips, and insights delivered to your inbox.
                </p>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-black"
                        style={{
                          background: `linear-gradient(135deg, hsl(${30 + i * 15}, 80%, 50%) 0%, hsl(${30 + i * 15}, 80%, 40%) 100%)`,
                        }}
                      />
                    ))}
                  </div>
                  <span>Join 25,000+ subscribers</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <Button
                  className="h-14 px-8 rounded-xl text-black font-semibold whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    boxShadow: '0 4px 20px rgba(255,145,0,0.3)',
                  }}
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    boxShadow: '0 8px 30px rgba(255,145,0,0.3)',
                  }}
                >
                  <Store className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold">Rendrix</span>
              </Link>
              <p className="text-white/50 mb-6 max-w-xs">
                The complete commerce platform for ambitious brands building the future of retail.
              </p>

              {/* Status Badge */}
              <Link
                href="/status"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                </div>
                <span className="text-sm text-green-400">All systems operational</span>
              </Link>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    aria-label={social.name}
                  >
                    <span className="text-white/40 group-hover:text-primary transition-colors">
                      {social.icon}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, #FF9100 0%, #FF6B00 100%)',
                    }}
                  />
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 -bottom-0.5 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <badge.icon className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/40">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t border-white/[0.06]"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,145,0,0.02) 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/30">
                <span>© {new Date().getFullYear()} Rendrix. All rights reserved.</span>
                <span className="hidden lg:block">•</span>
                <div
                  className="px-2 py-1 rounded-md text-xs font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  v2.4.0
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </button>

                <button
                  onClick={scrollToTop}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span>Back to top</span>
                  <ArrowRight className="w-4 h-4 -rotate-90 transition-transform duration-300 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: typeof coreFeatures[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const sizeClasses = {
    medium: 'col-span-1',
    large: 'col-span-1 md:col-span-2',
    full: 'col-span-1 md:col-span-2 lg:col-span-4',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={`group relative ${sizeClasses[feature.size as keyof typeof sizeClasses]}`}
    >
      {/* Outer glow on hover */}
      <div
        className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 145, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Gradient border on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.5) 0%, rgba(255, 107, 0, 0.3) 50%, rgba(255, 184, 77, 0.5) 100%)',
        }}
      />

      <div
        className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:border-transparent"
        style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Decorative corner glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(255, 145, 0, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
          {/* Icon */}
          <div className="mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary/90 transition-colors">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-white/50 leading-relaxed mb-5 flex-grow group-hover:text-white/60 transition-colors">
            {feature.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {feature.highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary/80 rounded-lg border border-primary/20 bg-primary/[0.05] group-hover:border-primary/30 group-hover:bg-primary/[0.08] transition-all"
              >
                <CheckCircle2 className="w-3 h-3" />
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// AI Feature Card
function AIFeatureCard({ feature, index }: { feature: typeof aiFeatures[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.3) 0%, rgba(255, 107, 0, 0.2) 100%)',
          filter: 'blur(15px)',
        }}
      />

      <div className="relative h-full p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300">
        {/* Stat badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-bold text-primary bg-primary/10 rounded-full border border-primary/20">
            {feature.stat}
          </span>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
          <feature.icon className="w-7 h-7 text-black" />
        </div>

        {/* Content */}
        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
        <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Filter features by category
  const filteredFeatures = activeCategory === 'all'
    ? coreFeatures
    : coreFeatures.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-primary/[0.08] rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.06] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[100px]"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,145,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <SharedHeader activeNav="features" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Trusted by 10,000+ merchants worldwide
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
            >
              <span className="text-white">Everything you need to</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
                build, scale & grow
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              The all-in-one AI-powered commerce platform that gives you complete control
              over your stores, products, and customer experience.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 text-base font-semibold text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-8 py-4 text-base font-medium text-white/80 border border-white/20 rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-[10%] hidden lg:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border border-primary/10 rounded-2xl"
          />
        </div>
        <div className="absolute bottom-20 right-[15%] hidden lg:block">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-4 h-4 bg-primary/30 rounded-full"
          />
        </div>
      </section>

      {/* Feature Categories Navigation */}
      <section className="relative py-8 px-6 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2"
          >
            {featureCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-primary text-black'
                    : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Features Bento Grid */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful features for modern commerce
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Everything you need to launch, manage, and scale your online business.
            </p>
          </motion.div>

          {/* Features Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {filteredFeatures.map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/10 border border-primary/30 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI that works while you sleep
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Automate content creation, customer support, and business intelligence with cutting-edge AI.
            </p>
          </motion.div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiFeatures.map((feature, index) => (
              <AIFeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="relative py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Connect with your favorite tools
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-8">
              Seamlessly integrate with the apps you already use and love.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/70">
              <Plug className="w-4 h-4 text-primary" />
              50+ integrations available
            </span>
          </motion.div>

          {/* Integration logos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group px-6 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-300"
              >
                <div className="text-center">
                  <span className="text-white font-medium group-hover:text-primary transition-colors">
                    {integration.name}
                  </span>
                  <p className="text-xs text-white/40 mt-1">{integration.category}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0a0a0a] to-[#111]"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,145,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                  <Code className="w-4 h-4" />
                  Developer API
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Built for developers
                </h3>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Powerful APIs, comprehensive documentation, and SDKs in your favorite languages.
                  Build custom integrations and extend Rendrix to fit your exact needs.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {developerFeatures.map((feature) => (
                    <div key={feature.name} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{feature.name}</p>
                        <p className="text-white/40 text-xs">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/api-docs"
                  className="inline-flex items-center gap-2 mt-8 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View API Documentation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right - Code preview */}
              <div className="relative">
                <div className="rounded-xl border border-white/[0.08] bg-black/50 overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-white/40 font-mono">api-example.js</span>
                  </div>
                  {/* Code content */}
                  <div className="p-4 font-mono text-sm">
                    <pre className="text-white/70">
                      <code>{`// Fetch products from your store
const response = await fetch(
  'https://api.rendrix.com/v1/products',
  {
    headers: {
      'Authorization': 'Bearer sk_live_...',
      'X-Store-Id': 'store_abc123'
    }
  }
);

const { data: products } = await response.json();
console.log(products);`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Enterprise Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Security you can trust
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Your data is protected by industry-leading security standards and compliance certifications.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-white font-medium text-sm mb-1">{feature.name}</p>
                <p className="text-white/40 text-xs">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why choose Rendrix?
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              See how we compare to other platforms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="p-4 text-white/50 text-sm font-medium">Feature</div>
              <div className="p-4 text-center">
                <span className="text-primary font-semibold">Rendrix</span>
              </div>
              <div className="p-4 text-center text-white/60">Shopify</div>
              <div className="p-4 text-center text-white/60">WooCommerce</div>
            </div>

            {/* Table rows */}
            {comparisonFeatures.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 ${index !== comparisonFeatures.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <div className="p-4 text-white/70 text-sm">{row.feature}</div>
                <div className="p-4 flex justify-center">
                  {row.rendrix ? (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                      <X className="w-4 h-4 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex justify-center">
                  {row.shopify ? (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white/50" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                      <X className="w-4 h-4 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex justify-center">
                  {row.woocommerce ? (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white/50" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                      <X className="w-4 h-4 text-white/30" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-primary/[0.1] rounded-full blur-[150px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to transform
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
                your commerce?
              </span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join thousands of businesses building the future of online retail with Rendrix.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-6 text-sm text-white/40">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <SharedFooter />
    </div>
  );
}

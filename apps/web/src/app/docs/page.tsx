'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Store,
  BookOpen,
  Search,
  ArrowRight,
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Quick start steps
const quickStartSteps = [
  {
    step: 1,
    icon: Store,
    title: 'Create Your First Store',
    description: 'Set up your online store in minutes',
    time: '5 min',
    href: '/docs/getting-started/create-store',
  },
  {
    step: 2,
    icon: Package,
    title: 'Add Products',
    description: 'Upload your product catalog',
    time: '3 min',
    href: '/docs/getting-started/add-products',
  },
  {
    step: 3,
    icon: CreditCard,
    title: 'Configure Payments',
    description: 'Connect payment gateways',
    time: '4 min',
    href: '/docs/getting-started/payments',
  },
  {
    step: 4,
    icon: Send,
    title: 'Launch Your Store',
    description: 'Go live and start selling',
    time: '2 min',
    href: '/docs/getting-started/launch',
  },
];

// Documentation categories
const docCategories = [
  {
    id: 'platform',
    icon: LayoutDashboard,
    title: 'Platform Overview',
    description: 'Core concepts, architecture, and terminology to understand how Rendrix works.',
    articles: 24,
    size: 'large',
    href: '/docs/platform',
    color: 'from-primary/20 via-orange-500/10 to-amber-500/5',
  },
  {
    id: 'getting-started',
    icon: Rocket,
    title: 'Getting Started',
    description: 'Quick start guides and onboarding tutorials.',
    articles: 12,
    size: 'medium',
    href: '/docs/getting-started',
    color: 'from-emerald-500/15 via-green-500/10 to-primary/5',
  },
  {
    id: 'dashboard',
    icon: Settings,
    title: 'Dashboard Guide',
    description: 'Navigation, settings, and preferences.',
    articles: 18,
    size: 'medium',
    href: '/docs/dashboard',
    color: 'from-blue-500/15 via-cyan-500/10 to-primary/5',
  },
  {
    id: 'stores',
    icon: Palette,
    title: 'Store Management',
    description: 'Create stores, themes, domains, and settings.',
    articles: 32,
    size: 'medium',
    href: '/docs/stores',
    color: 'from-purple-500/15 via-violet-500/10 to-primary/5',
  },
  {
    id: 'products',
    icon: Package,
    title: 'Product Catalog',
    description: 'Products, variants, categories, inventory management, and media uploads.',
    articles: 45,
    size: 'large',
    href: '/docs/products',
    color: 'from-primary/20 via-amber-500/10 to-orange-500/5',
  },
  {
    id: 'orders',
    icon: ShoppingCart,
    title: 'Order Management',
    description: 'Orders, fulfillment, shipping, and returns.',
    articles: 28,
    size: 'medium',
    href: '/docs/orders',
    color: 'from-sky-500/15 via-blue-500/10 to-primary/5',
  },
  {
    id: 'customers',
    icon: Users,
    title: 'Customers',
    description: 'Customer data, segments, and communications.',
    articles: 15,
    size: 'medium',
    href: '/docs/customers',
    color: 'from-pink-500/15 via-rose-500/10 to-primary/5',
  },
  {
    id: 'billing',
    icon: Receipt,
    title: 'Billing & Subscriptions',
    description: 'Plans, invoices, payments, and upgrades.',
    articles: 20,
    size: 'medium',
    href: '/docs/billing',
    color: 'from-teal-500/15 via-emerald-500/10 to-primary/5',
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Features',
    description: 'AI-powered descriptions, recommendations, chatbot, and predictive analytics.',
    articles: 22,
    size: 'large',
    href: '/docs/ai',
    color: 'from-primary/25 via-orange-500/15 to-amber-500/5',
  },
  {
    id: 'api',
    icon: Code,
    title: 'API & Developer Resources',
    description: 'REST API, GraphQL, Webhooks, SDKs, and authentication guides for developers.',
    articles: 65,
    size: 'full',
    href: '/docs/api',
    color: 'from-primary/20 via-orange-500/10 to-amber-500/5',
  },
];

// Popular articles
const popularArticles = [
  { title: 'How to create your first store', category: 'Getting Started', time: '5 min', href: '/docs/getting-started/create-store' },
  { title: 'Setting up payment gateways', category: 'Payments', time: '8 min', href: '/docs/payments/setup' },
  { title: 'Using AI product descriptions', category: 'AI Features', time: '4 min', href: '/docs/ai/descriptions' },
  { title: 'Configuring shipping rates', category: 'Shipping', time: '6 min', href: '/docs/shipping/rates' },
  { title: 'API authentication guide', category: 'API', time: '10 min', href: '/docs/api/authentication' },
  { title: 'Custom domain setup', category: 'Domains', time: '5 min', href: '/docs/domains/custom' },
];

// Developer resources
const developerResources = [
  {
    icon: FileCode,
    title: 'API Reference',
    description: 'Complete REST API documentation with examples',
    href: '/docs/api/reference',
    badge: 'v2.4',
  },
  {
    icon: Database,
    title: 'SDKs & Libraries',
    description: 'Official SDKs for JavaScript, Python, PHP, Ruby',
    href: '/docs/api/sdks',
    badge: '4 languages',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Real-time event notifications for your app',
    href: '/docs/api/webhooks',
    badge: '40+ events',
  },
  {
    icon: Terminal,
    title: 'GraphQL Explorer',
    description: 'Interactive GraphQL playground and schema',
    href: '/docs/api/graphql',
    badge: 'Interactive',
  },
];

// Additional resources
const additionalResources = [
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides',
    href: '/docs/videos',
    color: 'from-red-500/15 to-primary/5',
  },
  {
    icon: MessagesSquare,
    title: 'Community Forum',
    description: 'Connect with other merchants',
    href: '/community',
    color: 'from-blue-500/15 to-primary/5',
  },
  {
    icon: History,
    title: 'Changelog',
    description: 'Latest updates and releases',
    href: '/changelog',
    color: 'from-emerald-500/15 to-primary/5',
  },
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
              <Link href="/login" className="group">
                <Button variant="ghost" className="relative text-white/70 hover:text-white hover:bg-transparent font-medium h-10 px-4">
                  <span className="relative">
                    Log in
                    <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 group-hover:w-full transition-all duration-300" style={{ background: 'rgba(255,255,255,0.5)' }} />
                  </span>
                </Button>
              </Link>
              <Link href="/register" className="group">
                <Button
                  className="relative text-black font-semibold h-11 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 4px 20px rgba(255,145,0,0.35)' }}
                >
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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

// Documentation Card Component
function DocCard({ category, index }: { category: typeof docCategories[0]; index: number }) {
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
      className={`group relative ${sizeClasses[category.size as keyof typeof sizeClasses]}`}
    >
      <Link href={category.href}>
        {/* Outer glow */}
        <div
          className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255, 145, 0, 0.12) 0%, transparent 70%)', filter: 'blur(25px)' }}
        />

        {/* Gradient border */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.5) 0%, rgba(255, 107, 0, 0.3) 50%, rgba(255, 184, 77, 0.5) 100%)' }}
        />

        <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:border-transparent" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}>
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Top glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(255, 145, 0, 0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                <category.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-xs font-medium text-white/50 bg-white/[0.05] rounded-full border border-white/[0.06]">
                {category.articles} articles
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary/90 transition-colors">
              {category.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed flex-grow group-hover:text-white/60 transition-colors">
              {category.description}
            </p>

            {/* Arrow */}
            <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              <span className="text-sm text-primary font-medium">Browse docs</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
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
    { name: 'X', href: 'https://twitter.com/rendrix', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/rendrix', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.5) 50%, transparent 100%)' }} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #000000 0%, #050505 50%, #0a0a0a 100%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative">
        {/* Newsletter */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)', border: '1px solid rgba(255,145,0,0.2)' }}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px]" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,145,0,0.15) 0%, transparent 60%)', filter: 'blur(60px)' }} />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  Stay ahead of <span className="bg-clip-text text-transparent" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 100%)', WebkitBackgroundClip: 'text' }}>commerce</span>
                </h3>
                <p className="text-white/50 text-lg">Get the latest updates, tips, and insights delivered to your inbox.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <Button className="h-14 px-8 rounded-xl text-black font-semibold whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 4px 20px rgba(255,145,0,0.3)' }}>
                  Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 8px 30px rgba(255,145,0,0.3)' }}>
                  <Store className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold">Rendrix</span>
              </Link>
              <p className="text-white/50 mb-6 max-w-xs">The complete commerce platform for ambitious brands building the future of retail.</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link key={social.name} href={social.href} className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} aria-label={social.name}>
                    <span className="text-white/40 group-hover:text-primary transition-colors">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #FF9100 0%, #FF6B00 100%)' }} />
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                        <span className="relative">{link.label}<span className="absolute left-0 -bottom-0.5 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,145,0,0.02) 100%)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/30">
                <span>© {new Date().getFullYear()} Rendrix. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Globe className="w-4 h-4" /><span>English</span><ChevronRight className="w-3 h-3 rotate-90" />
                </button>
                <button onClick={scrollToTop} className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>Back to top</span><ArrowRight className="w-4 h-4 -rotate-90 transition-transform duration-300 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-primary/[0.08] rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.06] rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(255,145,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.4) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      </div>

      <SharedHeader activeNav="resources" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 mb-8">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Documentation</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
              <span className="text-white">Learn how to build with</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">Rendrix</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto mb-10 leading-relaxed">
              Comprehensive guides, API references, and tutorials to help you get the most out of Rendrix.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.3) 0%, rgba(255, 107, 0, 0.2) 100%)', filter: 'blur(10px)' }} />
                <div className="relative flex items-center">
                  <Search className="absolute left-5 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-14 pr-24 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                  />
                  <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                    <Command className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-xs text-white/40 font-medium">K</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> 500+ articles</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Updated daily</span>
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> 24/7 support</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Started in Minutes</h2>
            <p className="text-lg text-white/50">Follow these steps to launch your first store</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Link href={step.href}>
                  <div className="relative h-full p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
                    {/* Step number */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.step}</span>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-sm text-white/50 mb-3">{step.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" /> {step.time}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories Grid */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Browse Documentation</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">Explore our comprehensive guides organized by topic</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {docCategories.map((category, index) => (
              <DocCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles Section */}
      <section className="relative py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Most Popular</h2>
              <p className="text-white/50">Top articles read by our community</p>
            </div>
            <Link href="/docs/all" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={article.href}>
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-md">{article.category}</span>
                      <span className="text-xs text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.time}</span>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Resources Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0a0a0a] to-[#111]"
          >
            {/* Background grid */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(255,145,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 p-8 md:p-12">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                  <Code className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Developer Resources</h2>
                  <p className="text-white/50">Build powerful integrations with our APIs</p>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {developerResources.map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Link href={resource.href}>
                      <div className="h-full p-5 rounded-xl border border-white/[0.08] bg-black/50 hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <resource.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="px-2 py-1 text-xs font-medium text-white/50 bg-white/[0.05] rounded-md">{resource.badge}</span>
                        </div>
                        <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">{resource.title}</h3>
                        <p className="text-sm text-white/50">{resource.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Code Preview */}
              <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-white/40 font-mono">example.js</span>
                </div>
                <div className="p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/70">
{`// Initialize Rendrix client
const rendrix = new Rendrix({
  apiKey: 'sk_live_...',
  storeId: 'store_abc123'
});

// Fetch products
const products = await rendrix.products.list({
  limit: 10,
  status: 'active'
});`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="relative py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Additional Resources</h2>
            <p className="text-lg text-white/50">More ways to learn and connect</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Link href={resource.href}>
                  <div className={`relative h-full p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${resource.color} hover:border-primary/30 transition-all duration-300 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(255,145,0,0.4) 0%, transparent 70%)', filter: 'blur(20px)' }} />
                    <div className="relative z-10">
                      <div className="w-12 h-12 mb-4 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                        <resource.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                      <p className="text-sm text-white/50">{resource.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">Our support team is here to help. Reach out anytime.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="group px-8 py-4 text-base font-semibold text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2">
                Contact Support <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/help" className="px-8 py-4 text-base font-medium text-white/70 border border-white/20 rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300">
                Visit Help Center
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <Link href="/community" className="hover:text-white transition-colors flex items-center gap-2"><MessagesSquare className="w-4 h-4" /> Community Forum</Link>
              <Link href="/status" className="hover:text-white transition-colors flex items-center gap-2"><Activity className="w-4 h-4" /> System Status</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

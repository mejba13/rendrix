'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Store,
  Shield,
  Globe,
  Users,
  Package,
  ChevronRight,
  CheckCircle2,
  Play,
  Code2,
  Sparkles,
  TrendingUp,
  Mail,
  Search,
  Target,
  Truck,
  Languages,
  DollarSign,
  LineChart,
  Settings,
  Palette,
  ShoppingCart,
  Smartphone,
  Monitor,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  MessageSquare,
  FileText,
  BookOpen,
  Check,
  Menu,
  X,
} from 'lucide-react';
import { GlobalInfrastructureSection } from '@/components/landing/global-infrastructure-section';

// ============================================================================
// HOOKS
// ============================================================================

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: number = 0, shouldStart: boolean = false) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.floor(start + (end - start) * easeOut);
      setCount(countRef.current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, start, shouldStart]);

  return count;
}

// Hook to check if component is mounted (for hydration safety)
function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

// Intersection observer hook for scroll animations
function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return { ref, isInView };
}

// ============================================================================
// DATA
// ============================================================================

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
];

const trustedBrands = [
  'Luxura', 'NexGen', 'Artisan', 'Velocity', 'Prismo', 'Elevate'
];

const platformFeatures = [
  {
    icon: Store,
    title: 'Online Stores',
    description: 'Launch beautiful, conversion-optimized storefronts in minutes',
  },
  {
    icon: Smartphone,
    title: 'Mobile Commerce',
    description: 'Native mobile experiences that drive engagement and sales',
  },
  {
    icon: ShoppingCart,
    title: 'Point of Sale',
    description: 'Unified in-person and online sales with real-time sync',
  },
];

const testimonials = [
  {
    quote: "Rendrix transformed how we manage our multi-brand portfolio. The unified dashboard saves us hours every week.",
    author: "Sarah Chen",
    role: "CEO, Luxura Brands",
    avatar: "SC",
    type: "Enterprise",
  },
  {
    quote: "We launched our store in a day and hit $100K in our first month. The platform just works.",
    author: "Marcus Johnson",
    role: "Founder, Velocity Gear",
    avatar: "MJ",
    type: "Startup",
  },
  {
    quote: "The analytics and automation features have doubled our conversion rate. Incredible ROI.",
    author: "Elena Rodriguez",
    role: "CMO, Artisan Collective",
    avatar: "ER",
    type: "Growth",
  },
];

const sellEverywhereFeatures = [
  { icon: Monitor, title: 'Online Store', desc: 'Custom domains & themes' },
  { icon: Smartphone, title: 'Mobile App', desc: 'iOS & Android ready' },
  { icon: Instagram, title: 'Social Commerce', desc: 'Sell on Instagram & TikTok' },
  { icon: Globe, title: 'Marketplaces', desc: 'Amazon, eBay & more' },
];

const findCustomersFeatures = [
  { icon: Target, title: 'Marketing Automation', desc: 'Email, SMS & push campaigns' },
  { icon: Search, title: 'SEO Tools', desc: 'Rank higher organically' },
  { icon: LineChart, title: 'Analytics', desc: 'Customer behavior insights' },
  { icon: MessageSquare, title: 'Live Chat', desc: 'Convert visitors in real-time' },
];

const scaleGloballyFeatures = [
  { icon: DollarSign, title: 'Multi-Currency', desc: '135+ currencies supported' },
  { icon: Languages, title: 'Localization', desc: '50+ languages built-in' },
  { icon: Truck, title: 'Global Shipping', desc: 'Integrated carriers worldwide' },
  { icon: Shield, title: 'Tax Compliance', desc: 'Automated tax calculations' },
];

const manageEverythingFeatures = [
  { icon: Package, title: 'Inventory', desc: 'Real-time stock management' },
  { icon: FileText, title: 'Orders', desc: 'Streamlined fulfillment' },
  { icon: Users, title: 'Team', desc: 'Role-based permissions' },
  { icon: Settings, title: 'Workflows', desc: 'Automate repetitive tasks' },
];

const integrations = [
  { name: 'Stripe', category: 'Payments' },
  { name: 'PayPal', category: 'Payments' },
  { name: 'Shopify', category: 'Migration' },
  { name: 'Mailchimp', category: 'Marketing' },
  { name: 'Klaviyo', category: 'Marketing' },
  { name: 'Zapier', category: 'Automation' },
  { name: 'Slack', category: 'Communication' },
  { name: 'QuickBooks', category: 'Accounting' },
  { name: 'ShipStation', category: 'Shipping' },
  { name: 'Google Analytics', category: 'Analytics' },
  { name: 'Meta Pixel', category: 'Marketing' },
  { name: 'Zendesk', category: 'Support' },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for new businesses getting started',
    features: [
      '1 store',
      'Unlimited products',
      '2.9% + 30¢ per transaction',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    price: 99,
    description: 'For scaling businesses with multiple channels',
    features: [
      '5 stores',
      'Unlimited products',
      '2.5% + 30¢ per transaction',
      'Priority support',
      'Advanced analytics',
      'Marketing automation',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Custom solutions for large organizations',
    features: [
      'Unlimited stores',
      'Unlimited products',
      'Custom rates',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'API', 'Changelog'],
  Resources: ['Documentation', 'Guides', 'Blog', 'Webinars', 'Templates'],
  Company: ['About', 'Careers', 'Press', 'Partners', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'GDPR', 'Cookies'],
};

// ============================================================================
// COMPONENTS
// ============================================================================

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-primary/30"
            style={{
              background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
              boxShadow: '0 4px 20px rgba(255,145,0,0.25)',
            }}
          >
            <Store className="w-5 h-5 text-black" />
          </div>
          <span className="text-2xl font-semibold tracking-tight">Rendrix</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-[15px] text-white/60 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5 font-medium h-11 px-5"
            >
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button
              className="text-black font-semibold h-11 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                boxShadow: '0 4px 20px rgba(255,145,0,0.3)',
              }}
            >
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] py-6 px-6">
          <nav className="flex flex-col gap-2 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-white/70 hover:text-white font-medium rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button variant="outline" className="w-full border-white/20 text-white h-12">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className="w-full text-black font-semibold h-12"
                style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient orb */}
        <div
          className={`absolute -top-40 right-0 w-[800px] h-[800px] rounded-full transition-all duration-[2000ms] ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 40%, transparent 70%)',
          }}
        />
        {/* Secondary orb */}
        <div
          className={`absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full transition-all duration-[2500ms] delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(255,100,0,0.1) 0%, transparent 60%)',
          }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 pattern-grid opacity-20" />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Announcement Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/70 font-medium">Now with AI-powered insights</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] mb-6">
              <span
                className={`block transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Build your
              </span>
              <span
                className={`block transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 50%, #FF6B00 100%)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  commerce empire
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              The complete commerce platform for ambitious brands. Create stunning stores,
              reach customers everywhere, and scale without limits.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="relative text-black font-semibold px-8 h-14 text-base rounded-xl overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    boxShadow: '0 4px 30px rgba(255,145,0,0.3)',
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/70 hover:text-white hover:bg-white/5 h-14 px-6 rounded-xl group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <Play className="w-4 h-4 ml-0.5" />
                    </span>
                    Watch Demo
                  </span>
                </Button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div
              className={`flex flex-wrap items-center justify-center lg:justify-start gap-8 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <HeroStat value={50} suffix="K+" label="Active stores" shouldAnimate={isVisible} />
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <HeroStat value={10} suffix="M+" label="Orders/month" shouldAnimate={isVisible} />
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <HeroStat value={99.99} suffix="%" label="Uptime" shouldAnimate={isVisible} isDecimal />
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
          >
            {/* Floating stat cards */}
            <div
              className="absolute -left-8 top-8 z-20 hidden lg:block"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <FloatingCard icon={<TrendingUp className="w-5 h-5 text-green-400" />} label="Revenue" value="+24.5%" color="green" />
            </div>
            <div
              className="absolute -right-4 top-1/3 z-20 hidden lg:block"
              style={{ animation: 'float 7s ease-in-out infinite reverse' }}
            >
              <FloatingCard icon={<Package className="w-5 h-5 text-primary" />} label="Orders" value="1,247" color="orange" />
            </div>
            <div
              className="absolute -left-4 bottom-1/4 z-20 hidden xl:block"
              style={{ animation: 'float 8s ease-in-out infinite' }}
            >
              <FloatingCard icon={<Users className="w-5 h-5 text-blue-400" />} label="Visitors" value="+892" color="blue" />
            </div>

            {/* Browser Frame */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 100px rgba(0,0,0,0.5), 0 0 100px rgba(255,145,0,0.1)',
              }}
            >
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0a]/80 border-b border-white/[0.06]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/[0.04] rounded-lg px-4 py-2 text-sm text-white/40 max-w-sm mx-auto flex items-center gap-2 border border-white/[0.06]">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="truncate">dashboard.rendrix.com</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="aspect-[16/10] bg-[#050505] p-6">
                <DashboardPreview isVisible={isVisible} />
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-10 -z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-primary/10 to-transparent blur-3xl opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-48 bg-[#080808] border-r border-white/[0.06] p-3 flex-shrink-0 hidden sm:block">
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-7 h-7 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
          />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>
        <div className="space-y-1">
          {[true, false, false, false, false].map((active, i) => (
            <div
              key={i}
              className={`h-9 rounded-lg flex items-center gap-2 px-2 ${
                active ? 'bg-primary/15 border border-primary/20' : ''
              }`}
            >
              <div className={`w-4 h-4 rounded ${active ? 'bg-primary/40' : 'bg-white/10'}`} />
              <div className={`h-2 w-14 rounded ${active ? 'bg-primary/50' : 'bg-white/10'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-white/15 rounded" />
          <div
            className="h-8 w-24 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: '$12,847', trend: '+12%' },
            { value: '847', trend: '+8%' },
            { value: '2,451', trend: '+15%' },
            { value: '156', trend: '+5%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3">
              <div className="h-2 w-10 bg-white/10 rounded mb-2" />
              <div className="text-sm font-semibold text-white">{stat.value}</div>
              <div className="text-[10px] text-green-400">{stat.trend}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/[0.06] p-4 min-h-[140px]">
          <div className="flex items-center justify-between mb-4">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-14 bg-white/[0.04] rounded border border-white/[0.06]" />
              <div className="h-6 w-14 bg-primary/20 rounded" />
            </div>
          </div>
          <div className="flex items-end justify-between h-20 gap-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-1000"
                style={{
                  height: isVisible ? `${height}%` : '0%',
                  background: `linear-gradient(180deg, rgba(255,145,0,0.8) 0%, rgba(255,145,0,0.3) 100%)`,
                  transitionDelay: `${800 + i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'green' | 'orange' | 'blue';
}) {
  const bgColors = {
    green: 'rgba(34,197,94,0.15)',
    orange: 'rgba(255,145,0,0.15)',
    blue: 'rgba(59,130,246,0.15)',
  };

  return (
    <div
      className="p-4 rounded-2xl backdrop-blur-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: bgColors[color] }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs text-white/50 uppercase tracking-wider">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({
  value,
  suffix,
  label,
  shouldAnimate,
  isDecimal = false,
}: {
  value: number;
  suffix: string;
  label: string;
  shouldAnimate: boolean;
  isDecimal?: boolean;
}) {
  const count = useCountUp(isDecimal ? value * 100 : value, 2000, 0, shouldAnimate);
  const displayValue = isDecimal ? (count / 100).toFixed(2) : count;

  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-semibold tabular-nums">
        <span className="text-white">{displayValue}</span>
        <span className="text-white/50">{suffix}</span>
      </div>
      <div className="text-sm text-white/40 mt-1">{label}</div>
    </div>
  );
}

function SocialProofSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p
          className={`text-center text-sm text-white/40 uppercase tracking-widest mb-10 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Powering 10,000+ stores worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
          {trustedBrands.map((brand, i) => (
            <div
              key={brand}
              className={`text-2xl font-medium text-white/30 hover:text-white/50 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="platform" className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            The complete commerce
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 50%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              platform
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Everything you need to sell online, in-person, and everywhere in between.
            Unified commerce for the modern era.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {platformFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-8 rounded-2xl transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${(i + 2) * 100}ms`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,145,0,0.06), transparent 40%)',
                }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
                }}
              >
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            From startups to{' '}
            <span className="gradient-text">enterprise</span>
          </h2>
          <p
            className={`text-lg text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Trusted by ambitious brands at every stage of growth
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.author}
              className={`p-8 rounded-2xl transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${(i + 2) * 100}ms`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Type badge */}
              <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-xs font-medium text-primary">{testimonial.type}</span>
              </div>

              <p className="text-white/70 leading-relaxed mb-6">"{testimonial.quote}"</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesGridSection() {
  const { ref, isInView } = useInView();

  const featureSections = [
    {
      title: 'Sell everywhere',
      description: 'Reach customers on every channel and marketplace',
      features: sellEverywhereFeatures,
    },
    {
      title: 'Find your customers',
      description: 'Powerful marketing tools to grow your audience',
      features: findCustomersFeatures,
    },
    {
      title: 'Scale globally',
      description: 'Expand to new markets with built-in localization',
      features: scaleGloballyFeatures,
    },
    {
      title: 'Manage everything',
      description: 'Streamline operations from a single dashboard',
      features: manageEverythingFeatures,
    },
  ];

  return (
    <section ref={ref} id="solutions" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {featureSections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className={`mb-24 last:mb-0 ${sectionIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Section Header */}
            <div className="mb-12">
              <h3
                className={`text-3xl sm:text-4xl font-medium tracking-tight mb-4 transition-all duration-700 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${sectionIndex * 100}ms` }}
              >
                {section.title}
              </h3>
              <p
                className={`text-lg text-white/50 transition-all duration-700 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${sectionIndex * 100 + 50}ms` }}
              >
                {section.description}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`group p-6 rounded-xl transition-all duration-700 hover:-translate-y-1 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${sectionIndex * 100 + (i + 2) * 75}ms`,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-medium mb-1">{feature.title}</h4>
                  <p className="text-sm text-white/40">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntegrationsSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Apps for everything
          </h2>
          <p
            className={`text-lg text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Connect your favorite tools and extend your store with 200+ integrations
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-12">
          {integrations.map((integration, i) => (
            <div
              key={integration.name}
              className={`group p-4 rounded-xl text-center transition-all duration-500 hover:scale-105 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${i * 30}ms`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 mx-auto mb-2 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {integration.name}
              </div>
              <div className="text-xs text-white/30">{integration.category}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/integrations">
            <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white">
              <span className="flex items-center gap-2">
                View all integrations
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Code line component with syntax highlighting
function CodeLine({ line, lineNumber }: { line: string; lineNumber: number }) {
  // Simple syntax highlighting without regex that could cause hydration issues
  const highlightLine = (text: string) => {
    // Check for comment
    if (text.trim().startsWith('//')) {
      return <span className="text-white/30">{text}</span>;
    }

    // Split by quotes and keywords
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    // Keywords to highlight
    const keywords = ['const', 'await', 'async', 'true', 'false'];

    while (remaining.length > 0) {
      // Check for string
      const stringMatch = remaining.match(/^(".*?"|'.*?'|`.*?`)/);
      if (stringMatch) {
        parts.push(<span key={key++} className="text-green-400">{stringMatch[0]}</span>);
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // Check for number
      const numberMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numberMatch) {
        parts.push(<span key={key++} className="text-orange-400">{numberMatch[0]}</span>);
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }

      // Check for keywords
      let foundKeyword = false;
      for (const kw of keywords) {
        if (remaining.startsWith(kw) && (remaining.length === kw.length || !/\w/.test(remaining[kw.length]))) {
          if (kw === 'true' || kw === 'false') {
            parts.push(<span key={key++} className="text-blue-400">{kw}</span>);
          } else {
            parts.push(<span key={key++} className="text-purple-400">{kw}</span>);
          }
          remaining = remaining.slice(kw.length);
          foundKeyword = true;
          break;
        }
      }
      if (foundKeyword) continue;

      // Regular character
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return <>{parts}</>;
  };

  return (
    <div className="flex">
      <span className="w-8 text-white/20 select-none">{lineNumber}</span>
      <span>{highlightLine(line)}</span>
    </div>
  );
}

function DeveloperSection() {
  const { ref, isInView } = useInView();
  const mounted = useMounted();

  const codeLines = [
    '// Create a new product with Rendrix API',
    'const product = await rendrix.products.create({',
    '  name: "Premium Headphones",',
    '  price: 299.99,',
    '  currency: "USD",',
    '  inventory: {',
    '    quantity: 500,',
    '    trackQuantity: true',
    '  }',
    '});',
    '',
    'console.log("Created:", product.id);',
  ];

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/60 font-medium">Developer Platform</span>
            </div>

            <h2
              className={`text-4xl sm:text-5xl font-medium tracking-tight mb-6 transition-all duration-700 delay-100 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Built for{' '}
              <span className="gradient-text">developers</span>
            </h2>

            <p
              className={`text-lg text-white/50 mb-8 transition-all duration-700 delay-200 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Powerful APIs, comprehensive SDKs, and extensive documentation.
              Build custom experiences or extend the platform with ease.
            </p>

            <div
              className={`space-y-4 mb-10 transition-all duration-700 delay-300 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {[
                'RESTful API with 99.99% uptime',
                'SDKs for JavaScript, Python, Ruby, Go',
                'Webhooks for real-time events',
                'GraphQL support for flexible queries',
              ].map((feature, i) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-white/70">{feature}</span>
                </div>
              ))}
            </div>

            <div
              className={`flex gap-4 transition-all duration-700 delay-400 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/docs">
                <Button
                  className="text-black font-semibold"
                  style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Read Docs
                  </span>
                </Button>
              </Link>
              <Link href="/api">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white">
                  API Reference
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Code Preview */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              }}
            >
              {/* Code Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-sm text-white/40 font-mono">create-product.js</span>
              </div>

              {/* Code Content */}
              <pre className="p-6 text-sm overflow-x-auto">
                <code className="font-mono text-white/70 leading-relaxed">
                  {mounted ? (
                    codeLines.map((line, i) => (
                      <CodeLine key={i} line={line} lineNumber={i + 1} />
                    ))
                  ) : (
                    codeLines.map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 text-white/20 select-none">{i + 1}</span>
                        <span>{line}</span>
                      </div>
                    ))
                  )}
                </code>
              </pre>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="pricing" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Simple, transparent pricing
          </h2>
          <p
            className={`text-lg text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${plan.popular ? 'lg:scale-105' : ''}`}
              style={{
                transitionDelay: `${(i + 1) * 100}ms`,
                background: plan.popular
                  ? 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: plan.popular ? '1px solid rgba(255,145,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-primary text-black text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold">${plan.price}</span>
                    <span className="text-white/50">/month</span>
                  </div>
                ) : (
                  <div className="text-4xl font-semibold">Custom</div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-white/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.price ? '/register' : '/contact'} className="block">
                <Button
                  className={`w-full h-12 font-semibold ${
                    plan.popular ? 'text-black' : 'text-white'
                  }`}
                  style={{
                    background: plan.popular
                      ? 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)'
                      : 'rgba(255,255,255,0.05)',
                    border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2
          className={`text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Start selling in
          <br />
          <span className="gradient-text">minutes</span>
        </h2>

        <p
          className={`text-lg sm:text-xl text-white/50 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Join thousands of businesses already using Rendrix to power their commerce.
          No credit card required to get started.
        </p>

        {/* Steps */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 transition-all duration-700 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { step: '1', label: 'Create your store' },
            { step: '2', label: 'Add your products' },
            { step: '3', label: 'Start selling' },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold">
                  {item.step}
                </div>
                <span className="text-white/70">{item.label}</span>
              </div>
              {i < 2 && (
                <ChevronRight className="w-5 h-5 text-white/20 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link href="/register">
            <Button
              size="lg"
              className="text-black font-semibold h-14 px-10 text-base rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                boxShadow: '0 4px 40px rgba(255,145,0,0.4)',
              }}
            >
              <span className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/5 text-white h-14 px-10 text-base rounded-xl"
            >
              Talk to Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pt-24 pb-8">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
              >
                <Store className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-semibold">Rendrix</span>
            </Link>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
              The complete commerce platform for ambitious brands. Build, sell, and scale without limits.
            </p>

            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
              <Button
                size="sm"
                className="h-10 px-4 text-black font-medium"
                style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Social links */}
            <Link href="#" className="text-white/40 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/40">
            <span>&copy; 2025 Rendrix. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" suppressHydrationWarning>
      {/* Fixed background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-radial-top" />
      </div>

      <Header />

      <main>
        <HeroSection />
        <SocialProofSection />
        <PlatformSection />
        <TestimonialsSection />
        <FeaturesGridSection />
        <IntegrationsSection />
        <DeveloperSection />
        <GlobalInfrastructureSection />
        <PricingSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

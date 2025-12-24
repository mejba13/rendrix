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
  Target,
  Truck,
  Languages,
  DollarSign,
  LineChart,
  Settings,
  Palette,
  Smartphone,
  Monitor,
  MessageSquare,
  BookOpen,
  Check,
  Menu,
  X,
  Zap,
  BarChart3,
  ShoppingBag,
  CreditCard,
  Mail,
  Search,
  Activity,
  Database,
  Lock,
  Clock,
  Star,
  Award,
} from 'lucide-react';
import { GlobalInfrastructureSection } from '@/components/landing/global-infrastructure-section';

// ============================================================================
// HOOKS
// ============================================================================

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

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

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

const trustedBrands = ['Allbirds', 'Gymshark', 'MVMT', 'Bombas', 'Warby Parker', 'Casper', 'Away', 'Glossier'];

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

        <button
          className="lg:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

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
              <Button variant="outline" className="w-full border-white/20 bg-transparent text-white h-12">
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
  const { ref, isInView } = useInView();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient orb */}
        <div
          className={`absolute -top-40 right-0 w-[900px] h-[900px] rounded-full transition-all duration-[2000ms] ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.03) 50%, transparent 70%)',
          }}
        />
        <div
          className={`absolute top-1/3 -left-40 w-[700px] h-[700px] rounded-full transition-all duration-[2500ms] delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 60%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial fade */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, transparent 0%, black 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/60 font-medium">Now with AI-powered insights</span>
              <ChevronRight className="w-4 h-4 text-white/30" />
            </div>

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

            <p
              className={`text-lg sm:text-xl text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              The complete commerce platform for ambitious brands. Create stunning stores,
              reach customers everywhere, and scale without limits.
            </p>

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
                  className="text-white/60 hover:text-white hover:bg-white/5 h-14 px-6 rounded-xl group"
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

            {/* Stats Row */}
            <div
              className={`flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-white/[0.06] transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {[
                { value: '50K+', label: 'Active stores' },
                { value: '10M+', label: 'Orders/month' },
                { value: '99.99%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Main Dashboard Card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="text-xs text-white/40">dashboard.rendrix.com</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-4">
                {/* Revenue Card */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)',
                    border: '1px solid rgba(255,145,0,0.15)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-white/60">REVENUE</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">+24.5%</span>
                  </div>
                  <div className="text-3xl font-bold mb-3">$128,430</div>
                  {/* Mini Chart */}
                  <div className="flex items-end gap-1 h-12">
                    {[40, 55, 45, 70, 60, 80, 65, 90, 75, 95, 85, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(180deg, rgba(255,145,0,0.8) 0%, rgba(255,145,0,0.3) 100%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Orders', value: '1,247', change: '+12%' },
                    { label: 'Visitors', value: '8,492', change: '+8%' },
                    { label: 'Conversion', value: '3.2%', change: '+0.5%' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                    >
                      <div className="text-xs text-white/40 mb-1">{stat.label}</div>
                      <div className="text-lg font-semibold">{stat.value}</div>
                      <div className="text-xs text-green-400">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div
              className="absolute -top-4 -right-4 p-3 rounded-xl hidden lg:flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
                border: '1px solid rgba(34,197,94,0.25)',
                animation: 'float 5s ease-in-out infinite',
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-xs text-white/50">ORDERS</div>
                <div className="text-lg font-semibold text-green-400">+892</div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-4 p-3 rounded-xl hidden lg:flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)',
                border: '1px solid rgba(59,130,246,0.25)',
                animation: 'float 6s ease-in-out infinite reverse',
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-white/50">VISITORS</div>
                <div className="text-lg font-semibold text-blue-400">12.4K</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOCIAL PROOF SECTION
// ============================================================================

function SocialProofSection() {
  const { ref, isInView } = useInView();

  const stats = [
    { value: '50K+', label: 'Active Stores', sublabel: 'Worldwide merchants', icon: Store },
    { value: '$2B+', label: 'GMV Processed', sublabel: 'Annual transaction volume', icon: TrendingUp },
    { value: '99.99%', label: 'Uptime SLA', sublabel: 'Enterprise guarantee', icon: Shield },
    { value: '150+', label: 'Countries', sublabel: 'Global coverage', icon: Globe },
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.4) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`group relative p-6 lg:p-8 rounded-2xl transition-all duration-700 hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255,145,0,0.08) 0%, transparent 70%)',
                }}
              />

              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
                    border: '1px solid rgba(255,145,0,0.2)',
                  }}
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-white/70 mb-1">{stat.label}</div>
                <div className="text-xs text-white/40">{stat.sublabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <div className="relative">
          <p
            className={`text-center text-sm text-white/30 uppercase tracking-[0.2em] mb-8 transition-all duration-700 delay-400 ${
              isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Powering the world&apos;s fastest-growing brands
          </p>

          {/* Logo Scroll */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

            <div
              className={`flex items-center gap-16 transition-opacity duration-1000 ${
                isInView ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                animation: 'scroll 40s linear infinite',
              }}
            >
              {[...trustedBrands, ...trustedBrands, ...trustedBrands].map((brand, i) => (
                <div
                  key={`${brand}-${i}`}
                  className="text-xl lg:text-2xl font-semibold text-white/20 hover:text-white/40 transition-colors whitespace-nowrap"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PLATFORM SECTION - BENTO GRID
// ============================================================================

function PlatformSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="platform" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.1) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60">All-in-One Platform</span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Everything you need
            <br />
            <span className="text-white/50">to sell online</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Large Card - Storefront */}
          <div
            className={`lg:col-span-7 group rounded-3xl overflow-hidden transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: '200ms',
              background: 'linear-gradient(135deg, rgba(255,145,0,0.08) 0%, rgba(255,145,0,0.02) 100%)',
              border: '1px solid rgba(255,145,0,0.15)',
            }}
          >
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Beautiful Storefronts</h3>
              <p className="text-white/50 mb-6 max-w-md">
                Launch stunning online stores with our drag-and-drop builder. No coding required.
              </p>

              {/* Store Preview Mockup */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-3 w-24 bg-white/5 rounded" />
                      <div className="h-6 w-20 bg-primary/30 rounded mt-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 hidden lg:block"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            >
              <span className="text-sm font-medium text-green-400">+32% Sales</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 grid gap-4 lg:gap-6">
            {/* Mobile Card */}
            <div
              className={`group rounded-2xl overflow-hidden transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: '300ms',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)',
                border: '1px solid rgba(59,130,246,0.15)',
              }}
            >
              <div className="p-6 flex items-start gap-4">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Mobile-First</h3>
                  <p className="text-sm text-white/50">
                    Native apps that convert 3x better
                  </p>
                </div>
                {/* Phone mockup */}
                <div className="w-16 h-28 rounded-xl bg-gradient-to-b from-blue-500/20 to-blue-500/5 border border-blue-500/20 overflow-hidden">
                  <div className="w-6 h-1 bg-blue-500/30 mx-auto mt-1 rounded-full" />
                  <div className="p-2 space-y-1 mt-2">
                    <div className="h-4 bg-blue-500/30 rounded" />
                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div
              className={`group rounded-2xl overflow-hidden transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: '400ms',
                background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(168,85,247,0.02) 100%)',
                border: '1px solid rgba(168,85,247,0.15)',
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">AI-Powered</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Smart Analytics</h3>
                <p className="text-sm text-white/50 mb-4">
                  Real-time insights and predictions
                </p>
                {/* Mini chart */}
                <div className="flex items-end gap-1 h-16">
                  {[35, 50, 40, 65, 55, 80, 70, 90, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0.2) 100%)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - 3 Cards */}
          {[
            {
              icon: Globe,
              title: 'Multi-Channel',
              desc: 'Sell on Amazon, eBay, Instagram & more',
              color: 'cyan',
              delay: '500ms',
            },
            {
              icon: Package,
              title: 'Smart Inventory',
              desc: 'Real-time sync across all channels',
              color: 'emerald',
              delay: '600ms',
            },
            {
              icon: CreditCard,
              title: 'Unified Payments',
              desc: '100+ payment methods worldwide',
              color: 'amber',
              delay: '700ms',
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`lg:col-span-4 group rounded-2xl p-6 transition-all duration-700 hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: item.delay,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  item.color === 'cyan' ? 'bg-cyan-500/15' :
                  item.color === 'emerald' ? 'bg-emerald-500/15' :
                  'bg-amber-500/15'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    item.color === 'cyan' ? 'text-cyan-400' :
                    item.color === 'emerald' ? 'text-emerald-400' :
                    'text-amber-400'
                  }`}
                />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURES SECTION - 2x2 BENTO WITH VISUALS
// ============================================================================

function FeaturesSection() {
  const { ref, isInView } = useInView();

  const features = [
    {
      title: 'Sell everywhere',
      description: 'Reach customers on every channel and marketplace from one dashboard.',
      color: 'cyan',
      visual: (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {[
            { icon: Monitor, label: 'Web' },
            { icon: Smartphone, label: 'Mobile' },
            { icon: MessageSquare, label: 'Social' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
              style={{ animation: `float ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            >
              <item.icon className="w-5 h-5 text-cyan-400" />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Find your customers',
      description: 'AI-powered marketing tools to grow your audience and increase conversions.',
      color: 'pink',
      visual: (
        <div className="absolute bottom-4 right-4 left-4">
          <div className="flex items-end gap-1 h-20">
            {[30, 45, 40, 60, 55, 75, 70, 85, 80, 95, 90, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-1000"
                style={{
                  height: isInView ? `${h}%` : '10%',
                  background: 'linear-gradient(180deg, rgba(236,72,153,0.8) 0%, rgba(236,72,153,0.2) 100%)',
                  transitionDelay: `${i * 50 + 300}ms`,
                }}
              />
            ))}
          </div>
          <div className="absolute top-0 right-0 px-2 py-1 rounded bg-pink-500/20 border border-pink-500/30">
            <span className="text-xs font-medium text-pink-400">+127%</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Scale globally',
      description: 'Expand to new markets with built-in localization and multi-currency support.',
      color: 'emerald',
      visual: (
        <div className="absolute bottom-4 right-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
            <div className="absolute inset-2 rounded-full border border-emerald-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-8 h-8 text-emerald-400" />
            </div>
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <div
                key={deg}
                className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                style={{
                  top: `${50 + 40 * Math.sin((deg * Math.PI) / 180)}%`,
                  left: `${50 + 40 * Math.cos((deg * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse ${1.5 + i * 0.2}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Manage everything',
      description: 'Streamline operations with automated inventory, orders, and fulfillment.',
      color: 'violet',
      visual: (
        <div className="absolute bottom-4 right-4 left-4">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <div className="flex gap-1 p-2 border-b border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
            </div>
            <div className="p-3 space-y-2">
              <div className="flex gap-2">
                <div className="h-6 flex-1 rounded bg-violet-500/20" />
                <div className="h-6 w-12 rounded bg-violet-500/30" />
              </div>
              <div className="h-3 w-3/4 rounded bg-white/5" />
              <div className="h-3 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section ref={ref} id="solutions" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60">Powerful Features</span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-4 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Built for{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              growth
            </span>
          </h2>
        </div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative rounded-3xl overflow-hidden min-h-[280px] transition-all duration-700 hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${i * 100 + 200}ms`,
                background: `linear-gradient(135deg, rgba(${
                  feature.color === 'cyan' ? '6,182,212' :
                  feature.color === 'pink' ? '236,72,153' :
                  feature.color === 'emerald' ? '16,185,129' :
                  '139,92,246'
                },0.08) 0%, rgba(${
                  feature.color === 'cyan' ? '6,182,212' :
                  feature.color === 'pink' ? '236,72,153' :
                  feature.color === 'emerald' ? '16,185,129' :
                  '139,92,246'
                },0.02) 100%)`,
                border: `1px solid rgba(${
                  feature.color === 'cyan' ? '6,182,212' :
                  feature.color === 'pink' ? '236,72,153' :
                  feature.color === 'emerald' ? '16,185,129' :
                  '139,92,246'
                },0.15)`,
              }}
            >
              <div className="p-8">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === 'cyan' ? 'bg-cyan-500/15' :
                    feature.color === 'pink' ? 'bg-pink-500/15' :
                    feature.color === 'emerald' ? 'bg-emerald-500/15' :
                    'bg-violet-500/15'
                  }`}
                >
                  {feature.color === 'cyan' && <Globe className="w-6 h-6 text-cyan-400" />}
                  {feature.color === 'pink' && <Target className="w-6 h-6 text-pink-400" />}
                  {feature.color === 'emerald' && <Languages className="w-6 h-6 text-emerald-400" />}
                  {feature.color === 'violet' && <Settings className="w-6 h-6 text-violet-400" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 max-w-xs">{feature.description}</p>
              </div>
              {feature.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

function TestimonialsSection() {
  const { ref, isInView } = useInView();

  const testimonials = [
    {
      quote: "Rendrix transformed our business. We went from $50K to $2M in annual revenue within 18 months.",
      author: "Sarah Chen",
      role: "CEO, Luxura Brands",
      metric: "300%",
      metricLabel: "Revenue Growth",
      color: 'orange',
    },
    {
      quote: "The platform is incredibly intuitive. We launched our store in a day and saw our first sale within hours.",
      author: "Marcus Johnson",
      role: "Founder, Velocity Gear",
      metric: "$2.5M",
      metricLabel: "First Year Sales",
      color: 'emerald',
    },
    {
      quote: "Their AI-powered analytics doubled our conversion rate. It's like having a team of data scientists.",
      author: "Elena Rodriguez",
      role: "CMO, Artisan Collective",
      metric: "2.4x",
      metricLabel: "Conversion Rate",
      color: 'purple',
    },
  ];

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60">Customer Stories</span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-4 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Loved by{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              50,000+
            </span>
            {' '}brands
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className={`group relative rounded-3xl overflow-hidden transition-all duration-700 hover:-translate-y-2 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${i * 150 + 200}ms`,
              }}
            >
              {/* Gradient border effect */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, rgba(${
                    t.color === 'orange' ? '255,145,0' :
                    t.color === 'emerald' ? '16,185,129' :
                    '168,85,247'
                  },0.3) 0%, transparent 50%)`,
                  padding: '1px',
                }}
              />

              <div
                className="relative h-full rounded-3xl p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,15,15,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                }}
              >
                {/* Metric Badge */}
                <div
                  className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl mb-6 ${
                    t.color === 'orange' ? 'bg-primary/10' :
                    t.color === 'emerald' ? 'bg-emerald-500/10' :
                    'bg-purple-500/10'
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 ${
                    t.color === 'orange' ? 'text-primary' :
                    t.color === 'emerald' ? 'text-emerald-400' :
                    'text-purple-400'
                  }`} />
                  <div>
                    <div className={`text-xl font-bold ${
                      t.color === 'orange' ? 'text-primary' :
                      t.color === 'emerald' ? 'text-emerald-400' :
                      'text-purple-400'
                    }`}>{t.metric}</div>
                    <div className="text-xs text-white/50">{t.metricLabel}</div>
                  </div>
                </div>

                <p className="text-white/70 leading-relaxed mb-8">&ldquo;{t.quote}&rdquo;</p>

                <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      t.color === 'orange' ? 'bg-primary/20 text-primary' :
                      t.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-white">{t.author}</div>
                    <div className="text-sm text-white/50">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// INTEGRATIONS SECTION
// ============================================================================

function IntegrationsSection() {
  const { ref, isInView } = useInView();

  const categories = [
    { name: 'Payments', items: ['Stripe', 'PayPal', 'Square', 'Klarna'], icon: CreditCard, color: 'emerald' },
    { name: 'Marketing', items: ['Mailchimp', 'Klaviyo', 'HubSpot', 'Meta'], icon: Mail, color: 'pink' },
    { name: 'Shipping', items: ['ShipStation', 'FedEx', 'UPS', 'DHL'], icon: Truck, color: 'blue' },
    { name: 'Analytics', items: ['Google', 'Segment', 'Mixpanel', 'Amplitude'], icon: BarChart3, color: 'purple' },
  ];

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255,145,0,0.1) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60">200+ Integrations</span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-4 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Connect your{' '}
            <span className="text-white/50">favorite tools</span>
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`rounded-2xl p-6 transition-all duration-700 hover:-translate-y-1 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    cat.color === 'emerald' ? 'bg-emerald-500/15' :
                    cat.color === 'pink' ? 'bg-pink-500/15' :
                    cat.color === 'blue' ? 'bg-blue-500/15' :
                    'bg-purple-500/15'
                  }`}
                >
                  <cat.icon
                    className={`w-5 h-5 ${
                      cat.color === 'emerald' ? 'text-emerald-400' :
                      cat.color === 'pink' ? 'text-pink-400' :
                      cat.color === 'blue' ? 'text-blue-400' :
                      'text-purple-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-xs text-white/40">{cat.items.length}+ apps</p>
                </div>
              </div>

              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        cat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                        cat.color === 'pink' ? 'bg-pink-500/10 text-pink-400' :
                        cat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      {item[0]}
                    </div>
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className={`rounded-3xl p-8 lg:p-12 text-center transition-all duration-700 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)',
            border: '1px solid rgba(255,145,0,0.2)',
          }}
        >
          <h3 className="text-2xl font-semibold mb-3">Build your perfect stack</h3>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Connect all your tools and automate your workflow with our powerful integrations.
          </p>
          <Link href="/integrations">
            <Button
              className="text-black font-semibold h-12 px-6 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
              }}
            >
              <span className="flex items-center gap-2">
                Explore Marketplace
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DEVELOPER SECTION
// ============================================================================

function DeveloperSection() {
  const { ref, isInView } = useInView();
  const mounted = useMounted();

  const codeLines = [
    { text: '// Create a product', type: 'comment' },
    { text: 'const product = await rendrix.products.create({', type: 'code' },
    { text: '  name: "Premium Headphones",', type: 'string' },
    { text: '  price: 299.99,', type: 'number' },
    { text: '  currency: "USD",', type: 'string' },
    { text: '  inventory: { quantity: 500 }', type: 'code' },
    { text: '});', type: 'code' },
  ];

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/60">Developer Platform</span>
            </div>

            <h2
              className={`text-4xl sm:text-5xl font-medium tracking-tight mb-6 transition-all duration-700 delay-100 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Built for{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  WebkitBackgroundClip: 'text',
                }}
              >
                developers
              </span>
            </h2>

            <p
              className={`text-lg text-white/50 mb-8 transition-all duration-700 delay-200 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Powerful APIs, comprehensive SDKs, and extensive documentation.
              Build custom experiences or extend the platform.
            </p>

            <div
              className={`space-y-4 mb-8 transition-all duration-700 delay-300 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {[
                'RESTful API with 99.99% uptime',
                'SDKs for JavaScript, Python, Ruby, Go',
                'Webhooks for real-time events',
                'GraphQL support',
              ].map((feature) => (
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
                  className="text-black font-semibold h-12 px-6 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Docs
                </Button>
              </Link>
              <Link href="/api">
                <Button variant="outline" className="border-white/20 bg-transparent hover:bg-white/5 text-white h-12 px-6 rounded-xl">
                  API Reference
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Code Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-sm text-white/40 font-mono">create-product.js</span>
              </div>

              <pre className="p-6 text-sm overflow-x-auto">
                <code className="font-mono leading-relaxed">
                  {mounted && codeLines.map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-white/20 select-none">{i + 1}</span>
                      <span className={
                        line.type === 'comment' ? 'text-white/30' :
                        line.type === 'string' ? 'text-green-400' :
                        line.type === 'number' ? 'text-orange-400' :
                        'text-white/70'
                      }>
                        {line.text}
                      </span>
                    </div>
                  ))}
                  {!mounted && codeLines.map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-white/20 select-none">{i + 1}</span>
                      <span className="text-white/70">{line.text}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRICING SECTION
// ============================================================================

function PricingSection() {
  const { ref, isInView } = useInView();

  const plans = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for new businesses',
      features: [
        '1 online store',
        'Unlimited products',
        '2.9% + 30¢ per transaction',
        'Email support',
        'Basic analytics',
        'SSL certificate',
      ],
      popular: false,
    },
    {
      name: 'Growth',
      price: 99,
      description: 'For scaling businesses',
      features: [
        '5 online stores',
        'Unlimited products',
        '2.5% + 30¢ per transaction',
        'Priority support',
        'Advanced analytics',
        'Marketing automation',
        'API access',
        'Custom domains',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'Custom solutions',
      features: [
        'Unlimited stores',
        'Unlimited products',
        'Custom rates',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security',
        'Onboarding specialist',
      ],
      popular: false,
    },
  ];

  return (
    <section ref={ref} id="pricing" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,145,0,0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60">Simple Pricing</span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl font-medium tracking-tight mb-4 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Plans that{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              scale with you
            </span>
          </h2>
          <p
            className={`text-lg text-white/50 transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`group relative rounded-3xl transition-all duration-700 hover:-translate-y-2 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              style={{
                transitionDelay: `${i * 150 + 200}ms`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div
                    className="px-4 py-1.5 rounded-full text-sm font-semibold text-black"
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                      boxShadow: '0 4px 20px rgba(255,145,0,0.4)',
                    }}
                  >
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className="h-full rounded-3xl p-8"
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: plan.popular ? '1px solid rgba(255,145,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/50">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/[0.06]">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-white/50 ml-2">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold">Custom</div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-primary' : 'text-white/40'
                      }`} />
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={plan.price ? '/register' : '/contact'} className="block">
                  <Button
                    className={`w-full h-12 font-semibold rounded-xl ${
                      plan.popular ? 'text-black' : 'text-white'
                    }`}
                    style={{
                      background: plan.popular
                        ? 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div
          className={`flex items-center justify-center gap-8 mt-12 transition-all duration-700 delay-700 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Shield className="w-4 h-4" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Lock className="w-4 h-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Clock className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================

function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px]"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,145,0,0.2) 0%, rgba(255,145,0,0.05) 50%, transparent 80%)',
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,145,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,145,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        {/* Card */}
        <div
          className={`rounded-[2rem] p-8 lg:p-16 text-center transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)',
            border: '1px solid rgba(255,145,0,0.2)',
            boxShadow: '0 20px 80px rgba(255,145,0,0.1)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60">Free 14-day trial</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
            Ready to build your
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 50%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              commerce empire?
            </span>
          </h2>

          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
            Join 50,000+ businesses using Rendrix to sell online.
            Get started in minutes with no credit card required.
          </p>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            {[
              { step: '1', label: 'Sign up free', icon: Store },
              { step: '2', label: 'Customize', icon: Palette },
              { step: '3', label: 'Start selling', icon: TrendingUp },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-xl bg-black/30 border border-primary/30 flex items-center justify-center"
                    style={{ boxShadow: '0 0 20px rgba(255,145,0,0.2)' }}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
                {i < 2 && (
                  <ChevronRight className="w-5 h-5 text-white/20 mx-4 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                className="border-white/20 bg-transparent hover:bg-white/5 text-white h-14 px-10 text-base rounded-xl"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  const columns = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
    ],
  };

  return (
    <footer className="relative pt-20 pb-10 border-t border-white/[0.06]">
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,145,0,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
              >
                <Store className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-semibold">Rendrix</span>
            </Link>
            <p className="text-sm text-white/40 mb-4">
              The complete commerce platform for ambitious brands.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white/40">All systems operational</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white/70 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Rendrix. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="https://twitter.com/rendrix" className="text-white/30 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="https://github.com/rendrix" className="text-white/30 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="https://linkedin.com/company/rendrix" className="text-white/30 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden" suppressHydrationWarning>
      <Header />
      <HeroSection />
      <SocialProofSection />
      <PlatformSection />
      <FeaturesSection />
      <TestimonialsSection />
      <IntegrationsSection />
      <DeveloperSection />
      <GlobalInfrastructureSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}

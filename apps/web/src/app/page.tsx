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
  CreditCard,
  Mail,
  Lock,
  Clock,
  Star,
} from 'lucide-react';
import { GlobalInfrastructureSection } from '@/components/landing/global-infrastructure-section';

// ============================================================================
// HOOKS
// ============================================================================

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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation with dropdowns
  const navigation = [
    {
      label: 'Platform',
      href: '#platform',
      hasDropdown: true,
      items: [
        { icon: Store, label: 'Storefront', description: 'Beautiful, customizable themes', href: '/platform/storefront' },
        { icon: Package, label: 'Products', description: 'Inventory & catalog management', href: '/platform/products' },
        { icon: CreditCard, label: 'Payments', description: 'Accept payments globally', href: '/platform/payments' },
        { icon: Truck, label: 'Shipping', description: 'Automated fulfillment', href: '/platform/shipping' },
      ],
    },
    {
      label: 'Solutions',
      href: '#solutions',
      hasDropdown: true,
      items: [
        { icon: Sparkles, label: 'Enterprise', description: 'For large-scale operations', href: '/solutions/enterprise' },
        { icon: Target, label: 'Startups', description: 'Launch and scale fast', href: '/solutions/startups' },
        { icon: Globe, label: 'International', description: 'Sell across borders', href: '/solutions/international' },
      ],
    },
    { label: 'Pricing', href: '/pricing', hasDropdown: false },
    {
      label: 'Resources',
      href: '#resources',
      hasDropdown: true,
      items: [
        { icon: BookOpen, label: 'Documentation', description: 'Guides and references', href: '/docs' },
        { icon: Code2, label: 'API Reference', description: 'Build custom integrations', href: '/api' },
        { icon: MessageSquare, label: 'Community', description: 'Join the discussion', href: '/community' },
        { icon: Play, label: 'Tutorials', description: 'Learn by watching', href: '/tutorials' },
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
        {/* Background with glass effect */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isScrolled
              ? 'bg-black/80 backdrop-blur-2xl'
              : 'bg-gradient-to-b from-black/50 to-transparent'
          }`}
        />

        {/* Bottom border - gradient on scroll */}
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
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,145,0,0.4) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                    transform: 'scale(1.5)',
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight">Rendrix</span>
              </div>
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
                    className="group flex items-center gap-1.5 px-4 py-2.5 text-[15px] text-white/60 hover:text-white transition-all duration-300 font-medium rounded-lg"
                  >
                    <span className="relative">
                      {item.label}
                      {/* Animated underline */}
                      <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 rounded-full"
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

                  {/* Dropdown Menu */}
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
                        {item.items.map((subItem, idx) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="group/item flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                            style={{
                              animationDelay: `${idx * 50}ms`,
                            }}
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
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
                  {/* Shine effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                      animation: 'shine 2s ease-in-out infinite',
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Close button */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                }}
              >
                <Store className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Rendrix</span>
            </Link>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 space-y-2">
            {navigation.map((item, idx) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between p-4 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInRight 0.5s ease forwards' : '',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 border-t border-white/[0.06]">
            <Link href="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full h-12 border-white/20 bg-transparent text-white font-medium rounded-xl hover:bg-white/5"
              >
                Log in
              </Button>
            </Link>
            <Link href="/register" className="block" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                className="w-full h-12 text-black font-semibold rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 4px 20px rgba(255,145,0,0.3)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {['X', 'GitHub', 'LinkedIn'].map((social) => (
                <Link
                  key={social}
                  href={`https://${social.toLowerCase()}.com/rendrix`}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                  {social === 'X' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social === 'GitHub' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  )}
                  {social === 'LinkedIn' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for shine animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* ===== CINEMATIC BACKGROUND VIDEO ===== */}
      <div className="absolute inset-0">
        {/* Layer 1: Fallback gradient background - ALWAYS visible, lowest layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          }}
        />

        {/* Layer 2: Video Element - Full immersive background, ALWAYS visible */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          style={{
            filter: 'brightness(0.6) saturate(1.3)',
          }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Layer 3: Cinematic overlay gradients */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.85) 100%)',
          }}
        />

        {/* Layer 4: Side vignette for depth */}
        <div
          className="absolute inset-0 z-[3]"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Layer 5: Premium orange ambient glow from bottom */}
        <div
          className="absolute inset-0 z-[4]"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,145,0,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Layer 6: Subtle top glow */}
        <div
          className="absolute inset-0 z-[5]"
          style={{
            background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,145,0,0.08) 0%, transparent 50%)',
          }}
        />

        {/* Layer 7: Noise texture overlay for cinematic feel */}
        <div
          className="absolute inset-0 z-[6] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* ===== FLOATING PARTICLES ===== */}
      {mounted && (
        <div className="absolute inset-0 z-[7] overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${10 + (i * 6)}%`,
                top: `${20 + (i * 5) % 60}%`,
                background: i % 3 === 0 ? 'rgba(255,145,0,0.6)' : 'rgba(255,255,255,0.4)',
                animation: `floatParticle ${10 + (i * 2)}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ===== HERO CONTENT ===== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div className="text-center">
          {/* Announcement Badge */}
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-10 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
              border: '1px solid rgba(255,145,0,0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(255,145,0,0.1)',
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-sm text-white/90 font-medium tracking-wide">Introducing AI-Powered Commerce</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>

          {/* Main Headline - Larger and more impactful */}
          <h1 className="mb-8">
            <span
              className={`block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-bold tracking-tight text-white leading-[1.02] transition-all duration-1000 delay-150 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                textShadow: '0 4px 30px rgba(0,0,0,0.5)',
              }}
            >
              Build your
            </span>
            <span
              className={`block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-bold tracking-tight leading-[1.02] transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <span
                className="bg-clip-text text-transparent relative"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 30%, #FF6B00 70%, #FF4500 100%)',
                  WebkitBackgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 30px rgba(255,145,0,0.4))',
                }}
              >
                commerce empire
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`max-w-3xl mx-auto text-xl sm:text-2xl md:text-2xl text-white/70 leading-relaxed mb-14 font-light transition-all duration-1000 delay-450 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            The modern commerce platform for ambitious brands. Launch stunning stores,
            reach customers globally, and scale without limits.
          </p>

          {/* CTA Section */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Primary CTA - Enhanced */}
            <Link href="/register">
              <Button
                size="lg"
                className="relative text-black font-bold px-12 h-16 text-lg rounded-full overflow-hidden group shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 10px 40px rgba(255,145,0,0.4), 0 0 80px rgba(255,145,0,0.2)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-3">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            {/* Secondary CTA - Enhanced */}
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/30 hover:bg-white/10 hover:border-white/50 text-white font-semibold h-16 px-10 rounded-full transition-all duration-300"
                style={{
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Enhanced */}
          <div
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Stats Row - Larger and more prominent */}
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20 mb-10">
              {mounted && [
                { value: '50,000+', label: 'Active stores' },
                { value: '$2B+', label: 'GMV processed' },
                { value: '99.99%', label: 'Uptime SLA' },
                { value: '150+', label: 'Countries' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center group">
                  <div
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, #FF9100 0%, #FFD700 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      textShadow: i === 0 ? '0 0 40px rgba(255,145,0,0.3)' : 'none',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/50 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust Badges - Enhanced with glass effect */}
            <div
              className="inline-flex items-center justify-center gap-8 px-8 py-4 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Shield className="w-4 h-4 text-green-400/70" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Lock className="w-4 h-4 text-blue-400/70" />
                <span>PCI Compliant</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="hidden sm:flex items-center gap-2 text-white/50 text-sm">
                <Globe className="w-4 h-4 text-purple-400/70" />
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SCROLL INDICATOR - Enhanced ===== */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">Discover More</span>
          <div
            className="w-7 h-12 rounded-full flex items-start justify-center p-2"
            style={{
              border: '2px solid rgba(255,145,0,0.3)',
              background: 'rgba(255,145,0,0.05)',
            }}
          >
            <div
              className="w-1.5 h-3 rounded-full bg-gradient-to-b from-primary to-primary/50 animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>
      </div>

      {/* ===== BOTTOM GRADIENT TRANSITION ===== */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 50%, black 100%)',
        }}
      />
    </section>
  );
}

// ============================================================================
// SOCIAL PROOF SECTION
// ============================================================================

function SocialProofSection() {
  const { ref, isInView } = useInView();
  const mounted = useMounted();

  // Stats data with unique colors and visualizations
  const stats = [
    {
      value: '50K',
      suffix: '+',
      label: 'Active Stores',
      sublabel: 'Worldwide merchants',
      icon: Store,
      color: '#FF9100',
      bgGradient: 'rgba(255,145,0,0.15)',
    },
    {
      value: '$2B',
      suffix: '+',
      label: 'GMV Processed',
      sublabel: 'Annual transaction volume',
      icon: DollarSign,
      color: '#FFD700',
      bgGradient: 'rgba(255,215,0,0.15)',
    },
    {
      value: '99.99',
      suffix: '%',
      label: 'Uptime SLA',
      sublabel: 'Enterprise guarantee',
      icon: Shield,
      color: '#22C55E',
      bgGradient: 'rgba(34,197,94,0.15)',
    },
    {
      value: '150',
      suffix: '+',
      label: 'Countries',
      sublabel: 'Global coverage',
      icon: Globe,
      color: '#3B82F6',
      bgGradient: 'rgba(59,130,246,0.15)',
    },
  ];

  // Extended brand list for marquee
  const brands = [
    'Allbirds', 'Gymshark', 'MVMT', 'Bombas', 'Warby Parker',
    'Casper', 'Away', 'Glossier', 'Brooklinen', 'Outdoor Voices',
    'Rothy\'s', 'Everlane', 'Mejuri', 'Parachute', 'Koio',
  ];

  return (
    <section ref={ref} className="py-28 lg:py-36 relative overflow-hidden">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.5) 50%, transparent 100%)',
          }}
        />

        {/* Central glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.06) 0%, transparent 50%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Floating particles */}
        {mounted && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${20 + (i * 5) % 60}%`,
              background: i % 4 === 0 ? '#FF9100' : i % 4 === 1 ? '#FFD700' : i % 4 === 2 ? '#22C55E' : '#3B82F6',
              opacity: 0.4,
              animation: `floatParticle ${8 + (i * 1.5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
              border: '1px solid rgba(255,145,0,0.25)',
            }}
          >
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm font-medium text-white/80">Trusted by 50,000+ businesses worldwide</span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Powering{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 50%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              commerce
            </span>
            {' '}at scale
          </h2>
        </div>

        {/* ===== STATS BENTO GRID ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-20">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`group relative rounded-3xl p-6 lg:p-8 overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: `linear-gradient(135deg, ${stat.bgGradient} 0%, rgba(0,0,0,0.4) 100%)`,
                border: `1px solid ${stat.color}25`,
              }}
            >
              {/* Hover glow effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${stat.color}20 0%, transparent 60%)`,
                }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}30 0%, ${stat.color}10 100%)`,
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 8px 24px ${stat.color}20`,
                  }}
                >
                  <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>

                {/* Value with animated effect */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className="text-4xl lg:text-5xl font-black tracking-tight"
                    style={{
                      color: stat.color,
                      textShadow: `0 0 40px ${stat.color}40`,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.suffix}
                  </span>
                </div>

                {/* Labels */}
                <div className="text-base font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-white/40">{stat.sublabel}</div>

                {/* Mini visualization based on stat type */}
                <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  {i === 0 && (
                    // Store growth chart
                    <div className="flex items-end gap-1 h-10">
                      {[40, 55, 45, 70, 60, 85, 75, 95].map((h, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 rounded-full transition-all duration-500"
                          style={{
                            height: `${h}%`,
                            background: stat.color,
                            transitionDelay: `${idx * 50}ms`,
                            transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
                            transformOrigin: 'bottom',
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {i === 1 && (
                    // Transaction flow
                    <div className="relative w-12 h-12">
                      <DollarSign className="w-12 h-12" style={{ color: stat.color }} />
                    </div>
                  )}
                  {i === 2 && (
                    // Uptime indicator
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ border: `2px solid ${stat.color}` }}
                      >
                        <div
                          className="w-4 h-4 rounded-full animate-pulse"
                          style={{ background: stat.color }}
                        />
                      </div>
                    </div>
                  )}
                  {i === 3 && (
                    // Globe dots
                    <div className="relative w-12 h-12">
                      <Globe className="w-12 h-12" style={{ color: stat.color }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== TRUST BADGES ===== */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-16 transition-all duration-700 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { label: 'Enterprise Ready', icon: Shield },
            { label: 'SOC 2 Certified', icon: Lock },
            { label: 'GDPR Compliant', icon: CheckCircle2 },
            { label: '24/7 Support', icon: Clock },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <badge.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/50">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* ===== BRAND LOGOS MARQUEE ===== */}
        <div
          className={`relative transition-all duration-1000 delay-600 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-center text-xs text-white/30 uppercase tracking-[0.25em] mb-10">
            Powering the world&apos;s fastest-growing brands
          </p>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

          {/* First row - scroll left */}
          <div className="overflow-hidden mb-6">
            <div
              className="flex items-center gap-12"
              style={{
                animation: 'marqueeLeft 35s linear infinite',
              }}
            >
              {[...brands, ...brands, ...brands].map((brand, i) => (
                <div
                  key={`row1-${brand}-${i}`}
                  className="group flex items-center gap-3 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 hover:bg-white/5"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {brand[0]}
                  </div>
                  <span className="text-lg font-semibold text-white/25 group-hover:text-white/60 transition-colors">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Second row - scroll right */}
          <div className="overflow-hidden">
            <div
              className="flex items-center gap-12"
              style={{
                animation: 'marqueeRight 40s linear infinite',
              }}
            >
              {[...brands.slice().reverse(), ...brands.slice().reverse(), ...brands.slice().reverse()].map((brand, i) => (
                <div
                  key={`row2-${brand}-${i}`}
                  className="group flex items-center gap-3 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 hover:bg-white/5"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {brand[0]}
                  </div>
                  <span className="text-lg font-semibold text-white/25 group-hover:text-white/60 transition-colors">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
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
  const mounted = useMounted();

  // Integration data with brand colors
  const integrations = {
    payments: [
      { name: 'Stripe', letter: 'S', color: '#635BFF' },
      { name: 'PayPal', letter: 'P', color: '#00457C' },
      { name: 'Square', letter: 'S', color: '#3E4348' },
      { name: 'Klarna', letter: 'K', color: '#FFB3C7' },
      { name: 'Apple Pay', letter: 'A', color: '#000000' },
      { name: 'Google Pay', letter: 'G', color: '#4285F4' },
    ],
    marketing: [
      { name: 'Mailchimp', letter: 'M', color: '#FFE01B' },
      { name: 'Klaviyo', letter: 'K', color: '#2DD4BF' },
      { name: 'HubSpot', letter: 'H', color: '#FF7A59' },
      { name: 'Meta', letter: 'M', color: '#0668E1' },
    ],
    shipping: [
      { name: 'ShipStation', letter: 'S', color: '#84CC16' },
      { name: 'FedEx', letter: 'F', color: '#4D148C' },
      { name: 'UPS', letter: 'U', color: '#351C15' },
      { name: 'DHL', letter: 'D', color: '#FFCC00' },
    ],
    analytics: [
      { name: 'Google Analytics', letter: 'G', color: '#E37400' },
      { name: 'Segment', letter: 'S', color: '#52BD95' },
      { name: 'Mixpanel', letter: 'M', color: '#7856FF' },
      { name: 'Amplitude', letter: 'A', color: '#1E61F0' },
    ],
  };

  // Floating icons for hero area
  const floatingIcons = [
    { icon: CreditCard, x: 15, y: 20, delay: 0, color: '#635BFF' },
    { icon: Mail, x: 85, y: 25, delay: 0.5, color: '#FFE01B' },
    { icon: Truck, x: 10, y: 70, delay: 1, color: '#84CC16' },
    { icon: BarChart3, x: 90, y: 65, delay: 1.5, color: '#E37400' },
    { icon: Globe, x: 25, y: 45, delay: 2, color: '#FF9100' },
    { icon: Zap, x: 75, y: 50, delay: 2.5, color: '#2DD4BF' },
  ];

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.08) 0%, transparent 50%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,145,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,145,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Animated connection lines */}
        {mounted && (
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9100" stopOpacity="0" />
                <stop offset="50%" stopColor="#FF9100" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF9100" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1={`${10 + i * 15}%`}
                y1="0%"
                x2={`${40 + i * 10}%`}
                y2="100%"
                stroke="url(#lineGradient)"
                strokeWidth="1"
                style={{
                  animation: `pulseOpacity ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </svg>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* ===== HERO AREA WITH ANIMATED COUNTER ===== */}
        <div className="text-center mb-20 relative">
          {/* Floating integration icons */}
          {mounted && floatingIcons.map((item, i) => (
            <div
              key={i}
              className="absolute hidden lg:flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}05 100%)`,
                border: `1px solid ${item.color}30`,
                animation: `floatIcon 6s ease-in-out infinite`,
                animationDelay: `${item.delay}s`,
                boxShadow: `0 8px 32px ${item.color}20`,
              }}
            >
              <item.icon className="w-6 h-6" style={{ color: item.color }} />
            </div>
          ))}

          {/* Animated 200+ counter */}
          <div
            className={`relative inline-block mb-8 transition-all duration-1000 ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div
              className="text-[140px] sm:text-[180px] lg:text-[220px] font-black leading-none tracking-tighter"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 80px rgba(255,145,0,0.15))',
              }}
            >
              200+
            </div>
            {/* Glowing accent */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,145,0,0.15) 0%, transparent 60%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            One platform.{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 50%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              Endless possibilities.
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Connect your favorite tools and automate your entire workflow with our powerful integration ecosystem
          </p>
        </div>

        {/* ===== BENTO GRID LAYOUT ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">

          {/* PAYMENTS CARD - Large spanning 2 cols */}
          <div
            className={`lg:col-span-2 lg:row-span-2 group relative rounded-3xl p-8 overflow-hidden transition-all duration-700 hover:scale-[1.01] ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(99,91,255,0.08) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid rgba(99,91,255,0.2)',
              transitionDelay: '100ms',
            }}
          >
            {/* Hover glow effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(99,91,255,0.15) 0%, transparent 60%)',
              }}
            />

            {/* Card header */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #635BFF 0%, #8B7DFF 100%)',
                    boxShadow: '0 8px 24px rgba(99,91,255,0.3)',
                  }}
                >
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Payments</h3>
                  <p className="text-white/40">Accept payments globally</p>
                </div>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #635BFF20 0%, #635BFF05 100%)',
                  border: '1px solid #635BFF40',
                  color: '#A5A0FF',
                }}
              >
                20+ providers
              </div>
            </div>

            {/* Animated payment flow visualization */}
            <div className="relative h-48 mb-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              {/* Card mockup */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-36 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                }}
              >
                <div className="p-4">
                  <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4" />
                  <div className="h-2 w-32 rounded bg-white/10 mb-2" />
                  <div className="h-2 w-20 rounded bg-white/10" />
                </div>
                <div className="absolute bottom-3 right-4 text-white/30 text-sm font-mono">**** 4242</div>
              </div>

              {/* Animated glow lines */}
              {mounted && [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-[2px] rounded-full"
                  style={{
                    width: '100px',
                    left: '-100px',
                    top: `${30 + i * 25}%`,
                    background: 'linear-gradient(90deg, transparent, #635BFF, transparent)',
                    animation: `slideRight 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                />
              ))}

              {/* Success checkmark */}
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  boxShadow: '0 4px 12px rgba(34,197,94,0.4)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Integration logos */}
            <div className="relative grid grid-cols-3 gap-3">
              {integrations.payments.map((item, i) => (
                <div
                  key={item.name}
                  className="group/item flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover/item:scale-110"
                    style={{
                      background: `${item.color}20`,
                      color: item.color,
                      boxShadow: `0 4px 12px ${item.color}20`,
                    }}
                  >
                    {item.letter}
                  </div>
                  <span className="text-sm text-white/70 group-hover/item:text-white transition-colors">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MARKETING CARD */}
          <div
            className={`group relative rounded-3xl p-6 overflow-hidden transition-all duration-700 hover:scale-[1.02] ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,225,27,0.06) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid rgba(255,225,27,0.15)',
              transitionDelay: '200ms',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,225,27,0.1) 0%, transparent 60%)',
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #FFE01B 0%, #FFC700 100%)',
                    boxShadow: '0 6px 20px rgba(255,224,27,0.25)',
                  }}
                >
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Marketing</h3>
                  <p className="text-xs text-white/40">Grow your audience</p>
                </div>
              </div>

              {/* Mini notification badges */}
              <div className="flex gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-medium">+2.4k subs</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20">
                  <TrendingUp className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-medium">32% open</span>
                </div>
              </div>

              {/* Integration list */}
              <div className="space-y-2">
                {integrations.marketing.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer group/item"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ background: `${item.color}20`, color: item.color }}
                    >
                      {item.letter}
                    </div>
                    <span className="text-sm text-white/60 group-hover/item:text-white transition-colors">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SHIPPING CARD */}
          <div
            className={`group relative rounded-3xl p-6 overflow-hidden transition-all duration-700 hover:scale-[1.02] ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.06) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid rgba(132,204,22,0.15)',
              transitionDelay: '300ms',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(132,204,22,0.1) 0%, transparent 60%)',
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                    boxShadow: '0 6px 20px rgba(132,204,22,0.25)',
                  }}
                >
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Shipping</h3>
                  <p className="text-xs text-white/40">Deliver worldwide</p>
                </div>
              </div>

              {/* Mini world map with tracking dots */}
              <div
                className="relative h-20 mb-4 rounded-xl overflow-hidden"
                style={{ background: 'rgba(132,204,22,0.05)' }}
              >
                {/* Simplified map lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 50">
                  <path
                    d="M10,25 Q25,10 40,25 T70,25 T95,20"
                    fill="none"
                    stroke="#84CC16"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                </svg>
                {/* Animated tracking dots */}
                {mounted && [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-lime-400"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      boxShadow: '0 0 8px rgba(132,204,22,0.8)',
                      animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                ))}
              </div>

              {/* Integration list */}
              <div className="space-y-2">
                {integrations.shipping.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer group/item"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ background: `${item.color}30`, color: item.color === '#351C15' ? '#8B5A2B' : item.color }}
                    >
                      {item.letter}
                    </div>
                    <span className="text-sm text-white/60 group-hover/item:text-white transition-colors">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ANALYTICS CARD */}
          <div
            className={`lg:col-span-2 group relative rounded-3xl p-6 overflow-hidden transition-all duration-700 hover:scale-[1.01] ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(227,116,0,0.06) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid rgba(227,116,0,0.15)',
              transitionDelay: '400ms',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(227,116,0,0.1) 0%, transparent 60%)',
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #E37400 0%, #FF9100 100%)',
                      boxShadow: '0 6px 20px rgba(227,116,0,0.25)',
                    }}
                  >
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Analytics</h3>
                    <p className="text-xs text-white/40">Data-driven decisions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">98.7%</div>
                    <div className="text-[10px] text-white/40">accuracy</div>
                  </div>
                </div>
              </div>

              {/* Mini dashboard with animated chart */}
              <div className="flex gap-4 mb-4">
                <div
                  className="flex-1 h-24 rounded-xl p-3 overflow-hidden"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  {/* Animated bar chart */}
                  <div className="flex items-end gap-1 h-full">
                    {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t transition-all duration-500"
                        style={{
                          height: isInView ? `${height}%` : '10%',
                          background: i === 8 ? 'linear-gradient(180deg, #FF9100, #FF6B00)' : 'rgba(255,255,255,0.1)',
                          transitionDelay: `${500 + i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Integration logos - vertical stack */}
                <div className="flex flex-col gap-2">
                  {integrations.analytics.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer group/item"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                        style={{ background: `${item.color}20`, color: item.color }}
                      >
                        {item.letter}
                      </div>
                      <span className="text-sm text-white/60 group-hover/item:text-white transition-colors whitespace-nowrap">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CTA SECTION ===== */}
        <div
          className={`relative rounded-3xl p-10 lg:p-14 text-center overflow-hidden transition-all duration-700 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,145,0,0.12) 0%, rgba(255,107,0,0.04) 100%)',
            border: '1px solid rgba(255,145,0,0.25)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(255,145,0,0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Floating app icons */}
          {mounted && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[
                { x: 5, y: 30, size: 40 },
                { x: 12, y: 70, size: 32 },
                { x: 88, y: 25, size: 36 },
                { x: 92, y: 65, size: 28 },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute rounded-xl opacity-30"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: pos.size,
                    height: pos.size,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    animation: `floatIcon ${5 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Build your{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                }}
              >
                perfect stack
              </span>
            </h3>
            <p className="text-white/50 mb-8 max-w-lg mx-auto text-lg">
              Connect all your tools and automate your workflow with our powerful integration ecosystem
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/integrations">
                <Button
                  className="text-black font-semibold h-14 px-8 rounded-xl text-base transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    boxShadow: '0 8px 30px rgba(255,145,0,0.35)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    Explore All Integrations
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/docs/api">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-xl text-base bg-transparent border-white/20 text-white/80 hover:bg-white/5 hover:text-white hover:border-white/30 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Build Custom
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); opacity: 0; }
          50% { transform: translateX(400px); opacity: 1; }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-15px); }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
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
  const mounted = useMounted();

  // Journey steps data
  const steps = [
    {
      step: '01',
      title: 'Sign up free',
      description: 'Create your account in seconds',
      icon: Store,
      color: '#FF9100'
    },
    {
      step: '02',
      title: 'Customize',
      description: 'Design your perfect storefront',
      icon: Palette,
      color: '#FFD700'
    },
    {
      step: '03',
      title: 'Start selling',
      description: 'Launch and grow your business',
      icon: TrendingUp,
      color: '#FF6B00'
    },
  ];

  return (
    <section ref={ref} className="py-32 lg:py-40 relative overflow-hidden">
      {/* ===== DRAMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
          }}
        />

        {/* Dramatic orange glow rising from bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[800px]"
          style={{
            background: 'radial-gradient(ellipse 50% 80% at 50% 100%, rgba(255,145,0,0.35) 0%, rgba(255,107,0,0.15) 30%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Secondary glow orbs */}
        <div
          className="absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-40 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.2) 0%, transparent 60%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Perspective grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,145,0,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,145,0,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)',
            transform: 'perspective(500px) rotateX(30deg)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* Animated light rays */}
        {mounted && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-[2px] h-full origin-bottom"
                style={{
                  left: `${30 + i * 10}%`,
                  background: `linear-gradient(to top, rgba(255,145,0,0.4) 0%, transparent 60%)`,
                  transform: `rotate(${-20 + i * 10}deg)`,
                  animation: `rayPulse ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating particles */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${5 + (i * 4.5)}%`,
                  bottom: `${10 + (i * 3) % 40}%`,
                  width: `${3 + (i % 4)}px`,
                  height: `${3 + (i % 4)}px`,
                  background: i % 3 === 0
                    ? 'rgba(255,145,0,0.8)'
                    : i % 3 === 1
                      ? 'rgba(255,215,0,0.6)'
                      : 'rgba(255,255,255,0.4)',
                  boxShadow: i % 3 === 0 ? '0 0 10px rgba(255,145,0,0.5)' : 'none',
                  animation: `floatUp ${8 + (i % 5) * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* ===== BADGE ===== */}
        <div
          className={`flex justify-center mb-10 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,145,0,0.05) 100%)',
              border: '1px solid rgba(255,145,0,0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(255,145,0,0.15)',
            }}
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary" />
              <div
                className="absolute inset-0 animate-ping"
                style={{ animationDuration: '2s' }}
              >
                <Sparkles className="w-5 h-5 text-primary opacity-50" />
              </div>
            </div>
            <span className="text-sm font-medium text-white/90">Free 14-day trial • No credit card required</span>
          </div>
        </div>

        {/* ===== HEADLINE ===== */}
        <div className="text-center mb-16">
          <h2
            className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 transition-all duration-1000 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block text-white" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
              Ready to build your
            </span>
            <span
              className="block bg-clip-text text-transparent relative"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFD700 25%, #FF6B00 50%, #FFD700 75%, #FF9100 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animation: 'shimmerText 4s ease-in-out infinite',
                filter: 'drop-shadow(0 4px 30px rgba(255,145,0,0.4))',
              }}
            >
              commerce empire?
            </span>
          </h2>
          <p
            className={`text-xl lg:text-2xl text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Join <span className="text-primary font-semibold">50,000+</span> businesses using Rendrix to sell online
          </p>
        </div>

        {/* ===== JOURNEY STEPS ===== */}
        <div
          className={`grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {steps.map((item, i) => (
            <div key={item.step} className="relative group">
              {/* Connecting line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 h-[2px] z-10">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}40, ${steps[i + 1].color}40)`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: steps[i + 1].color,
                      boxShadow: `0 0 10px ${steps[i + 1].color}60`,
                      animation: 'pulse 2s ease-in-out infinite',
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                </div>
              )}

              {/* Step card */}
              <div
                className="relative rounded-3xl p-8 h-full transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${item.color}15 0%, transparent 60%)`,
                  }}
                />

                {/* Step number */}
                <div
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                    border: `1px solid ${item.color}40`,
                    color: item.color,
                    boxShadow: `0 4px 20px ${item.color}20`,
                  }}
                >
                  {item.step}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}25 0%, ${item.color}10 100%)`,
                    border: `1px solid ${item.color}30`,
                    boxShadow: `0 8px 32px ${item.color}20`,
                  }}
                >
                  <item.icon className="w-8 h-8" style={{ color: item.color }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CTA BUTTONS ===== */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 transition-all duration-700 delay-400 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/register" className="group">
            <Button
              size="lg"
              className="relative text-black font-bold h-16 px-12 text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                boxShadow: '0 8px 40px rgba(255,145,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
              }}
            >
              {/* Shine effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                  animation: 'shine 2s ease-in-out infinite',
                }}
              />
              <span className="relative flex items-center gap-3">
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          <Link href="/contact" className="group">
            <Button
              size="lg"
              variant="outline"
              className="relative h-16 px-12 text-lg rounded-2xl bg-transparent border-white/20 text-white overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-white/30 hover:scale-105"
            >
              <span className="relative flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                Talk to Sales
              </span>
            </Button>
          </Link>
        </div>

        {/* ===== TRUST INDICATORS ===== */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 lg:gap-6 transition-all duration-700 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { icon: Shield, label: 'Bank-level security', color: '#22C55E' },
            { icon: CreditCard, label: 'No credit card', color: '#3B82F6' },
            { icon: Clock, label: 'Cancel anytime', color: '#A855F7' },
            { icon: Zap, label: 'Setup in minutes', color: '#F59E0B' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="group flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${item.color}15`,
                }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>

        {/* ===== SOCIAL PROOF AVATARS ===== */}
        <div
          className={`flex flex-col items-center mt-12 transition-all duration-700 delay-600 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex -space-x-3 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-black"
                style={{
                  background: `linear-gradient(135deg, hsl(${30 + i * 20}, 80%, 50%) 0%, hsl(${30 + i * 20}, 80%, 40%) 100%)`,
                }}
              />
            ))}
            <div
              className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                color: 'black',
              }}
            >
              +50K
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
            <span className="text-sm text-white/50 ml-2">4.9/5 from 2,000+ reviews</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmerText {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-100px) scale(1.2); opacity: 1; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  const mounted = useMounted();
  const [email, setEmail] = useState('');

  const columns = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap', badge: 'New' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'DPA', href: '/dpa' },
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
      name: 'GitHub',
      href: 'https://github.com/rendrix',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
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
    {
      name: 'Discord',
      href: 'https://discord.gg/rendrix',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@rendrix',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  const trustBadges = [
    { label: 'G2 Leader 2024', icon: Star },
    { label: 'SOC 2 Type II', icon: Shield },
    { label: 'GDPR Compliant', icon: Lock },
    { label: 'PCI DSS', icon: CreditCard },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* ===== GRADIENT TOP BORDER ===== */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.5) 50%, transparent 100%)',
        }}
      />

      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #050505 50%, #0a0a0a 100%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Corner glows */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.08) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative">
        {/* ===== NEWSLETTER SECTION ===== */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className="relative rounded-3xl p-8 lg:p-12 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, rgba(255,145,0,0.02) 100%)',
              border: '1px solid rgba(255,145,0,0.2)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-[400px] h-[400px]"
              style={{
                background: 'radial-gradient(circle at 100% 0%, rgba(255,145,0,0.15) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
            />

            {/* Floating shapes */}
            {mounted && (
              <>
                <div
                  className="absolute top-10 right-20 w-20 h-20 rounded-2xl opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    animation: 'floatShape 6s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute bottom-10 right-40 w-12 h-12 rounded-full opacity-10"
                  style={{
                    background: '#FFD700',
                    animation: 'floatShape 8s ease-in-out infinite',
                    animationDelay: '1s',
                  }}
                />
              </>
            )}

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

        {/* ===== MAIN FOOTER CONTENT ===== */}
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
                          <span
                            className="absolute left-0 -bottom-0.5 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"
                          />
                        </span>
                        {link.badge && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{
                              background: link.badge === 'Hiring'
                                ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                                : 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                              color: 'black',
                            }}
                          >
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TRUST BADGES ===== */}
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

        {/* ===== BOTTOM BAR ===== */}
        <div
          className="border-t border-white/[0.06]"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,145,0,0.02) 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Left side */}
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

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Language Selector */}
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

                {/* Back to Top */}
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatShape {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
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

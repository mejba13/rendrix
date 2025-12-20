'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Store,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Layers,
  Sparkles,
  Users,
  CreditCard,
  Package,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-radial-top pointer-events-none" />
      <div className="fixed inset-0 pattern-grid opacity-30 pointer-events-none" />

      {/* Header - Firebase Studio inspired */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl border-b border-white/[0.06]" />
        <div className="relative max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo - Bigger and bolder */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Store className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Rendrix</span>
          </Link>

          {/* Minimal nav - just Features and Pricing */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[15px] text-white/60 hover:text-white transition-colors font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-[15px] text-white/60 hover:text-white transition-colors font-medium">
              Pricing
            </Link>
          </nav>

          {/* CTA - Outlined button with orange border */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5 text-[15px] font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="border-primary/60 hover:border-primary bg-transparent hover:bg-primary/10 text-primary hover:text-primary font-medium px-6 h-11 text-[15px] rounded-lg transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Firebase Studio inspired with massive typography */}
      <section className="relative min-h-screen flex flex-col pt-32 pb-0 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center flex-1 flex flex-col justify-center">
          {/* Main Headline - Much larger, with inline icon */}
          <h1
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-medium tracking-tight leading-[0.95] mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="block">The full</span>
            <span className="flex items-center justify-center gap-4 sm:gap-6">
              <span className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-orange-600 shadow-2xl shadow-primary/30">
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black" />
              </span>
              <span className="bg-gradient-to-r from-primary via-orange-400 to-orange-500 bg-clip-text text-transparent">
                commerce
              </span>
            </span>
            <span className="block">stack</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-white/50 leading-relaxed mb-12 font-normal transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Create, manage, and scale multiple stores from a single dashboard.
            Enterprise-grade commerce for any size.
          </p>

          {/* Single CTA Button */}
          <div
            className={`flex justify-center mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Link href="/register">
              <Button size="lg" className="btn-primary text-black font-semibold px-10 py-7 text-lg rounded-xl glow-primary hover:scale-105 transition-transform">
                <span className="flex items-center gap-3">
                  Try Rendrix free
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Browser Mockup - Positioned at bottom, partially visible */}
        <div
          className={`relative w-full max-w-5xl mx-auto px-8 mt-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <div className="browser-frame shadow-2xl shadow-primary/10 translate-y-16 sm:translate-y-24 lg:translate-y-32">
            <div className="browser-header bg-[#1a1a1a] border-b border-white/5">
              <div className="browser-dot bg-[#ff5f57]" />
              <div className="browser-dot bg-[#febc2e]" />
              <div className="browser-dot bg-[#28c840]" />
              <div className="flex-1 mx-4">
                <div className="bg-white/[0.06] rounded-lg px-4 py-2 text-sm text-white/40 max-w-sm mx-auto flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  dashboard.rendrix.com
                </div>
              </div>
            </div>
            <div className="relative aspect-[16/9] bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
              {/* Dashboard Preview */}
              <div className="absolute inset-4 flex gap-4">
                {/* Sidebar Preview */}
                <div className="w-56 bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className={`h-10 rounded-lg flex items-center gap-3 px-3 ${i === 1 ? 'bg-primary/15 border border-primary/20' : 'hover:bg-white/[0.03]'}`}>
                        <div className={`w-5 h-5 rounded ${i === 1 ? 'bg-primary/30' : 'bg-white/10'}`} />
                        <div className={`h-2.5 w-20 rounded ${i === 1 ? 'bg-primary/40' : 'bg-white/10'}`} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main Content Preview */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-white/10 rounded" />
                    <div className="h-9 w-28 bg-primary/20 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
                        <div className="h-2.5 w-16 bg-white/10 rounded mb-3" />
                        <div className="h-7 w-24 bg-white/15 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-64 bg-white/[0.02] rounded-xl border border-white/[0.06]" />
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect behind browser */}
          <div className="absolute inset-0 -z-10 blur-[100px] opacity-30">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-orange-500/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Trusted By Section - Extra top padding to account for overlapping browser */}
      <section className="pt-48 sm:pt-56 lg:pt-64 pb-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-white/40 mb-10 uppercase tracking-widest font-medium">
            Trusted by leading ecommerce brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-14 opacity-50">
            {['Brand', 'Store', 'Shop', 'Commerce', 'Retail'].map((brand) => (
              <div key={brand} className="text-2xl font-semibold text-white/50 hover:text-white/70 transition-colors">
                {brand}Co
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-radial-center pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-medium mb-6">
              Everything you need to{' '}
              <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              A complete commerce platform designed for scale. Manage unlimited stores,
              process millions in orders, and grow without limits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Store className="w-6 h-6" />}
              title="Multi-Store Management"
              description="Manage multiple stores across different verticals from one unified dashboard"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Setup"
              description="Launch new stores in minutes with industry-specific templates and themes"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Enterprise Security"
              description="Bank-level encryption and PCI-DSS compliant payment processing"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Powerful Analytics"
              description="Cross-store insights and real-time performance tracking dashboards"
            />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-medium mb-6">
                Scale your commerce
                <br />
                <span className="gradient-text">without limits</span>
              </h2>
              <p className="text-lg text-white/60 mb-8">
                Whether you're launching your first store or managing an enterprise portfolio,
                Rendrix provides the infrastructure to grow without boundaries.
              </p>

              <div className="space-y-4">
                {[
                  'Unlimited stores per organization',
                  'Automatic scaling infrastructure',
                  'Multi-currency & multi-language support',
                  'Advanced inventory management',
                  'Integrated payment processing',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/register">
                  <Button className="btn-primary text-black font-medium px-6 py-5 rounded-xl">
                    <span className="flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <MetricCard
                    value="99.99%"
                    label="Uptime SLA"
                    icon={<Globe className="w-5 h-5" />}
                  />
                  <MetricCard
                    value="150ms"
                    label="Avg Response"
                    icon={<Zap className="w-5 h-5" />}
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <MetricCard
                    value="10M+"
                    label="Orders Processed"
                    icon={<Package className="w-5 h-5" />}
                  />
                  <MetricCard
                    value="50K+"
                    label="Active Stores"
                    icon={<Store className="w-5 h-5" />}
                  />
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-medium mb-6">
              Built for modern commerce
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Every feature you need to run a successful ecommerce business,
              from inventory management to advanced analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LargeFeatureCard
              icon={<Layers className="w-8 h-8" />}
              title="Multi-Tenant Architecture"
              description="Run multiple independent stores under one account. Each store gets its own branding, domain, and customer base."
            />
            <LargeFeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Team Collaboration"
              description="Invite team members with role-based access. Assign permissions at organization or store level."
            />
            <LargeFeatureCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Payment Processing"
              description="Accept payments globally with Stripe integration. Support for subscriptions, one-time payments, and more."
            />
            <LargeFeatureCard
              icon={<Package className="w-8 h-8" />}
              title="Inventory Management"
              description="Track stock across all stores. Set alerts, manage variants, and sync inventory in real-time."
            />
            <LargeFeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Advanced Analytics"
              description="Get insights that matter. Track revenue, conversion rates, and customer behavior across all stores."
            />
            <LargeFeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Global Commerce"
              description="Sell anywhere with multi-currency support, localized storefronts, and international shipping."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-medium mb-6">
            Ready to transform your
            <br />
            <span className="gradient-text">commerce experience?</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses already using Rendrix to scale their ecommerce operations.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="btn-primary text-black font-medium px-10 py-6 text-lg rounded-xl glow-primary">
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
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-10 py-6 text-lg rounded-xl"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Firebase Studio inspired with dark card container */}
      <footer className="relative pt-24 pb-8">
        {/* Orange gradient glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Main footer card */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-3xl p-10 md:p-12">
            {/* Top row - Logo and Status */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
              {/* Large logo */}
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Store className="w-6 h-6 text-black" />
                </div>
                <span className="text-3xl font-semibold tracking-tight">Rendrix</span>
              </Link>

              {/* Status indicator */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08]">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-white/60 uppercase tracking-wider font-medium">All systems operational</span>
              </div>
            </div>

            {/* 4-column links grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-12">
              <div>
                <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-5">Learn</h4>
                <ul className="space-y-4">
                  {['Documentation', 'Tutorials', 'API Reference', 'Examples'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-[15px] text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                        {item}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-5">Community</h4>
                <ul className="space-y-4">
                  {['Discord', 'GitHub', 'Twitter', 'YouTube'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-[15px] text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                        {item}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-5">Support</h4>
                <ul className="space-y-4">
                  {['Help Center', 'Status', 'Contact Us', 'Feedback'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-[15px] text-white/70 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-5">Platform</h4>
                <ul className="space-y-4">
                  {['Pricing', 'Security', 'Enterprise', 'Changelog'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-[15px] text-white/70 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white/50">Rendrix for Commerce</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-white/40 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-sm text-white/40 hover:text-white transition-colors">
                  Cookies
                </Link>
                <span className="text-sm text-white/30">
                  &copy; 2025 Rendrix
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group glass-card p-6 card-interactive">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}

function LargeFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group glass-card p-8 card-interactive">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center mb-6 text-primary group-hover:from-primary/30 group-hover:to-orange-500/20 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Learn more
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-3 text-primary">
        {icon}
      </div>
      <div className="text-3xl font-semibold mb-1">{value}</div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
}

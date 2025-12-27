'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Users,
  Cpu,
  Lock,
  CreditCard,
  MessageSquare,
  Star,
  Building2,
  Crown,
  Gift,
  Infinity,
  TrendingUp,
  Award,
  Heart,
} from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// Standard SaaS Pricing - Aligned with dashboard
const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Start selling today',
    description: 'Everything you need to launch your first store',
    icon: Gift,
    monthlyPrice: 0,
    yearlyPrice: 0,
    savings: 0,
    popular: false,
    highlighted: false,
    color: 'emerald',
    features: [
      { name: '1 Online Store', included: true },
      { name: 'Up to 10 Products', included: true },
      { name: '1 Team Member', included: true },
      { name: '5% Transaction Fee', included: true },
      { name: '1GB Storage', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Community Support', included: true },
      { name: 'Rendrix Branding', included: true },
    ],
    cta: 'Get Started Free',
    ctaVariant: 'secondary' as const,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Most Popular',
    description: 'For growing businesses ready to scale',
    icon: Zap,
    monthlyPrice: 29,
    yearlyPrice: 290,
    savings: 58,
    popular: true,
    highlighted: true,
    color: 'primary',
    features: [
      { name: '3 Online Stores', included: true },
      { name: 'Up to 500 Products', included: true },
      { name: '5 Team Members', included: true },
      { name: '2.9% Transaction Fee', included: true },
      { name: '10GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Email Support', included: true },
      { name: 'Custom Domain', included: true },
      { name: 'AI Product Descriptions', included: true },
      { name: 'Remove Rendrix Branding', included: true },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'primary' as const,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For scaling brands',
    description: 'Advanced tools for high-volume sellers',
    icon: Building2,
    monthlyPrice: 79,
    yearlyPrice: 790,
    savings: 158,
    popular: false,
    highlighted: false,
    color: 'blue',
    features: [
      { name: '10 Online Stores', included: true },
      { name: 'Unlimited Products', included: true },
      { name: '15 Team Members', included: true },
      { name: '2.5% Transaction Fee', included: true },
      { name: '50GB Storage', included: true },
      { name: 'Advanced Analytics + Reports', included: true },
      { name: 'Priority Chat & Email', included: true },
      { name: '5 Custom Domains', included: true },
      { name: 'AI Suite (Full Access)', included: true },
      { name: 'Inventory Forecasting', included: true },
      { name: 'API Access', included: true },
      { name: 'Dedicated Account Manager', included: true },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'secondary' as const,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom solutions',
    description: 'For large-scale commerce operations',
    icon: Crown,
    monthlyPrice: null,
    yearlyPrice: null,
    savings: null,
    popular: false,
    highlighted: false,
    color: 'purple',
    features: [
      { name: 'Unlimited Stores', included: true },
      { name: 'Unlimited Products', included: true },
      { name: 'Unlimited Team Members', included: true },
      { name: 'Custom Transaction Rates', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: 'Custom Analytics & BI', included: true },
      { name: '24/7 Phone Support', included: true },
      { name: 'Unlimited Custom Domains', included: true },
      { name: 'AI Suite + Custom Models', included: true },
      { name: 'White-label Solution', included: true },
      { name: 'Dedicated Success Team', included: true },
      { name: 'SLA & Compliance', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'secondary' as const,
  },
];

// FAQ data
const faqs = [
  {
    question: 'Can I try Rendrix before committing?',
    answer: 'Yes! Start with our Free plan or get a 14-day free trial of Pro/Business. No credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Absolutely. Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.',
  },
  {
    question: 'What happens when I exceed my limits?',
    answer: "We'll notify you before you hit limits. You can upgrade or purchase add-ons. We never shut down your store.",
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes, 30-day money-back guarantee on all paid plans. No questions asked.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer: 'Yes! Nonprofits get 50% off any plan. Contact us with your organization details.',
  },
];

// FAQ Item component
function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="border-b border-white/[0.06] last:border-0"
      initial={false}
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
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-white/60" />
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
            <p className="pb-5 text-white/60 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.07] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-500/[0.05] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,145,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <span className="text-sm font-bold text-black">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Rendrix</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-primary">Pricing</Link>
            <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link>
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
      <section ref={heroRef} className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Simple, transparent pricing
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              <span className="text-white">Start free,</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
                scale without limits
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
            >
              No hidden fees. No surprises. Cancel anytime.
              <br className="hidden sm:block" />
              Join 25,000+ brands building the future of commerce.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !isAnnual
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isAnnual
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Annual
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full">
                  -17%
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards - Bento Grid Layout */}
      <section className="relative pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Free Plan - Compact */}
            <motion.div
              variants={fadeInScale}
              onMouseEnter={() => setHoveredPlan('free')}
              onMouseLeave={() => setHoveredPlan(null)}
              className="lg:col-span-3 relative group"
            >
              <div className={`h-full p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] transition-all duration-500 ${
                hoveredPlan === 'free' ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10' : ''
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Free</h3>
                    <p className="text-xs text-emerald-400">Forever free</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-white/40 text-sm">/month</span>
                  </div>
                  <p className="text-sm text-white/50 mt-2">Perfect for getting started</p>
                </div>

                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all mb-6"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-3">
                  {pricingPlans[0].features.slice(0, 6).map((feature) => (
                    <div key={feature.name} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-white/70">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Pro Plan - Featured/Large */}
            <motion.div
              variants={fadeInScale}
              onMouseEnter={() => setHoveredPlan('pro')}
              onMouseLeave={() => setHoveredPlan(null)}
              className="lg:col-span-5 relative"
            >
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="px-4 py-1.5 bg-gradient-to-r from-primary to-orange-500 text-black text-xs font-bold rounded-full shadow-lg shadow-primary/40 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  MOST POPULAR
                </div>
              </div>

              <div className={`h-full p-8 rounded-3xl bg-gradient-to-b from-primary/20 via-primary/10 to-transparent border-2 border-primary/50 transition-all duration-500 relative overflow-hidden ${
                hoveredPlan === 'pro' ? 'border-primary shadow-2xl shadow-primary/20' : ''
              }`}>
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/30">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Pro</h3>
                      <p className="text-xs text-primary">For growing businesses</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">
                        ${isAnnual ? 24 : 29}
                      </span>
                      <span className="text-white/40 text-sm">/month</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Save $60/year (billed annually)
                      </p>
                    )}
                    <p className="text-sm text-white/50 mt-2">Everything you need to grow</p>
                  </div>

                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-black font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mb-8 group"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                    {pricingPlans[1].features.map((feature) => (
                      <div key={feature.name} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-white/80">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Plan */}
            <motion.div
              variants={fadeInScale}
              onMouseEnter={() => setHoveredPlan('business')}
              onMouseLeave={() => setHoveredPlan(null)}
              className="lg:col-span-4 relative group"
            >
              <div className={`h-full p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] transition-all duration-500 ${
                hoveredPlan === 'business' ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : ''
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Business</h3>
                    <p className="text-xs text-blue-400">For scaling brands</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${isAnnual ? 66 : 79}
                    </span>
                    <span className="text-white/40 text-sm">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-emerald-400 mt-1">Save $156/year</p>
                  )}
                  <p className="text-sm text-white/50 mt-2">Advanced tools for growth</p>
                </div>

                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all mb-6"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-3">
                  {pricingPlans[2].features.slice(0, 8).map((feature) => (
                    <div key={feature.name} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-white/70">{feature.name}</span>
                    </div>
                  ))}
                  <p className="text-xs text-white/40 pt-2">+ 4 more features</p>
                </div>
              </div>
            </motion.div>

            {/* Enterprise - Full Width */}
            <motion.div
              variants={fadeInScale}
              onMouseEnter={() => setHoveredPlan('enterprise')}
              onMouseLeave={() => setHoveredPlan(null)}
              className="lg:col-span-12"
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-white/[0.03] to-violet-500/10 border border-white/[0.08] transition-all duration-500 ${
                hoveredPlan === 'enterprise' ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10' : ''
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Enterprise</h3>
                        <p className="text-xs text-purple-400">Custom solutions for large organizations</p>
                      </div>
                    </div>
                    <p className="text-white/60 max-w-xl">
                      Tailored solutions with dedicated support, custom integrations, and enterprise-grade security.
                      Let&apos;s build something amazing together.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                    {[
                      { icon: Infinity, label: 'Unlimited Everything' },
                      { icon: Shield, label: 'SLA & Compliance' },
                      { icon: Users, label: 'Dedicated Team' },
                      { icon: Cpu, label: 'Custom AI Models' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-sm text-white/70">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    Contact Sales
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, title: '99.99% Uptime', desc: 'Enterprise reliability', color: 'emerald' },
              { icon: Lock, title: 'SOC 2 Type II', desc: 'Bank-level security', color: 'blue' },
              { icon: CreditCard, title: 'PCI Compliant', desc: 'Secure payments', color: 'purple' },
              { icon: Award, title: '30-Day Guarantee', desc: 'Money back promise', color: 'primary' },
            ].map((signal) => (
              <motion.div
                key={signal.title}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all group text-center"
              >
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all ${
                  signal.color === 'emerald' ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' :
                  signal.color === 'blue' ? 'bg-blue-500/10 group-hover:bg-blue-500/20' :
                  signal.color === 'purple' ? 'bg-purple-500/10 group-hover:bg-purple-500/20' :
                  'bg-primary/10 group-hover:bg-primary/20'
                }`}>
                  <signal.icon className={`w-7 h-7 ${
                    signal.color === 'emerald' ? 'text-emerald-400' :
                    signal.color === 'blue' ? 'text-blue-400' :
                    signal.color === 'purple' ? 'text-purple-400' :
                    'text-primary'
                  }`} />
                </div>
                <h4 className="text-white font-semibold mb-1">{signal.title}</h4>
                <p className="text-sm text-white/50">{signal.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Banner */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-orange-500/10 to-amber-500/20" />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Save up to 60% compared to Shopify
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto mb-8">
                Rendrix offers enterprise-grade features at a fraction of the cost.
                No hidden fees, no transaction surprises—just transparent pricing that scales with you.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {['Shopify', 'BigCommerce', 'WooCommerce', 'Magento'].map((competitor) => (
                  <div
                    key={competitor}
                    className="px-4 py-2 rounded-full bg-white/10 text-white/60 text-sm"
                  >
                    vs {competitor}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/70">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Common questions
              </h2>
              <p className="text-white/60">
                Everything you need to know about pricing
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6"
            >
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
            >
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm text-primary">Loved by 25,000+ brands</span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to grow your business?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
            >
              Start free today. No credit card required.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all group"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                Talk to Sales
              </Link>
            </motion.div>
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
            <Link href="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

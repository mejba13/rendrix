'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Check,
  X,
  Zap,
  Shield,
  Headphones,
  Clock,
  Globe,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Store,
  Users,
  Package,
  BarChart3,
  Cpu,
  Lock,
  CreditCard,
  MessageSquare,
  Star,
  Building2,
  Rocket,
  Crown,
} from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Pricing data
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals launching their first online store',
    icon: Rocket,
    monthlyPrice: 29,
    yearlyPrice: 290,
    savings: 58,
    popular: false,
    features: [
      { name: '1 Online Store', included: true },
      { name: 'Up to 100 Products', included: true },
      { name: '2 Team Members', included: true },
      { name: '2.9% + 30¢ Transaction Fee', included: true },
      { name: '5GB Storage', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Email Support', included: true },
      { name: '1 Custom Domain', included: true },
      { name: 'AI Product Descriptions', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Support', included: false },
      { name: 'API Access', included: false },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'secondary' as const,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses ready to scale their operations',
    icon: Zap,
    monthlyPrice: 79,
    yearlyPrice: 790,
    savings: 158,
    popular: true,
    features: [
      { name: '3 Online Stores', included: true },
      { name: 'Up to 1,000 Products', included: true },
      { name: '5 Team Members', included: true },
      { name: '2.5% + 30¢ Transaction Fee', included: true },
      { name: '25GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Email Support', included: true },
      { name: '3 Custom Domains', included: true },
      { name: 'AI Product Descriptions', included: true },
      { name: 'Inventory Forecasting', included: true },
      { name: 'Priority Support', included: false },
      { name: 'API Access', included: false },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'primary' as const,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Advanced features for scaling brands with high volume',
    icon: Building2,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    savings: 398,
    popular: false,
    features: [
      { name: '10 Online Stores', included: true },
      { name: 'Unlimited Products', included: true },
      { name: '15 Team Members', included: true },
      { name: '2.2% + 30¢ Transaction Fee', included: true },
      { name: '100GB Storage', included: true },
      { name: 'Advanced Analytics + Reports', included: true },
      { name: 'Priority Support (Chat & Email)', included: true },
      { name: '10 Custom Domains', included: true },
      { name: 'AI Suite (Full Access)', included: true },
      { name: 'Inventory Forecasting', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'Full API Access', included: true },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'secondary' as const,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large-scale commerce operations',
    icon: Crown,
    monthlyPrice: null,
    yearlyPrice: null,
    savings: null,
    popular: false,
    features: [
      { name: 'Unlimited Stores', included: true },
      { name: 'Unlimited Products', included: true },
      { name: 'Unlimited Team Members', included: true },
      { name: 'Custom Transaction Rates', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: 'Custom Analytics & BI', included: true },
      { name: '24/7 Phone & Chat Support', included: true },
      { name: 'Unlimited Custom Domains', included: true },
      { name: 'AI Suite + Custom Models', included: true },
      { name: 'White-label Solutions', included: true },
      { name: 'Dedicated Success Team', included: true },
      { name: 'SLA & Compliance', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'secondary' as const,
  },
];

// Feature comparison data
const featureCategories = [
  {
    name: 'Store Management',
    icon: Store,
    features: [
      { name: 'Online Stores', starter: '1', pro: '3', business: '10', enterprise: 'Unlimited' },
      { name: 'Products', starter: '100', pro: '1,000', business: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Team Members', starter: '2', pro: '5', business: '15', enterprise: 'Unlimited' },
      { name: 'Custom Domains', starter: '1', pro: '3', business: '10', enterprise: 'Unlimited' },
    ],
  },
  {
    name: 'Commerce Features',
    icon: Package,
    features: [
      { name: 'Transaction Fee', starter: '2.9%', pro: '2.5%', business: '2.2%', enterprise: 'Custom' },
      { name: 'Payment Gateways', starter: 'Stripe, PayPal', pro: 'All Major', business: 'All + Custom', enterprise: 'All + Custom' },
      { name: 'Abandoned Cart Recovery', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Multi-currency', starter: false, pro: true, business: true, enterprise: true },
    ],
  },
  {
    name: 'AI & Automation',
    icon: Cpu,
    features: [
      { name: 'AI Product Descriptions', starter: false, pro: true, business: true, enterprise: true },
      { name: 'AI-Powered Search', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Smart Recommendations', starter: false, pro: 'Basic', business: 'Advanced', enterprise: 'Custom' },
      { name: 'Inventory Forecasting', starter: false, pro: true, business: true, enterprise: true },
    ],
  },
  {
    name: 'Analytics & Reporting',
    icon: BarChart3,
    features: [
      { name: 'Basic Analytics', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Advanced Reports', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Custom Dashboards', starter: false, pro: false, business: true, enterprise: true },
      { name: 'Data Export', starter: 'CSV', pro: 'CSV, Excel', business: 'All Formats', enterprise: 'All + API' },
    ],
  },
  {
    name: 'Support & Security',
    icon: Shield,
    features: [
      { name: 'Email Support', starter: true, pro: true, business: true, enterprise: true },
      { name: 'Priority Support', starter: false, pro: true, business: true, enterprise: true },
      { name: 'Phone Support', starter: false, pro: false, business: false, enterprise: true },
      { name: 'Dedicated Account Manager', starter: false, pro: false, business: true, enterprise: true },
      { name: 'SLA Guarantee', starter: false, pro: false, business: '99.9%', enterprise: '99.99%' },
    ],
  },
];

// FAQ data
const faqs = [
  {
    question: 'Can I try Rendrix before committing to a plan?',
    answer: 'Absolutely! All plans come with a 14-day free trial with full access to features. No credit card required to start. You can upgrade, downgrade, or cancel at any time during or after your trial.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice with NET 30 terms.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features and we\'ll prorate your billing. When downgrading, changes take effect at the next billing cycle.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: 'We\'ll notify you when you\'re approaching your limits. You can either upgrade to a higher plan or purchase add-ons for specific features. We never automatically charge you or shut down your store.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! When you choose annual billing, you get 2 months free—that\'s roughly 17% savings compared to monthly billing. Enterprise customers can negotiate custom terms for multi-year agreements.',
  },
  {
    question: 'Is there a setup fee or hidden costs?',
    answer: 'No setup fees, no hidden costs. The price you see is the price you pay. Transaction fees are clearly stated for each plan and are only charged on successful sales. Domain registration and third-party integrations may have separate costs.',
  },
  {
    question: 'What\'s included in priority support?',
    answer: 'Priority support includes faster response times (under 4 hours vs 24 hours), access to chat support during business hours, and direct escalation paths. Business and Enterprise plans also get dedicated account managers.',
  },
  {
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'We offer a 30-day money-back guarantee for all new customers. If you\'re not completely satisfied within the first 30 days, contact us for a full refund—no questions asked.',
  },
];

// Trust signals
const trustSignals = [
  { icon: Shield, title: '99.99% Uptime', description: 'Enterprise-grade reliability' },
  { icon: Lock, title: 'SOC 2 Compliant', description: 'Bank-level security' },
  { icon: CreditCard, title: 'PCI DSS Level 1', description: 'Secure payments' },
  { icon: Clock, title: '24/7 Monitoring', description: 'Always protected' },
];

// Billing toggle component
function BillingToggle({
  isAnnual,
  onToggle,
}: {
  isAnnual: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-white/50'}`}>
        Monthly
      </span>
      <button
        onClick={onToggle}
        className="relative w-16 h-8 rounded-full bg-white/10 border border-white/10 transition-colors hover:bg-white/15"
      >
        <motion.div
          className="absolute top-1 w-6 h-6 rounded-full bg-primary"
          animate={{ left: isAnnual ? '34px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-white/50'}`}>
        Annual
      </span>
      <span className="ml-2 px-2 py-0.5 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
        Save 17%
      </span>
    </div>
  );
}

// Pricing card component
function PricingCard({
  plan,
  isAnnual,
  index,
}: {
  plan: typeof pricingPlans[0];
  isAnnual: boolean;
  index: number;
}) {
  const Icon = plan.icon;
  const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
  const period = isAnnual ? '/year' : '/month';

  return (
    <motion.div
      variants={scaleIn}
      className={`relative rounded-2xl overflow-hidden ${
        plan.popular
          ? 'bg-gradient-to-b from-primary/20 via-primary/5 to-transparent border-2 border-primary/50'
          : 'bg-white/[0.02] border border-white/[0.06]'
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="px-4 py-1 bg-primary text-black text-xs font-bold rounded-full">
            MOST POPULAR
          </div>
        </div>
      )}

      {/* Glow effect for popular */}
      {plan.popular && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      )}

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            plan.popular ? 'bg-primary/20' : 'bg-white/5'
          }`}>
            <Icon className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-white/60'}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
          </div>
        </div>

        <p className="text-white/50 text-sm mb-6 min-h-[40px]">{plan.description}</p>

        {/* Price */}
        <div className="mb-6">
          {price !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">${price}</span>
              <span className="text-white/50 text-sm">{period}</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
          )}
          {isAnnual && plan.savings && (
            <p className="text-sm text-emerald-400 mt-1">Save ${plan.savings}/year</p>
          )}
        </div>

        {/* CTA Button */}
        <Link
          href={plan.id === 'enterprise' ? '/contact' : '/register'}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all mb-8 ${
            plan.ctaVariant === 'primary'
              ? 'bg-primary text-black hover:bg-primary/90'
              : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
          }`}
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Features */}
        <div className="space-y-3">
          {plan.features.map((feature) => (
            <div key={feature.name} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-white/20 flex-shrink-0" />
              )}
              <span className={`text-sm ${feature.included ? 'text-white/80' : 'text-white/30'}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Feature comparison row
function FeatureRow({
  feature,
}: {
  feature: { name: string; starter: string | boolean; pro: string | boolean; business: string | boolean; enterprise: string | boolean };
}) {
  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-white/20 mx-auto" />
      );
    }
    return <span className="text-white/80 text-sm">{value}</span>;
  };

  return (
    <div className="grid grid-cols-5 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
      <div className="text-white/60 text-sm pl-4">{feature.name}</div>
      <div className="text-center">{renderValue(feature.starter)}</div>
      <div className="text-center">{renderValue(feature.pro)}</div>
      <div className="text-center">{renderValue(feature.business)}</div>
      <div className="text-center">{renderValue(feature.enterprise)}</div>
    </div>
  );
}

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
    <div className="border-b border-white/[0.06]">
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
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/60 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/70">Simple, transparent pricing</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Choose your</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
                growth plan
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Start free, scale infinitely. No hidden fees, no surprises.
              Join thousands of brands building the future of commerce.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div variants={fadeInUp}>
              <BillingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pricingPlans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="relative py-16 px-6 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {trustSignals.map((signal) => (
              <motion.div key={signal.title} variants={fadeInUp} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <signal.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-white font-semibold mb-1">{signal.title}</h4>
                <p className="text-sm text-white/50">{signal.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Toggle */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare plans in detail
            </h2>
            <p className="text-white/60 mb-8">
              See exactly what you get with each plan
            </p>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              {showComparison ? 'Hide comparison' : 'Show full comparison'}
              <motion.div
                animate={{ rotate: showComparison ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
          </motion.div>

          {/* Feature Comparison Table */}
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-5 py-4 bg-white/[0.02] border-b border-white/[0.06]">
                    <div className="pl-4 text-white/40 text-sm font-medium">Features</div>
                    <div className="text-center text-white font-semibold">Starter</div>
                    <div className="text-center text-primary font-semibold">Pro</div>
                    <div className="text-center text-white font-semibold">Business</div>
                    <div className="text-center text-white font-semibold">Enterprise</div>
                  </div>

                  {/* Feature Categories */}
                  {featureCategories.map((category) => (
                    <div key={category.name}>
                      {/* Category Header */}
                      <div className="grid grid-cols-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                        <div className="pl-4 flex items-center gap-2">
                          <category.icon className="w-4 h-4 text-primary" />
                          <span className="text-white font-medium text-sm">{category.name}</span>
                        </div>
                        <div className="col-span-4" />
                      </div>
                      {/* Features */}
                      {category.features.map((feature) => (
                        <FeatureRow key={feature.name} feature={feature} />
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="relative py-20 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why brands choose Rendrix
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                More than just a platform—a partner in your commerce journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: 'Go global instantly',
                  description: 'Multi-currency, multi-language, and local payment methods built-in. Reach customers in 190+ countries from day one.',
                },
                {
                  icon: Sparkles,
                  title: 'AI-powered growth',
                  description: 'Smart product recommendations, automated descriptions, and predictive analytics help you sell more with less effort.',
                },
                {
                  icon: Shield,
                  title: 'Enterprise security',
                  description: 'SOC 2 compliant, PCI DSS Level 1 certified. Your data and your customers\' data is always protected.',
                },
                {
                  icon: Headphones,
                  title: 'World-class support',
                  description: 'Our commerce experts are here to help you succeed. Priority support with response times under 4 hours.',
                },
                {
                  icon: Zap,
                  title: 'Lightning fast',
                  description: 'Built for performance with global CDN, edge caching, and optimized checkout. Speed equals conversions.',
                },
                {
                  icon: Users,
                  title: 'Scale with confidence',
                  description: 'From 10 orders to 10 million. Our infrastructure grows with you, handling traffic spikes effortlessly.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-primary" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              &quot;Switching to Rendrix was the best decision we made. Our conversion rate increased by 40% in the first month, and the AI features have saved us countless hours. The transparent pricing means no surprises.&quot;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-black font-bold">
                JM
              </div>
              <div>
                <p className="text-white font-semibold">Jennifer Martinez</p>
                <p className="text-white/50 text-sm">CEO, Bloom & Grow Co.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-6 bg-white/[0.01]">
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
                <span className="text-sm text-white/70">Common questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently asked questions
              </h2>
              <p className="text-white/60">
                Everything you need to know about our pricing
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
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

      {/* Money-back Guarantee */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-white/60">
                Try Rendrix risk-free. If you&apos;re not completely satisfied within the first 30 days,
                we&apos;ll refund your payment in full—no questions asked. We&apos;re that confident you&apos;ll love it.
              </p>
            </div>
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
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your commerce?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Join 25,000+ brands already growing with Rendrix. Start your 14-day free trial today.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                Talk to Sales
              </Link>
            </motion.div>
            <motion.p variants={fadeInUp} className="mt-6 text-sm text-white/40">
              No credit card required · 14-day free trial · Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

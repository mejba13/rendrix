import {
  Gift,
  Zap,
  Building2,
  Crown,
} from 'lucide-react';

/**
 * Standardized Pricing Configuration
 * Single source of truth for all pricing across the application
 */

export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Gift | typeof Zap | typeof Building2 | typeof Crown;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  savings: number | null;
  popular: boolean;
  highlighted: boolean;
  color: 'emerald' | 'primary' | 'blue' | 'purple';
  gradient: string;
  iconColor: string;
  features: PricingFeature[];
  limits: {
    stores: number | null;
    products: number | null;
    teamMembers: number | null;
    storage: string;
    transactionFee: string;
  };
  cta: string;
  ctaVariant: 'primary' | 'secondary';
  ctaLink: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    slug: 'free',
    name: 'Free',
    tagline: 'Forever free',
    description: 'Perfect for getting started',
    icon: Gift,
    monthlyPrice: 0,
    yearlyPrice: 0,
    savings: null,
    popular: false,
    highlighted: false,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/10',
    iconColor: 'text-emerald-500',
    features: [
      { name: '1 Online Store', included: true },
      { name: 'Up to 50 Products', included: true },
      { name: '1 Team Member', included: true },
      { name: '5% Transaction Fee', included: true },
      { name: '1GB Storage', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Email Support', included: true },
      { name: 'SSL Certificate', included: true },
    ],
    limits: {
      stores: 1,
      products: 50,
      teamMembers: 1,
      storage: '1GB',
      transactionFee: '5%',
    },
    cta: 'Get Started',
    ctaVariant: 'secondary',
    ctaLink: '/register',
  },
  {
    id: 'pro',
    slug: 'pro',
    name: 'Pro',
    tagline: 'Most Popular',
    description: 'For growing businesses',
    icon: Zap,
    monthlyPrice: 29,
    yearlyPrice: 290, // $24.17/month billed annually
    savings: 58, // Save $58/year
    popular: true,
    highlighted: true,
    color: 'primary',
    gradient: 'from-primary/20 to-orange-500/10',
    iconColor: 'text-primary',
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
    limits: {
      stores: 3,
      products: 500,
      teamMembers: 5,
      storage: '10GB',
      transactionFee: '2.9%',
    },
    cta: 'Start Free Trial',
    ctaVariant: 'primary',
    ctaLink: '/register',
  },
  {
    id: 'business',
    slug: 'business',
    name: 'Business',
    tagline: 'For scaling brands',
    description: 'Advanced tools for growth',
    icon: Building2,
    monthlyPrice: 79,
    yearlyPrice: 790, // $65.83/month billed annually
    savings: 158, // Save $158/year
    popular: false,
    highlighted: false,
    color: 'blue',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'text-blue-500',
    features: [
      { name: '10 Online Stores', included: true },
      { name: 'Unlimited Products', included: true },
      { name: '15 Team Members', included: true },
      { name: '2.5% Transaction Fee', included: true },
      { name: '50GB Storage', included: true },
      { name: 'Advanced Analytics + Reports', included: true },
      { name: 'Priority Chat & Email Support', included: true },
      { name: '5 Custom Domains', included: true },
      { name: 'AI Suite (Full Access)', included: true },
      { name: 'Inventory Forecasting', included: true },
      { name: 'API Access', included: true },
      { name: 'Dedicated Account Manager', included: true },
    ],
    limits: {
      stores: 10,
      products: null, // Unlimited
      teamMembers: 15,
      storage: '50GB',
      transactionFee: '2.5%',
    },
    cta: 'Start Free Trial',
    ctaVariant: 'secondary',
    ctaLink: '/register',
  },
  {
    id: 'enterprise',
    slug: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom solutions',
    description: 'For large organizations',
    icon: Crown,
    monthlyPrice: null,
    yearlyPrice: null,
    savings: null,
    popular: false,
    highlighted: false,
    color: 'purple',
    gradient: 'from-purple-500/20 to-violet-500/10',
    iconColor: 'text-purple-500',
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
    limits: {
      stores: null, // Unlimited
      products: null, // Unlimited
      teamMembers: null, // Unlimited
      storage: 'Unlimited',
      transactionFee: 'Custom',
    },
    cta: 'Contact Sales',
    ctaVariant: 'secondary',
    ctaLink: '/contact',
  },
];

// Helper functions
export const getPlanBySlug = (slug: string): PricingPlan | undefined => {
  return pricingPlans.find((plan) => plan.slug === slug);
};

export const getPopularPlan = (): PricingPlan | undefined => {
  return pricingPlans.find((plan) => plan.popular);
};

export const formatPlanPrice = (
  plan: PricingPlan,
  isAnnual: boolean = false
): string => {
  if (plan.monthlyPrice === null) {
    return 'Custom';
  }
  if (plan.monthlyPrice === 0) {
    return '$0';
  }
  const price = isAnnual ? Math.round((plan.yearlyPrice || 0) / 12) : plan.monthlyPrice;
  return `$${price}`;
};

export const getAnnualSavings = (plan: PricingPlan): number | null => {
  if (!plan.monthlyPrice || !plan.yearlyPrice) return null;
  return plan.monthlyPrice * 12 - plan.yearlyPrice;
};

// Plan comparison for upgrade/downgrade
export const comparePlans = (
  currentSlug: string,
  targetSlug: string
): 'upgrade' | 'downgrade' | 'same' => {
  const planOrder = ['free', 'pro', 'business', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentSlug);
  const targetIndex = planOrder.indexOf(targetSlug);

  if (currentIndex < targetIndex) return 'upgrade';
  if (currentIndex > targetIndex) return 'downgrade';
  return 'same';
};

// FAQ data for pricing pages
export const pricingFAQs = [
  {
    question: 'Can I try Rendrix before committing?',
    answer:
      'Yes! Start with our Free plan forever, or get a 14-day free trial of Pro or Business plans. No credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Absolutely. Upgrade or downgrade anytime. Changes take effect immediately with prorated billing.',
  },
  {
    question: 'What happens when I exceed my limits?',
    answer:
      "We'll notify you before you hit limits. You can upgrade or purchase add-ons. We never shut down your store.",
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes, 30-day money-back guarantee on all paid plans. No questions asked.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer:
      'Yes! Nonprofits and educational institutions get 50% off any plan. Contact us with your organization details.',
  },
];

// Trust badges
export const trustBadges = [
  { text: '14-day free trial', icon: 'shield' as const },
  { text: 'No credit card required', icon: 'lock' as const },
  { text: 'Cancel anytime', icon: 'clock' as const },
  { text: '30-day money back', icon: 'creditCard' as const },
];

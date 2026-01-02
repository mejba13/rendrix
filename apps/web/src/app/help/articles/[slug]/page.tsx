'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Eye,
  BookOpen,
  Calendar,
  ChevronRight,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  Copy,
  Check,
  HelpCircle,
  Rocket,
  CreditCard,
  Store,
  ShoppingCart,
  Brain,
  Plug,
  Shield,
  Code,
  Zap,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

// Category configuration with Rendrix brand colors
// Brand palette: Primary #FF9100, Secondary #FFB84D (light), #FF6B00 (dark)
const categoryConfig: Record<string, {
  icon: React.ElementType;
  color: string;
  label: string;
  bgGradient: string;
  accentColor: string;
  glowColor: string;
}> = {
  'getting-started': {
    icon: Rocket,
    color: 'from-primary to-orange-600',
    label: 'Getting Started',
    bgGradient: 'from-primary/20 via-orange-500/10 to-amber-500/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
  'account-billing': {
    icon: CreditCard,
    color: 'from-primary to-amber-500',
    label: 'Account & Billing',
    bgGradient: 'from-primary/18 via-amber-500/10 to-orange-500/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
  'stores-products': {
    icon: Store,
    color: 'from-orange-500 to-primary',
    label: 'Stores & Products',
    bgGradient: 'from-orange-500/20 via-primary/12 to-amber-500/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.4)',
  },
  'orders-payments': {
    icon: ShoppingCart,
    color: 'from-primary to-orange-500',
    label: 'Orders & Payments',
    bgGradient: 'from-primary/22 via-orange-400/10 to-amber-400/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
  'ai-features': {
    icon: Brain,
    color: 'from-amber-500 to-primary',
    label: 'AI Features',
    bgGradient: 'from-amber-500/18 via-primary/12 to-orange-500/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
  'integrations': {
    icon: Plug,
    color: 'from-primary to-amber-400',
    label: 'Integrations',
    bgGradient: 'from-primary/20 via-amber-400/10 to-orange-400/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
  'security': {
    icon: Shield,
    color: 'from-orange-600 to-primary',
    label: 'Security',
    bgGradient: 'from-orange-600/18 via-primary/12 to-amber-500/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
  'api-developers': {
    icon: Code,
    color: 'from-amber-500 to-orange-600',
    label: 'API & Developers',
    bgGradient: 'from-amber-500/20 via-orange-500/12 to-primary/5',
    accentColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.35)',
  },
};

// Article content type
interface ArticleSection {
  id: string;
  title: string;
  content: string;
  type?: 'text' | 'steps' | 'code' | 'tip' | 'warning' | 'info';
  steps?: string[];
  code?: string;
  language?: string;
}

interface ArticleData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  readTime: number;
  trending?: boolean;
  date: string;
  author: string;
  sections: ArticleSection[];
  relatedArticles: string[];
}

// Comprehensive article database
const articlesDatabase: Record<string, ArticleData> = {
  'create-first-store': {
    slug: 'create-first-store',
    title: 'How to create your first online store in 5 minutes',
    excerpt: 'Learn the step-by-step process to launch your first Rendrix store, from signing up to publishing your storefront.',
    category: 'getting-started',
    views: 15420,
    readTime: 5,
    trending: true,
    date: '2025-01-15',
    author: 'Rendrix Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Creating your first online store with Rendrix is quick and straightforward. In this guide, we\'ll walk you through the entire process from account creation to launching your live storefront. Whether you\'re selling physical products, digital downloads, or services, Rendrix provides all the tools you need to get started.',
        type: 'text',
      },
      {
        id: 'prerequisites',
        title: 'What you\'ll need',
        content: 'Before you begin, make sure you have the following ready:',
        type: 'steps',
        steps: [
          'A valid email address for account verification',
          'Basic information about your business (name, description)',
          'At least one product to list (images and details)',
          'A payment method for your subscription (free trial available)',
        ],
      },
      {
        id: 'step-1',
        title: 'Step 1: Create your Rendrix account',
        content: 'Visit rendrix.com and click "Start Free Trial" in the top navigation. Enter your email address and create a secure password. You\'ll receive a verification email—click the link to confirm your account.',
        type: 'text',
      },
      {
        id: 'tip-verification',
        title: 'Pro Tip',
        content: 'Check your spam folder if you don\'t see the verification email within a few minutes. You can also resend the verification from the login page.',
        type: 'tip',
      },
      {
        id: 'step-2',
        title: 'Step 2: Set up your store profile',
        content: 'After logging in, you\'ll be guided through the store setup wizard. Start by entering your store name, selecting your industry, and describing what you sell. This information helps Rendrix customize your dashboard and recommendations.',
        type: 'text',
      },
      {
        id: 'step-3',
        title: 'Step 3: Choose your theme',
        content: 'Browse our library of professionally designed themes optimized for conversion. Each theme is fully customizable—you can change colors, fonts, layouts, and more. Preview themes on both desktop and mobile before selecting one.',
        type: 'text',
      },
      {
        id: 'step-4',
        title: 'Step 4: Add your first product',
        content: 'Navigate to Products > Add Product from your dashboard. Fill in the essential details:',
        type: 'steps',
        steps: [
          'Product name and description (use our AI assistant for help)',
          'Upload high-quality product images (drag and drop supported)',
          'Set your price and compare-at price for sales',
          'Configure inventory tracking if applicable',
          'Add product variants like size or color',
        ],
      },
      {
        id: 'step-5',
        title: 'Step 5: Configure payments',
        content: 'Go to Settings > Payments to connect your payment processor. Rendrix integrates seamlessly with Stripe, PayPal, and other major gateways. For the fastest setup, use Stripe—you can be accepting payments in under 2 minutes.',
        type: 'text',
      },
      {
        id: 'warning-payments',
        title: 'Important',
        content: 'Complete your payment processor verification to avoid any delays in receiving payouts. This typically requires basic business information and bank account details.',
        type: 'warning',
      },
      {
        id: 'step-6',
        title: 'Step 6: Launch your store',
        content: 'Review your store settings, ensure your legal pages (privacy policy, terms of service) are configured, and click "Publish Store" in the top right corner. Your store is now live! Share your store URL on social media to start driving traffic.',
        type: 'text',
      },
      {
        id: 'next-steps',
        title: 'Next steps',
        content: 'Congratulations on launching your store! Here are some recommended next steps to grow your business:',
        type: 'steps',
        steps: [
          'Connect a custom domain for a professional brand presence',
          'Set up Google Analytics to track visitor behavior',
          'Configure email notifications for orders and abandoned carts',
          'Explore our marketing integrations for social selling',
          'Join the Rendrix community for tips from other merchants',
        ],
      },
    ],
    relatedArticles: ['connecting-custom-domain', 'choosing-theme', 'first-product-guide'],
  },
  'stripe-paypal-setup': {
    slug: 'stripe-paypal-setup',
    title: 'Setting up Stripe and PayPal payment gateways',
    excerpt: 'Connect your payment processors to start accepting credit cards, digital wallets, and more.',
    category: 'orders-payments',
    views: 12350,
    readTime: 8,
    trending: true,
    date: '2025-01-17',
    author: 'Rendrix Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Accepting online payments is essential for any ecommerce business. Rendrix integrates with industry-leading payment processors to provide secure, reliable payment processing. This guide covers setting up both Stripe and PayPal—the two most popular options among our merchants.',
        type: 'text',
      },
      {
        id: 'comparison',
        title: 'Stripe vs PayPal: Which to choose?',
        content: 'Both Stripe and PayPal are excellent choices, but they have different strengths. Stripe offers lower fees and better developer tools, while PayPal has higher brand recognition and buyer protection features. We recommend enabling both to maximize conversion—customers appreciate having payment options.',
        type: 'info',
      },
      {
        id: 'stripe-setup',
        title: 'Setting up Stripe',
        content: 'Stripe is our recommended payment processor for most merchants due to its competitive rates, excellent reliability, and comprehensive feature set.',
        type: 'text',
      },
      {
        id: 'stripe-steps',
        title: 'Stripe configuration steps',
        content: 'Follow these steps to connect Stripe to your Rendrix store:',
        type: 'steps',
        steps: [
          'Go to Settings > Payments in your Rendrix dashboard',
          'Click "Connect Stripe" in the payment gateways section',
          'Sign in to your existing Stripe account or create a new one',
          'Authorize Rendrix to access your Stripe account',
          'Complete the Stripe onboarding if you\'re a new user',
          'Test with a test card number (4242 4242 4242 4242)',
        ],
      },
      {
        id: 'stripe-features',
        title: 'Stripe features available',
        content: 'Once connected, you\'ll have access to these Stripe features through Rendrix:',
        type: 'steps',
        steps: [
          'Credit and debit card payments (Visa, Mastercard, Amex, Discover)',
          'Digital wallets (Apple Pay, Google Pay, Link)',
          'Buy now, pay later options (Klarna, Afterpay)',
          'Local payment methods based on customer location',
          'Automatic currency conversion for international sales',
          'Advanced fraud protection with Stripe Radar',
        ],
      },
      {
        id: 'paypal-setup',
        title: 'Setting up PayPal',
        content: 'PayPal offers a trusted checkout experience that many customers prefer, especially for first-time purchases from unfamiliar stores.',
        type: 'text',
      },
      {
        id: 'paypal-steps',
        title: 'PayPal configuration steps',
        content: 'Follow these steps to connect PayPal:',
        type: 'steps',
        steps: [
          'Navigate to Settings > Payments in Rendrix',
          'Click "Connect PayPal" and sign into your PayPal Business account',
          'Grant the necessary permissions for payment processing',
          'Configure your PayPal checkout preferences',
          'Enable PayPal Pay Later for installment options',
        ],
      },
      {
        id: 'tip-both',
        title: 'Pro Tip',
        content: 'Enable both payment methods and let customers choose. Studies show that offering PayPal alongside card payments can increase conversion by 28% on average.',
        type: 'tip',
      },
      {
        id: 'testing',
        title: 'Testing your setup',
        content: 'Always test your payment configuration before going live. Use test mode to simulate transactions without processing real payments. Verify that order confirmations, receipts, and inventory updates work correctly.',
        type: 'text',
      },
      {
        id: 'troubleshooting',
        title: 'Common issues and solutions',
        content: 'If you encounter problems with payment setup, check these common issues:',
        type: 'steps',
        steps: [
          'Ensure your Stripe/PayPal account is fully verified',
          'Check that your business country matches your Rendrix settings',
          'Verify your currency settings are consistent',
          'Disable any browser extensions that might block OAuth flows',
          'Contact support if authorization repeatedly fails',
        ],
      },
    ],
    relatedArticles: ['order-fulfillment', 'refunds-returns', 'tax-configuration'],
  },
  'ai-product-descriptions': {
    slug: 'ai-product-descriptions',
    title: 'Using AI to generate product descriptions',
    excerpt: 'Leverage our AI writing assistant to create compelling, SEO-optimized product descriptions in seconds.',
    category: 'ai-features',
    views: 8540,
    readTime: 4,
    trending: true,
    date: '2025-01-18',
    author: 'Rendrix Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Writing unique, compelling product descriptions for every item in your catalog can be time-consuming. Rendrix AI solves this by generating high-quality, SEO-optimized descriptions in seconds. Our AI understands ecommerce best practices and creates content that converts browsers into buyers.',
        type: 'text',
      },
      {
        id: 'accessing-ai',
        title: 'Accessing the AI Description Generator',
        content: 'The AI writing assistant is available directly in your product editor:',
        type: 'steps',
        steps: [
          'Navigate to Products and select a product to edit',
          'Click the "AI Generate" button next to the description field',
          'Alternatively, use the sparkle icon (✨) in the toolbar',
          'The AI panel will open with generation options',
        ],
      },
      {
        id: 'generating',
        title: 'Generating your first description',
        content: 'The AI uses your product details to create relevant content. For best results, ensure your product has a clear title, category, and at least one image. You can also provide additional context like target audience, key features, or brand voice guidelines.',
        type: 'text',
      },
      {
        id: 'options',
        title: 'Customization options',
        content: 'Tailor the AI output with these settings:',
        type: 'steps',
        steps: [
          'Tone: Professional, Casual, Luxury, Playful, or Technical',
          'Length: Brief (50 words), Standard (100 words), or Detailed (200+ words)',
          'Focus: Features, Benefits, Storytelling, or SEO-optimized',
          'Format: Paragraph, bullet points, or structured sections',
          'Include: Specific keywords, CTAs, or brand terminology',
        ],
      },
      {
        id: 'tip-editing',
        title: 'Pro Tip',
        content: 'Always review and personalize AI-generated content. Add specific details about materials, sizing, or unique selling points that only you know. This creates authentic content while saving significant time.',
        type: 'tip',
      },
      {
        id: 'seo-optimization',
        title: 'SEO optimization',
        content: 'Our AI automatically incorporates SEO best practices, including relevant keywords, optimal length for search visibility, and structured content. You can also specify target keywords to ensure they\'re naturally included in the description.',
        type: 'text',
      },
      {
        id: 'bulk-generation',
        title: 'Bulk description generation',
        content: 'Need descriptions for multiple products? Use our bulk generation feature from the Products list view. Select multiple products, click "AI Actions," and choose "Generate Descriptions." The AI will process each product using its unique details.',
        type: 'text',
      },
      {
        id: 'best-practices',
        title: 'Best practices',
        content: 'Follow these tips for optimal results:',
        type: 'steps',
        steps: [
          'Provide clear, accurate product titles',
          'Add relevant product tags and categories',
          'Upload quality images (AI can analyze visual details)',
          'Specify your brand voice in the settings',
          'Review and refine generated content',
          'A/B test different description styles',
        ],
      },
    ],
    relatedArticles: ['ai-image-enhancement', 'product-seo', 'bulk-product-import'],
  },
  'inventory-management': {
    slug: 'inventory-management',
    title: 'Managing inventory and stock levels effectively',
    excerpt: 'Set up stock tracking, low-stock alerts, and automatic inventory sync across multiple sales channels.',
    category: 'stores-products',
    views: 9870,
    readTime: 6,
    trending: false,
    date: '2025-01-16',
    author: 'Rendrix Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Effective inventory management is crucial for ecommerce success. Running out of stock loses sales, while overstocking ties up capital. Rendrix provides powerful tools to track inventory, automate reordering, and sync stock across all your sales channels.',
        type: 'text',
      },
      {
        id: 'enabling-tracking',
        title: 'Enabling inventory tracking',
        content: 'To enable inventory tracking for a product:',
        type: 'steps',
        steps: [
          'Go to Products and select the product to edit',
          'Scroll to the Inventory section',
          'Toggle "Track quantity" to enable',
          'Enter your current stock quantity',
          'Set a SKU (Stock Keeping Unit) for reference',
        ],
      },
      {
        id: 'stock-locations',
        title: 'Managing multiple stock locations',
        content: 'If you store inventory in multiple warehouses or retail locations, Rendrix supports location-based inventory tracking. Add locations in Settings > Locations, then assign stock quantities to each location per product.',
        type: 'text',
      },
      {
        id: 'low-stock-alerts',
        title: 'Setting up low-stock alerts',
        content: 'Never run out of your best sellers with automatic alerts:',
        type: 'steps',
        steps: [
          'Go to Settings > Notifications > Inventory',
          'Enable "Low stock alerts"',
          'Set your default threshold (e.g., 10 units)',
          'Choose notification method (email, dashboard, or both)',
          'Optionally set product-specific thresholds',
        ],
      },
      {
        id: 'warning-overselling',
        title: 'Preventing overselling',
        content: 'Enable "Stop selling when out of stock" in your inventory settings to automatically hide products when stock reaches zero. For products with longer lead times, consider enabling this at a higher threshold.',
        type: 'warning',
      },
      {
        id: 'channel-sync',
        title: 'Syncing inventory across channels',
        content: 'If you sell on multiple platforms (Amazon, eBay, social commerce), Rendrix can automatically sync inventory. Connect your channels in Settings > Sales Channels, and enable inventory sync. Stock updates in real-time across all platforms.',
        type: 'text',
      },
      {
        id: 'inventory-history',
        title: 'Viewing inventory history',
        content: 'Track all inventory changes in the Inventory History tab. See adjustments from sales, returns, manual updates, and imports. Use filters to analyze stock movement patterns and identify trends.',
        type: 'text',
      },
      {
        id: 'bulk-adjustments',
        title: 'Making bulk adjustments',
        content: 'Update inventory for multiple products at once using our bulk editor or CSV import. Export your current inventory, make changes in a spreadsheet, and re-import to update quantities.',
        type: 'text',
      },
    ],
    relatedArticles: ['product-variants', 'bulk-product-import', 'analytics-dashboard'],
  },
  'api-quickstart': {
    slug: 'api-quickstart',
    title: 'API quickstart guide',
    excerpt: 'Get up and running with the Rendrix API in minutes with authentication and your first request.',
    category: 'api-developers',
    views: 7890,
    readTime: 6,
    trending: true,
    date: '2025-01-17',
    author: 'Rendrix Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'The Rendrix API enables you to programmatically access your store data and perform operations like managing products, processing orders, and syncing inventory. This quickstart guide will get you making API requests in minutes.',
        type: 'text',
      },
      {
        id: 'getting-api-key',
        title: 'Getting your API key',
        content: 'To access the API, you\'ll need an API key:',
        type: 'steps',
        steps: [
          'Go to Settings > API & Webhooks in your Rendrix dashboard',
          'Click "Create API Key" in the API Keys section',
          'Give your key a descriptive name (e.g., "Inventory Sync")',
          'Select the permissions your integration needs',
          'Click "Create" and securely store your key',
        ],
      },
      {
        id: 'warning-key-security',
        title: 'Security Warning',
        content: 'Your API key provides access to your store data. Never expose it in client-side code, public repositories, or share it with untrusted parties. If a key is compromised, revoke it immediately from your dashboard.',
        type: 'warning',
      },
      {
        id: 'base-url',
        title: 'API base URL',
        content: 'All API requests should be made to:',
        type: 'code',
        code: 'https://api.rendrix.com/v1/',
        language: 'text',
      },
      {
        id: 'authentication',
        title: 'Authentication',
        content: 'Include your API key in the Authorization header of every request:',
        type: 'code',
        code: 'Authorization: Bearer YOUR_API_KEY',
        language: 'text',
      },
      {
        id: 'first-request',
        title: 'Making your first request',
        content: 'Let\'s fetch your store information to verify your setup:',
        type: 'code',
        code: `curl https://api.rendrix.com/v1/store \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        language: 'bash',
      },
      {
        id: 'response-format',
        title: 'Understanding responses',
        content: 'The API returns JSON responses. Successful requests return a 2xx status code with the requested data. Error responses include an error object with a descriptive message and error code.',
        type: 'text',
      },
      {
        id: 'example-products',
        title: 'Example: Listing products',
        content: 'Here\'s how to fetch your products with pagination:',
        type: 'code',
        code: `curl "https://api.rendrix.com/v1/products?limit=20&page=1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        language: 'bash',
      },
      {
        id: 'rate-limits',
        title: 'Rate limits',
        content: 'The API is rate-limited to protect service quality. Standard plans allow 100 requests per minute. Enterprise plans have higher limits. Check the X-RateLimit headers in responses to monitor your usage.',
        type: 'info',
      },
      {
        id: 'next-steps',
        title: 'Next steps',
        content: 'Now that you\'re set up, explore more capabilities:',
        type: 'steps',
        steps: [
          'Browse the full API Reference for all endpoints',
          'Set up webhooks for real-time event notifications',
          'Download our SDKs for JavaScript, Python, PHP, and Ruby',
          'Join our developer community for support and updates',
        ],
      },
    ],
    relatedArticles: ['webhooks-setup', 'api-authentication', 'graphql-api'],
  },
  'connecting-custom-domain': {
    slug: 'connecting-custom-domain',
    title: 'Connecting your custom domain to your store',
    excerpt: 'Configure your own domain name for a professional storefront. Includes DNS setup and SSL certificate automation.',
    category: 'getting-started',
    views: 7620,
    readTime: 3,
    trending: false,
    date: '2025-01-12',
    author: 'Rendrix Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'A custom domain gives your store a professional presence and builds customer trust. Instead of yourstore.rendrix.com, customers will see www.yourbrand.com. Rendrix handles SSL certificates automatically, ensuring your store is always secure.',
        type: 'text',
      },
      {
        id: 'before-you-start',
        title: 'Before you start',
        content: 'You\'ll need a domain name from a registrar (like GoDaddy, Namecheap, or Google Domains). If you don\'t have one yet, you can purchase directly through Rendrix in Settings > Domains.',
        type: 'info',
      },
      {
        id: 'adding-domain',
        title: 'Adding your domain in Rendrix',
        content: 'Follow these steps to connect your domain:',
        type: 'steps',
        steps: [
          'Go to Settings > Domains in your Rendrix dashboard',
          'Click "Add Custom Domain"',
          'Enter your domain name (e.g., www.yourbrand.com)',
          'Choose whether to use www or the root domain as primary',
          'Click "Add Domain" to continue',
        ],
      },
      {
        id: 'dns-configuration',
        title: 'Configuring DNS records',
        content: 'After adding your domain, you\'ll see the DNS records you need to configure at your domain registrar. You\'ll typically need to add a CNAME record pointing to shops.rendrix.com, or A records pointing to our IP addresses.',
        type: 'text',
      },
      {
        id: 'verification',
        title: 'Verification and SSL',
        content: 'Once DNS is configured, Rendrix will automatically verify your domain and provision an SSL certificate. This usually takes 15-30 minutes but can take up to 24 hours for DNS propagation.',
        type: 'text',
      },
      {
        id: 'tip-propagation',
        title: 'Pro Tip',
        content: 'DNS changes can take time to propagate worldwide. Use a tool like whatsmydns.net to check if your DNS records have updated globally. Once verified, your SSL certificate will be issued automatically.',
        type: 'tip',
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        content: 'If verification fails, check these common issues:',
        type: 'steps',
        steps: [
          'Ensure DNS records exactly match the values shown in Rendrix',
          'Remove any conflicting A or CNAME records',
          'Wait for full DNS propagation (up to 24-48 hours)',
          'Check for typos in the domain name',
          'Contact your domain registrar if records won\'t save',
        ],
      },
    ],
    relatedArticles: ['create-first-store', 'store-settings-overview', 'ssl-certificates'],
  },
};

// Get all article slugs for navigation
const allArticleSlugs = Object.keys(articlesDatabase);

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      title="Copy code"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4 text-white/60" />
      )}
    </button>
  );
}

// Table of Contents Component - Rendrix brand styling
function TableOfContents({ sections, activeSection }: { sections: ArticleSection[]; activeSection: string }) {
  return (
    <nav className="space-y-1">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
          <BookOpen className="w-3 h-3 text-primary" />
        </div>
        On this page
      </h4>
      {sections.filter(s => s.type !== 'tip' && s.type !== 'warning' && s.type !== 'info').map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`block py-1.5 px-3 text-sm rounded-lg transition-all duration-200 ${
            activeSection === section.id
              ? 'text-primary bg-primary/10 border-l-2 border-primary font-medium'
              : 'text-white/50 hover:text-white hover:bg-primary/5 border-l-2 border-transparent'
          }`}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}

// Related Article Card - using Rendrix brand colors
function RelatedArticleCard({ slug }: { slug: string }) {
  const article = articlesDatabase[slug];
  if (!article) return null;

  const category = categoryConfig[article.category];

  return (
    <Link href={`/help/articles/${slug}`} className="group block">
      <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-primary/[0.04] hover:border-primary/20 transition-all duration-300">
        <div className="flex items-start gap-3">
          {category && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
              <category.icon className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h4>
            <span className="text-xs text-white/40 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min read
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}

// Section Renderer
function SectionContent({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case 'steps':
      return (
        <div id={section.id} className="scroll-mt-32">
          <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
          {section.content && <p className="text-white/60 mb-4 leading-relaxed">{section.content}</p>}
          <ul className="space-y-3">
            {section.steps?.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-white/70 pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'code':
      return (
        <div id={section.id} className="scroll-mt-32">
          <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
          {section.content && <p className="text-white/60 mb-4 leading-relaxed">{section.content}</p>}
          <div className="relative rounded-xl overflow-hidden bg-[#0d0d0d] border border-white/[0.06]">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              {section.language && (
                <span className="ml-auto text-xs text-white/40">{section.language}</span>
              )}
            </div>
            <CopyButton text={section.code || ''} />
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-emerald-400 font-mono">{section.code}</code>
            </pre>
          </div>
        </div>
      );

    case 'tip':
      return (
        <div id={section.id} className="rounded-xl border border-primary/20 bg-primary/5 p-5 my-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-primary mb-1">{section.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
            </div>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div id={section.id} className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 my-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-1">{section.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
            </div>
          </div>
        </div>
      );

    case 'info':
      return (
        <div id={section.id} className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 my-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-1">{section.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div id={section.id} className="scroll-mt-32">
          <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
          <p className="text-white/60 leading-relaxed">{section.content}</p>
        </div>
      );
  }
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [activeSection, setActiveSection] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not-helpful' | null>(null);

  const article = articlesDatabase[slug];
  const category = article ? categoryConfig[article.category] : null;

  // Find previous and next articles
  const currentIndex = allArticleSlugs.indexOf(slug);
  const prevArticle = currentIndex > 0 ? articlesDatabase[allArticleSlugs[currentIndex - 1]] : null;
  const nextArticle = currentIndex < allArticleSlugs.length - 1 ? articlesDatabase[allArticleSlugs[currentIndex + 1]] : null;

  // Track active section on scroll
  useEffect(() => {
    if (!article) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    article.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [article]);

  // 404 state
  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-white/30" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Article not found</h1>
          <p className="text-white/50 mb-8">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link
            href="/help/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse all articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
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
            <Link href="/features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            <Link href="/help" className="text-sm text-primary">Resources</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-primary to-orange-500 rounded-full">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Premium Editorial Hero Header */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Dynamic gradient mesh background based on category */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category?.bgGradient || 'from-primary/20 via-orange-500/10 to-transparent'}`} />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ backgroundColor: category?.glowColor || 'rgba(255, 145, 0, 0.15)' }}
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ backgroundColor: category?.glowColor || 'rgba(255, 145, 0, 0.15)' }}
          />
        </div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative floating geometric shapes - using brand colors */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-32 right-[15%] w-16 h-16 border border-primary/[0.08] rounded-2xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-48 right-[8%] w-8 h-8 border border-primary/[0.12] rounded-lg"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-24 left-[10%] w-3 h-3 bg-primary/30 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-40 left-[20%] w-2 h-2 bg-primary/20 rounded-full"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main content column */}
            <div className="lg:col-span-9 pt-8">
              {/* Animated Breadcrumb */}
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 text-sm mb-8 flex-wrap"
              >
                <Link
                  href="/help"
                  className="flex items-center gap-1.5 text-white/40 hover:text-white transition-all duration-300 group"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>Help Center</span>
                </Link>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-4 h-px bg-gradient-to-r from-white/20 to-transparent"
                />
                <Link
                  href="/help/articles"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  Articles
                </Link>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="w-4 h-px bg-gradient-to-r from-white/20 to-transparent"
                />
                <span className="text-white/60">{category?.label}</span>
              </motion.nav>

              {/* Category badge and trending */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                {category && (
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${category.color} blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                    <span className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${category.color} text-white text-sm font-semibold shadow-lg`}>
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </span>
                  </div>
                )}
                {article.trending && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm"
                  >
                    <Zap className="w-3 h-3 animate-pulse" />
                    TRENDING
                  </motion.span>
                )}
              </motion.div>

              {/* Magazine-style title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight group"
              >
                <span className="inline bg-gradient-to-r from-white via-white to-white/80 bg-clip-text group-hover:from-primary group-hover:via-orange-400 group-hover:to-white transition-all duration-500">
                  {article.title}
                </span>
              </motion.h1>

              {/* Elegant excerpt */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl md:text-2xl text-white/50 font-light leading-relaxed max-w-3xl mb-10"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {article.excerpt}
              </motion.p>

              {/* Glass morphism metadata pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {[
                  { icon: Calendar, label: new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), key: 'date' },
                  { icon: Clock, label: `${article.readTime} min read`, key: 'time' },
                  { icon: Eye, label: `${article.views.toLocaleString()} views`, key: 'views' },
                  { icon: BookOpen, label: article.author, key: 'author' },
                ].map((meta, index) => (
                  <motion.div
                    key={meta.key}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.45 + index * 0.08, duration: 0.4 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 rounded-xl bg-white/[0.03] blur-sm group-hover:bg-white/[0.06] transition-colors" />
                    <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl hover:border-white/[0.15] transition-all duration-300">
                      <meta.icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors font-medium">
                        {meta.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Large floating category icon */}
            <div className="hidden lg:flex lg:col-span-3 justify-center items-start pt-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
                className="relative"
              >
                {/* Animated glow rings */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-3xl"
                  style={{ boxShadow: `0 0 80px 40px ${category?.glowColor || 'rgba(255, 145, 0, 0.2)'}` }}
                />
                <motion.div
                  animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute inset-0 rounded-3xl"
                  style={{ boxShadow: `0 0 120px 60px ${category?.glowColor || 'rgba(255, 145, 0, 0.15)'}` }}
                />

                {/* Icon container */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${category?.color || 'from-primary to-orange-600'} p-0.5 shadow-2xl`}>
                    <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-black/20 to-transparent flex items-center justify-center backdrop-blur-sm">
                      {category && <category.icon className="w-14 h-14 text-white drop-shadow-lg" />}
                    </div>
                  </div>

                  {/* Decorative accents - brand colors */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-3 -right-3 w-6 h-6 rounded-lg border border-primary/20 bg-primary/[0.05]"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-2 -left-2 w-4 h-4 rounded-md bg-primary/30"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated gradient border separator */}
        <div className="relative mt-12">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            style={{ transformOrigin: 'center' }}
          />
          <div className="h-8 bg-gradient-to-b from-transparent to-black" />
        </div>
      </section>

      {/* Article Content */}
      <section className="relative py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 space-y-8"
            >
              {article.sections.map((section) => (
                <SectionContent key={section.id} section={section} />
              ))}

              {/* Feedback Section */}
              <div className="pt-8 mt-8 border-t border-white/[0.06]">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Was this article helpful?</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFeedbackGiven('helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        feedbackGiven === 'helpful'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes, it helped
                    </button>
                    <button
                      onClick={() => setFeedbackGiven('not-helpful')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        feedbackGiven === 'not-helpful'
                          ? 'border-red-500/50 bg-red-500/10 text-red-400'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Not really
                    </button>
                  </div>
                  {feedbackGiven && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-white/50 mt-4"
                    >
                      Thanks for your feedback! It helps us improve our documentation.
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Article Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                {prevArticle && (
                  <Link href={`/help/articles/${prevArticle.slug}`} className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <span className="text-xs text-white/40 mb-1 block">Previous article</span>
                    <span className="text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      {prevArticle.title}
                    </span>
                  </Link>
                )}
                {nextArticle && (
                  <Link href={`/help/articles/${nextArticle.slug}`} className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all md:text-right md:ml-auto">
                    <span className="text-xs text-white/40 mb-1 block">Next article</span>
                    <span className="text-white group-hover:text-primary transition-colors flex items-center gap-2 md:justify-end">
                      {nextArticle.title}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                )}
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
                >
                  <TableOfContents sections={article.sections} activeSection={activeSection} />
                </motion.div>

                {/* Related Articles */}
                {article.relatedArticles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
                  >
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary" />
                      </div>
                      Related Articles
                    </h4>
                    <div className="space-y-3">
                      {article.relatedArticles.map((slug) => (
                        <RelatedArticleCard key={slug} slug={slug} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Need Help Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6"
                >
                  <h4 className="text-sm font-semibold text-white mb-2">Still need help?</h4>
                  <p className="text-sm text-white/50 mb-4">Our support team is available 24/7 to assist you.</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/[0.06] mt-12">
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
            <Link href="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  BookOpen,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Rocket,
  Package,
  CreditCard,
  Send,
  LayoutDashboard,
  Settings,
  Palette,
  ShoppingCart,
  Users,
  Receipt,
  Brain,
  Code,
  MessageSquare,
  Clock,
  FileText,
  Globe,
  Mail,
  Home,
  Menu,
  X,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  type LucideIcon,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Printer,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Category data with articles - same structure as category page
const categoryData: Record<string, {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  articles: Array<{
    slug: string;
    title: string;
    description: string;
    readTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    updatedAt: string;
    content: {
      sections: Array<{
        id: string;
        title: string;
        content: string;
        subsections?: Array<{ id: string; title: string; content: string }>;
      }>;
    };
  }>;
}> = {
  'getting-started': {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Quick start guides and onboarding tutorials.',
    icon: Rocket,
    articles: [
      {
        slug: 'create-store',
        title: 'Create Your First Store',
        description: 'Learn how to set up your online store in minutes with our step-by-step guide.',
        readTime: '5 min',
        difficulty: 'beginner',
        tags: ['setup', 'basics'],
        updatedAt: '2024-01-15',
        content: {
          sections: [
            {
              id: 'introduction',
              title: 'Introduction',
              content: `Creating your first store on Rendrix is a straightforward process that takes just a few minutes. This guide will walk you through every step, from initial setup to launching your store.

Whether you're starting a new business or migrating from another platform, Rendrix makes it easy to get your online store up and running quickly.`,
            },
            {
              id: 'prerequisites',
              title: 'Prerequisites',
              content: `Before you begin, make sure you have:

- A Rendrix account (sign up at rendrix.com if you haven't already)
- Basic information about your business (name, description, contact details)
- At least one product ready to add (optional but recommended)
- A payment method for your subscription`,
            },
            {
              id: 'step-1',
              title: 'Step 1: Access the Dashboard',
              content: `After logging into your Rendrix account, you'll be taken to your main dashboard. This is your central hub for managing all your stores.

1. Click on the **"Create Store"** button in the top right corner
2. Or navigate to **Stores > Create New Store** from the sidebar

You'll see a modal appear with the store creation wizard.`,
              subsections: [
                {
                  id: 'choosing-plan',
                  title: 'Choosing Your Plan',
                  content: `Select the plan that best fits your needs:

- **Starter**: Perfect for new businesses with up to 100 products
- **Professional**: For growing businesses with advanced features
- **Enterprise**: Custom solutions for large-scale operations

You can always upgrade later as your business grows.`,
                },
              ],
            },
            {
              id: 'step-2',
              title: 'Step 2: Configure Store Settings',
              content: `Now it's time to configure your store's basic settings:

**Store Name**: Choose a memorable name that represents your brand. This will appear in your store URL and customer-facing pages.

**Store Description**: Write a brief description of what you sell. This helps with SEO and gives customers context about your business.

**Currency**: Select your primary currency. You can add additional currencies later for international sales.

**Timezone**: Set your store's timezone for accurate order timestamps and analytics.`,
            },
            {
              id: 'step-3',
              title: 'Step 3: Add Your First Product',
              content: `With your store created, it's time to add your first product:

1. Navigate to **Products > Add Product**
2. Enter the product name, description, and price
3. Upload product images (we recommend at least 3 high-quality images)
4. Set inventory levels if applicable
5. Click **Save** to publish your product

Your product is now live on your store!`,
            },
            {
              id: 'step-4',
              title: 'Step 4: Configure Payments',
              content: `Before you can accept orders, you need to set up payment processing:

1. Go to **Settings > Payments**
2. Click **Connect** next to your preferred payment provider
3. Follow the prompts to link your account
4. Test the integration with a small test purchase

Rendrix supports Stripe, PayPal, and many other payment gateways.`,
            },
            {
              id: 'next-steps',
              title: 'Next Steps',
              content: `Congratulations! Your store is now set up and ready to receive orders. Here's what you can do next:

- **Customize your theme**: Make your store match your brand identity
- **Add more products**: Build out your product catalog
- **Set up shipping**: Configure shipping zones and rates
- **Connect a domain**: Use your own custom domain
- **Enable marketing tools**: Set up email campaigns and promotions

Check out our other guides for detailed instructions on each of these topics.`,
            },
          ],
        },
      },
      {
        slug: 'add-products',
        title: 'Add Products',
        description: 'Upload and manage your product catalog with variants, images, and pricing.',
        readTime: '3 min',
        difficulty: 'beginner',
        tags: ['products', 'catalog'],
        updatedAt: '2024-01-14',
        content: {
          sections: [
            {
              id: 'overview',
              title: 'Overview',
              content: `Adding products to your Rendrix store is simple and intuitive. This guide covers everything from basic product creation to advanced features like variants and inventory management.`,
            },
            {
              id: 'adding-product',
              title: 'Adding a New Product',
              content: `To add a new product:

1. Navigate to **Products** in your dashboard sidebar
2. Click the **Add Product** button
3. Fill in the required fields:
   - Product name
   - Description
   - Base price
4. Click **Save** to create your product`,
            },
            {
              id: 'product-images',
              title: 'Product Images',
              content: `High-quality images are essential for selling online. Rendrix supports:

- Multiple images per product (up to 10)
- Automatic image optimization
- Drag-and-drop reordering
- Alt text for accessibility and SEO

**Tip**: Use images that are at least 1200x1200 pixels for best results.`,
            },
            {
              id: 'variants',
              title: 'Product Variants',
              content: `Variants allow you to offer different versions of a product (size, color, etc.):

1. In the product editor, click **Add Variants**
2. Create options (e.g., Size: Small, Medium, Large)
3. Set individual prices and inventory for each variant
4. Upload variant-specific images if needed`,
            },
          ],
        },
      },
      {
        slug: 'payments',
        title: 'Configure Payments',
        description: 'Connect payment gateways and start accepting payments from customers.',
        readTime: '4 min',
        difficulty: 'beginner',
        tags: ['payments', 'stripe'],
        updatedAt: '2024-01-13',
        content: {
          sections: [
            {
              id: 'overview',
              title: 'Payment Gateway Overview',
              content: `Rendrix integrates with leading payment processors to help you accept payments securely. This guide walks you through connecting and configuring payment gateways.`,
            },
            {
              id: 'supported-gateways',
              title: 'Supported Payment Gateways',
              content: `We support the following payment providers:

- **Stripe**: Credit cards, Apple Pay, Google Pay
- **PayPal**: PayPal balance and cards
- **Square**: In-person and online payments
- **Klarna**: Buy now, pay later options`,
            },
            {
              id: 'connecting-stripe',
              title: 'Connecting Stripe',
              content: `Stripe is our recommended payment provider:

1. Go to **Settings > Payments**
2. Click **Connect Stripe**
3. Log in to your Stripe account (or create one)
4. Authorize Rendrix to access your Stripe account
5. Configure your payment settings

Once connected, you can accept credit card payments immediately.`,
            },
          ],
        },
      },
      {
        slug: 'launch',
        title: 'Launch Your Store',
        description: 'Go live and start selling to customers worldwide.',
        readTime: '2 min',
        difficulty: 'beginner',
        tags: ['launch', 'go-live'],
        updatedAt: '2024-01-12',
        content: {
          sections: [
            {
              id: 'pre-launch',
              title: 'Pre-Launch Checklist',
              content: `Before launching, ensure you have:

- [ ] Added products to your store
- [ ] Configured payment processing
- [ ] Set up shipping rates
- [ ] Tested the checkout process
- [ ] Added legal pages (Privacy Policy, Terms)`,
            },
            {
              id: 'going-live',
              title: 'Going Live',
              content: `When you're ready to launch:

1. Go to **Settings > General**
2. Toggle **Store Status** to **Live**
3. Your store is now accessible to customers!

Share your store URL on social media and start marketing your products.`,
            },
          ],
        },
      },
    ],
  },
  'platform': {
    id: 'platform',
    title: 'Platform Overview',
    description: 'Core concepts, architecture, and terminology.',
    icon: LayoutDashboard,
    articles: [
      {
        slug: 'architecture',
        title: 'Platform Architecture',
        description: 'Understand the technical architecture behind Rendrix.',
        readTime: '10 min',
        difficulty: 'intermediate',
        tags: ['architecture', 'technical'],
        updatedAt: '2024-01-15',
        content: {
          sections: [
            {
              id: 'overview',
              title: 'Architecture Overview',
              content: `Rendrix is built on a modern, scalable architecture designed for reliability and performance. This document provides an overview of the key components and how they work together.`,
            },
            {
              id: 'components',
              title: 'Core Components',
              content: `The platform consists of several key components:

- **API Layer**: RESTful and GraphQL APIs for all operations
- **Database**: PostgreSQL for relational data storage
- **Cache**: Redis for session management and caching
- **Search**: Meilisearch for product and content search
- **Storage**: S3-compatible object storage for media files`,
            },
          ],
        },
      },
    ],
  },
  'api': {
    id: 'api',
    title: 'API & Developers',
    description: 'REST API, GraphQL, Webhooks, and SDKs.',
    icon: Code,
    articles: [
      {
        slug: 'authentication',
        title: 'API Authentication',
        description: 'Authenticate your API requests with tokens and keys.',
        readTime: '8 min',
        difficulty: 'intermediate',
        tags: ['api', 'auth'],
        updatedAt: '2024-01-15',
        content: {
          sections: [
            {
              id: 'overview',
              title: 'Authentication Overview',
              content: `All API requests to Rendrix must be authenticated. We support multiple authentication methods depending on your use case.`,
            },
            {
              id: 'api-keys',
              title: 'API Keys',
              content: `API keys are used for server-to-server communication:

1. Go to **Settings > API**
2. Click **Generate API Key**
3. Copy and securely store your key
4. Include the key in your request headers:

\`\`\`bash
curl -H "Authorization: Bearer sk_live_xxxxx" \\
  https://api.rendrix.com/v1/products
\`\`\``,
            },
            {
              id: 'oauth',
              title: 'OAuth 2.0',
              content: `For user-facing applications, use OAuth 2.0:

1. Register your application in the developer portal
2. Implement the OAuth flow
3. Exchange authorization codes for access tokens
4. Use tokens to make authenticated requests`,
            },
          ],
        },
      },
      {
        slug: 'reference',
        title: 'REST API Reference',
        description: 'Complete reference for all REST API endpoints.',
        readTime: '15 min',
        difficulty: 'intermediate',
        tags: ['api', 'rest'],
        updatedAt: '2024-01-14',
        content: {
          sections: [
            {
              id: 'base-url',
              title: 'Base URL',
              content: `All API requests should be made to:

\`\`\`
https://api.rendrix.com/v1
\`\`\``,
            },
            {
              id: 'products',
              title: 'Products API',
              content: `**List Products**
\`\`\`
GET /products
\`\`\`

**Get Product**
\`\`\`
GET /products/:id
\`\`\`

**Create Product**
\`\`\`
POST /products
\`\`\``,
            },
          ],
        },
      },
    ],
  },
  'ai': {
    id: 'ai',
    title: 'AI Features',
    description: 'AI-powered descriptions, recommendations, and more.',
    icon: Brain,
    articles: [
      {
        slug: 'descriptions',
        title: 'AI Product Descriptions',
        description: 'Generate compelling product descriptions with AI.',
        readTime: '5 min',
        difficulty: 'beginner',
        tags: ['ai', 'descriptions'],
        updatedAt: '2024-01-15',
        content: {
          sections: [
            {
              id: 'overview',
              title: 'Overview',
              content: `Rendrix's AI can generate compelling, SEO-optimized product descriptions in seconds. Save time and improve your product listings with AI-powered content.`,
            },
            {
              id: 'using-ai',
              title: 'Using AI Descriptions',
              content: `To generate an AI description:

1. Open a product in the editor
2. Click the **AI** button next to the description field
3. Review the generated description
4. Edit as needed and save

The AI considers your product title, images, and category to generate relevant content.`,
            },
          ],
        },
      },
    ],
  },
};

// Add more categories with placeholder articles
const additionalCategories = ['dashboard', 'stores', 'products', 'orders', 'customers', 'billing'];
additionalCategories.forEach(catId => {
  if (!categoryData[catId]) {
    const icons: Record<string, LucideIcon> = {
      dashboard: Settings,
      stores: Palette,
      products: Package,
      orders: ShoppingCart,
      customers: Users,
      billing: Receipt,
    };
    const titles: Record<string, string> = {
      dashboard: 'Dashboard Guide',
      stores: 'Store Management',
      products: 'Product Catalog',
      orders: 'Order Management',
      customers: 'Customers',
      billing: 'Billing & Subscriptions',
    };
    categoryData[catId] = {
      id: catId,
      title: titles[catId] || catId,
      description: `Documentation for ${titles[catId] || catId}.`,
      icon: icons[catId] || FileText,
      articles: [
        {
          slug: 'overview',
          title: `${titles[catId]} Overview`,
          description: `Learn about ${titles[catId]?.toLowerCase() || catId} features and capabilities.`,
          readTime: '5 min',
          difficulty: 'beginner',
          tags: [catId, 'overview'],
          updatedAt: '2024-01-15',
          content: {
            sections: [
              {
                id: 'overview',
                title: 'Overview',
                content: `This guide provides an overview of ${titles[catId]?.toLowerCase() || catId} features in Rendrix.`,
              },
              {
                id: 'getting-started',
                title: 'Getting Started',
                content: `To get started with ${titles[catId]?.toLowerCase() || catId}, navigate to the relevant section in your dashboard.`,
              },
            ],
          },
        },
      ],
    };
  }
});

// All categories list
const allCategories = [
  { id: 'platform', title: 'Platform Overview', icon: LayoutDashboard },
  { id: 'getting-started', title: 'Getting Started', icon: Rocket },
  { id: 'dashboard', title: 'Dashboard Guide', icon: Settings },
  { id: 'stores', title: 'Store Management', icon: Palette },
  { id: 'products', title: 'Product Catalog', icon: Package },
  { id: 'orders', title: 'Order Management', icon: ShoppingCart },
  { id: 'customers', title: 'Customers', icon: Users },
  { id: 'billing', title: 'Billing & Subscriptions', icon: Receipt },
  { id: 'ai', title: 'AI Features', icon: Brain },
  { id: 'api', title: 'API & Developers', icon: Code },
];

// Header Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled ? 'bg-black/90 backdrop-blur-2xl' : 'bg-black/80 backdrop-blur-xl'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-50'
        }`}
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.3) 50%, transparent 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 4px 20px rgba(255,145,0,0.35)' }}
            >
              <Store className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">Rendrix</span>
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
                  className={`group flex items-center gap-1.5 px-4 py-2.5 text-sm transition-all duration-300 font-medium rounded-lg ${
                    item.isActive ? 'text-primary' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {item.hasDropdown && item.items && (
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                      activeDropdown === item.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div
                      className="w-64 p-2 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.99) 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="group/item flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/5"
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,145,0,0.1)', border: '1px solid rgba(255,145,0,0.2)' }}>
                            <subItem.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white group-hover/item:text-primary transition-colors">{subItem.label}</div>
                            <div className="text-xs text-white/40">{subItem.description}</div>
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
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <Link href="/login">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-transparent font-medium h-9 px-3 text-sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className="text-black font-semibold h-9 px-4 rounded-lg text-sm"
                style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// Code Block Component
function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-xs text-white/40 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-white/80 font-mono">{code}</code>
      </pre>
    </div>
  );
}

// Callout Component
function Callout({ type, children }: { type: 'tip' | 'warning' | 'info' | 'success'; children: React.ReactNode }) {
  const styles = {
    tip: { icon: Lightbulb, bg: 'bg-primary/10', border: 'border-primary/20', iconColor: 'text-primary' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', iconColor: 'text-amber-400' },
    info: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/20', iconColor: 'text-blue-400' },
    success: { icon: CheckCircle2, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', iconColor: 'text-emerald-400' },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`my-6 p-4 rounded-xl ${style.bg} border ${style.border}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="text-sm text-white/70 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// Table of Contents Component
function TableOfContents({ sections, activeSection }: { sections: Array<{ id: string; title: string; subsections?: Array<{ id: string; title: string }> }>; activeSection: string }) {
  return (
    <nav className="space-y-1">
      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">On This Page</h4>
      {sections.map((section) => (
        <div key={section.id}>
          <a
            href={`#${section.id}`}
            className={`block py-1.5 text-sm transition-colors border-l-2 pl-3 ${
              activeSection === section.id
                ? 'text-primary border-primary'
                : 'text-white/50 border-transparent hover:text-white hover:border-white/20'
            }`}
          >
            {section.title}
          </a>
          {section.subsections?.map((sub) => (
            <a
              key={sub.id}
              href={`#${sub.id}`}
              className={`block py-1 text-xs transition-colors border-l-2 pl-6 ${
                activeSection === sub.id
                  ? 'text-primary border-primary'
                  : 'text-white/40 border-transparent hover:text-white/60 hover:border-white/10'
              }`}
            >
              {sub.title}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

// Render article content with proper formatting
function renderContent(content: string) {
  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    // Handle code blocks
    if (part.startsWith('```')) {
      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      if (match) {
        const [, lang, code] = match;
        return <CodeBlock key={index} code={code.trim()} language={lang || 'bash'} />;
      }
    }

    // Handle inline formatting
    const lines = part.split('\n');
    return (
      <div key={index} className="space-y-4">
        {lines.map((line, lineIndex) => {
          // Headers
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={lineIndex} className="font-semibold text-white mt-4">{line.replace(/\*\*/g, '')}</p>;
          }
          // List items
          if (line.startsWith('- ')) {
            return (
              <div key={lineIndex} className="flex gap-2 ml-4">
                <span className="text-primary mt-2">•</span>
                <span className="text-white/70">{line.substring(2).replace(/\*\*(.*?)\*\*/g, '$1')}</span>
              </div>
            );
          }
          // Numbered list items
          if (/^\d+\.\s/.test(line)) {
            const [num, ...rest] = line.split('. ');
            return (
              <div key={lineIndex} className="flex gap-3 ml-4">
                <span className="text-primary font-medium">{num}.</span>
                <span className="text-white/70">{rest.join('. ').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
              </div>
            );
          }
          // Checkbox items
          if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
            const isChecked = line.startsWith('- [x]');
            const text = line.substring(6);
            return (
              <div key={lineIndex} className="flex items-center gap-2 ml-4">
                <div className={`w-4 h-4 rounded border ${isChecked ? 'bg-primary border-primary' : 'border-white/20'} flex items-center justify-center`}>
                  {isChecked && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className={`text-white/70 ${isChecked ? 'line-through text-white/40' : ''}`}>{text}</span>
              </div>
            );
          }
          // Inline code
          if (line.includes('`')) {
            const formatted = line.split(/(`[^`]+`)/).map((segment, i) => {
              if (segment.startsWith('`') && segment.endsWith('`')) {
                return (
                  <code key={i} className="px-1.5 py-0.5 rounded bg-white/[0.06] text-primary text-sm font-mono">
                    {segment.slice(1, -1)}
                  </code>
                );
              }
              return segment.replace(/\*\*(.*?)\*\*/g, '$1');
            });
            return line.trim() ? <p key={lineIndex} className="text-white/70 leading-relaxed">{formatted}</p> : null;
          }
          // Regular paragraph
          return line.trim() ? (
            <p key={lineIndex} className="text-white/70 leading-relaxed">
              {line.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          ) : null;
        })}
      </div>
    );
  });
}

export default function DocsArticlePage() {
  const params = useParams();
  const categoryId = params.category as string;
  const articleSlug = params.slug as string;

  const [activeSection, setActiveSection] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const category = categoryData[categoryId];
  const article = category?.articles.find(a => a.slug === articleSlug);

  // Find prev/next articles
  const articleIndex = category?.articles.findIndex(a => a.slug === articleSlug) ?? -1;
  const prevArticle = articleIndex > 0 ? category?.articles[articleIndex - 1] : null;
  const nextArticle = articleIndex < (category?.articles.length ?? 0) - 1 ? category?.articles[articleIndex + 1] : null;

  // Track scroll for active section
  useEffect(() => {
    if (!article) return;

    const handleScroll = () => {
      const sections = article.content.sections.map(s => document.getElementById(s.id)).filter(Boolean);
      const scrollPos = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(article.content.sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  if (!category || !article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-white/50 mb-8">The documentation article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/docs">
            <Button className="bg-primary text-black font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Documentation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const CategoryIcon = category.icon;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.05] rounded-full blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `linear-gradient(rgba(255,145,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.4) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
      </div>

      <Header />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-[#0a0a0a] border-r border-white/[0.06] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Documentation</h3>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {allCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = cat.id === categoryId;
                  return (
                    <Link
                      key={cat.id}
                      href={`/docs/${cat.id}`}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{cat.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative pt-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Categories */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
                <nav className="space-y-1">
                  {allCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = cat.id === categoryId;
                    return (
                      <Link
                        key={cat.id}
                        href={`/docs/${cat.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                          isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{cat.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0 pb-24">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
                <Link href="/" className="hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/docs/${categoryId}`} className="hover:text-white transition-colors">{category.title}</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/60 truncate">{article.title}</span>
              </nav>

              {/* Article Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                    <CategoryIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{category.title}</span>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${difficultyColors[article.difficulty]}`}>
                    {article.difficulty}
                  </span>
                  <span className="text-sm text-white/40 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {article.readTime} read
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {article.title}
                </h1>
                <p className="text-lg text-white/60 leading-relaxed max-w-3xl">
                  {article.description}
                </p>

                {/* Action bar */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/[0.06]">
                  <span className="text-sm text-white/40">Last updated: {article.updatedAt}</span>
                  <div className="flex-1" />
                  <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Bookmark">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors" title="Print">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </motion.header>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none">
                {article.content.sections.map((section, index) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-12 scroll-mt-24"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <span className="w-1 h-6 bg-primary rounded-full" />
                      {section.title}
                    </h2>
                    <div className="pl-4 border-l border-white/[0.06]">
                      {renderContent(section.content)}

                      {section.subsections?.map((sub) => (
                        <div key={sub.id} id={sub.id} className="mt-8 scroll-mt-24">
                          <h3 className="text-xl font-semibold text-white mb-3">{sub.title}</h3>
                          {renderContent(sub.content)}
                        </div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Feedback Section */}
              <div className="mt-16 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-white mb-4">Was this article helpful?</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFeedback('helpful')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      feedback === 'helpful'
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes, helpful
                  </button>
                  <button
                    onClick={() => setFeedback('not-helpful')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      feedback === 'not-helpful'
                        ? 'bg-red-500/20 border-red-500/30 text-red-400'
                        : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Not helpful
                  </button>
                </div>
                {feedback && (
                  <p className="mt-3 text-sm text-white/50">
                    Thank you for your feedback! {feedback === 'not-helpful' && 'We\'ll work to improve this article.'}
                  </p>
                )}
              </div>

              {/* Previous / Next Navigation */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link href={`/docs/${categoryId}/${prevArticle.slug}`} className="group">
                    <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all">
                      <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Previous
                      </div>
                      <p className="font-semibold text-white group-hover:text-primary transition-colors">{prevArticle.title}</p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {nextArticle && (
                  <Link href={`/docs/${categoryId}/${nextArticle.slug}`} className="group">
                    <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-white/40 mb-2">
                        Next
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="font-semibold text-white group-hover:text-primary transition-colors">{nextArticle.title}</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Edit on GitHub */}
              <div className="mt-8 text-center">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit this page on GitHub
                </a>
              </div>
            </article>

            {/* Right Sidebar - Table of Contents */}
            <aside className="hidden xl:block w-56 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
                <TableOfContents sections={article.content.sections} activeSection={activeSection} />

                {/* Related articles */}
                <div className="mt-8 pt-8 border-t border-white/[0.06]">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Related Articles</h4>
                  <div className="space-y-2">
                    {category.articles
                      .filter(a => a.slug !== articleSlug)
                      .slice(0, 3)
                      .map((related) => (
                        <Link
                          key={related.slug}
                          href={`/docs/${categoryId}/${related.slug}`}
                          className="block text-sm text-white/50 hover:text-primary transition-colors"
                        >
                          {related.title}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }}>
                <Store className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">Rendrix</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} Rendrix</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

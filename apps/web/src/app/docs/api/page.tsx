'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Copy,
  Check,
  ChevronRight,
  Code2,
  Key,
  Building2,
  Store,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Webhook,
  ArrowRight,
  Terminal,
  BookOpen,
  Zap,
  Shield,
  Globe,
  ExternalLink,
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

// Method badge colors
const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  POST: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  PUT: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  PATCH: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  DELETE: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

// Code block component with copy functionality
function CodeBlock({
  code,
  language = 'bash',
  showLineNumbers = false,
}: {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-xs text-white/40 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-white/40 hover:text-white rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="select-none text-white/20 w-8 flex-shrink-0">{i + 1}</span>
              )}
              <code className="text-white/80">{line}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// Method badge component
function MethodBadge({ method }: { method: string }) {
  const colors = methodColors[method] || methodColors.GET;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold font-mono rounded ${colors.bg} ${colors.text}`}>
      {method}
    </span>
  );
}

// Endpoint row component
function EndpointRow({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.02] px-4 -mx-4 transition-colors cursor-pointer">
      <MethodBadge method={method} />
      <div className="flex-1 min-w-0">
        <code className="text-sm text-white/90 font-mono">{path}</code>
        <p className="text-sm text-white/50 mt-0.5">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
    </div>
  );
}

// API category card component
function APICategoryCard({
  icon: Icon,
  title,
  description,
  endpoints,
  color,
  id,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  endpoints: { method: string; path: string; description: string }[];
  color: string;
  id: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      id={id}
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {/* Header */}
        <div className={`p-6 border-b border-white/[0.06] bg-gradient-to-r ${color}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/60">{description}</p>
            </div>
          </div>
        </div>
        {/* Endpoints */}
        <div className="p-4">
          {endpoints.map((endpoint, i) => (
            <EndpointRow key={i} {...endpoint} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Sidebar navigation item
function SidebarItem({
  icon: Icon,
  title,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </button>
  );
}

export default function APIReferencePage() {
  const [activeSection, setActiveSection] = useState('authentication');
  const [copied, setCopied] = useState(false);

  const copyBaseUrl = () => {
    navigator.clipboard.writeText('https://api.rendrix.com/api/v1');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['authentication', 'organizations', 'stores', 'products', 'orders', 'customers', 'analytics', 'webhooks'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sidebarItems = [
    { icon: Key, title: 'Authentication', id: 'authentication' },
    { icon: Building2, title: 'Organizations', id: 'organizations' },
    { icon: Store, title: 'Stores', id: 'stores' },
    { icon: Package, title: 'Products', id: 'products' },
    { icon: ShoppingCart, title: 'Orders', id: 'orders' },
    { icon: Users, title: 'Customers', id: 'customers' },
    { icon: BarChart3, title: 'Analytics', id: 'analytics' },
    { icon: Webhook, title: 'Webhooks', id: 'webhooks' },
  ];

  const apiCategories = [
    {
      icon: Key,
      title: 'Authentication',
      description: 'Manage user authentication and tokens',
      id: 'authentication',
      color: 'from-emerald-500/10 to-transparent',
      endpoints: [
        { method: 'POST', path: '/auth/login', description: 'Authenticate user and get access token' },
        { method: 'POST', path: '/auth/register', description: 'Create a new user account' },
        { method: 'POST', path: '/auth/refresh', description: 'Refresh access token using refresh token' },
        { method: 'POST', path: '/auth/logout', description: 'Invalidate current session' },
        { method: 'POST', path: '/auth/forgot-password', description: 'Request password reset email' },
        { method: 'POST', path: '/auth/reset-password', description: 'Reset password with token' },
      ],
    },
    {
      icon: Building2,
      title: 'Organizations',
      description: 'Manage organizations and team members',
      id: 'organizations',
      color: 'from-blue-500/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/organizations', description: 'List all organizations for current user' },
        { method: 'POST', path: '/organizations', description: 'Create a new organization' },
        { method: 'GET', path: '/organizations/:id', description: 'Get organization details' },
        { method: 'PATCH', path: '/organizations/:id', description: 'Update organization settings' },
        { method: 'DELETE', path: '/organizations/:id', description: 'Delete an organization' },
        { method: 'GET', path: '/organizations/:id/members', description: 'List organization members' },
        { method: 'POST', path: '/organizations/:id/members/invite', description: 'Invite a new member' },
      ],
    },
    {
      icon: Store,
      title: 'Stores',
      description: 'Create and manage e-commerce stores',
      id: 'stores',
      color: 'from-primary/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/stores', description: 'List all stores in organization' },
        { method: 'POST', path: '/stores', description: 'Create a new store' },
        { method: 'GET', path: '/stores/:id', description: 'Get store details' },
        { method: 'PATCH', path: '/stores/:id', description: 'Update store settings' },
        { method: 'DELETE', path: '/stores/:id', description: 'Delete a store' },
        { method: 'GET', path: '/stores/:id/settings', description: 'Get store configuration' },
        { method: 'PATCH', path: '/stores/:id/domains', description: 'Configure custom domain' },
      ],
    },
    {
      icon: Package,
      title: 'Products',
      description: 'Product catalog management',
      id: 'products',
      color: 'from-purple-500/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/stores/:storeId/products', description: 'List all products' },
        { method: 'POST', path: '/stores/:storeId/products', description: 'Create a new product' },
        { method: 'GET', path: '/stores/:storeId/products/:id', description: 'Get product details' },
        { method: 'PATCH', path: '/stores/:storeId/products/:id', description: 'Update product' },
        { method: 'DELETE', path: '/stores/:storeId/products/:id', description: 'Delete product' },
        { method: 'POST', path: '/stores/:storeId/products/:id/variants', description: 'Add product variant' },
        { method: 'POST', path: '/stores/:storeId/products/:id/images', description: 'Upload product image' },
      ],
    },
    {
      icon: ShoppingCart,
      title: 'Orders',
      description: 'Order processing and fulfillment',
      id: 'orders',
      color: 'from-cyan-500/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/stores/:storeId/orders', description: 'List all orders' },
        { method: 'GET', path: '/stores/:storeId/orders/:id', description: 'Get order details' },
        { method: 'PATCH', path: '/stores/:storeId/orders/:id', description: 'Update order status' },
        { method: 'POST', path: '/stores/:storeId/orders/:id/fulfill', description: 'Mark order as fulfilled' },
        { method: 'POST', path: '/stores/:storeId/orders/:id/refund', description: 'Process refund' },
        { method: 'POST', path: '/stores/:storeId/orders/:id/cancel', description: 'Cancel order' },
      ],
    },
    {
      icon: Users,
      title: 'Customers',
      description: 'Customer data and segmentation',
      id: 'customers',
      color: 'from-pink-500/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/stores/:storeId/customers', description: 'List all customers' },
        { method: 'GET', path: '/stores/:storeId/customers/:id', description: 'Get customer details' },
        { method: 'PATCH', path: '/stores/:storeId/customers/:id', description: 'Update customer info' },
        { method: 'GET', path: '/stores/:storeId/customers/:id/orders', description: 'Get customer orders' },
        { method: 'POST', path: '/stores/:storeId/customers/export', description: 'Export customer data' },
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Reports and business intelligence',
      id: 'analytics',
      color: 'from-amber-500/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/stores/:storeId/analytics/dashboard', description: 'Get dashboard metrics' },
        { method: 'GET', path: '/stores/:storeId/analytics/sales', description: 'Sales analytics' },
        { method: 'GET', path: '/stores/:storeId/analytics/products', description: 'Product performance' },
        { method: 'GET', path: '/stores/:storeId/analytics/customers', description: 'Customer analytics' },
        { method: 'POST', path: '/stores/:storeId/analytics/export', description: 'Export reports' },
      ],
    },
    {
      icon: Webhook,
      title: 'Webhooks',
      description: 'Event notifications and integrations',
      id: 'webhooks',
      color: 'from-teal-500/10 to-transparent',
      endpoints: [
        { method: 'GET', path: '/stores/:storeId/webhooks', description: 'List webhook subscriptions' },
        { method: 'POST', path: '/stores/:storeId/webhooks', description: 'Create webhook subscription' },
        { method: 'GET', path: '/stores/:storeId/webhooks/:id', description: 'Get webhook details' },
        { method: 'PATCH', path: '/stores/:storeId/webhooks/:id', description: 'Update webhook' },
        { method: 'DELETE', path: '/stores/:storeId/webhooks/:id', description: 'Delete webhook' },
        { method: 'POST', path: '/stores/:storeId/webhooks/:id/test', description: 'Send test event' },
      ],
    },
  ];

  const errorCodes = [
    { code: '200', name: 'OK', description: 'Request succeeded' },
    { code: '201', name: 'Created', description: 'Resource created successfully' },
    { code: '400', name: 'Bad Request', description: 'Invalid request parameters' },
    { code: '401', name: 'Unauthorized', description: 'Authentication required' },
    { code: '403', name: 'Forbidden', description: 'Insufficient permissions' },
    { code: '404', name: 'Not Found', description: 'Resource not found' },
    { code: '422', name: 'Validation Error', description: 'Input validation failed' },
    { code: '429', name: 'Rate Limited', description: 'Too many requests' },
    { code: '500', name: 'Server Error', description: 'Internal server error' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-sm font-bold text-black">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Rendrix</span>
            <span className="text-white/40 mx-2">/</span>
            <span className="text-white/60">API Reference</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/help" className="text-sm text-white/60 hover:text-white transition-colors">Help</Link>
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Sign In</Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Get API Key
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/[0.06] bg-black/50 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                API Reference
              </h3>
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    {...item}
                    isActive={activeSection === item.id}
                    onClick={() => scrollToSection(item.id)}
                  />
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/[0.06]">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                  Resources
                </h3>
                <div className="space-y-1">
                  <Link href="/docs" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                    <BookOpen className="w-4 h-4" />
                    <span>Documentation</span>
                  </Link>
                  <Link href="/docs/sdks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Code2 className="w-4 h-4" />
                    <span>SDKs & Libraries</span>
                  </Link>
                  <Link href="/changelog" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Zap className="w-4 h-4" />
                    <span>Changelog</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-6">
                <Terminal className="w-4 h-4" />
                <span>REST API v1</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                API Reference
              </h1>
              <p className="text-lg text-white/60 mb-8 max-w-2xl">
                Build powerful e-commerce integrations with the Rendrix API. Our RESTful API provides programmatic access to all platform features.
              </p>

              {/* Base URL */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-8">
                <Globe className="w-5 h-5 text-white/40" />
                <code className="text-sm font-mono text-white/80 flex-1">
                  https://api.rendrix.com/api/v1
                </code>
                <button
                  onClick={copyBaseUrl}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60 hover:text-white bg-white/[0.05] rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Quick links */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Key, label: 'Authentication', href: '#authentication' },
                  { icon: Zap, label: 'Quick Start', href: '#quickstart' },
                  { icon: Code2, label: 'SDKs', href: '/docs/sdks' },
                  { icon: Shield, label: 'Security', href: '/docs/security' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.06] hover:text-white transition-all"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Quick Start Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              id="quickstart"
              className="mb-16 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
              <p className="text-white/60 mb-6">
                Get started with the Rendrix API in minutes. All API requests require authentication using JWT Bearer tokens.
              </p>

              {/* Authentication flow */}
              <div className="space-y-6">
                <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">1</span>
                    Get your API credentials
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Log in to your Rendrix dashboard and navigate to Settings → API Keys to generate your credentials.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">2</span>
                    Authenticate to get access token
                  </h3>
                  <CodeBlock
                    language="bash"
                    code={`curl -X POST https://api.rendrix.com/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "your@email.com",
    "password": "your-password"
  }'`}
                  />
                </div>

                <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">3</span>
                    Make authenticated requests
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Include the access token in the Authorization header for all subsequent requests:
                  </p>
                  <CodeBlock
                    language="bash"
                    code={`curl https://api.rendrix.com/api/v1/stores \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "X-Organization-Id: YOUR_ORG_ID"`}
                  />
                </div>
              </div>

              {/* Required headers */}
              <div className="mt-8 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-white mb-4">Required Headers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left py-3 text-white/60 font-medium">Header</th>
                        <th className="text-left py-3 text-white/60 font-medium">Description</th>
                        <th className="text-left py-3 text-white/60 font-medium">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-3"><code className="text-primary font-mono text-xs">Authorization</code></td>
                        <td className="py-3 text-white/70">Bearer token for authentication</td>
                        <td className="py-3"><span className="text-emerald-400">Yes</span></td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-3"><code className="text-primary font-mono text-xs">X-Organization-Id</code></td>
                        <td className="py-3 text-white/70">Organization UUID for scoped requests</td>
                        <td className="py-3"><span className="text-emerald-400">Yes*</span></td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-3"><code className="text-primary font-mono text-xs">Content-Type</code></td>
                        <td className="py-3 text-white/70">application/json for POST/PUT/PATCH</td>
                        <td className="py-3"><span className="text-amber-400">Conditional</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>

            {/* API Categories */}
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Endpoints</h2>
              {apiCategories.map((category) => (
                <APICategoryCard key={category.id} {...category} />
              ))}
            </motion.section>

            {/* Error Codes Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
              id="errors"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Error Codes</h2>
              <p className="text-white/60 mb-6">
                The API uses standard HTTP status codes to indicate success or failure of requests.
              </p>

              {/* Error response format */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Error Response Format</h3>
                <CodeBlock
                  language="json"
                  code={`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "reason": "must be a valid email"
    }
  }
}`}
                />
              </div>

              {/* Error codes table */}
              <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.02]">
                    <tr>
                      <th className="text-left px-6 py-4 text-white/60 font-medium">Code</th>
                      <th className="text-left px-6 py-4 text-white/60 font-medium">Name</th>
                      <th className="text-left px-6 py-4 text-white/60 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((error, i) => (
                      <tr key={error.code} className={i !== errorCodes.length - 1 ? 'border-b border-white/[0.04]' : ''}>
                        <td className="px-6 py-4">
                          <code className={`font-mono text-xs px-2 py-1 rounded ${
                            error.code.startsWith('2') ? 'bg-emerald-500/20 text-emerald-400' :
                            error.code.startsWith('4') ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {error.code}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-white/80 font-medium">{error.name}</td>
                        <td className="px-6 py-4 text-white/60">{error.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* Rate Limiting */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Rate Limiting
              </h2>
              <p className="text-white/60 mb-4">
                API requests are rate limited to ensure fair usage. The default limit is 1000 requests per minute per API key.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { header: 'X-RateLimit-Limit', desc: 'Max requests per window' },
                  { header: 'X-RateLimit-Remaining', desc: 'Remaining requests' },
                  { header: 'X-RateLimit-Reset', desc: 'Window reset timestamp' },
                ].map((item) => (
                  <div key={item.header} className="p-4 rounded-lg bg-white/[0.03]">
                    <code className="text-xs text-primary font-mono">{item.header}</code>
                    <p className="text-sm text-white/50 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Need Help CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/10 to-transparent text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-3">Need Help?</h2>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Our developer support team is here to help you integrate with the Rendrix API.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all"
                >
                  Join Community
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </motion.section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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

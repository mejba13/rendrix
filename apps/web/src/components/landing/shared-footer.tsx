'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  ArrowRight,
  Globe,
  ChevronRight,
  Shield,
  Lock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SharedFooter() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const columns = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  // Expanded social links with all major platforms
  const socialLinks = [
    {
      name: 'X',
      href: 'https://twitter.com/rendrix',
      color: '#ffffff',
      hoverBg: 'rgba(255,255,255,0.1)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/rendrix',
      color: '#0A66C2',
      hoverBg: 'rgba(10,102,194,0.15)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/rendrix',
      color: '#E4405F',
      hoverBg: 'linear-gradient(45deg, rgba(253,29,29,0.15), rgba(131,58,180,0.15))',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/rendrix',
      color: '#1877F2',
      hoverBg: 'rgba(24,119,242,0.15)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@rendrix',
      color: '#FF0000',
      hoverBg: 'rgba(255,0,0,0.15)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/rendrix',
      color: '#ffffff',
      hoverBg: 'rgba(255,255,255,0.1)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/rendrix',
      color: '#5865F2',
      hoverBg: 'rgba(88,101,242,0.15)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@rendrix',
      color: '#ff0050',
      hoverBg: 'linear-gradient(45deg, rgba(0,242,234,0.15), rgba(255,0,80,0.15))',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  const trustBadges = [
    { label: 'SOC 2 Type II', icon: Shield },
    { label: 'GDPR Compliant', icon: Lock },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,145,0,0.5) 50%, transparent 100%)',
        }}
      />

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #050505 50%, #0a0a0a 100%)',
          }}
        />
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
        {/* Newsletter Section */}
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

        {/* Main Footer Content */}
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
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
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
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

        {/* Premium Social Section - Centered */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-8 lg:p-10 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Background Effects */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,145,0,0.08) 0%, transparent 60%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse 40% 30% at 50% 0%, rgba(255,145,0,0.05) 0%, transparent 50%)',
              }}
            />

            {/* Content */}
            <div className="relative text-center">
              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  Connect with{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 100%)',
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    Rendrix
                  </span>
                </h3>
                <p className="text-sm text-white/40">Follow us for updates, tips, and community highlights</p>
              </motion.div>

              {/* Social Icons Grid */}
              <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl transition-all duration-300 hover:scale-110"
                      style={{
                        background: hoveredSocial === social.name ? social.hoverBg : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${hoveredSocial === social.name ? `${social.color}40` : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: hoveredSocial === social.name ? `0 8px 32px ${social.color}30, 0 0 0 1px ${social.color}20` : 'none',
                      }}
                      onMouseEnter={() => setHoveredSocial(social.name)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      {/* Glow Effect */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle, ${social.color}20 0%, transparent 70%)`,
                          filter: 'blur(8px)',
                        }}
                      />
                      {/* Icon */}
                      <span
                        className="relative transition-all duration-300"
                        style={{
                          color: hoveredSocial === social.name ? social.color : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {social.icon}
                      </span>
                      {/* Tooltip */}
                      <span
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-9 pointer-events-none"
                        style={{
                          background: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: social.color,
                        }}
                      >
                        {social.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Follower Count */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 flex items-center justify-center gap-6 text-sm text-white/30"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-black"
                        style={{
                          background: `linear-gradient(135deg, hsl(${25 + i * 10}, 90%, 55%) 0%, hsl(${25 + i * 10}, 90%, 45%) 100%)`,
                        }}
                      />
                    ))}
                  </div>
                  <span>100K+ followers</span>
                </div>
                <span className="hidden sm:block text-white/20">•</span>
                <span className="hidden sm:block">Join our growing community</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
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
                <span>&copy; {new Date().getFullYear()} Rendrix. All rights reserved.</span>
                <span className="hidden lg:block">&bull;</span>
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

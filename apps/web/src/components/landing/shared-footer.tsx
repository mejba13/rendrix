'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/rendrix',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
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

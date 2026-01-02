'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  ChevronRight,
  ArrowRight,
  Search,
  BookOpen,
  MessageSquare,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SharedHeaderProps {
  activeNav?: 'features' | 'pricing' | 'resources' | null;
}

export function SharedHeader({ activeNav = null }: SharedHeaderProps) {
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { label: 'Features', href: '/features', hasDropdown: false, key: 'features' as const },
    { label: 'Pricing', href: '/pricing', hasDropdown: false, key: 'pricing' as const },
    {
      label: 'Resources',
      href: '#resources',
      hasDropdown: true,
      key: 'resources' as const,
      items: [
        { icon: BookOpen, label: 'Documentation', description: 'Guides and API references', href: '/docs' },
        { icon: MessageSquare, label: 'Help Center', description: 'Get support and answers', href: '/help' },
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
              <span className="text-2xl font-bold tracking-tight">Rendrix</span>
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
                    className={`group flex items-center gap-1.5 px-4 py-2.5 text-[15px] transition-all duration-300 font-medium rounded-lg ${
                      activeNav === item.key
                        ? 'text-primary'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      {/* Animated underline */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300 rounded-full ${
                          activeNav === item.key ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
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
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/80 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 w-full max-w-sm h-full z-50 lg:hidden"
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
              <nav className="p-6">
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeNav === item.key
                            ? 'bg-primary/10 text-primary'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                        onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.hasDropdown && <ChevronRight className="w-4 h-4" />}
                      </Link>

                      {/* Dropdown items for mobile */}
                      {item.hasDropdown && item.items && (
                        <div className="mt-2 ml-4 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <subItem.icon className="w-4 h-4 text-primary" />
                              <span className="text-sm">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 pt-8 border-t border-white/[0.06] space-y-3">
                  <Link
                    href="/login"
                    className="block w-full py-3 text-center rounded-xl text-white/70 hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full py-3 text-center rounded-xl text-black font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Store,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Layers,
  Users,
  CreditCard,
  Package,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
  TrendingUp,
  Play,
} from 'lucide-react';
import { GlobalInfrastructureSection } from '@/components/landing/global-infrastructure-section';

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: number = 0, shouldStart: boolean = false) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.floor(start + (end - start) * easeOut);
      setCount(countRef.current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, start, shouldStart]);

  return count;
}

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

      {/* Hero Section - Premium Luminous Commerce */}
      <section className="relative min-h-screen flex flex-col pt-32 pb-0 overflow-hidden">
        {/* Vignette overlay for focus */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-[2]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Ambient Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large primary orb - top right */}
          <div
            className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full transition-all duration-[2000ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{
              background: 'radial-gradient(circle, rgba(255,145,0,0.18) 0%, rgba(255,145,0,0.06) 35%, transparent 65%)',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          {/* Secondary orb - left */}
          <div
            className={`absolute top-1/4 -left-32 w-[450px] h-[450px] rounded-full transition-all duration-[2500ms] delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{
              background: 'radial-gradient(circle, rgba(255,100,0,0.14) 0%, rgba(255,145,0,0.05) 40%, transparent 65%)',
              animation: 'float 10s ease-in-out infinite reverse',
            }}
          />
          {/* Accent orb - bottom center */}
          <div
            className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full transition-all duration-[3000ms] delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{
              background: 'radial-gradient(ellipse, rgba(255,145,0,0.12) 0%, transparent 60%)',
              animation: 'float 12s ease-in-out infinite',
            }}
          />

          {/* Floating geometric rings */}
          <div
            className={`absolute top-1/4 right-[15%] w-24 h-24 rounded-full border border-primary/10 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ animation: 'float 15s ease-in-out infinite' }}
          />
          <div
            className={`absolute top-[60%] left-[10%] w-16 h-16 rounded-full border border-orange-500/10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ animation: 'float 12s ease-in-out infinite reverse' }}
          />

          {/* Enhanced floating particles with glow */}
          {[
            { size: 3, left: 10, top: 25, delay: 0, duration: 8 },
            { size: 2, left: 25, top: 15, delay: 1, duration: 10 },
            { size: 4, left: 85, top: 20, delay: 0.5, duration: 9 },
            { size: 2, left: 75, top: 55, delay: 1.5, duration: 11 },
            { size: 3, left: 15, top: 65, delay: 2, duration: 7 },
            { size: 2, left: 90, top: 70, delay: 0.8, duration: 12 },
            { size: 3, left: 50, top: 80, delay: 1.2, duration: 10 },
            { size: 2, left: 35, top: 35, delay: 0.3, duration: 9 },
          ].map((particle, i) => (
            <div
              key={i}
              className={`absolute rounded-full transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                background: 'rgba(255,145,0,0.6)',
                boxShadow: '0 0 8px rgba(255,145,0,0.4), 0 0 16px rgba(255,145,0,0.2)',
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center flex-1 flex flex-col justify-center">
          {/* Eyebrow badge */}
          <div
            className={`flex justify-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <Link href="#features" className="group">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.06] hover:border-primary/20 transition-all cursor-pointer">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm text-white/70 font-medium group-hover:text-white/90 transition-colors">Now with AI-powered analytics</span>
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>

          {/* Main Headline - Staggered animation */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-medium tracking-tight leading-[0.95] mb-8">
            <span
              className={`block transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
            >
              The full
            </span>
            <span
              className={`flex items-center justify-center gap-4 sm:gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <span className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-orange-600 shadow-2xl group" style={{ boxShadow: '0 0 60px rgba(255,145,0,0.3), 0 20px 40px rgba(255,145,0,0.2)' }}>
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black" />
                {/* Subtle pulse ring */}
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 animate-pulse" style={{ animationDuration: '2s' }} />
              </span>
              <span className="relative">
                <span
                  className="bg-gradient-to-r from-primary via-orange-400 to-orange-500 bg-clip-text text-transparent"
                  style={{ textShadow: '0 0 80px rgba(255,145,0,0.5)' }}
                >
                  commerce
                </span>
                {/* Glowing underline */}
                <span
                  className={`absolute -bottom-2 left-0 h-1 rounded-full transition-all duration-1000 delay-700 ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
                  style={{
                    background: 'linear-gradient(90deg, #FF9100, #FF6B00)',
                    boxShadow: '0 0 20px rgba(255,145,0,0.5), 0 0 40px rgba(255,145,0,0.3)',
                  }}
                />
              </span>
            </span>
            <span
              className={`block transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
            >
              stack
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-white/50 leading-relaxed mb-10 font-normal transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Create, manage, and scale multiple stores from a single dashboard.
            <br className="hidden sm:block" />
            <span className="text-white/80 font-medium">Enterprise-grade commerce</span> for any size.
          </p>

          {/* CTA Group */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="relative text-black font-semibold px-10 py-7 text-lg rounded-xl overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 0 40px rgba(255,145,0,0.25), 0 10px 30px rgba(255,145,0,0.2)',
                }}
              >
                {/* Animated shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-3">
                  Start building free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="#demo" className="group">
              <Button variant="ghost" size="lg" className="text-white/70 hover:text-white hover:bg-white/[0.04] font-medium px-6 py-7 text-lg rounded-xl border border-transparent hover:border-white/10 transition-all">
                <span className="flex items-center gap-3">
                  <span className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all overflow-hidden">
                    <Play className="w-4 h-4 ml-0.5 relative z-10" />
                    <span className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform rounded-full" />
                  </span>
                  Watch demo
                </span>
              </Button>
            </Link>
          </div>

          {/* Trust Stats - Animated Counters */}
          <div
            className={`flex flex-wrap items-center justify-center gap-8 sm:gap-14 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <HeroStat value={50} suffix="K+" label="Active stores" shouldAnimate={isVisible} />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden sm:block" />
            <HeroStat value={10} suffix="M+" label="Orders processed" shouldAnimate={isVisible} />
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden sm:block" />
            <HeroStat value={99.99} suffix="%" label="Uptime SLA" shouldAnimate={isVisible} isDecimal />
          </div>
        </div>

        {/* Browser Mockup - Enhanced */}
        <div
          className={`relative w-full max-w-5xl mx-auto px-4 sm:px-8 mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          {/* Floating feature cards around the browser */}
          <div className="absolute -left-8 lg:-left-16 top-[15%] z-20 hidden lg:block">
            <div
              className={`relative p-4 rounded-2xl backdrop-blur-xl transition-all duration-1000 delay-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.1) 100%)' }}>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">Revenue</div>
                  <div className="text-xl font-semibold text-green-400">+24.5%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-8 lg:-right-16 top-[25%] z-20 hidden lg:block">
            <div
              className={`relative p-4 rounded-2xl backdrop-blur-xl transition-all duration-1000 delay-1100 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
                animation: 'float 7s ease-in-out infinite reverse',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,145,0,0.1) 100%)' }}>
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">Orders</div>
                  <div className="text-xl font-semibold">1,247</div>
                </div>
              </div>
            </div>
          </div>

          {/* Third floating card - bottom left */}
          <div className="absolute -left-4 lg:-left-8 bottom-[35%] z-20 hidden xl:block">
            <div
              className={`relative p-3 rounded-xl backdrop-blur-xl transition-all duration-1000 delay-1200 hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                animation: 'float 8s ease-in-out infinite',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-sm font-medium">+127 new</div>
              </div>
            </div>
          </div>

          {/* Browser frame with enhanced styling */}
          <div
            className="relative rounded-xl overflow-hidden translate-y-16 sm:translate-y-24 lg:translate-y-32"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px rgba(0,0,0,0.5), 0 0 100px rgba(255,145,0,0.1)',
            }}
          >
            {/* Browser reflection/sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />

            <div className="browser-header bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" style={{ boxShadow: '0 0 8px rgba(255,95,87,0.4)' }} />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" style={{ boxShadow: '0 0 8px rgba(254,188,46,0.4)' }} />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 8px rgba(40,200,64,0.4)' }} />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white/[0.04] rounded-lg px-4 py-2 text-sm text-white/40 max-w-md mx-auto flex items-center gap-2 border border-white/[0.06]">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
                  <span className="truncate">dashboard.rendrix.com/stores/my-store</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] hidden sm:block" />
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] hidden sm:block" />
              </div>
            </div>
            <div className="relative aspect-[16/9] bg-[#050505] overflow-hidden">
              {/* Dashboard Preview - More detailed */}
              <div className="absolute inset-0 flex">
                {/* Sidebar */}
                <div className="w-16 sm:w-56 bg-[#080808] border-r border-white/[0.06] p-2 sm:p-4 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)', boxShadow: '0 4px 12px rgba(255,145,0,0.3)' }} />
                    <div className="h-4 w-20 bg-white/10 rounded hidden sm:block" />
                  </div>
                  <div className="space-y-1">
                    {[
                      { active: true },
                      { active: false },
                      { active: false },
                      { active: false },
                      { active: false },
                      { active: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`h-10 rounded-lg flex items-center gap-3 px-2 sm:px-3 transition-colors ${item.active ? 'bg-primary/15 border border-primary/20' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded flex-shrink-0 ${item.active ? 'bg-primary/40' : 'bg-white/10'}`} />
                        <div className={`h-2.5 w-16 rounded hidden sm:block ${item.active ? 'bg-primary/50' : 'bg-white/10'}`} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 p-3 sm:p-6 space-y-4 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-6 w-24 sm:w-36 bg-white/15 rounded" />
                      <div className="h-3 w-16 sm:w-24 bg-white/5 rounded hidden sm:block" />
                    </div>
                    <div className="h-9 w-20 sm:w-32 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' }} />
                  </div>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {[
                      { value: '$12,847', color: 'text-green-400', trend: '+12%' },
                      { value: '847', color: 'text-white', trend: '+8%' },
                      { value: '2,451', color: 'text-white', trend: '+15%' },
                      { value: '156', color: 'text-white', trend: '' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-2 sm:p-4">
                        <div className="h-2 w-10 sm:w-14 bg-white/10 rounded mb-2" />
                        <div className="flex items-baseline gap-1">
                          <div className={`text-sm sm:text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                          {stat.trend && (
                            <span className="text-[10px] text-green-400 hidden sm:inline">{stat.trend}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Chart Area */}
                  <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/[0.06] p-3 sm:p-4 min-h-[120px] sm:min-h-[180px]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-3 w-16 sm:w-24 bg-white/10 rounded" />
                      <div className="flex gap-2">
                        <div className="h-6 w-12 sm:w-16 bg-white/[0.04] rounded border border-white/[0.06] hidden sm:block" />
                        <div className="h-6 w-12 sm:w-16 bg-primary/20 rounded hidden sm:block" />
                      </div>
                    </div>
                    {/* Animated chart bars */}
                    <div className="flex items-end justify-between h-16 sm:h-28 gap-1 sm:gap-2 mt-4">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t transition-all duration-1000 ${isVisible ? '' : 'h-0'}`}
                          style={{
                            height: isVisible ? `${height}%` : '0%',
                            background: `linear-gradient(180deg, rgba(255,145,0,0.8) 0%, rgba(255,145,0,0.3) 100%)`,
                            transitionDelay: `${800 + i * 50}ms`,
                            boxShadow: i === 9 ? '0 0 20px rgba(255,145,0,0.3)' : undefined,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced glow effect behind browser */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-x-0 bottom-0 h-[80%] blur-[100px] opacity-50">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-orange-500/40 to-transparent" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[300px] blur-[120px] opacity-40">
              <div className="absolute inset-0 bg-primary/50 rounded-full" />
            </div>
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

      {/* Global Infrastructure Section */}
      <GlobalInfrastructureSection />

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

function HeroStat({
  value,
  suffix,
  label,
  shouldAnimate,
  isDecimal = false,
}: {
  value: number;
  suffix: string;
  label: string;
  shouldAnimate: boolean;
  isDecimal?: boolean;
}) {
  const count = useCountUp(isDecimal ? value * 100 : value, 2000, 0, shouldAnimate);
  const displayValue = isDecimal ? (count / 100).toFixed(2) : count;

  return (
    <div className="text-center group cursor-default">
      <div className="text-3xl sm:text-4xl font-semibold tabular-nums transition-transform duration-300 group-hover:scale-105">
        <span
          className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent bg-[length:200%_100%]"
          style={{ animation: shouldAnimate ? 'shimmer 3s ease-in-out infinite' : undefined }}
        >
          {displayValue}
        </span>
        <span className="text-white/50">{suffix}</span>
      </div>
      <div className="text-sm text-white/40 mt-1.5 group-hover:text-white/60 transition-colors">{label}</div>
    </div>
  );
}

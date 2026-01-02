'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Clock,
  Globe,
  Baby,
  FileText,
  Mail,
  ChevronRight,
  ArrowUp,
  Store,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SharedHeader } from '@/components/landing/shared-header';
import { SharedFooter } from '@/components/landing/shared-footer';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Privacy sections data
const privacySections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: FileText,
    color: 'primary',
    gradient: 'from-primary/20 to-orange-500/10',
  },
  {
    id: 'information-collection',
    title: 'Information We Collect',
    icon: Database,
    color: 'blue',
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    id: 'information-use',
    title: 'How We Use Information',
    icon: Eye,
    color: 'purple',
    gradient: 'from-purple-500/20 to-violet-500/10',
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing',
    icon: Share2,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    color: 'amber',
    gradient: 'from-amber-500/20 to-yellow-500/10',
  },
  {
    id: 'your-rights',
    title: 'Your Rights & Choices',
    icon: UserCheck,
    color: 'rose',
    gradient: 'from-rose-500/20 to-pink-500/10',
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: Cookie,
    color: 'indigo',
    gradient: 'from-indigo-500/20 to-blue-500/10',
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: Clock,
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-sky-500/10',
  },
  {
    id: 'international',
    title: 'International Transfers',
    icon: Globe,
    color: 'teal',
    gradient: 'from-teal-500/20 to-emerald-500/10',
  },
  {
    id: 'children',
    title: "Children's Privacy",
    icon: Baby,
    color: 'pink',
    gradient: 'from-pink-500/20 to-rose-500/10',
  },
  {
    id: 'changes',
    title: 'Policy Changes',
    icon: AlertCircle,
    color: 'orange',
    gradient: 'from-orange-500/20 to-amber-500/10',
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    color: 'sky',
    gradient: 'from-sky-500/20 to-blue-500/10',
  },
];

// Section component for animated visibility
function Section({
  id,
  children,
  className = ''
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Section Header component
function SectionHeader({
  icon: Icon,
  title,
  gradient,
  color
}: {
  icon: React.ElementType;
  title: string;
  gradient: string;
  color: string;
}) {
  const getIconColor = () => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'blue': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'emerald': return 'text-emerald-400';
      case 'amber': return 'text-amber-400';
      case 'rose': return 'text-rose-400';
      case 'indigo': return 'text-indigo-400';
      case 'cyan': return 'text-cyan-400';
      case 'teal': return 'text-teal-400';
      case 'pink': return 'text-pink-400';
      case 'orange': return 'text-orange-400';
      case 'sky': return 'text-sky-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${getIconColor()}`} />
      </div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
    </div>
  );
}

// Bullet point component
function BulletPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-white/60 leading-relaxed">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
}


// Back to top button
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary/20"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}

// Main Privacy Page
export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = privacySections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(privacySections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SharedHeader activeNav={null} />
      <BackToTop />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/70">Your Privacy Matters</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Privacy{' '}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-white/50 mb-8 leading-relaxed">
              We are committed to protecting your privacy and being transparent about how we collect, use, and safeguard your personal information.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-4 h-4" />
                <span>Last updated: January 15, 2025</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <FileText className="w-4 h-4" />
                <span>Version 2.1</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="sticky top-28">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                  On This Page
                </h3>
                <nav className="space-y-1">
                  {privacySections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 group ${
                          isActive
                            ? 'bg-white/[0.06] text-white'
                            : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-primary' : 'group-hover:text-primary/70'
                        }`} />
                        <span className="truncate">{section.title}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 ml-auto text-primary" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t border-white/[0.06]">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/terms"
                      className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Terms of Service
                    </Link>
                    <Link
                      href="/cookies"
                      className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Cookie Policy
                    </Link>
                    <Link
                      href="/security"
                      className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Security Overview
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Content */}
            <div className="space-y-16">
              {/* Introduction */}
              <Section id="introduction">
                <SectionHeader
                  icon={FileText}
                  title="Introduction"
                  gradient="from-primary/20 to-orange-500/10"
                  color="primary"
                />
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/60 leading-relaxed text-lg">
                    Welcome to Rendrix ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our e-commerce platform and services.
                  </p>
                  <p className="text-white/60 leading-relaxed mt-4">
                    By accessing or using Rendrix, you agree to this Privacy Policy. If you do not agree with the terms of this policy, please do not access the platform.
                  </p>
                  <div className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/70">
                        <strong className="text-white">Important:</strong> This policy applies to all users of Rendrix, including merchants, customers, and visitors. Please read it carefully to understand our practices regarding your personal data.
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Information We Collect */}
              <Section id="information-collection">
                <SectionHeader
                  icon={Database}
                  title="Information We Collect"
                  gradient="from-blue-500/20 to-cyan-500/10"
                  color="blue"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from third-party sources.
                  </p>

                  {/* Bento Grid for Info Types */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Database className="w-4 h-4 text-blue-400" />
                        </div>
                        Personal Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <BulletPoint>Name and contact information</BulletPoint>
                        <BulletPoint>Email address and phone number</BulletPoint>
                        <BulletPoint>Billing and shipping addresses</BulletPoint>
                        <BulletPoint>Payment information</BulletPoint>
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-purple-400" />
                        </div>
                        Usage Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <BulletPoint>Device and browser information</BulletPoint>
                        <BulletPoint>IP address and location data</BulletPoint>
                        <BulletPoint>Pages visited and actions taken</BulletPoint>
                        <BulletPoint>Time spent on platform</BulletPoint>
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Store className="w-4 h-4 text-emerald-400" />
                        </div>
                        Business Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <BulletPoint>Business name and details</BulletPoint>
                        <BulletPoint>Tax identification numbers</BulletPoint>
                        <BulletPoint>Store configuration data</BulletPoint>
                        <BulletPoint>Product and inventory data</BulletPoint>
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-amber-400" />
                        </div>
                        Third-Party Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <BulletPoint>Social media profile data</BulletPoint>
                        <BulletPoint>Integration service data</BulletPoint>
                        <BulletPoint>Analytics provider data</BulletPoint>
                        <BulletPoint>Payment processor data</BulletPoint>
                      </ul>
                    </div>
                  </div>
                </div>
              </Section>

              {/* How We Use Information */}
              <Section id="information-use">
                <SectionHeader
                  icon={Eye}
                  title="How We Use Your Information"
                  gradient="from-purple-500/20 to-violet-500/10"
                  color="purple"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you and ensure the security of our platform.
                  </p>

                  <div className="grid gap-4">
                    {[
                      { title: 'Service Delivery', desc: 'To provide you with our e-commerce platform services, process transactions, and fulfill orders.' },
                      { title: 'Account Management', desc: 'To create and manage your account, authenticate your identity, and provide customer support.' },
                      { title: 'Communications', desc: 'To send you updates, security alerts, marketing messages (with your consent), and respond to inquiries.' },
                      { title: 'Analytics & Improvement', desc: 'To analyze usage patterns, improve our services, and develop new features and functionality.' },
                      { title: 'Security & Fraud Prevention', desc: 'To detect, prevent, and address fraud, abuse, and other harmful activities.' },
                      { title: 'Legal Compliance', desc: 'To comply with applicable laws, regulations, and legal processes.' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">{item.title}</h4>
                          <p className="text-sm text-white/50">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Information Sharing */}
              <Section id="information-sharing">
                <SectionHeader
                  icon={Share2}
                  title="Information Sharing"
                  gradient="from-emerald-500/20 to-teal-500/10"
                  color="emerald"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-2">Service Providers</h4>
                      <p className="text-sm text-white/50">
                        We share information with third-party vendors who perform services on our behalf, such as payment processing, data hosting, and customer support.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-2">Business Transfers</h4>
                      <p className="text-sm text-white/50">
                        In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-2">Legal Requirements</h4>
                      <p className="text-sm text-white/50">
                        We may disclose your information if required by law or in response to valid legal process, such as a subpoena or court order.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-2">With Your Consent</h4>
                      <p className="text-sm text-white/50">
                        We may share information with third parties when you have given us explicit consent to do so.
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Data Security */}
              <Section id="data-security">
                <SectionHeader
                  icon={Lock}
                  title="Data Security"
                  gradient="from-amber-500/20 to-yellow-500/10"
                  color="amber"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Lock, title: 'Encryption', desc: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256)' },
                      { icon: Shield, title: 'Access Controls', desc: 'Strict role-based access controls and multi-factor authentication' },
                      { icon: Eye, title: 'Monitoring', desc: '24/7 security monitoring and intrusion detection systems' },
                      { icon: Database, title: 'Backups', desc: 'Regular encrypted backups with geographic redundancy' },
                      { icon: UserCheck, title: 'Compliance', desc: 'SOC 2 Type II compliant with regular third-party audits' },
                      { icon: AlertCircle, title: 'Incident Response', desc: 'Comprehensive incident response and breach notification procedures' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-5 h-5 text-amber-400" />
                          </div>
                          <h4 className="text-white font-medium mb-1">{item.title}</h4>
                          <p className="text-xs text-white/50">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Section>

              {/* Your Rights */}
              <Section id="your-rights">
                <SectionHeader
                  icon={UserCheck}
                  title="Your Rights & Choices"
                  gradient="from-rose-500/20 to-pink-500/10"
                  color="rose"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information. We respect these rights and provide mechanisms to exercise them.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Access', desc: 'Request a copy of the personal information we hold about you' },
                      { title: 'Correction', desc: 'Request correction of inaccurate or incomplete information' },
                      { title: 'Deletion', desc: 'Request deletion of your personal information (subject to legal obligations)' },
                      { title: 'Portability', desc: 'Request your data in a portable, machine-readable format' },
                      { title: 'Opt-out', desc: 'Opt out of marketing communications at any time' },
                      { title: 'Restriction', desc: 'Request restriction of processing in certain circumstances' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <CheckCircle2 className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-1">{item.title}</h4>
                          <p className="text-sm text-white/50">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-white/50 mt-4">
                    To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:privacy@rendrix.com" className="text-primary hover:underline">
                      privacy@rendrix.com
                    </a>
                    . We will respond to your request within 30 days.
                  </p>
                </div>
              </Section>

              {/* Cookies */}
              <Section id="cookies">
                <SectionHeader
                  icon={Cookie}
                  title="Cookies & Tracking"
                  gradient="from-indigo-500/20 to-blue-500/10"
                  color="indigo"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We use cookies and similar tracking technologies to collect information about your browsing activities and to provide you with a personalized experience.
                  </p>

                  <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                    <table className="w-full">
                      <thead className="bg-white/[0.04]">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-white">Cookie Type</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-white">Purpose</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-white">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {[
                          { type: 'Essential', purpose: 'Required for basic site functionality', duration: 'Session' },
                          { type: 'Analytics', purpose: 'Help us understand how visitors interact', duration: '2 years' },
                          { type: 'Preferences', purpose: 'Remember your settings and preferences', duration: '1 year' },
                          { type: 'Marketing', purpose: 'Deliver relevant advertisements', duration: '90 days' },
                        ].map((row, index) => (
                          <tr key={index} className="bg-white/[0.02]">
                            <td className="px-4 py-3 text-sm text-white">{row.type}</td>
                            <td className="px-4 py-3 text-sm text-white/60">{row.purpose}</td>
                            <td className="px-4 py-3 text-sm text-white/50">{row.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-white/50">
                    You can manage your cookie preferences through your browser settings. For more information, see our{' '}
                    <Link href="/cookies" className="text-primary hover:underline">
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
              </Section>

              {/* Data Retention */}
              <Section id="data-retention">
                <SectionHeader
                  icon={Clock}
                  title="Data Retention"
                  gradient="from-cyan-500/20 to-sky-500/10"
                  color="cyan"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, and resolve disputes.
                  </p>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-white font-medium mb-4">Retention Periods</h4>
                    <div className="space-y-3">
                      {[
                        { data: 'Account information', period: 'Duration of account + 3 years' },
                        { data: 'Transaction records', period: '7 years (legal requirement)' },
                        { data: 'Support communications', period: '3 years after resolution' },
                        { data: 'Marketing preferences', period: 'Until you opt out' },
                        { data: 'Analytics data', period: '26 months' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                          <span className="text-sm text-white/70">{item.data}</span>
                          <span className="text-sm text-white/40">{item.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* International Transfers */}
              <Section id="international">
                <SectionHeader
                  icon={Globe}
                  title="International Data Transfers"
                  gradient="from-teal-500/20 to-emerald-500/10"
                  color="teal"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    Rendrix operates globally, and your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-2">Standard Contractual Clauses</h4>
                      <p className="text-sm text-white/50">
                        We use EU-approved Standard Contractual Clauses for data transfers outside the EEA.
                      </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-white font-medium mb-2">Data Processing Agreements</h4>
                      <p className="text-sm text-white/50">
                        We have DPAs in place with all third-party processors to ensure data protection.
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Children's Privacy */}
              <Section id="children">
                <SectionHeader
                  icon={Baby}
                  title="Children's Privacy"
                  gradient="from-pink-500/20 to-rose-500/10"
                  color="pink"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    Rendrix is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.
                  </p>

                  <div className="p-5 rounded-xl bg-pink-500/5 border border-pink-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/70">
                        If you believe we have collected information from a child under 16, please contact us immediately at{' '}
                        <a href="mailto:privacy@rendrix.com" className="text-primary hover:underline">
                          privacy@rendrix.com
                        </a>
                        {' '}and we will take steps to delete such information.
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Policy Changes */}
              <Section id="changes">
                <SectionHeader
                  icon={AlertCircle}
                  title="Changes to This Policy"
                  gradient="from-orange-500/20 to-amber-500/10"
                  color="orange"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-white/60">We will notify you of material changes via email or platform notification</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-white/60">The "Last Updated" date at the top will be revised accordingly</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-white/60">Your continued use after changes constitutes acceptance of the updated policy</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Contact Us */}
              <Section id="contact">
                <SectionHeader
                  icon={Mail}
                  title="Contact Us"
                  gradient="from-sky-500/20 to-blue-500/10"
                  color="sky"
                />
                <div className="space-y-6">
                  <p className="text-white/60 leading-relaxed">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <Mail className="w-8 h-8 text-sky-400 mb-3" />
                      <h4 className="text-white font-medium mb-1">Email</h4>
                      <a href="mailto:privacy@rendrix.com" className="text-primary hover:underline">
                        privacy@rendrix.com
                      </a>
                    </div>

                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <Globe className="w-8 h-8 text-sky-400 mb-3" />
                      <h4 className="text-white font-medium mb-1">Address</h4>
                      <p className="text-sm text-white/50">
                        Rendrix Inc.<br />
                        123 Commerce Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/5 border border-primary/20">
                    <p className="text-sm text-white/70">
                      For EU residents, our Data Protection Officer can be reached at{' '}
                      <a href="mailto:dpo@rendrix.com" className="text-primary hover:underline">
                        dpo@rendrix.com
                      </a>
                      . You also have the right to lodge a complaint with your local supervisory authority.
                    </p>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

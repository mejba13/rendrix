'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Zap,
  Globe,
  Shield,
  Rocket,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  Store,
  Code,
  Palette,
  BarChart3,
  Heart,
  Award,
  TrendingUp,
  CheckCircle2,
  Crown,
  Linkedin,
  Twitter,
  Github,
  Brain,
  Server,
  Megaphone,
  Layers,
} from 'lucide-react';
import type { Variants } from 'framer-motion';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className="tabular-nums"
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value.toLocaleString()}{suffix}
        </motion.span>
      ) : (
        '0'
      )}
    </motion.span>
  );
}

// Bento card component
function BentoCard({
  children,
  className = '',
  glowColor = 'rgba(255, 145, 0, 0.1)',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className={`relative group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm ${className}`}
      style={{
        boxShadow: `0 0 60px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
}

// Value card component
function ValueCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Timeline item component
function TimelineItem({
  year,
  title,
  description,
  isLast = false,
  index,
}: {
  year: string;
  title: string;
  description: string;
  isLast?: boolean;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[23px] top-12 bottom-0 w-px bg-gradient-to-b from-primary/40 to-primary/0" />
      )}
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30">
        <span className="text-xs font-bold text-black">{year}</span>
      </div>
      {/* Content */}
      <div className="pb-10">
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Department colors mapping
const departmentColors: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  Leadership: { bg: 'from-primary/20 to-orange-600/20', text: 'text-primary', glow: 'rgba(255, 145, 0, 0.3)', border: 'border-primary/30' },
  Engineering: { bg: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.2)', border: 'border-blue-500/30' },
  AI: { bg: 'from-cyan-500/20 to-teal-500/20', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.2)', border: 'border-cyan-500/30' },
  Design: { bg: 'from-purple-500/20 to-pink-500/20', text: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.2)', border: 'border-purple-500/30' },
  Marketing: { bg: 'from-emerald-500/20 to-green-500/20', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.2)', border: 'border-emerald-500/30' },
  DevOps: { bg: 'from-orange-500/20 to-red-500/20', text: 'text-orange-400', glow: 'rgba(249, 115, 22, 0.2)', border: 'border-orange-500/30' },
  Product: { bg: 'from-amber-500/20 to-yellow-500/20', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.2)', border: 'border-amber-500/30' },
};

// Team member type
interface TeamMember {
  name: string;
  role: string;
  department: string;
  image: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

// CEO Showcase Card Component
function CEOShowcaseCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-w-4xl mx-auto mb-20"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-orange-500/10 to-primary/20 blur-[100px] rounded-full"
      />

      {/* Main card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-xl">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated border gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-[1px] rounded-[2.5rem] opacity-50"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #FF9100, transparent, #FF6B00, transparent)',
          }}
        />

        {/* Inner content container */}
        <div className="relative bg-black/40 rounded-[2.5rem] p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image section with animated rings */}
            <div className="relative flex-shrink-0">
              {/* Outer animated ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-6 rounded-full border-2 border-dashed border-primary/20"
              />

              {/* Middle pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-3 rounded-full border border-primary/40"
              />

              {/* Glow effect behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-orange-600 blur-2xl opacity-40" />

              {/* Image container */}
              <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl shadow-primary/30">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Founder badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/50"
              >
                <Crown className="w-7 h-7 text-black" />
              </motion.div>
            </div>

            {/* Content section */}
            <div className="flex-1 text-center md:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Founder & Visionary</span>
              </motion.div>

              {/* Name */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-white mb-2"
              >
                {member.name}
              </motion.h3>

              {/* Role */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-xl text-primary font-medium mb-4"
              >
                {member.role}
              </motion.p>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-white/60 leading-relaxed mb-6 max-w-lg"
              >
                {member.bio}
              </motion.p>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center md:justify-start gap-3"
              >
                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 group"
                  >
                    <Linkedin className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
                  </a>
                )}
                {member.social?.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 group"
                  >
                    <Twitter className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
                  </a>
                )}
                {member.social?.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 group"
                  >
                    <Github className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Team member bento card
function TeamMemberBentoCard({
  member,
  index,
  size = 'normal',
}: {
  member: TeamMember;
  index: number;
  size?: 'normal' | 'large';
}) {
  const colors = departmentColors[member.department] || departmentColors.Engineering;
  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm ${isLarge ? 'row-span-2' : ''}`}
      style={{ boxShadow: `0 0 40px ${colors.glow}` }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hover gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Animated border on hover */}
      <div className={`absolute inset-0 rounded-2xl border-2 ${colors.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className={`relative z-10 p-6 ${isLarge ? 'flex flex-col h-full' : ''}`}>
        {/* Image */}
        <div className={`relative ${isLarge ? 'w-28 h-28 mb-6' : 'w-20 h-20 mb-4'} mx-auto rounded-full overflow-hidden`}>
          {/* Glow ring on hover */}
          <motion.div
            className={`absolute -inset-1 rounded-full bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300`}
          />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-colors duration-300">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Department badge */}
        <div className={`flex justify-center mb-3`}>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.text} bg-white/5 border ${colors.border}`}>
            {member.department === 'AI' && <Brain className="w-3 h-3" />}
            {member.department === 'Engineering' && <Code className="w-3 h-3" />}
            {member.department === 'Design' && <Palette className="w-3 h-3" />}
            {member.department === 'Marketing' && <Megaphone className="w-3 h-3" />}
            {member.department === 'DevOps' && <Server className="w-3 h-3" />}
            {member.department === 'Product' && <Layers className="w-3 h-3" />}
            {member.department === 'Leadership' && <Crown className="w-3 h-3" />}
            {member.department}
          </span>
        </div>

        {/* Name */}
        <h4 className={`text-center font-semibold text-white group-hover:${colors.text} transition-colors duration-300 ${isLarge ? 'text-xl mb-1' : 'text-base mb-0.5'}`}>
          {member.name}
        </h4>

        {/* Role */}
        <p className={`text-center text-white/50 ${isLarge ? 'text-sm mb-4' : 'text-xs'}`}>
          {member.role}
        </p>

        {/* Bio for large cards */}
        {isLarge && member.bio && (
          <p className="text-center text-white/40 text-sm leading-relaxed flex-1">
            {member.bio}
          </p>
        )}

        {/* Social links */}
        {member.social && (
          <div className={`flex items-center justify-center gap-2 ${isLarge ? 'mt-4' : 'mt-3'}`}>
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group/social"
              >
                <Linkedin className={`w-4 h-4 text-white/40 group-hover/social:${colors.text} transition-colors`} />
              </a>
            )}
            {member.social.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group/social"
              >
                <Twitter className={`w-4 h-4 text-white/40 group-hover/social:${colors.text} transition-colors`} />
              </a>
            )}
            {member.social.github && (
              <a
                href={member.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group/social"
              >
                <Github className={`w-4 h-4 text-white/40 group-hover/social:${colors.text} transition-colors`} />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Floating particle component for team section background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  const values = [
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We push boundaries and embrace cutting-edge technology to deliver exceptional e-commerce solutions.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security infrastructure protecting your business and customer data around the clock.',
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Built for businesses of all sizes, from local startups to international enterprises.',
    },
    {
      icon: Heart,
      title: 'Customer Obsessed',
      description: 'Every feature we build starts with understanding and solving real merchant challenges.',
    },
    {
      icon: Rocket,
      title: 'Performance Driven',
      description: 'Lightning-fast storefronts that convert visitors into customers, every single time.',
    },
    {
      icon: Users,
      title: 'Community Powered',
      description: 'A thriving ecosystem of merchants, developers, and partners growing together.',
    },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'The Vision Begins',
      description: 'Rendrix was founded with a mission to democratize enterprise-grade e-commerce for businesses worldwide.',
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Released our multi-tenant SaaS platform with advanced store management, payment processing, and analytics.',
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to 50+ countries with localized payment methods, currencies, and compliance frameworks.',
    },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Active Stores', icon: Store },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', icon: CheckCircle2 },
    { value: 150, suffix: '+', label: 'Countries Served', icon: Globe },
    { value: 2.5, suffix: 'M+', label: 'Orders Processed', icon: TrendingUp },
  ];

  // CEO Data
  const ceo: TeamMember = {
    name: 'Engr Mejba Ahmed',
    role: 'CEO & Founder',
    department: 'Leadership',
    image: '/images/engr-mejba-ahmed-optimize.png',
    bio: 'Visionary entrepreneur and software engineer with a passion for democratizing e-commerce. Leading Rendrix to empower businesses worldwide with enterprise-grade tools.',
    social: {
      linkedin: 'https://linkedin.com/in/mejbaahmed',
      twitter: 'https://twitter.com/mejbaahmed',
      github: 'https://github.com/mejbaahmed',
    },
  };

  // Leadership Team Data
  const leadershipTeam: TeamMember[] = [
    {
      name: 'Sarah Chen',
      role: 'Chief Technology Officer',
      department: 'Engineering',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      bio: 'Former Google engineer driving our technical vision.',
      social: { linkedin: '#', github: '#' },
    },
    {
      name: 'Dr. James Wilson',
      role: 'Head of AI & ML',
      department: 'AI',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'PhD in Machine Learning, building intelligent commerce systems.',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      department: 'Product',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'Michael Park',
      role: 'Lead DevOps Engineer',
      department: 'DevOps',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      social: { linkedin: '#', github: '#' },
    },
    {
      name: 'Sophia Martinez',
      role: 'Creative Director',
      department: 'Design',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning designer crafting beautiful experiences.',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'David Kim',
      role: 'Marketing Director',
      department: 'Marketing',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      name: 'Rachel Thompson',
      role: 'Senior Frontend Engineer',
      department: 'Engineering',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      social: { linkedin: '#', github: '#' },
    },
    {
      name: 'Alex Johnson',
      role: 'Senior Backend Engineer',
      department: 'Engineering',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
      social: { linkedin: '#', github: '#' },
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/[0.02] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            <Link href="/#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-primary">About</Link>
            <Link href="/#contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative pt-32 pb-24 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powering the future of commerce</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">We&apos;re building the</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              commerce of tomorrow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Rendrix empowers entrepreneurs and enterprises alike to create, manage, and scale
            their online stores with enterprise-grade tools that were once only available to the biggest players.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#story"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white border border-white/20 rounded-full hover:bg-white/5 transition-all duration-300"
            >
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 border border-white/[0.05] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-20 w-16 h-16 border border-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </motion.section>

      {/* Stats Section - Bento Grid */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <BentoCard key={stat.label} delay={index * 0.1} className="p-8 text-center">
                <div className="relative z-10">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4 opacity-80" />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-white/50 font-medium">{stat.label}</p>
                </div>
              </BentoCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section - Large Bento Card */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <BentoCard className="p-12 md:p-16" glowColor="rgba(255, 145, 0, 0.15)">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
                    <Target className="w-4 h-4" />
                    Our Mission
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    Democratizing enterprise commerce for everyone
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-6">
                    We believe every entrepreneur deserves access to the same powerful tools that drive
                    billion-dollar businesses. Rendrix makes enterprise-grade e-commerce accessible,
                    affordable, and incredibly easy to use.
                  </p>
                  <p className="text-white/60 leading-relaxed">
                    From AI-powered analytics to global payment processing, we&apos;re building the
                    infrastructure that enables businesses to compete and win in the digital economy.
                  </p>
                </motion.div>
              </div>
              <div className="relative">
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-white/10"
                >
                  {/* Abstract visualization */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-orange-500/10 to-purple-500/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Animated rings */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-16 border border-primary/20 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-32 border border-primary/10 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-48 border border-primary/5 rounded-full"
                      />
                      {/* Center icon */}
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/50">
                        <Store className="w-12 h-12 text-black" />
                      </div>
                    </div>
                  </div>
                  {/* Floating icons */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <Code className="w-6 h-6 text-primary" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <Palette className="w-6 h-6 text-orange-400" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-8 left-8 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <BarChart3 className="w-6 h-6 text-amber-400" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-8 right-8 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  >
                    <Award className="w-6 h-6 text-emerald-400" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What drives us forward
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              These core principles guide every decision we make and every feature we build.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((value, index) => (
              <ValueCard key={value.title} {...value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Story/Timeline Section */}
      <section id="story" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
                  <Rocket className="w-4 h-4" />
                  Our Journey
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  From vision to reality
                </h2>
                <p className="text-white/60 leading-relaxed mb-8">
                  Rendrix started with a simple observation: small businesses were being left behind
                  in the e-commerce revolution. We set out to change that by building a platform that
                  combines enterprise power with startup simplicity.
                </p>
              </motion.div>

              {/* Timeline */}
              <div className="space-y-0">
                {timeline.map((item, index) => (
                  <TimelineItem
                    key={item.year}
                    {...item}
                    index={index}
                    isLast={index === timeline.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Visual element */}
            <div className="lg:sticky lg:top-32">
              <BentoCard className="aspect-square p-8" glowColor="rgba(255, 145, 0, 0.1)">
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mb-8 shadow-2xl shadow-primary/40"
                  >
                    <span className="text-5xl font-bold text-black">R</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Built Different</h3>
                  <p className="text-white/60 text-sm max-w-xs">
                    Every line of code, every pixel, every feature is crafted with our merchants in mind.
                  </p>
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Floating particles background */}
        <FloatingParticles />

        {/* Ambient glows */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/10 border border-primary/30 mb-6"
            >
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary tracking-wide">Our Team</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Meet the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-300">Visionaries</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              A diverse team of engineers, designers, AI experts, and commerce specialists united by a mission to revolutionize e-commerce.
            </p>
          </motion.div>

          {/* CEO Showcase - Centered, Single Row */}
          <CEOShowcaseCard member={ceo} />

          {/* Leadership Team Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Leadership Team</h3>
            <p className="text-white/40">The brilliant minds driving innovation</p>
          </motion.div>

          {/* Bento Grid for Team Members */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* CTO - Large card */}
            <div className="col-span-1 row-span-2 hidden md:block">
              <TeamMemberBentoCard member={leadershipTeam[0]} index={0} size="large" />
            </div>
            {/* CTO - Normal card for mobile */}
            <div className="md:hidden">
              <TeamMemberBentoCard member={leadershipTeam[0]} index={0} size="normal" />
            </div>

            {/* Head of AI */}
            <TeamMemberBentoCard member={leadershipTeam[1]} index={1} />

            {/* Head of Product */}
            <TeamMemberBentoCard member={leadershipTeam[2]} index={2} />

            {/* DevOps Lead */}
            <TeamMemberBentoCard member={leadershipTeam[3]} index={3} />

            {/* Creative Director - Large card */}
            <div className="col-span-1 row-span-2 hidden md:block">
              <TeamMemberBentoCard member={leadershipTeam[4]} index={4} size="large" />
            </div>
            {/* Creative Director - Normal for mobile */}
            <div className="md:hidden">
              <TeamMemberBentoCard member={leadershipTeam[4]} index={4} size="normal" />
            </div>

            {/* Marketing Director */}
            <TeamMemberBentoCard member={leadershipTeam[5]} index={5} />

            {/* Frontend Engineer */}
            <TeamMemberBentoCard member={leadershipTeam[6]} index={6} />

            {/* Backend Engineer */}
            <TeamMemberBentoCard member={leadershipTeam[7]} index={7} />
          </div>

          {/* Join the Team CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-left">
                <h4 className="text-lg font-semibold text-white mb-1">Want to join our team?</h4>
                <p className="text-sm text-white/50">We&apos;re always looking for talented individuals.</p>
              </div>
              <Link
                href="#careers"
                className="px-6 py-3 text-sm font-medium text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 whitespace-nowrap"
              >
                View Open Positions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <BentoCard className="p-12 md:p-16 text-center" glowColor="rgba(255, 145, 0, 0.2)">
            <div className="relative z-10">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Ready to join the future of commerce?
                </h2>
                <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
                  Start building your online empire today with the platform trusted by thousands of merchants worldwide.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-gradient-to-r from-primary to-orange-500 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white border border-white/20 rounded-full hover:bg-white/5 transition-all duration-300"
                  >
                    Contact Sales
                  </Link>
                </div>
              </motion.div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/[0.06]">
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
            <Link href="/#contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

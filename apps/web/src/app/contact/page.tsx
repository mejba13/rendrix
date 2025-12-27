'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Loader2,
  Building2,
  Users,
  UserPlus,
  Newspaper,
  Globe,
  MessageSquare,
  Headphones,
  Sparkles,
  ExternalLink,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  ChevronDown,
  BookOpen,
  Activity,
  HelpCircle,
} from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Form field component
function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
}) {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-white/70">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <Component
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white/[0.03] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 ${isTextarea ? 'min-h-[140px] resize-none' : ''}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Select field component
function SelectField({
  label,
  name,
  options,
  required = false,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-white/70">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 appearance-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-black text-white">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
      </div>
    </div>
  );
}

// Department card component
function DepartmentCard({
  icon: Icon,
  title,
  description,
  email,
  phone,
  responseTime,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  email: string;
  phone?: string;
  responseTime: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hover gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.replace('/10', '/30').replace('/5', '/20')} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/50 mb-4">{description}</p>

        {/* Contact info */}
        <div className="space-y-2">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            {email}
          </a>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          )}
        </div>

        {/* Response time */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs text-white/50">{responseTime}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Office location card
function OfficeCard({
  city,
  country,
  address,
  timezone,
  phone,
  delay,
}: {
  city: string;
  country: string;
  address: string;
  timezone: string;
  phone: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-300"
    >
      {/* City header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-white">{city}</h4>
          <p className="text-sm text-white/50">{country}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Address */}
      <p className="text-sm text-white/60 mb-4 leading-relaxed">{address}</p>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-white/50">
          <Globe className="w-4 h-4" />
          <span>{timezone}</span>
        </div>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-2 text-white/50 hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>{phone}</span>
        </a>
      </div>
    </motion.div>
  );
}

// Social link component
function SocialLink({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 group"
    >
      <Icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
    </a>
  );
}

// Quick link component
function QuickLink({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors flex items-center gap-2">
          {title}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h4>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    department: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const departmentOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnerships', label: 'Partnerships' },
    { value: 'press', label: 'Press & Media' },
  ];

  const departments = [
    {
      icon: Building2,
      title: 'Talk to Sales',
      description: 'Get a demo, discuss pricing, or explore enterprise solutions.',
      email: 'sales@rendrix.com',
      phone: '+1 (800) 123-4567',
      responseTime: 'Response within 4 hours',
      color: 'from-blue-500/10 to-blue-600/5',
    },
    {
      icon: Headphones,
      title: 'Get Support',
      description: 'Technical assistance, troubleshooting, and platform guidance.',
      email: 'support@rendrix.com',
      phone: '+1 (800) 123-4568',
      responseTime: '24/7 • Average response 2 hours',
      color: 'from-emerald-500/10 to-emerald-600/5',
    },
    {
      icon: UserPlus,
      title: 'Partner with Us',
      description: 'Integration partners, agencies, affiliates, and resellers.',
      email: 'partners@rendrix.com',
      responseTime: 'Response within 1 business day',
      color: 'from-purple-500/10 to-purple-600/5',
    },
    {
      icon: Newspaper,
      title: 'Media Inquiries',
      description: 'Press kit, interviews, company news, and media coverage.',
      email: 'press@rendrix.com',
      responseTime: 'Response within 24 hours',
      color: 'from-primary/10 to-orange-600/5',
    },
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'United States • Global HQ',
      address: '100 Market Street, Suite 800\nSan Francisco, CA 94105',
      timezone: 'PST (UTC-8)',
      phone: '+1 (415) 555-0100',
    },
    {
      city: 'London',
      country: 'United Kingdom • Europe',
      address: '30 Finsbury Square\nLondon, EC2A 1AG',
      timezone: 'GMT (UTC+0)',
      phone: '+44 20 7946 0958',
    },
    {
      city: 'Singapore',
      country: 'Singapore • Asia Pacific',
      address: '1 Raffles Place, Tower 2\nSingapore 048616',
      timezone: 'SGT (UTC+8)',
      phone: '+65 6123 4567',
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/rendrix', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/rendrix', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/rendrix', label: 'GitHub' },
    { icon: Youtube, href: 'https://youtube.com/@rendrix', label: 'YouTube' },
  ];

  const quickLinks = [
    { icon: HelpCircle, title: 'Help Center', description: 'Browse help articles and guides', href: '/help' },
    { icon: BookOpen, title: 'Documentation', description: 'API docs and developer resources', href: '/docs' },
    { icon: Activity, title: 'System Status', description: 'Check platform availability', href: '/status' },
    { icon: Users, title: 'Community', description: 'Join discussions and forums', href: '/community' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-primary">Contact</Link>
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
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-8"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Get in Touch</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Let&apos;s Build Something</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              Great Together
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 mb-10 max-w-2xl mx-auto"
          >
            Whether you have questions, need support, or want to explore partnership opportunities, we&apos;re here to help you succeed.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { icon: Clock, label: 'Response Time', value: '< 2 hours' },
              { icon: Globe, label: 'Global Presence', value: '3 offices' },
              { icon: Sparkles, label: 'Satisfaction Rate', value: '98%' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/40">{stat.label}</p>
                  <p className="text-sm font-medium text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section - Bento Grid */}
      <section className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form - Takes 3 columns */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
                {/* Noise texture */}
                <div
                  className="absolute inset-0 opacity-[0.015] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-amber-500" />

                <div className="relative z-10 p-8 md:p-10">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                      <p className="text-white/60 mb-6 max-w-md mx-auto">
                        Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            company: '',
                            department: 'general',
                            subject: '',
                            message: '',
                          });
                        }}
                        className="text-primary hover:underline"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                        <p className="text-white/50">Fill out the form below and we&apos;ll get back to you shortly.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                          />
                          <FormField
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            label="Company"
                            name="company"
                            placeholder="Your company name"
                            value={formData.company}
                            onChange={handleChange}
                          />
                          <SelectField
                            label="Department"
                            name="department"
                            options={departmentOptions}
                            required
                            value={formData.department}
                            onChange={handleChange}
                          />
                        </div>

                        <FormField
                          label="Subject"
                          name="subject"
                          placeholder="How can we help?"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          error={errors.subject}
                        />

                        <FormField
                          label="Message"
                          name="message"
                          type="textarea"
                          placeholder="Tell us more about your inquiry..."
                          required
                          value={formData.message}
                          onChange={handleChange}
                          error={errors.message}
                        />

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Department Cards - Takes 2 columns */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {departments.map((dept, index) => (
                <DepartmentCard key={dept.title} {...dept} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Our Global Offices</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              With teams across three continents, we&apos;re positioned to support you wherever you are.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {offices.map((office, index) => (
              <OfficeCard key={office.city} {...office} delay={index * 0.1} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social & Quick Links Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Social Links */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Connect with Us</h3>
              <p className="text-white/50 text-sm mb-6">Follow us for updates, tips, and community highlights.</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <SocialLink key={social.label} {...social} />
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-2 px-4 pt-2">Quick Resources</h3>
              <p className="text-white/50 text-sm mb-4 px-4">Find answers and resources instantly.</p>
              <div className="space-y-1">
                {quickLinks.map((link) => (
                  <QuickLink key={link.title} {...link} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-12 text-center"
          >
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Join thousands of businesses already growing with Rendrix. Start your free trial today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-black font-semibold rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </motion.div>
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
            <Link href="/about" className="text-sm text-white/40 hover:text-white transition-colors">About</Link>
            <Link href="/help" className="text-sm text-white/40 hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

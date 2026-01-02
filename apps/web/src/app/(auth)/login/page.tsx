'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Store,
  Quote,
  Globe,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // YouTube video ready handler
  useEffect(() => {
    if (!mounted) return;
    const videoTimer = setTimeout(() => setVideoReady(true), 1500);
    return () => clearTimeout(videoTimer);
  }, [mounted]);

  const youtubeVideoId = 'oP9fPjf0_Wk';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error: unknown) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f8f8]">
      {/* ===== LEFT SIDE - Video Background Panel ===== */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        {/* ===== CINEMATIC VIDEO BACKGROUND ===== */}
        <div className="absolute inset-0">
          {/* Layer 1: Fallback gradient background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
            }}
          />

          {/* Layer 2: YouTube Video Background */}
          <div
            className={`absolute inset-0 z-[1] overflow-hidden transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="absolute w-full h-full"
              style={{
                transform: 'scale(1.2)',
                transformOrigin: 'center center',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                title="Background Video"
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-[177.77vh] min-h-[56.25vw] border-0"
                style={{
                  transform: 'translate(-50%, -50%)',
                  filter: 'brightness(0.5) saturate(1.3) contrast(1.1)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Layer 3: Cinematic overlay gradients */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* Layer 4: Side vignette */}
          <div
            className="absolute inset-0 z-[3]"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)',
            }}
          />

          {/* Layer 5: Orange ambient glow from bottom */}
          <div
            className="absolute inset-0 z-[4]"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,145,0,0.2) 0%, transparent 60%)',
            }}
          />

          {/* Layer 6: Top glow */}
          <div
            className="absolute inset-0 z-[5]"
            style={{
              background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,145,0,0.12) 0%, transparent 50%)',
            }}
          />

          {/* Layer 7: Noise texture */}
          <div
            className="absolute inset-0 z-[6] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Layer 8: Right edge fade for seamless transition */}
          <div
            className="absolute inset-0 z-[7]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, transparent 70%, rgba(248,248,248,0.1) 90%, rgba(248,248,248,0.3) 100%)',
            }}
          />
        </div>

        {/* ===== FLOATING PARTICLES ===== */}
        {mounted && (
          <div className="absolute inset-0 z-[8] overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  y: [0, -30, 0],
                  x: [0, Math.sin(i) * 10, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 2 + (i % 3),
                  height: 2 + (i % 3),
                  left: `${10 + i * 7}%`,
                  top: `${20 + (i * 5) % 60}%`,
                  background: i % 3 === 0 ? '#FF9100' : 'rgba(255,255,255,0.6)',
                  boxShadow: i % 3 === 0 ? '0 0 6px rgba(255,145,0,0.5)' : 'none',
                }}
              />
            ))}
          </div>
        )}

        {/* ===== CONTENT ===== */}
        <div className="relative z-10 flex flex-col w-full h-full p-10 xl:p-14">
          {/* Logo */}
          <motion.div
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={fadeInUp}
            custom={0}
          >
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 8px 32px rgba(255,145,0,0.4)',
                }}
              >
                <Store className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">Rendrix</span>
            </Link>
          </motion.div>

          {/* Stats Badges */}
          <div className="flex gap-3 mt-8">
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInScale}
              custom={0.2}
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-white font-medium">50K+ Active Stores</span>
            </motion.div>
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInScale}
              custom={0.3}
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-medium">$2B+ Processed</span>
            </motion.div>
          </div>

          {/* Main Testimonial */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            {/* Large Quote Mark */}
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInScale}
              custom={0.4}
              className="mb-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,145,0,0.25) 0%, rgba(255,145,0,0.1) 100%)',
                  border: '1px solid rgba(255,145,0,0.4)',
                  boxShadow: '0 8px 32px rgba(255,145,0,0.2)',
                }}
              >
                <Quote className="w-8 h-8 text-primary" />
              </div>
            </motion.div>

            {/* Testimonial Text */}
            <motion.blockquote
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={slideInLeft}
              custom={0.5}
              className="text-2xl xl:text-3xl text-white leading-relaxed font-light mb-8 drop-shadow-lg"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &ldquo;Simply all the tools that my team and I need to{' '}
              <span className="text-primary font-medium">scale our business</span>{' '}
              to new heights.&rdquo;
            </motion.blockquote>

            {/* Author Info */}
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInUp}
              custom={0.6}
              className="flex items-center gap-4"
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-black"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 8px 24px rgba(255,145,0,0.4)',
                }}
              >
                KY
              </div>
              <div>
                <p className="text-white font-semibold text-lg drop-shadow-md">Karen Yue</p>
                <p className="text-white/70 text-sm">Director of Digital Marketing Technology</p>
              </div>
            </motion.div>

            {/* Rating & Stats */}
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInUp}
              custom={0.7}
              className="flex items-center gap-6 mt-8 pt-8 border-t border-white/20"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary drop-shadow-md" />
                ))}
              </div>
              <div className="h-5 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/70">150+ countries</span>
              </div>
            </motion.div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute bottom-14 right-14">
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInScale}
              custom={0.8}
              className="relative"
            >
              {/* Mini Dashboard Card */}
              <div
                className="w-56 rounded-2xl overflow-hidden backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-xs text-white/80 font-medium">Today&apos;s Revenue</span>
                    </div>
                    <Sparkles className="w-4 h-4 text-primary/70" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-3">$24,847</div>
                  <div className="flex gap-1">
                    {[35, 55, 40, 70, 50, 85, 65, 90, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all duration-300"
                        style={{
                          height: `${h * 0.4}px`,
                          background: i >= 7 ? '#FF9100' : 'rgba(255,145,0,0.35)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Order Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-4 -left-6 px-3 py-2 rounded-xl backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.1) 100%)',
                  border: '1px solid rgba(34,197,94,0.4)',
                }}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">+127 orders today</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Login Form ===== */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col relative bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden p-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
              }}
            >
              <Store className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-gray-900">Rendrix</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInUp}
              custom={0.1}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Welcome back to{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  }}
                >
                  Rendrix
                </span>
              </h1>
              <p className="text-gray-500 text-lg">
                Build your e-commerce empire effortlessly with our powerful platform.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInUp}
              custom={0.2}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex.jordan@gmail.com"
                    className={`h-12 px-4 rounded-xl text-gray-900 placeholder:text-gray-400 border-2 transition-all duration-300 focus:ring-0 focus:ring-offset-0 ${
                      focusedField === 'email'
                        ? 'border-primary shadow-[0_0_0_3px_rgba(255,145,0,0.1)]'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${errors.email ? 'border-red-400' : ''}`}
                    {...register('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    className={`h-12 px-4 pr-12 rounded-xl text-gray-900 placeholder:text-gray-400 border-2 transition-all duration-300 focus:ring-0 focus:ring-offset-0 ${
                      focusedField === 'password'
                        ? 'border-primary shadow-[0_0_0_3px_rgba(255,145,0,0.1)]'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${errors.password ? 'border-red-400' : ''}`}
                    {...register('password')}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password & Remember Me */}
              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-gray-600">Remember sign in details</span>
                  <div
                    className={`w-10 h-6 rounded-full transition-all duration-300 flex items-center ${
                      rememberMe ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm mx-0.5 transition-all duration-300 ${
                        rememberMe ? 'shadow-primary/20' : ''
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold relative overflow-hidden group"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 4px 20px rgba(255,145,0,0.25)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-black" />
                ) : (
                  <span className="relative flex items-center justify-center gap-2 text-black">
                    Log in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-gray-400 bg-white">OR</span>
                </div>
              </div>

              {/* Social Login */}
              <button
                type="button"
                className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </motion.form>

            {/* Sign Up Link */}
            <motion.p
              initial="hidden"
              animate={mounted ? 'visible' : 'hidden'}
              variants={fadeInUp}
              custom={0.4}
              className="text-center text-gray-500 mt-8"
            >
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign up
              </Link>
            </motion.p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center lg:text-right lg:pr-16">
          <p className="text-xs text-gray-400">&copy; 2025 Rendrix. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

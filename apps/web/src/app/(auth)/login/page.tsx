'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Store,
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Zap,
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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 pattern-grid opacity-20" />

        {/* Gradient Orbs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.15) 0%, transparent 60%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 60%)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.1) 0%, transparent 60%)',
            animation: 'float 12s ease-in-out infinite',
          }}
        />

        {/* Floating particles */}
        {[
          { size: 3, left: 15, top: 20, delay: 0, duration: 8 },
          { size: 2, left: 80, top: 15, delay: 1, duration: 10 },
          { size: 4, left: 70, top: 70, delay: 0.5, duration: 9 },
          { size: 2, left: 20, top: 75, delay: 1.5, duration: 11 },
          { size: 3, left: 90, top: 40, delay: 2, duration: 7 },
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: 'rgba(255,145,0,0.5)',
              boxShadow: '0 0 10px rgba(255,145,0,0.3)',
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Floating geometric rings */}
        <div
          className="absolute top-[25%] left-[8%] w-20 h-20 rounded-full border border-primary/10"
          style={{ animation: 'float 15s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[30%] right-[12%] w-14 h-14 rounded-full border border-orange-500/10"
          style={{ animation: 'float 12s ease-in-out infinite reverse' }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* Logo */}
      <div
        className={`relative z-10 mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
              boxShadow: '0 0 40px rgba(255,145,0,0.3), 0 10px 30px rgba(255,145,0,0.2)',
            }}
          >
            <Store className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-semibold text-white">Rendrix</span>
        </Link>
      </div>

      {/* Login Card */}
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Card glow effect */}
        <div
          className="absolute -inset-[1px] rounded-3xl opacity-60 blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,145,0,0.3) 0%, rgba(255,107,0,0.1) 50%, rgba(255,145,0,0.2) 100%)',
          }}
        />
        <div
          className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,145,0,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Card */}
        <div
          className="relative rounded-3xl p-8 sm:p-10 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">Welcome back</h1>
            <p className="text-white/50">Sign in to continue to your dashboard</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="group relative flex items-center justify-center gap-2 h-12 rounded-xl transition-all duration-300 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium text-white/80">Google</span>
            </button>
            <button
              type="button"
              className="group relative flex items-center justify-center gap-2 h-12 rounded-xl transition-all duration-300 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-medium text-white/80">GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-white/40 bg-transparent">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-white/70">Email address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 transition-colors group-focus-within:text-primary/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-12 pl-12 rounded-xl text-white placeholder:text-white/30 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-white/70">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-white/40 hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 transition-colors group-focus-within:text-primary/70" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-12 pl-12 pr-12 rounded-xl text-white placeholder:text-white/30 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold relative overflow-hidden group"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                boxShadow: '0 0 30px rgba(255,145,0,0.2), 0 10px 20px rgba(255,145,0,0.15)',
              }}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-black" />
              ) : (
                <span className="relative flex items-center justify-center gap-2 text-black">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <Zap className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400/90 font-medium">256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <Shield className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs text-white/50 font-medium">SOC 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Link */}
      <p
        className={`relative z-10 text-center text-white/50 mt-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Create free account
        </Link>
      </p>

      {/* Footer */}
      <p
        className={`relative z-10 text-center text-xs text-white/30 mt-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        &copy; 2025 Rendrix. All rights reserved.
      </p>
    </div>
  );
}

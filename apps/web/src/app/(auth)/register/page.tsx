'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
  Store,
  Quote,
  Globe,
  Star,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: '12+ chars', met: password.length >= 12 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strengthScore = passwordRequirements.filter(r => r.met).length;
  const strengthColor = strengthScore <= 2 ? '#ef4444' : strengthScore <= 4 ? '#f59e0b' : '#22c55e';
  const strengthLabel = strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Good' : 'Strong';

  const onSubmit = async (data: RegisterForm) => {
    if (!agreedToTerms) {
      toast({
        title: 'Terms required',
        description: 'Please agree to the terms of service to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.firstName, data.lastName);
      toast({
        title: 'Account created',
        description: 'Welcome to Rendrix! Let\'s set up your first store.',
      });
      router.push('/onboarding');
    } catch (error: unknown) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== LEFT SIDE - Form Section ===== */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-black">
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 70% 50%, rgba(255,145,0,0.03) 0%, transparent 50%)',
          }}
        />

        {/* Logo Section */}
        <div
          className={`p-6 lg:p-10 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                boxShadow: '0 0 40px rgba(255,145,0,0.3)',
              }}
            >
              <Store className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">Rendrix</span>
          </Link>
        </div>

        {/* Form Container - Centered */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-6">
          <div className="w-full max-w-md">
            {/* Header */}
            <div
              className={`mb-6 transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="text-white">Start your </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  }}
                >
                  journey
                </span>
              </h1>
              <p className="text-white/50 text-sm">
                Create your account and launch your store today
              </p>
            </div>

            {/* Form Card */}
            <div
              className={`relative transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Card Glow */}
              <div
                className="absolute -inset-[1px] rounded-2xl opacity-40 blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, transparent 50%, rgba(255,145,0,0.1) 100%)',
                }}
              />

              <div
                className="relative rounded-2xl p-5 sm:p-6 backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 h-10 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-sm font-medium text-white/80">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 h-10 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-sm font-medium text-white/80">GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-xs text-white/30 bg-transparent">or continue with email</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-xs text-white/70">First name</Label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                            focusedField === 'firstName' ? 'text-primary' : 'text-white/30'
                          }`}
                        />
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="h-10 pl-9 rounded-xl text-white placeholder:text-white/30 text-sm transition-all duration-300 focus:ring-0 focus:ring-offset-0"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: focusedField === 'firstName' ? '1px solid rgba(255,145,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: focusedField === 'firstName' ? '0 0 15px rgba(255,145,0,0.1)' : 'none',
                          }}
                          {...register('firstName')}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-[10px] text-red-400">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-xs text-white/70">Last name</Label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                            focusedField === 'lastName' ? 'text-primary' : 'text-white/30'
                          }`}
                        />
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="h-10 pl-9 rounded-xl text-white placeholder:text-white/30 text-sm transition-all duration-300 focus:ring-0 focus:ring-offset-0"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: focusedField === 'lastName' ? '1px solid rgba(255,145,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: focusedField === 'lastName' ? '0 0 15px rgba(255,145,0,0.1)' : 'none',
                          }}
                          {...register('lastName')}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-[10px] text-red-400">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs text-white/70">Email address</Label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                          focusedField === 'email' ? 'text-primary' : 'text-white/30'
                        }`}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className="h-10 pl-9 rounded-xl text-white placeholder:text-white/30 text-sm transition-all duration-300 focus:ring-0 focus:ring-offset-0"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: focusedField === 'email' ? '1px solid rgba(255,145,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: focusedField === 'email' ? '0 0 15px rgba(255,145,0,0.1)' : 'none',
                        }}
                        {...register('email')}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs text-white/70">Password</Label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                          focusedField === 'password' ? 'text-primary' : 'text-white/30'
                        }`}
                      />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="h-10 pl-9 pr-9 rounded-xl text-white placeholder:text-white/30 text-sm transition-all duration-300 focus:ring-0 focus:ring-offset-0"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: focusedField === 'password' ? '1px solid rgba(255,145,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: focusedField === 'password' ? '0 0 15px rgba(255,145,0,0.1)' : 'none',
                        }}
                        {...register('password')}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5 flex-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className="h-1 flex-1 rounded-full transition-all duration-500"
                                style={{
                                  background: strengthScore >= level ? strengthColor : 'rgba(255,255,255,0.1)',
                                }}
                              />
                            ))}
                          </div>
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: strengthColor }}
                          >
                            {strengthLabel}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {passwordRequirements.map((req) => (
                            <div
                              key={req.label}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-all duration-300"
                              style={{
                                background: req.met ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)',
                                border: req.met ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              {req.met && <Check className="w-2.5 h-2.5 text-green-400" />}
                              <span className={`text-[9px] font-medium ${req.met ? 'text-green-400' : 'text-white/30'}`}>
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-xs text-white/70">Confirm password</Label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                          focusedField === 'confirmPassword' ? 'text-primary' : 'text-white/30'
                        }`}
                      />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="h-10 pl-9 pr-9 rounded-xl text-white placeholder:text-white/30 text-sm transition-all duration-300 focus:ring-0 focus:ring-offset-0"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: focusedField === 'confirmPassword' ? '1px solid rgba(255,145,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: focusedField === 'confirmPassword' ? '0 0 15px rgba(255,145,0,0.1)' : 'none',
                        }}
                        {...register('confirmPassword')}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-red-400">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className="relative flex-shrink-0 w-4 h-4 rounded transition-all duration-300 mt-0.5"
                      style={{
                        background: agreedToTerms ? 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)' : 'rgba(255,255,255,0.03)',
                        border: agreedToTerms ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {agreedToTerms && <Check className="w-3 h-3 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </button>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl text-sm font-semibold relative overflow-hidden group"
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                      boxShadow: '0 0 30px rgba(255,145,0,0.2), 0 8px 20px rgba(255,145,0,0.15)',
                    }}
                  >
                    {/* Shine Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-black" />
                    ) : (
                      <span className="relative flex items-center justify-center gap-2 text-black">
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sign In Link */}
            <p
              className={`text-center text-white/50 text-sm mt-5 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 text-center lg:text-left transition-all duration-700 delay-400 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-xs text-white/30">&copy; 2025 Rendrix. All rights reserved.</p>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Brand Theater ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Cinematic Background Layers */}
        <div className="absolute inset-0">
          {/* Layer 1: Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
            }}
          />

          {/* Layer 2: Orange ambient glow from bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,145,0,0.2) 0%, transparent 60%)',
            }}
          />

          {/* Layer 3: Top glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,145,0,0.1) 0%, transparent 50%)',
            }}
          />

          {/* Layer 4: Center glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,145,0,0.05) 0%, transparent 40%)',
            }}
          />

          {/* Layer 5: Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Layer 6: Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>

        {/* Floating Particles */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${10 + (i * 6)}%`,
                  top: `${15 + (i * 5) % 70}%`,
                  background: i % 3 === 0 ? 'rgba(255,145,0,0.6)' : 'rgba(255,255,255,0.4)',
                  animation: `floatParticle ${12 + (i * 2)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-10 xl:p-14">
          {/* Stats Badges - Top */}
          <div
            className={`absolute top-10 left-10 transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-white/80 font-medium">50K+ Active Stores</span>
            </div>
          </div>

          <div
            className={`absolute top-10 right-10 transition-all duration-1000 delay-600 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-white/80 font-medium">$2B+ Processed</span>
            </div>
          </div>

          {/* Feature Badge - Middle Left */}
          <div
            className={`absolute left-10 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-700 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,145,0,0.1)',
                border: '1px solid rgba(255,145,0,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">14-day free trial</span>
            </div>
          </div>

          {/* Main Testimonial Content */}
          <div className="max-w-md text-center">
            {/* Quote Icon */}
            <div
              className={`mb-6 transition-all duration-1000 delay-300 ${
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,145,0,0.05) 100%)',
                  border: '1px solid rgba(255,145,0,0.3)',
                }}
              >
                <Quote className="w-7 h-7 text-primary" />
              </div>
            </div>

            {/* Quote Text */}
            <blockquote
              className={`text-lg xl:text-xl text-white/90 leading-relaxed mb-6 font-light transition-all duration-1000 delay-400 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              &ldquo;Rendrix transformed our e-commerce operations. We scaled from{' '}
              <span className="text-primary font-medium">$10K to $2M</span> monthly revenue in just 8 months.
              The platform is incredibly intuitive and powerful.&rdquo;
            </blockquote>

            {/* Author */}
            <div
              className={`flex items-center justify-center gap-3 mb-6 transition-all duration-1000 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{
                  background: 'linear-gradient(135deg, #FF9100 0%, #FF6B00 100%)',
                  boxShadow: '0 0 20px rgba(255,145,0,0.3)',
                }}
              >
                SK
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Sarah Kim</p>
                <p className="text-white/50 text-xs">CEO, StyleVault</p>
              </div>
            </div>

            {/* Bottom Stats */}
            <div
              className={`flex items-center justify-center gap-5 transition-all duration-1000 delay-600 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-xs text-white/50">150+ countries</span>
              </div>
              <div className="w-px h-3 bg-white/20" />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>
            </div>
          </div>

          {/* Floating Dashboard Preview - Bottom Right */}
          <div
            className={`absolute bottom-10 right-10 transition-all duration-1000 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div
              className="w-44 h-28 rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Mini Dashboard Preview */}
              <div className="p-2.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[9px] text-white/60">Revenue Today</span>
                </div>
                <div className="text-base font-bold text-white mb-1.5">$12,847</div>
                <div className="flex gap-0.5">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h * 0.25}px`,
                        background: i === 5 ? '#FF9100' : 'rgba(255,145,0,0.3)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Orders Preview - Bottom Left */}
          <div
            className={`absolute bottom-10 left-10 transition-all duration-1000 delay-800 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div
              className="w-40 rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="p-2.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] text-white/60">New Orders</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Order #2847', amount: '$127.00' },
                    { name: 'Order #2846', amount: '$89.50' },
                  ].map((order, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <span className="text-[9px] text-white/70">{order.name}</span>
                      <span className="text-[9px] text-primary font-medium">{order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-30px) translateX(5px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}

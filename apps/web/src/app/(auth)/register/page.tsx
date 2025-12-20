'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
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

  const features = [
    'Create unlimited stores',
    'Multi-tenant architecture',
    'Real-time analytics',
    'Enterprise-grade security',
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black" />
        <div className="absolute inset-0 pattern-grid opacity-20" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-semibold text-white">Rendrix</span>
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-medium text-white leading-tight">
                Start your
                <br />
                <span className="gradient-text">commerce journey</span>
              </h1>
              <p className="text-lg text-white/50 max-w-md">
                Join thousands of businesses using Rendrix to scale their ecommerce operations.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/30">
            &copy; 2025 Rendrix. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                <Store className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-semibold text-white">Rendrix</span>
            </Link>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-white">Create your account</h2>
            <p className="text-white/50">Start your 14-day free trial</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/70">First name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/50"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-400">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/70">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/50"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-400">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/50"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/50"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/70">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/50"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 btn-primary text-black font-medium text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-center text-white/40">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
            </p>
          </form>

          <div className="mt-8 pt-8 border-t border-white/[0.08]">
            <p className="text-center text-white/50">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

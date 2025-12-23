'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Store,
  Sparkles,
  Rocket,
  Baby,
  UtensilsCrossed,
  Paintbrush,
  Home,
  Shirt,
  Sparkle,
  Dumbbell,
  Smartphone,
  Refrigerator,
  Package,
  Globe,
  Zap,
  Shield,
  BarChart3,
  CreditCard,
  Truck,
  Lock,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

// Schema
const storeSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(255),
  slug: z.string().max(100).optional().refine(
    (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
    'Slug must only contain lowercase letters, numbers, and hyphens'
  ),
  industry: z.enum([
    'toys', 'kitchen', 'nail_care', 'home_decor', 'garments',
    'beauty', 'sports', 'gadgets', 'home_appliances', 'general'
  ]),
  description: z.string().max(1000).optional(),
});

type StoreForm = z.infer<typeof storeSchema>;

// Industries with rich visual data
const industries = [
  {
    value: 'toys',
    label: 'Toys & Games',
    icon: Baby,
    description: 'Fun products for all ages',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    iconBg: 'bg-pink-500/20',
    accent: 'pink'
  },
  {
    value: 'kitchen',
    label: 'Kitchen & Dining',
    icon: UtensilsCrossed,
    description: 'Culinary essentials',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    iconBg: 'bg-amber-500/20',
    accent: 'amber'
  },
  {
    value: 'nail_care',
    label: 'Nail Care',
    icon: Paintbrush,
    description: 'Beauty & nail products',
    gradient: 'from-fuchsia-500 to-pink-600',
    bgGradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
    iconBg: 'bg-fuchsia-500/20',
    accent: 'fuchsia'
  },
  {
    value: 'home_decor',
    label: 'Home Decor',
    icon: Home,
    description: 'Interior design items',
    gradient: 'from-teal-500 to-emerald-600',
    bgGradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    iconBg: 'bg-teal-500/20',
    accent: 'teal'
  },
  {
    value: 'garments',
    label: 'Fashion & Apparel',
    icon: Shirt,
    description: 'Clothing & accessories',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    iconBg: 'bg-violet-500/20',
    accent: 'violet'
  },
  {
    value: 'beauty',
    label: 'Beauty & Cosmetics',
    icon: Sparkle,
    description: 'Skincare & makeup',
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    iconBg: 'bg-rose-500/20',
    accent: 'rose'
  },
  {
    value: 'sports',
    label: 'Sports & Fitness',
    icon: Dumbbell,
    description: 'Athletic equipment',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
    iconBg: 'bg-green-500/20',
    accent: 'green'
  },
  {
    value: 'gadgets',
    label: 'Electronics',
    icon: Smartphone,
    description: 'Tech & gadgets',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    iconBg: 'bg-blue-500/20',
    accent: 'blue'
  },
  {
    value: 'home_appliances',
    label: 'Appliances',
    icon: Refrigerator,
    description: 'Household essentials',
    gradient: 'from-slate-500 to-zinc-600',
    bgGradient: 'from-slate-500/20 via-zinc-500/10 to-transparent',
    iconBg: 'bg-slate-500/20',
    accent: 'slate'
  },
  {
    value: 'general',
    label: 'General Store',
    icon: Package,
    description: 'Multi-category',
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    iconBg: 'bg-orange-500/20',
    accent: 'orange'
  },
] as const;

// Steps
const steps = [
  { id: 1, name: 'Details', description: 'Name & brand', icon: Store },
  { id: 2, name: 'Industry', description: 'Your niche', icon: Sparkles },
  { id: 3, name: 'Launch', description: 'Go live', icon: Rocket },
];

// Features included
const features = [
  { icon: Shield, label: 'SSL Certificate', description: 'Secure checkout' },
  { icon: Zap, label: 'Fast Hosting', description: 'Global CDN' },
  { icon: BarChart3, label: 'Analytics', description: 'Real-time insights' },
  { icon: CreditCard, label: 'Payments', description: 'Multiple gateways' },
  { icon: Truck, label: 'Shipping', description: 'Auto-calculated' },
  { icon: Lock, label: 'Secure', description: 'PCI compliant' },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

// Animated background component
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Primary gradient orb */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255,145,0,0.15) 0%, rgba(255,107,0,0.05) 40%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      {/* Secondary orb */}
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(255,145,0,0.1) 0%, transparent 60%)',
          animation: 'float 15s ease-in-out infinite reverse',
        }}
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}

// Store Preview Component
function StorePreview({
  name,
  slug,
  industry,
  description
}: {
  name: string;
  slug: string;
  industry: typeof industries[number] | undefined;
  description: string;
}) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-orange-500/10 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Preview card */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-sm overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.05] text-xs text-white/40">
              <Lock className="w-3 h-3" />
              <span>{slug || 'your-store'}.rendrix.com</span>
            </div>
          </div>
        </div>

        {/* Store content preview */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              industry ? `bg-gradient-to-br ${industry.gradient}` : "bg-gradient-to-br from-primary to-orange-600"
            )}>
              {industry ? (
                <industry.icon className="w-6 h-6 text-white" />
              ) : (
                <Store className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {name || 'Your Store Name'}
              </h3>
              <p className="text-xs text-white/40">{industry?.label || 'General Store'}</p>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-white/50 line-clamp-2">{description}</p>
          )}

          {/* Mock products */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-white/[0.04] animate-pulse" />
            ))}
          </div>

          {/* Mock nav */}
          <div className="flex gap-4 pt-2 border-t border-white/[0.06]">
            {['Home', 'Products', 'About'].map((item) => (
              <span key={item} className="text-xs text-white/30">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -right-2 top-20 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-400 animate-in slide-in-from-right duration-500">
          <Shield className="w-3 h-3" />
          SSL Secured
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-400 animate-in slide-in-from-right duration-500 delay-100">
          <Zap className="w-3 h-3" />
          Fast CDN
        </div>
      </div>
    </div>
  );
}

// Progress stepper component
function ProgressStepper({
  currentStep,
  onStepClick
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative">
      {/* Progress bar background */}
      <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/[0.06] mx-20" />
      {/* Progress bar fill */}
      <div
        className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-primary to-orange-500 mx-20 transition-all duration-700 ease-out"
        style={{ width: `calc(${progress}% - 160px * ${progress / 100})` }}
      />

      <div className="relative flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => step.id <= currentStep && onStepClick(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                "flex flex-col items-center gap-3 transition-all duration-300 group",
                step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              {/* Step circle */}
              <div className="relative">
                {/* Animated ring for active */}
                {isActive && (
                  <>
                    <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                    <div className="absolute -inset-2 rounded-full border-2 border-primary/50" />
                  </>
                )}

                <div className={cn(
                  "relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isCompleted
                    ? "bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/25"
                    : isActive
                      ? "bg-gradient-to-br from-primary/20 to-orange-600/20 border-2 border-primary"
                      : "bg-white/[0.04] border border-white/[0.08]"
                )}>
                  {isCompleted ? (
                    <Check className="w-7 h-7 text-black" strokeWidth={2.5} />
                  ) : (
                    <Icon className={cn(
                      "w-7 h-7 transition-colors duration-300",
                      isActive ? "text-primary" : "text-white/40"
                    )} />
                  )}
                </div>
              </div>

              {/* Labels */}
              <div className="text-center">
                <p className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isActive || isCompleted ? "text-white" : "text-white/40"
                )}>
                  {step.name}
                </p>
                <p className={cn(
                  "text-xs transition-colors duration-300 mt-0.5",
                  isActive ? "text-primary/80" : "text-white/30"
                )}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function NewStorePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentOrganization } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      slug: '',
      industry: 'general',
      description: '',
    },
    mode: 'onChange',
  });

  const watchedName = watch('name');
  const watchedSlug = watch('slug');
  const watchedIndustry = watch('industry');
  const watchedDescription = watch('description');

  const selectedIndustry = useMemo(
    () => industries.find((i) => i.value === watchedIndustry),
    [watchedIndustry]
  );

  const displaySlug = watchedSlug || generateSlug(watchedName) || 'your-store';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (watchedName && !watchedSlug) {
      setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, watchedSlug, setValue]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(['name']);
      case 2:
        return await trigger(['industry']);
      default:
        return true;
    }
  };

  const goToStep = async (step: number) => {
    if (step > currentStep) {
      const isValid = await validateStep(currentStep);
      if (!isValid) return;
    }
    setCurrentStep(step);
  };

  const nextStep = async () => {
    if (currentStep < 3) {
      await goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: StoreForm) => {
    console.log('onSubmit called with data:', data);

    // Check if user has an organization
    if (!currentOrganization) {
      toast({
        title: 'Organization required',
        description: 'You need an organization to create a store. Please try logging out and logging back in.',
        variant: 'destructive',
      });
      return;
    }

    // Ensure API client has tokens loaded
    api.loadTokens();
    api.loadOrganizationId();

    setIsSubmitting(true);
    try {
      console.log('Sending store creation request...');
      await api.fetch('/api/v1/stores', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          slug: data.slug || undefined,
          industry: data.industry,
          description: data.description || undefined,
        }),
      });
      console.log('Store created successfully');

      setIsSuccess(true);
      await queryClient.invalidateQueries({ queryKey: ['stores'] });

      toast({
        title: 'Store created!',
        description: 'Your new store is ready to go.',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (error) {
      let errorMessage = 'Please try again';
      if (error instanceof ApiError) {
        errorMessage = error.message;
        // Log additional details for debugging
        console.error('Store creation error:', {
          code: error.code,
          status: error.status,
          details: error.details,
        });
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Failed to create store',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center relative">
        <AmbientBackground />
        <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          {/* Success animation */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-orange-600 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center animate-in zoom-in duration-500 delay-300">
                <Rocket className="w-10 h-10 text-black animate-bounce" />
              </div>
            </div>
            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 3 === 0 ? '#FF9100' : i % 3 === 1 ? '#FF6B00' : '#FFA940',
                  top: '50%',
                  left: '50%',
                  animation: `confetti-${i % 4} 1.5s ease-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">
              {watchedName} is Live!
            </h1>
            <p className="text-white/60 text-lg max-w-md mx-auto">
              Your store has been created successfully. Taking you to your dashboard...
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-white/40">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Setting up your store...</span>
          </div>
        </div>

        <style jsx>{`
          @keyframes confetti-0 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(80px, -100px) rotate(360deg); opacity: 0; }
          }
          @keyframes confetti-1 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(-80px, -80px) rotate(-360deg); opacity: 0; }
          }
          @keyframes confetti-2 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(60px, -120px) rotate(180deg); opacity: 0; }
          }
          @keyframes confetti-3 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(-60px, -90px) rotate(-180deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[85vh] flex flex-col transition-all duration-700",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <AmbientBackground />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild className="hover:bg-white/[0.08] rounded-xl">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Create your store</h1>
          <p className="text-white/50 text-sm mt-0.5">Launch your online business in minutes</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
          <Clock className="w-4 h-4" />
          <span>~2 min setup</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="relative z-10 mb-12 max-w-2xl mx-auto w-full">
        <ProgressStepper currentStep={currentStep} onStepClick={goToStep} />
      </div>

      {/* Form Content */}
      <div className="relative z-10 flex-1">
        <form onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.log('Form validation failed:', formErrors);
          const errorMessages = Object.entries(formErrors)
            .map(([field, error]) => `${field}: ${error?.message}`)
            .join(', ');
          toast({
            title: 'Please fix form errors',
            description: errorMessages || 'Please check all required fields',
            variant: 'destructive',
          });
        })}>
          {/* Step 1: Store Details */}
          <div className={cn(
            "transition-all duration-500",
            currentStep === 1
              ? "opacity-100 translate-x-0"
              : "opacity-0 absolute inset-0 pointer-events-none translate-x-[-100px]"
          )}>
            {currentStep === 1 && (
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Form Column */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Store className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Store Information</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Name your store</h2>
                    <p className="text-white/50">Choose a name that represents your brand identity</p>
                  </div>

                  <div className="space-y-6">
                    {/* Store Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/80 text-sm font-medium">
                        Store Name <span className="text-primary">*</span>
                      </Label>
                      <div className="relative group">
                        <Input
                          id="name"
                          placeholder="Enter your store name"
                          className="h-14 px-5 text-base bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 rounded-xl focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300"
                          {...register('name')}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-orange-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity duration-300" />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-400 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-red-400" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Store URL */}
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-white/80 text-sm font-medium">Store URL</Label>
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-white/40 pointer-events-none">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm font-mono">{displaySlug}.rendrix.com</span>
                        </div>
                        <Input
                          id="slug"
                          readOnly
                          tabIndex={-1}
                          className="h-14 px-5 text-base bg-white/[0.03] border-white/[0.08] text-transparent rounded-xl focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300 cursor-default"
                          {...register('slug')}
                        />
                      </div>
                      <p className="text-xs text-white/40 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        Auto-generated from your store name
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white/80 text-sm font-medium">
                        Description <span className="text-white/40">(optional)</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Tell customers what makes your store special..."
                        className="min-h-[120px] px-5 py-4 text-base bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 rounded-xl focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300 resize-none"
                        {...register('description')}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Column */}
                <div className="hidden lg:block">
                  <div className="sticky top-8">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Live Preview</span>
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Updating
                      </span>
                    </div>
                    <StorePreview
                      name={watchedName}
                      slug={displaySlug}
                      industry={selectedIndustry}
                      description={watchedDescription || ''}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Industry Selection */}
          <div className={cn(
            "transition-all duration-500",
            currentStep === 2
              ? "opacity-100 translate-x-0"
              : currentStep < 2
                ? "opacity-0 absolute inset-0 pointer-events-none translate-x-[100px]"
                : "opacity-0 absolute inset-0 pointer-events-none translate-x-[-100px]"
          )}>
            {currentStep === 2 && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Industry Selection</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">What will you sell?</h2>
                  <p className="text-white/50">Choose an industry to customize your store experience</p>
                </div>

                {/* Industry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {industries.map((industry, index) => {
                    const Icon = industry.icon;
                    const isSelected = watchedIndustry === industry.value;

                    return (
                      <button
                        key={industry.value}
                        type="button"
                        onClick={() => setValue('industry', industry.value)}
                        className={cn(
                          "group relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300",
                          "animate-in fade-in slide-in-from-bottom-4",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xl shadow-primary/20 scale-[1.02]"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04] hover:scale-[1.02]"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-200">
                            <Check className="w-4 h-4 text-black" strokeWidth={3} />
                          </div>
                        )}

                        {/* Glow effect */}
                        <div className={cn(
                          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                          `bg-gradient-to-br ${industry.bgGradient}`,
                          isSelected ? "opacity-100" : "group-hover:opacity-50"
                        )} />

                        {/* Icon */}
                        <div className={cn(
                          "relative w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
                          isSelected
                            ? `bg-gradient-to-br ${industry.gradient}`
                            : `${industry.iconBg} group-hover:scale-110`
                        )}>
                          <Icon className={cn(
                            "w-7 h-7 transition-colors duration-300",
                            isSelected ? "text-white" : "text-white/70"
                          )} />
                        </div>

                        {/* Label */}
                        <span className={cn(
                          "relative text-sm font-medium text-center transition-colors duration-300",
                          isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                        )}>
                          {industry.label}
                        </span>
                        <span className="relative text-xs text-white/40 mt-1">{industry.description}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected summary */}
                {selectedIndustry && (
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-in fade-in duration-300">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-gradient-to-br ${selectedIndustry.gradient}`)}>
                      <selectedIndustry.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{selectedIndustry.label}</p>
                      <p className="text-xs text-white/50">Perfect for {selectedIndustry.description.toLowerCase()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Review & Launch */}
          <div className={cn(
            "transition-all duration-500",
            currentStep === 3
              ? "opacity-100 translate-x-0"
              : "opacity-0 absolute inset-0 pointer-events-none translate-x-[100px]"
          )}>
            {currentStep === 3 && (
              <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Summary - 3 cols */}
                  <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <Rocket className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Ready to Launch</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">Review your store</h2>
                      <p className="text-white/50">Everything looks good? Let&apos;s make it live!</p>
                    </div>

                    {/* Store Summary Card */}
                    <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 space-y-6 overflow-hidden">
                      {/* Decorative gradient */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />

                      {/* Store header */}
                      <div className="relative flex items-start gap-4">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                          `bg-gradient-to-br ${selectedIndustry?.gradient || 'from-primary to-orange-600'}`
                        )}>
                          {selectedIndustry ? (
                            <selectedIndustry.icon className="w-8 h-8 text-white" />
                          ) : (
                            <Store className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white truncate">{watchedName || 'Your Store'}</h3>
                          <p className="text-sm text-white/50 flex items-center gap-2 mt-1">
                            <Globe className="w-4 h-4" />
                            {displaySlug}.rendrix.com
                            <ExternalLink className="w-3 h-3" />
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              `bg-gradient-to-r ${selectedIndustry?.gradient || 'from-primary to-orange-600'} text-white`
                            )}>
                              {selectedIndustry?.label || 'General Store'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {watchedDescription && (
                        <div className="relative">
                          <p className="text-sm text-white/60 leading-relaxed">{watchedDescription}</p>
                        </div>
                      )}

                      {/* Edit buttons */}
                      <div className="relative flex gap-3 pt-4 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => goToStep(1)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Store className="w-3.5 h-3.5" />
                          Edit details
                        </button>
                        <button
                          type="button"
                          onClick={() => goToStep(2)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Change industry
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Features - 2 cols */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">What&apos;s Included</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {features.map((feature, index) => (
                        <div
                          key={feature.label}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-in fade-in slide-in-from-right duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <feature.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{feature.label}</p>
                            <p className="text-[10px] text-white/40">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pro tip */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-orange-500/5 to-transparent border border-primary/20 mt-6">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-white">Pro Tip</p>
                          <p className="text-xs text-white/50 mt-1">
                            After launching, you can add products, customize your theme, and set up payments from your dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="relative z-10 flex items-center justify-between mt-12 pt-6 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(
                "gap-2 text-white/70 hover:text-white hover:bg-white/[0.08] rounded-xl h-12 px-6",
                currentStep === 1 && "opacity-0 pointer-events-none"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2 text-xs text-white/30">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="gap-2 bg-gradient-to-r from-primary to-orange-600 text-black font-semibold hover:opacity-90 rounded-xl h-12 px-8 shadow-lg shadow-primary/25"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  console.log('Launch button clicked, form errors:', errors);
                  if (Object.keys(errors).length > 0) {
                    toast({
                      title: 'Please fix form errors',
                      description: Object.values(errors).map(e => e?.message).filter(Boolean).join(', ') || 'Please check all fields',
                      variant: 'destructive',
                    });
                  }
                }}
                className="gap-2 bg-gradient-to-r from-primary to-orange-600 text-black font-semibold hover:opacity-90 rounded-xl h-12 px-8 shadow-lg shadow-primary/25 min-w-[160px] group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 group-hover:animate-bounce" />
                    Launch Store
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

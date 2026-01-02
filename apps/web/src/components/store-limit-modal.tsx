'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Crown,
  Sparkles,
  Store,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoreLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStores: number;
  maxStores: number;
  planName: string;
}

const upgradeBenefits = [
  { icon: Store, text: 'Up to 10 stores' },
  { icon: Zap, text: 'Priority support' },
  { icon: Shield, text: 'Advanced security' },
  { icon: TrendingUp, text: 'Advanced analytics' },
];

export function StoreLimitModal({
  isOpen,
  onClose,
  currentStores,
  maxStores,
  planName,
}: StoreLimitModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-primary/30 via-orange-500/20 to-transparent blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-tr from-amber-500/20 via-primary/10 to-transparent blur-3xl" />

              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-white/50 transition-all hover:bg-white/[0.1] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="relative p-8">
                {/* Icon Header */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="relative"
                  >
                    {/* Glow rings */}
                    <div className="absolute -inset-4 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 blur-xl" />
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/30 to-orange-500/30 blur-md" />

                    {/* Icon container */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 shadow-lg shadow-primary/30">
                      <Crown className="h-10 w-10 text-black" strokeWidth={2} />
                    </div>

                    {/* Floating sparkles */}
                    <motion.div
                      animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -right-2 -top-2"
                    >
                      <Sparkles className="h-5 w-5 text-primary" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Title & Message */}
                <div className="mb-8 text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-3 text-2xl font-bold text-white"
                  >
                    Store Limit Reached
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/60 leading-relaxed"
                  >
                    You've used all <span className="font-semibold text-primary">{maxStores} stores</span> available
                    on your <span className="font-semibold text-white">{planName}</span> plan.
                    Upgrade to unlock more stores and premium features.
                  </motion.p>
                </div>

                {/* Usage Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-white/60">Current Usage</span>
                    <span className="font-semibold text-white">
                      {currentStores} / {maxStores} stores
                    </span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                  <p className="mt-2 text-xs text-amber-400/80 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Limit reached
                  </p>
                </motion.div>

                {/* Upgrade Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 grid grid-cols-2 gap-3"
                >
                  {upgradeBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <benefit.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-white/80">{benefit.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col gap-3"
                >
                  <Button
                    asChild
                    className="group h-14 w-full rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-base font-semibold text-black shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                  >
                    <Link href="/settings/billing">
                      <Crown className="mr-2 h-5 w-5" />
                      Upgrade Plan
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="h-12 w-full rounded-xl text-white/60 hover:bg-white/[0.05] hover:text-white"
                  >
                    Maybe Later
                  </Button>
                </motion.div>
              </div>

              {/* Bottom Gradient Line */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

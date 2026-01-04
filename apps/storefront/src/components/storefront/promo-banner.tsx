'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  backgroundColor?: string;
  paymentLogos?: string[];
  className?: string;
}

// Default payment method icons (text-based)
const defaultPaymentMethods = ['VISA', 'MC', 'AMEX', 'PayPal'];

export function PromoBanner({
  title = 'Earn Cash Back For The Things You Buy Every Where',
  subtitle = 'Application via Merto Terms and Conditions',
  ctaText = 'View More',
  ctaUrl = '/products',
  imageUrl,
  backgroundColor = '#22c55e',
  paymentLogos,
  className,
}: PromoBannerProps) {
  return (
    <section className={cn('py-8 lg:py-12 bg-[var(--theme-background)] theme-transition', className)}>
      <div className="container-theme">
        <div
          className="relative overflow-hidden rounded-[var(--theme-radius-xl)] px-6 py-8 lg:px-12 lg:py-10"
          style={{ backgroundColor }}
        >
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-2 text-sm text-white/70">{subtitle}</p>
              )}
            </div>

            {/* CTA and Payment Logos */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
              <Button
                asChild
                className="h-11 rounded-[var(--theme-radius-sm)] bg-white px-6 font-semibold text-[var(--theme-foreground)] shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90"
              >
                <Link href={ctaUrl}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Payment Logos */}
              <div className="flex items-center gap-3">
                {paymentLogos
                  ? paymentLogos.map((logo, index) => (
                      <div
                        key={index}
                        className="flex h-8 items-center justify-center rounded bg-white px-3"
                      >
                        <Image
                          src={logo}
                          alt="Payment method"
                          width={40}
                          height={24}
                          className="h-5 w-auto object-contain"
                        />
                      </div>
                    ))
                  : defaultPaymentMethods.map((method) => (
                      <div
                        key={method}
                        className="flex h-8 items-center justify-center rounded bg-white px-3 text-xs font-bold text-[var(--theme-foreground)]"
                      >
                        {method}
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Background Image */}
          {imageUrl && (
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-50">
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-contain object-right"
              />
            </div>
          )}

          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>
      </div>
    </section>
  );
}

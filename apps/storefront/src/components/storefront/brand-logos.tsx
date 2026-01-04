'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Brand {
  name: string;
  logo?: string;
}

interface BrandLogosProps {
  brands?: Brand[];
  className?: string;
}

// Default placeholder brands with text-based logos
const defaultBrands: Brand[] = [
  { name: 'ZARA' },
  { name: 'Nike' },
  { name: 'DANNON' },
  { name: 'intel' },
  { name: 'logitech' },
  { name: 'GUESS' },
];

export function BrandLogos({ brands = defaultBrands, className }: BrandLogosProps) {
  return (
    <section
      className={cn(
        'border-y border-[var(--theme-border)] bg-[var(--theme-background)] py-8 theme-transition',
        className
      )}
    >
      <div className="container-theme">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="flex items-center justify-center opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain sm:h-10"
                />
              ) : (
                <span
                  className={cn(
                    'select-none text-xl font-bold tracking-tight text-[var(--theme-foreground)] sm:text-2xl',
                    index === 1 && 'font-black italic', // Nike style
                    index === 3 && 'font-normal lowercase tracking-wider', // intel style
                    index === 4 && 'font-medium lowercase', // logitech style
                    index === 5 && 'font-light tracking-[0.3em]' // GUESS style
                  )}
                >
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

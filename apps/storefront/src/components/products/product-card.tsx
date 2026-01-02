'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus, Eye, Heart, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { formatPrice, getDiscountPercentage, cn } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
  index?: number;
}

// Animation easing curve
const easeOut = [0.22, 1, 0.36, 1] as const;

// Premium animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: easeOut,
    },
  }),
};

const imageOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const buttonContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeOut,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
};

export function ProductCard({ product, priority = false, className, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? getDiscountPercentage(product.compareAtPrice!, product.price)
    : 0;
  const isOutOfStock = product.quantity <= 0;
  const mainImage = product.images?.[0];
  const secondImage = product.images?.[1];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      maxQuantity: product.quantity,
    });

    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.article
      className={cn('group relative theme-transition', className)}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <motion.div
          className="relative aspect-product overflow-hidden rounded-[var(--theme-card-radius)] bg-[var(--theme-muted)] theme-transition dark:bg-[var(--theme-surface)]"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: easeOut }}
          style={{
            boxShadow: isHovered
              ? 'var(--theme-card-shadow-hover)'
              : 'var(--theme-card-shadow)',
          }}
        >
          {/* Image Layer */}
          {mainImage ? (
            <div className="relative h-full w-full">
              {/* Main Image */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: secondImage && isHovered ? 1.08 : 1,
                  opacity: secondImage && isHovered ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: easeOut }}
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={priority}
                />
              </motion.div>

              {/* Second Image on Hover */}
              {secondImage && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.6, ease: easeOut }}
                >
                  <Image
                    src={secondImage}
                    alt={`${product.name} - alternate view`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="relative flex h-full items-center justify-center overflow-hidden">
              {/* Premium Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-muted)] via-[var(--theme-surface)] to-[var(--theme-muted)] dark:from-[var(--theme-surface)] dark:via-[var(--theme-muted)] dark:to-[var(--theme-surface)]" />

              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--theme-accent)]/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--theme-primary)]/10 blur-3xl" />
              </div>

              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(var(--theme-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--theme-foreground) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Product Initial */}
              <motion.div
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--theme-background)]/80 shadow-xl ring-1 ring-[var(--theme-foreground)]/5 backdrop-blur-sm"
                animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 3 : 0 }}
                transition={{ duration: 0.6, ease: easeOut }}
              >
                <span className="text-4xl font-bold text-[var(--theme-foreground)]/20">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </motion.div>

              {/* Floating Icons */}
              <motion.div
                className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--theme-accent)]/10"
                animate={{ y: isHovered ? -4 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ShoppingBag className="h-4 w-4 text-[var(--theme-accent)]" />
              </motion.div>
            </div>
          )}

          {/* Premium Gradient Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                variants={imageOverlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            )}
          </AnimatePresence>

          {/* Top Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <AnimatePresence>
              {hasDiscount && (
                <motion.span
                  initial={{ opacity: 0, x: -10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                >
                  <Sparkles className="h-3 w-3" />
                  -{discountPercent}%
                </motion.span>
              )}
              {isOutOfStock && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center rounded-full bg-[var(--theme-foreground)]/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  Sold Out
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist Button - Always visible on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute right-3 top-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-colors',
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-[var(--theme-foreground)] hover:bg-white hover:text-red-500'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                >
                  <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4"
                variants={buttonContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Quick Add Button */}
                {!isOutOfStock && product.variants.length === 0 && (
                  <motion.div variants={buttonVariants} className="flex-1">
                    <Button
                      size="default"
                      className={cn(
                        'w-full rounded-full font-semibold shadow-xl backdrop-blur-md transition-all duration-300',
                        isAdding
                          ? 'bg-emerald-500 text-white hover:bg-emerald-500'
                          : 'bg-white text-[var(--theme-foreground)] hover:bg-[var(--theme-primary)] hover:text-white'
                      )}
                      onClick={handleQuickAdd}
                    >
                      <AnimatePresence mode="wait">
                        {isAdding ? (
                          <motion.span
                            key="added"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Added!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="add"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Quick Add
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                )}

                {/* View Button (for products with variants or out of stock) */}
                {(isOutOfStock || product.variants.length > 0) && (
                  <motion.div variants={buttonVariants} className="flex-1">
                    <Button
                      size="default"
                      className="w-full rounded-full bg-white font-semibold text-[var(--theme-foreground)] shadow-xl backdrop-blur-md hover:bg-[var(--theme-primary)] hover:text-white"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Border Ring on Hover */}
          <motion.div
            className={cn(
              'pointer-events-none absolute inset-0 rounded-[var(--theme-card-radius)] ring-2 ring-inset transition-colors duration-300',
              isHovered ? 'ring-[rgb(var(--theme-accent-rgb)/0.3)]' : 'ring-transparent'
            )}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Product Details */}
        <motion.div
          className="mt-4 space-y-2"
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          {/* Category */}
          {product.categories?.[0] && (
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-secondary)]">
              {product.categories[0].name}
            </p>
          )}

          {/* Title */}
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-[var(--theme-foreground)] transition-colors duration-300 group-hover:text-[var(--theme-primary)]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'text-base font-bold',
                hasDiscount ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-foreground)]'
              )}
            >
              {formatPrice(product.price)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-[var(--theme-secondary)] line-through">
                {formatPrice(product.compareAtPrice!)}
              </p>
            )}
          </div>

          {/* Stock indicator */}
          {!isOutOfStock && product.quantity <= 5 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-xs font-medium text-[var(--theme-accent)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)] animate-pulse" />
              Only {product.quantity} left
            </motion.p>
          )}
        </motion.div>
      </Link>
    </motion.article>
  );
}

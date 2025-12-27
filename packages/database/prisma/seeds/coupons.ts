import { PrismaClient, Store } from '@prisma/client';

interface CouponData {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bogo';
  value: number | null;
  minimumOrder: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
  description: string;
}

// Get date helpers
const now = new Date();
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

// Store-specific coupons
const couponsByStore: Record<string, CouponData[]> = {
  ramlit: [
    // Active percentage coupons
    {
      code: 'TECH20',
      type: 'percentage',
      value: 20,
      minimumOrder: 1000,
      maximumDiscount: 500,
      usageLimit: 100,
      usageCount: 23,
      perCustomerLimit: 1,
      startsAt: daysAgo(30),
      expiresAt: daysFromNow(60),
      isActive: true,
      description: '20% off all services for tech companies',
    },
    {
      code: 'STARTUP15',
      type: 'percentage',
      value: 15,
      minimumOrder: 500,
      maximumDiscount: 300,
      usageLimit: 200,
      usageCount: 67,
      perCustomerLimit: 2,
      startsAt: daysAgo(60),
      expiresAt: daysFromNow(30),
      isActive: true,
      description: '15% startup discount on all services',
    },
    {
      code: 'DEVOPS25',
      type: 'percentage',
      value: 25,
      minimumOrder: 5000,
      maximumDiscount: 2000,
      usageLimit: 50,
      usageCount: 12,
      perCustomerLimit: 1,
      startsAt: daysAgo(15),
      expiresAt: daysFromNow(45),
      isActive: true,
      description: '25% off DevOps services bundle',
    },
    // Active fixed amount coupons
    {
      code: 'SAVE500',
      type: 'fixed',
      value: 500,
      minimumOrder: 3000,
      maximumDiscount: null,
      usageLimit: 75,
      usageCount: 34,
      perCustomerLimit: 1,
      startsAt: daysAgo(45),
      expiresAt: daysFromNow(15),
      isActive: true,
      description: '$500 off orders over $3000',
    },
    {
      code: 'CLOUD1000',
      type: 'fixed',
      value: 1000,
      minimumOrder: 10000,
      maximumDiscount: null,
      usageLimit: 25,
      usageCount: 8,
      perCustomerLimit: 1,
      startsAt: daysAgo(20),
      expiresAt: daysFromNow(40),
      isActive: true,
      description: '$1000 off cloud migration packages',
    },
    // Scheduled coupon (starts in future)
    {
      code: 'NEWYEAR2025',
      type: 'percentage',
      value: 30,
      minimumOrder: 2000,
      maximumDiscount: 1500,
      usageLimit: 100,
      usageCount: 0,
      perCustomerLimit: 1,
      startsAt: daysFromNow(5),
      expiresAt: daysFromNow(35),
      isActive: true,
      description: 'New Year special - 30% off',
    },
    // Expired coupon
    {
      code: 'BLACKFRIDAY',
      type: 'percentage',
      value: 40,
      minimumOrder: 1000,
      maximumDiscount: 2000,
      usageLimit: 150,
      usageCount: 142,
      perCustomerLimit: 1,
      startsAt: daysAgo(60),
      expiresAt: daysAgo(30),
      isActive: false,
      description: 'Black Friday 40% off - expired',
    },
    // Unlimited usage coupon
    {
      code: 'ENTERPRISE',
      type: 'percentage',
      value: 10,
      minimumOrder: 20000,
      maximumDiscount: null,
      usageLimit: null,
      usageCount: 89,
      perCustomerLimit: null,
      startsAt: null,
      expiresAt: null,
      isActive: true,
      description: '10% enterprise client discount',
    },
  ],
  colorpark: [
    // Active percentage coupons
    {
      code: 'DESIGN15',
      type: 'percentage',
      value: 15,
      minimumOrder: 300,
      maximumDiscount: 200,
      usageLimit: 150,
      usageCount: 45,
      perCustomerLimit: 2,
      startsAt: daysAgo(30),
      expiresAt: daysFromNow(60),
      isActive: true,
      description: '15% off all design services',
    },
    {
      code: 'BRAND25',
      type: 'percentage',
      value: 25,
      minimumOrder: 1500,
      maximumDiscount: 750,
      usageLimit: 50,
      usageCount: 18,
      perCustomerLimit: 1,
      startsAt: daysAgo(20),
      expiresAt: daysFromNow(40),
      isActive: true,
      description: '25% off complete branding packages',
    },
    {
      code: 'UIUX20',
      type: 'percentage',
      value: 20,
      minimumOrder: 2000,
      maximumDiscount: 1000,
      usageLimit: 40,
      usageCount: 11,
      perCustomerLimit: 1,
      startsAt: daysAgo(10),
      expiresAt: daysFromNow(50),
      isActive: true,
      description: '20% off UI/UX design projects',
    },
    // Fixed amount coupons
    {
      code: 'LOGO100',
      type: 'fixed',
      value: 100,
      minimumOrder: 500,
      maximumDiscount: null,
      usageLimit: 100,
      usageCount: 56,
      perCustomerLimit: 1,
      startsAt: daysAgo(45),
      expiresAt: daysFromNow(15),
      isActive: true,
      description: '$100 off logo design packages',
    },
    {
      code: 'WEB250',
      type: 'fixed',
      value: 250,
      minimumOrder: 2000,
      maximumDiscount: null,
      usageLimit: 60,
      usageCount: 22,
      perCustomerLimit: 1,
      startsAt: daysAgo(15),
      expiresAt: daysFromNow(45),
      isActive: true,
      description: '$250 off web design projects',
    },
    // First-time customer discount
    {
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      minimumOrder: 200,
      maximumDiscount: 200,
      usageLimit: null,
      usageCount: 234,
      perCustomerLimit: 1,
      startsAt: null,
      expiresAt: null,
      isActive: true,
      description: '20% off first order for new customers',
    },
    // Social media bundle
    {
      code: 'SOCIAL30',
      type: 'percentage',
      value: 30,
      minimumOrder: 1000,
      maximumDiscount: 500,
      usageLimit: 75,
      usageCount: 33,
      perCustomerLimit: 1,
      startsAt: daysAgo(25),
      expiresAt: daysFromNow(35),
      isActive: true,
      description: '30% off social media design packages',
    },
    // Expired coupon
    {
      code: 'SUMMER2024',
      type: 'percentage',
      value: 25,
      minimumOrder: 500,
      maximumDiscount: 300,
      usageLimit: 100,
      usageCount: 89,
      perCustomerLimit: 1,
      startsAt: daysAgo(180),
      expiresAt: daysAgo(90),
      isActive: false,
      description: 'Summer 2024 sale - expired',
    },
  ],
  xcybersecurity: [
    // Active percentage coupons
    {
      code: 'SECURE20',
      type: 'percentage',
      value: 20,
      minimumOrder: 2000,
      maximumDiscount: 1000,
      usageLimit: 80,
      usageCount: 29,
      perCustomerLimit: 1,
      startsAt: daysAgo(30),
      expiresAt: daysFromNow(60),
      isActive: true,
      description: '20% off all security services',
    },
    {
      code: 'PENTEST25',
      type: 'percentage',
      value: 25,
      minimumOrder: 3000,
      maximumDiscount: 2000,
      usageLimit: 50,
      usageCount: 15,
      perCustomerLimit: 1,
      startsAt: daysAgo(15),
      expiresAt: daysFromNow(45),
      isActive: true,
      description: '25% off penetration testing packages',
    },
    {
      code: 'COMPLIANCE15',
      type: 'percentage',
      value: 15,
      minimumOrder: 5000,
      maximumDiscount: 3000,
      usageLimit: 40,
      usageCount: 12,
      perCustomerLimit: 1,
      startsAt: daysAgo(20),
      expiresAt: daysFromNow(40),
      isActive: true,
      description: '15% off compliance packages',
    },
    // Fixed amount coupons
    {
      code: 'SOC1000',
      type: 'fixed',
      value: 1000,
      minimumOrder: 8000,
      maximumDiscount: null,
      usageLimit: 30,
      usageCount: 9,
      perCustomerLimit: 1,
      startsAt: daysAgo(25),
      expiresAt: daysFromNow(35),
      isActive: true,
      description: '$1000 off SOC monitoring services',
    },
    {
      code: 'ASSESS500',
      type: 'fixed',
      value: 500,
      minimumOrder: 2500,
      maximumDiscount: null,
      usageLimit: 60,
      usageCount: 28,
      perCustomerLimit: 1,
      startsAt: daysAgo(45),
      expiresAt: daysFromNow(15),
      isActive: true,
      description: '$500 off security assessments',
    },
    // Enterprise discount
    {
      code: 'ENTERPRISE30',
      type: 'percentage',
      value: 30,
      minimumOrder: 50000,
      maximumDiscount: null,
      usageLimit: 10,
      usageCount: 3,
      perCustomerLimit: 1,
      startsAt: null,
      expiresAt: null,
      isActive: true,
      description: '30% off enterprise security packages',
    },
    // Retainer discount
    {
      code: 'RETAINER20',
      type: 'percentage',
      value: 20,
      minimumOrder: 10000,
      maximumDiscount: 5000,
      usageLimit: 25,
      usageCount: 7,
      perCustomerLimit: 1,
      startsAt: daysAgo(10),
      expiresAt: daysFromNow(50),
      isActive: true,
      description: '20% off incident response retainers',
    },
    // Scheduled coupon
    {
      code: 'CYBERWEEK',
      type: 'percentage',
      value: 35,
      minimumOrder: 5000,
      maximumDiscount: 3500,
      usageLimit: 50,
      usageCount: 0,
      perCustomerLimit: 1,
      startsAt: daysFromNow(7),
      expiresAt: daysFromNow(14),
      isActive: true,
      description: 'Cybersecurity awareness week special',
    },
    // Expired coupon
    {
      code: 'LAUNCH2024',
      type: 'percentage',
      value: 50,
      minimumOrder: 1000,
      maximumDiscount: 1000,
      usageLimit: 100,
      usageCount: 78,
      perCustomerLimit: 1,
      startsAt: daysAgo(120),
      expiresAt: daysAgo(90),
      isActive: false,
      description: 'Launch special - expired',
    },
  ],
};

export async function seedCoupons(prisma: PrismaClient, stores: Record<string, Store>) {
  console.log('  Creating coupons for all stores...');

  let totalCoupons = 0;

  for (const [storeKey, store] of Object.entries(stores)) {
    const coupons = couponsByStore[storeKey] || [];

    for (const couponData of coupons) {
      await prisma.coupon.upsert({
        where: {
          storeId_code: {
            storeId: store.id,
            code: couponData.code,
          },
        },
        update: {
          type: couponData.type,
          value: couponData.value,
          minimumOrder: couponData.minimumOrder,
          maximumDiscount: couponData.maximumDiscount,
          usageLimit: couponData.usageLimit,
          usageCount: couponData.usageCount,
          perCustomerLimit: couponData.perCustomerLimit,
          startsAt: couponData.startsAt,
          expiresAt: couponData.expiresAt,
          isActive: couponData.isActive,
        },
        create: {
          storeId: store.id,
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          minimumOrder: couponData.minimumOrder,
          maximumDiscount: couponData.maximumDiscount,
          usageLimit: couponData.usageLimit,
          usageCount: couponData.usageCount,
          perCustomerLimit: couponData.perCustomerLimit,
          applicableProducts: [],
          applicableCategories: [],
          startsAt: couponData.startsAt,
          expiresAt: couponData.expiresAt,
          isActive: couponData.isActive,
        },
      });
      totalCoupons++;
    }
  }

  console.log(`  Created ${totalCoupons} coupons across all stores`);
}

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create subscription plans
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { slug: 'free' },
      update: {},
      create: {
        name: 'Free',
        slug: 'free',
        description: 'Perfect for getting started',
        priceMonthly: 0,
        priceYearly: 0,
        features: {
          basicThemes: true,
          premiumThemes: false,
          allThemes: false,
          seoTools: false,
          advancedSeo: false,
          marketingSuite: false,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: false,
          dedicatedSupport: false,
          customIntegrations: false,
          sla: false,
        },
        limits: {
          maxStores: 1,
          maxProducts: 50,
          maxBandwidthGb: 1,
          maxTeamMembers: 1,
          maxCustomDomains: 0,
        },
        sortOrder: 0,
      },
    }),
    prisma.plan.upsert({
      where: { slug: 'pro' },
      update: {},
      create: {
        name: 'Pro',
        slug: 'pro',
        description: 'For growing businesses',
        priceMonthly: 29,
        priceYearly: 290,
        features: {
          basicThemes: true,
          premiumThemes: true,
          allThemes: false,
          seoTools: true,
          advancedSeo: false,
          marketingSuite: false,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: true,
          dedicatedSupport: false,
          customIntegrations: false,
          sla: false,
        },
        limits: {
          maxStores: 3,
          maxProducts: 500,
          maxBandwidthGb: 10,
          maxTeamMembers: 5,
          maxCustomDomains: 3,
        },
        sortOrder: 1,
      },
    }),
    prisma.plan.upsert({
      where: { slug: 'premium' },
      update: {},
      create: {
        name: 'Premium',
        slug: 'premium',
        description: 'For scaling businesses',
        priceMonthly: 79,
        priceYearly: 790,
        features: {
          basicThemes: true,
          premiumThemes: true,
          allThemes: true,
          seoTools: true,
          advancedSeo: true,
          marketingSuite: true,
          apiAccess: true,
          whiteLabel: false,
          prioritySupport: true,
          dedicatedSupport: false,
          customIntegrations: false,
          sla: false,
        },
        limits: {
          maxStores: 10,
          maxProducts: 5000,
          maxBandwidthGb: 100,
          maxTeamMembers: 15,
          maxCustomDomains: 10,
        },
        sortOrder: 2,
      },
    }),
    prisma.plan.upsert({
      where: { slug: 'enterprise' },
      update: {},
      create: {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'For large organizations',
        priceMonthly: null,
        priceYearly: null,
        features: {
          basicThemes: true,
          premiumThemes: true,
          allThemes: true,
          seoTools: true,
          advancedSeo: true,
          marketingSuite: true,
          apiAccess: true,
          whiteLabel: true,
          prioritySupport: true,
          dedicatedSupport: true,
          customIntegrations: true,
          sla: true,
        },
        limits: {
          maxStores: null,
          maxProducts: null,
          maxBandwidthGb: null,
          maxTeamMembers: null,
          maxCustomDomains: null,
        },
        sortOrder: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${plans.length} subscription plans`);

  // Create default themes
  const themes = await Promise.all([
    prisma.theme.upsert({
      where: { slug: 'minimal-store' },
      update: {},
      create: {
        name: 'Minimal Store',
        slug: 'minimal-store',
        description: 'A clean, minimal design perfect for any store',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['general', 'garments', 'beauty'],
        features: ['responsive', 'dark-mode', 'quick-view'],
        isPremium: false,
        settingsSchema: {
          colors: {
            primary: '#000000',
            secondary: '#666666',
            accent: '#0066cc',
          },
          typography: {
            headingFont: 'Inter',
            bodyFont: 'Inter',
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'modern-boutique' },
      update: {},
      create: {
        name: 'Modern Boutique',
        slug: 'modern-boutique',
        description: 'Elegant and sophisticated design for boutique stores',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['beauty', 'garments', 'nail_care'],
        features: ['responsive', 'dark-mode', 'mega-menu', 'lookbook'],
        isPremium: true,
        price: 49,
        settingsSchema: {
          colors: {
            primary: '#1a1a1a',
            secondary: '#8b7355',
            accent: '#c9a87c',
          },
          typography: {
            headingFont: 'Playfair Display',
            bodyFont: 'Lato',
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'tech-hub' },
      update: {},
      create: {
        name: 'Tech Hub',
        slug: 'tech-hub',
        description: 'Modern tech-focused design for gadget and electronics stores',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['gadgets', 'home_appliances', 'sports'],
        features: ['responsive', 'dark-mode', 'compare-products', 'specs-table'],
        isPremium: true,
        price: 59,
        settingsSchema: {
          colors: {
            primary: '#0a0a0a',
            secondary: '#00d4ff',
            accent: '#7c3aed',
          },
          typography: {
            headingFont: 'Space Grotesk',
            bodyFont: 'Inter',
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'kids-world' },
      update: {},
      create: {
        name: 'Kids World',
        slug: 'kids-world',
        description: 'Playful and colorful design for toy and kids stores',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['toys'],
        features: ['responsive', 'animated', 'wishlist', 'age-filter'],
        isPremium: true,
        price: 49,
        settingsSchema: {
          colors: {
            primary: '#ff6b6b',
            secondary: '#4ecdc4',
            accent: '#ffe66d',
          },
          typography: {
            headingFont: 'Fredoka One',
            bodyFont: 'Nunito',
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'home-living' },
      update: {},
      create: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Warm and inviting design for home decor and kitchen stores',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['home_decor', 'kitchen', 'home_appliances'],
        features: ['responsive', 'room-visualizer', 'collections', 'lookbook'],
        isPremium: true,
        price: 59,
        settingsSchema: {
          colors: {
            primary: '#3d405b',
            secondary: '#81b29a',
            accent: '#f2cc8f',
          },
          typography: {
            headingFont: 'Cormorant Garamond',
            bodyFont: 'Raleway',
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${themes.length} themes`);

  // Create a demo user and organization (for development)
  if (process.env.NODE_ENV === 'development') {
    const passwordHash = await hash('demo123456', 12);

    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@rendrix.com' },
      update: {},
      create: {
        email: 'demo@rendrix.com',
        passwordHash,
        firstName: 'Demo',
        lastName: 'User',
        emailVerifiedAt: new Date(),
      },
    });

    const freePlan = plans.find((p) => p.slug === 'free')!;

    const subscription = await prisma.subscription.create({
      data: {
        planId: freePlan.id,
        organizationId: '', // Will be updated
        status: 'active',
        billingInterval: 'monthly',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const demoOrg = await prisma.organization.upsert({
      where: { slug: 'demo-org' },
      update: {},
      create: {
        name: 'Demo Organization',
        slug: 'demo-org',
        ownerId: demoUser.id,
        subscriptionId: subscription.id,
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
        },
      },
    });

    // Update subscription with organization ID
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { organizationId: demoOrg.id },
    });

    // Add user as owner member
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: demoOrg.id,
          userId: demoUser.id,
        },
      },
      update: {},
      create: {
        organizationId: demoOrg.id,
        userId: demoUser.id,
        role: 'owner',
        permissions: [],
      },
    });

    // Create a demo store
    const defaultTheme = themes.find((t) => t.slug === 'minimal-store')!;

    await prisma.store.upsert({
      where: { subdomain: 'demo-store' },
      update: {},
      create: {
        organizationId: demoOrg.id,
        name: 'Demo Store',
        slug: 'demo-store',
        subdomain: 'demo-store',
        industry: 'general',
        description: 'A demo store for testing',
        themeId: defaultTheme.id,
        settings: {
          currency: 'USD',
          timezone: 'America/New_York',
          weightUnit: 'lb',
          dimensionUnit: 'in',
          taxesIncluded: false,
          enableReviews: true,
          enableWishlist: true,
          maintenanceMode: false,
        },
        seoSettings: {
          metaTitle: 'Demo Store - Your One Stop Shop',
          metaDescription: 'Welcome to Demo Store. Find amazing products at great prices.',
        },
      },
    });

    console.log('✅ Created demo user, organization, and store');
    console.log('   Email: demo@rendrix.com');
    console.log('   Password: demo123456');
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import {
  seedStores,
  seedProducts,
  seedCustomers,
  seedOrders,
  seedCoupons,
  seedBlog,
  seedPages,
  seedMedia,
} from './seeds';

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
        name: 'Minimal',
        slug: 'minimal-store',
        description: 'Clean, white space focused design that lets your products shine. Perfect for brands that value simplicity and elegance.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['general', 'garments', 'beauty'],
        features: ['responsive', 'dark-mode', 'quick-view'],
        isPremium: false,
        thumbnailUrl: '/themes/minimal-preview.png',
        previewUrl: '/themes/minimal-preview.png',
        settingsSchema: {
          colors: {
            primary: '#000000',
            secondary: '#333333',
            accent: '#000000',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#6b7280',
          },
          typography: {
            headingFont: 'Inter',
            bodyFont: 'Inter',
            baseFontSize: 16,
            headingWeight: '600',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'minimal',
            footerStyle: 'minimal',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'rounded',
            cardStyle: 'flat',
            imageStyle: 'square',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: false,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'bold' },
      update: {},
      create: {
        name: 'Bold',
        slug: 'bold',
        description: 'Make a statement with bold colors and dynamic typography. Ideal for brands that want to stand out.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['sports', 'gadgets', 'general'],
        features: ['responsive', 'dark-mode', 'mega-menu', 'quick-view'],
        isPremium: true,
        price: 49,
        thumbnailUrl: '/themes/bold-preview.png',
        previewUrl: '/themes/bold-preview.png',
        settingsSchema: {
          colors: {
            primary: '#dc2626',
            secondary: '#f8fafc',
            accent: '#dc2626',
            background: '#1a1a1a',
            text: '#f8fafc',
            muted: '#9ca3af',
          },
          typography: {
            headingFont: 'Space Grotesk',
            bodyFont: 'Inter',
            baseFontSize: 16,
            headingWeight: '700',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'wide',
            headerStyle: 'expanded',
            footerStyle: 'expanded',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'sharp',
            cardStyle: 'bordered',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'luxe' },
      update: {},
      create: {
        name: 'Luxe',
        slug: 'luxe',
        description: 'Sophisticated serif typography paired with elegant gold accents. Perfect for luxury and premium brands.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['beauty', 'garments', 'nail_care'],
        features: ['responsive', 'dark-mode', 'lookbook', 'mega-menu'],
        isPremium: true,
        price: 79,
        thumbnailUrl: '/themes/luxe-preview.png',
        previewUrl: '/themes/luxe-preview.png',
        settingsSchema: {
          colors: {
            primary: '#d4af37',
            secondary: '#f5f5f0',
            accent: '#d4af37',
            background: '#1a1a1a',
            text: '#f5f5f0',
            muted: '#8a8a8a',
          },
          typography: {
            headingFont: 'Playfair Display',
            bodyFont: 'Lato',
            baseFontSize: 16,
            headingWeight: '500',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'centered',
            footerStyle: 'standard',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'pill',
            cardStyle: 'flat',
            imageStyle: 'square',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'fresh' },
      update: {},
      create: {
        name: 'Fresh',
        slug: 'fresh',
        description: 'Vibrant greens and natural tones for organic and eco-friendly brands. Clean and refreshing design.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['kitchen', 'home_decor', 'beauty'],
        features: ['responsive', 'dark-mode', 'quick-view', 'wishlist'],
        isPremium: false,
        thumbnailUrl: '/themes/fresh-preview.png',
        previewUrl: '/themes/fresh-preview.png',
        settingsSchema: {
          colors: {
            primary: '#22c55e',
            secondary: '#ecfdf5',
            accent: '#16a34a',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#6b7280',
          },
          typography: {
            headingFont: 'DM Sans',
            bodyFont: 'DM Sans',
            baseFontSize: 16,
            headingWeight: '600',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'minimal',
            footerStyle: 'standard',
            productGridColumns: 4,
          },
          components: {
            buttonStyle: 'rounded',
            cardStyle: 'raised',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: false,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'classic' },
      update: {},
      create: {
        name: 'Classic',
        slug: 'classic',
        description: 'Timeless design with traditional aesthetics. Perfect for established brands and heritage stores.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['general', 'garments', 'home_decor'],
        features: ['responsive', 'mega-menu', 'quick-view'],
        isPremium: true,
        price: 39,
        thumbnailUrl: '/themes/classic-preview.png',
        previewUrl: '/themes/classic-preview.png',
        settingsSchema: {
          colors: {
            primary: '#1e3a5f',
            secondary: '#f8f6f3',
            accent: '#8b4513',
            background: '#ffffff',
            text: '#2c2c2c',
            muted: '#6b6b6b',
          },
          typography: {
            headingFont: 'Georgia',
            bodyFont: 'Arial',
            baseFontSize: 16,
            headingWeight: '700',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'centered',
            footerStyle: 'expanded',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'rounded',
            cardStyle: 'bordered',
            imageStyle: 'square',
          },
          effects: {
            enableAnimations: false,
            enableHoverEffects: true,
            enableParallax: false,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'artisan' },
      update: {},
      create: {
        name: 'Artisan',
        slug: 'artisan',
        description: 'Handcrafted feel with warm earth tones. Ideal for handmade goods, crafts, and artisanal products.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['home_decor', 'kitchen', 'general'],
        features: ['responsive', 'lookbook', 'collections', 'quick-view'],
        isPremium: true,
        price: 59,
        thumbnailUrl: '/themes/artisan-preview.png',
        previewUrl: '/themes/artisan-preview.png',
        settingsSchema: {
          colors: {
            primary: '#a0522d',
            secondary: '#faf7f2',
            accent: '#8b4513',
            background: '#fefdfb',
            text: '#3d3d3d',
            muted: '#8a8a8a',
          },
          typography: {
            headingFont: 'Cormorant Garamond',
            bodyFont: 'Open Sans',
            baseFontSize: 16,
            headingWeight: '500',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'narrow',
            headerStyle: 'centered',
            footerStyle: 'minimal',
            productGridColumns: 2,
          },
          components: {
            buttonStyle: 'rounded',
            cardStyle: 'flat',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'tech-hub' },
      update: {},
      create: {
        name: 'Tech',
        slug: 'tech-hub',
        description: 'Modern tech-focused design with cyber aesthetics. Perfect for gadget and electronics stores.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['gadgets', 'home_appliances', 'sports'],
        features: ['responsive', 'dark-mode', 'compare-products', 'specs-table'],
        isPremium: true,
        price: 59,
        thumbnailUrl: '/themes/tech-preview.png',
        previewUrl: '/themes/tech-preview.png',
        settingsSchema: {
          colors: {
            primary: '#7c3aed',
            secondary: '#00d4ff',
            accent: '#7c3aed',
            background: '#0a0a0a',
            text: '#f8fafc',
            muted: '#64748b',
          },
          typography: {
            headingFont: 'Space Grotesk',
            bodyFont: 'Inter',
            baseFontSize: 15,
            headingWeight: '600',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'wide',
            headerStyle: 'expanded',
            footerStyle: 'expanded',
            productGridColumns: 4,
          },
          components: {
            buttonStyle: 'sharp',
            cardStyle: 'bordered',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'boutique' },
      update: {},
      create: {
        name: 'Boutique',
        slug: 'boutique',
        description: 'Elegant and feminine design with soft colors. Perfect for fashion boutiques and beauty stores.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['beauty', 'garments', 'nail_care'],
        features: ['responsive', 'dark-mode', 'lookbook', 'quick-view'],
        isPremium: true,
        price: 49,
        thumbnailUrl: '/themes/boutique-preview.png',
        previewUrl: '/themes/boutique-preview.png',
        settingsSchema: {
          colors: {
            primary: '#db2777',
            secondary: '#fdf2f8',
            accent: '#be185d',
            background: '#ffffff',
            text: '#1f2937',
            muted: '#9ca3af',
          },
          typography: {
            headingFont: 'Cormorant Garamond',
            bodyFont: 'Nunito',
            baseFontSize: 16,
            headingWeight: '500',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'centered',
            footerStyle: 'standard',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'pill',
            cardStyle: 'raised',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: false,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'nature' },
      update: {},
      create: {
        name: 'Nature',
        slug: 'nature',
        description: 'Earthy and organic feel with natural textures. Great for outdoor, wellness, and sustainable brands.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['home_decor', 'kitchen', 'sports'],
        features: ['responsive', 'collections', 'quick-view', 'wishlist'],
        isPremium: true,
        price: 49,
        thumbnailUrl: '/themes/nature-preview.png',
        previewUrl: '/themes/nature-preview.png',
        settingsSchema: {
          colors: {
            primary: '#365314',
            secondary: '#ecfccb',
            accent: '#4d7c0f',
            background: '#f7fee7',
            text: '#1a2e05',
            muted: '#6b7280',
          },
          typography: {
            headingFont: 'Libre Baskerville',
            bodyFont: 'Source Sans Pro',
            baseFontSize: 16,
            headingWeight: '700',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'minimal',
            footerStyle: 'standard',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'rounded',
            cardStyle: 'flat',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'urban' },
      update: {},
      create: {
        name: 'Urban',
        slug: 'urban',
        description: 'Street-style inspired design with edgy aesthetics. Perfect for streetwear and youth-focused brands.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['garments', 'sports', 'general'],
        features: ['responsive', 'dark-mode', 'lookbook', 'quick-view'],
        isPremium: true,
        price: 69,
        thumbnailUrl: '/themes/urban-preview.png',
        previewUrl: '/themes/urban-preview.png',
        settingsSchema: {
          colors: {
            primary: '#fbbf24',
            secondary: '#27272a',
            accent: '#f59e0b',
            background: '#18181b',
            text: '#fafafa',
            muted: '#a1a1aa',
          },
          typography: {
            headingFont: 'Bebas Neue',
            bodyFont: 'Roboto',
            baseFontSize: 16,
            headingWeight: '400',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'full',
            headerStyle: 'expanded',
            footerStyle: 'expanded',
            productGridColumns: 4,
          },
          components: {
            buttonStyle: 'sharp',
            cardStyle: 'bordered',
            imageStyle: 'square',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'kids-world' },
      update: {},
      create: {
        name: 'Playful',
        slug: 'kids-world',
        description: 'Fun and colorful design for toy and kids stores. Engaging animations and playful typography.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['toys'],
        features: ['responsive', 'animated', 'wishlist', 'age-filter'],
        isPremium: true,
        price: 49,
        thumbnailUrl: '/themes/playful-preview.png',
        previewUrl: '/themes/playful-preview.png',
        settingsSchema: {
          colors: {
            primary: '#f472b6',
            secondary: '#a78bfa',
            accent: '#22d3ee',
            background: '#fdf4ff',
            text: '#1e1b4b',
            muted: '#7c3aed',
          },
          typography: {
            headingFont: 'Fredoka One',
            bodyFont: 'Nunito',
            baseFontSize: 17,
            headingWeight: '400',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'wide',
            headerStyle: 'expanded',
            footerStyle: 'expanded',
            productGridColumns: 4,
          },
          components: {
            buttonStyle: 'pill',
            cardStyle: 'raised',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: false,
          },
        },
      },
    }),
    prisma.theme.upsert({
      where: { slug: 'home-living' },
      update: {},
      create: {
        name: 'Cozy',
        slug: 'home-living',
        description: 'Warm and inviting design for home decor and kitchen stores. Comfortable and welcoming atmosphere.',
        version: '1.0.0',
        author: 'Rendrix',
        industries: ['home_decor', 'kitchen', 'home_appliances'],
        features: ['responsive', 'room-visualizer', 'collections', 'lookbook'],
        isPremium: true,
        price: 59,
        thumbnailUrl: '/themes/cozy-preview.png',
        previewUrl: '/themes/cozy-preview.png',
        settingsSchema: {
          colors: {
            primary: '#92400e',
            secondary: '#fef3c7',
            accent: '#d97706',
            background: '#fffbeb',
            text: '#451a03',
            muted: '#78716c',
          },
          typography: {
            headingFont: 'Merriweather',
            bodyFont: 'Open Sans',
            baseFontSize: 16,
            headingWeight: '700',
            bodyWeight: '400',
          },
          layout: {
            containerWidth: 'medium',
            headerStyle: 'centered',
            footerStyle: 'standard',
            productGridColumns: 3,
          },
          components: {
            buttonStyle: 'rounded',
            cardStyle: 'raised',
            imageStyle: 'rounded',
          },
          effects: {
            enableAnimations: true,
            enableHoverEffects: true,
            enableParallax: true,
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${themes.length} themes`);

  // Create users and sample data (for development)
  if (process.env.NODE_ENV === 'development') {
    // ========================================
    // Admin User (for Web Dashboard)
    // ========================================
    const adminPasswordHash = await hash('Admin@123456', 12);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@rendrix.com' },
      update: {},
      create: {
        email: 'admin@rendrix.com',
        passwordHash: adminPasswordHash,
        firstName: 'Admin',
        lastName: 'User',
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Created admin user');

    // ========================================
    // Demo User (for Web Dashboard)
    // ========================================
    const demoPasswordHash = await hash('Demo@123456', 12);

    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@rendrix.com' },
      update: {},
      create: {
        email: 'demo@rendrix.com',
        passwordHash: demoPasswordHash,
        firstName: 'Demo',
        lastName: 'User',
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Created demo user');

    const freePlan = plans.find((p) => p.slug === 'free')!;
    const proPlan = plans.find((p) => p.slug === 'pro')!;

    // ========================================
    // Admin Organization and Store
    // ========================================
    const adminOrg = await prisma.organization.upsert({
      where: { slug: 'rendrix-admin' },
      update: {},
      create: {
        name: 'Rendrix Admin',
        slug: 'rendrix-admin',
        ownerId: adminUser.id,
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
        },
      },
    });

    let adminSubscription = await prisma.subscription.findFirst({
      where: { organizationId: adminOrg.id },
    });
    if (!adminSubscription) {
      adminSubscription = await prisma.subscription.create({
        data: {
          planId: proPlan.id,
          organizationId: adminOrg.id,
          status: 'active',
          billingInterval: 'monthly',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    await prisma.organization.update({
      where: { id: adminOrg.id },
      data: { subscriptionId: adminSubscription.id },
    });

    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: adminOrg.id,
          userId: adminUser.id,
        },
      },
      update: {},
      create: {
        organizationId: adminOrg.id,
        userId: adminUser.id,
        role: 'owner',
        permissions: [],
      },
    });

    // ========================================
    // Demo Organization and Store
    // ========================================
    const demoOrg = await prisma.organization.upsert({
      where: { slug: 'demo-org' },
      update: {},
      create: {
        name: 'Demo Organization',
        slug: 'demo-org',
        ownerId: demoUser.id,
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
        },
      },
    });

    let demoSubscription = await prisma.subscription.findFirst({
      where: { organizationId: demoOrg.id },
    });
    if (!demoSubscription) {
      demoSubscription = await prisma.subscription.create({
        data: {
          planId: freePlan.id,
          organizationId: demoOrg.id,
          status: 'active',
          billingInterval: 'monthly',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    await prisma.organization.update({
      where: { id: demoOrg.id },
      data: { subscriptionId: demoSubscription.id },
    });

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

    // Add demo user to Admin Organization so they can also see all stores
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: adminOrg.id,
          userId: demoUser.id,
        },
      },
      update: {},
      create: {
        organizationId: adminOrg.id,
        userId: demoUser.id,
        role: 'member',
        permissions: [],
      },
    });

    // ========================================
    // Create Three Store Contexts with Comprehensive Seed Data
    // ========================================
    console.log('\n📦 Seeding comprehensive store data...');

    const defaultTheme = themes.find((t) => t.slug === 'minimal-store')!;

    // Create the three stores under Admin Organization: Ramlit Limited, ColorPark, xCyberSecurity
    const stores = await seedStores(prisma, adminOrg.id, defaultTheme.id);
    console.log('✅ Created 3 stores: Ramlit Limited, ColorPark, xCyberSecurity');

    // Seed products with store-specific catalogs
    await seedProducts(prisma, stores);
    console.log('✅ Created products for all stores');

    // Seed customers with segments
    const customersByStore = await seedCustomers(prisma, stores);
    console.log('✅ Created customers with segments for all stores');

    // Seed orders with realistic histories
    await seedOrders(prisma, stores, customersByStore);
    console.log('✅ Created order histories for all stores');

    // Seed coupons with various types
    await seedCoupons(prisma, stores);
    console.log('✅ Created coupons for all stores');

    // Seed blog posts and categories
    await seedBlog(prisma, stores);
    console.log('✅ Created blog posts and categories for all stores');

    // Seed static pages
    await seedPages(prisma, stores);
    console.log('✅ Created static pages for all stores');

    // Seed media assets
    await seedMedia(prisma, stores);
    console.log('✅ Created media assets for all stores');

    // ========================================
    // Print Login Credentials & Summary
    // ========================================
    console.log('\n========================================');
    console.log('🔐 LOGIN CREDENTIALS');
    console.log('========================================');
    console.log('\n📊 Web Dashboard (Admin Panel):');
    console.log('   URL: http://localhost:3000');
    console.log('   --------------------------------');
    console.log('   Admin Account:');
    console.log('   Email: admin@rendrix.com');
    console.log('   Password: Admin@123456');
    console.log('   --------------------------------');
    console.log('   Demo Account:');
    console.log('   Email: demo@rendrix.com');
    console.log('   Password: Demo@123456');
    console.log('\n🏪 SEEDED STORES:');
    console.log('   --------------------------------');
    console.log('   1. Ramlit Limited (IT Services, AI, DevOps, Cloud)');
    console.log('   2. ColorPark (Design Agency: Logo, Branding, UI/UX)');
    console.log('   3. xCyberSecurity (Security: Pentesting, Compliance)');
    console.log('\n📦 SEEDED DATA SUMMARY:');
    console.log('   --------------------------------');
    console.log('   - Products: 15-16 per store (45+ total)');
    console.log('   - Customers: 15 per store with segments');
    console.log('   - Orders: 25+ per store with various statuses');
    console.log('   - Coupons: 8-9 per store (active, scheduled, expired)');
    console.log('   - Blog Posts: 6-7 per store (published, draft, scheduled)');
    console.log('   - Pages: 7 per store (About, Services, Contact, FAQ, etc.)');
    console.log('   - Media: 12-15 assets per store');
    console.log('\n🎁 SAMPLE COUPON CODES:');
    console.log('   --------------------------------');
    console.log('   Ramlit: TECH20, STARTUP15, DEVOPS25');
    console.log('   ColorPark: DESIGN15, BRAND25, WELCOME20');
    console.log('   xCyberSecurity: SECURE20, PENTEST25, COMPLIANCE15');
    console.log('========================================\n');
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

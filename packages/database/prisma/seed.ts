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

    // ========================================
    // Create Demo Store
    // ========================================
    const defaultTheme = themes.find((t) => t.slug === 'minimal-store')!;

    const demoStore = await prisma.store.upsert({
      where: { subdomain: 'demo' },
      update: {},
      create: {
        organizationId: demoOrg.id,
        name: 'Demo Store',
        slug: 'demo',
        subdomain: 'demo',
        industry: 'general',
        description: 'A demo store showcasing our platform',
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

    console.log('✅ Created demo store');

    // ========================================
    // Create Categories
    // ========================================
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'electronics' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Electronics',
          slug: 'electronics',
          description: 'Latest gadgets and electronic devices',
          sortOrder: 1,
        },
      }),
      prisma.category.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'clothing' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Clothing',
          slug: 'clothing',
          description: 'Fashionable apparel for everyone',
          sortOrder: 2,
        },
      }),
      prisma.category.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'accessories' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Accessories',
          slug: 'accessories',
          description: 'Complete your look with our accessories',
          sortOrder: 3,
        },
      }),
      prisma.category.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'home-decor' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Home & Decor',
          slug: 'home-decor',
          description: 'Beautiful items for your home',
          sortOrder: 4,
        },
      }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // ========================================
    // Create Sample Products
    // ========================================
    const products = await Promise.all([
      // Electronics
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'wireless-headphones' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Wireless Bluetooth Headphones',
          slug: 'wireless-headphones',
          description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
          shortDescription: 'Premium wireless headphones with ANC',
          sku: 'ELEC-WH-001',
          price: 199.99,
          compareAtPrice: 249.99,
          quantity: 50,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[0].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', position: 0 },
            ],
          },
        },
      }),
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'smart-watch' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Smart Watch Pro',
          slug: 'smart-watch',
          description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Water resistant up to 50 meters.',
          shortDescription: 'Advanced smartwatch with health features',
          sku: 'ELEC-SW-001',
          price: 299.99,
          compareAtPrice: 349.99,
          quantity: 35,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[0].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', position: 0 },
            ],
          },
        },
      }),
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'portable-speaker' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Portable Bluetooth Speaker',
          slug: 'portable-speaker',
          description: 'Compact yet powerful portable speaker with 360-degree sound, waterproof design, and 20-hour playtime.',
          shortDescription: 'Waterproof portable speaker',
          sku: 'ELEC-SP-001',
          price: 79.99,
          compareAtPrice: 99.99,
          quantity: 100,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[0].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', position: 0 },
            ],
          },
        },
      }),
      // Clothing
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'classic-cotton-tshirt' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Classic Cotton T-Shirt',
          slug: 'classic-cotton-tshirt',
          description: 'Premium 100% cotton t-shirt with a comfortable fit. Available in multiple colors and sizes.',
          shortDescription: 'Comfortable 100% cotton tee',
          sku: 'CLO-TS-001',
          price: 29.99,
          compareAtPrice: 39.99,
          quantity: 200,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[1].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', position: 0 },
            ],
          },
        },
      }),
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'denim-jacket' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Classic Denim Jacket',
          slug: 'denim-jacket',
          description: 'Timeless denim jacket with a modern fit. Perfect for layering in any season.',
          shortDescription: 'Timeless denim jacket',
          sku: 'CLO-DJ-001',
          price: 89.99,
          compareAtPrice: 119.99,
          quantity: 45,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[1].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800', position: 0 },
            ],
          },
        },
      }),
      // Accessories
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'leather-wallet' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Premium Leather Wallet',
          slug: 'leather-wallet',
          description: 'Handcrafted genuine leather wallet with RFID blocking technology. Multiple card slots and bill compartment.',
          shortDescription: 'Handcrafted leather wallet with RFID',
          sku: 'ACC-WL-001',
          price: 49.99,
          compareAtPrice: 69.99,
          quantity: 75,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[2].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', position: 0 },
            ],
          },
        },
      }),
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'sunglasses' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Designer Sunglasses',
          slug: 'sunglasses',
          description: 'Stylish polarized sunglasses with UV400 protection. Lightweight titanium frame.',
          shortDescription: 'Polarized designer sunglasses',
          sku: 'ACC-SG-001',
          price: 129.99,
          compareAtPrice: 159.99,
          quantity: 60,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[2].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', position: 0 },
            ],
          },
        },
      }),
      // Home & Decor
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'ceramic-vase' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Minimalist Ceramic Vase',
          slug: 'ceramic-vase',
          description: 'Elegant handcrafted ceramic vase perfect for fresh or dried flowers. Adds a touch of sophistication to any room.',
          shortDescription: 'Handcrafted minimalist vase',
          sku: 'HOME-VAS-001',
          price: 45.99,
          compareAtPrice: 59.99,
          quantity: 40,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[3].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800', position: 0 },
            ],
          },
        },
      }),
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'scented-candle' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Luxury Scented Candle',
          slug: 'scented-candle',
          description: 'Hand-poured soy wax candle with natural essential oils. Burns for up to 60 hours with a warm, inviting fragrance.',
          shortDescription: 'Hand-poured soy wax candle',
          sku: 'HOME-CAN-001',
          price: 34.99,
          compareAtPrice: 44.99,
          quantity: 80,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[3].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1602607507892-3e1c7b9c7e09?w=800', position: 0 },
            ],
          },
        },
      }),
      prisma.product.upsert({
        where: { storeId_slug: { storeId: demoStore.id, slug: 'throw-blanket' } },
        update: {},
        create: {
          storeId: demoStore.id,
          name: 'Cozy Throw Blanket',
          slug: 'throw-blanket',
          description: 'Ultra-soft microfiber throw blanket. Perfect for snuggling on the couch or adding texture to your bedroom.',
          shortDescription: 'Ultra-soft microfiber blanket',
          sku: 'HOME-BLK-001',
          price: 59.99,
          compareAtPrice: 79.99,
          quantity: 55,
          status: 'active',
          trackInventory: true,
          categories: {
            create: { categoryId: categories[3].id },
          },
          images: {
            create: [
              { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', position: 0 },
            ],
          },
        },
      }),
    ]);

    console.log(`✅ Created ${products.length} products`);

    // ========================================
    // Create Demo Customer (for Storefront)
    // ========================================
    const customerPasswordHash = await hash('Customer@123', 12);

    const demoCustomer = await prisma.customer.upsert({
      where: { storeId_email: { storeId: demoStore.id, email: 'customer@demo.com' } },
      update: {},
      create: {
        storeId: demoStore.id,
        email: 'customer@demo.com',
        passwordHash: customerPasswordHash,
        firstName: 'John',
        lastName: 'Customer',
        phone: '+1 555-123-4567',
        acceptsMarketing: true,
        addresses: {
          create: [
            {
              firstName: 'John',
              lastName: 'Customer',
              address1: '123 Main Street',
              city: 'New York',
              state: 'NY',
              postalCode: '10001',
              country: 'US',
              phone: '+1 555-123-4567',
              isDefault: true,
            },
          ],
        },
      },
    });

    console.log('✅ Created demo customer');

    // ========================================
    // Create a Coupon
    // ========================================
    await prisma.coupon.upsert({
      where: { storeId_code: { storeId: demoStore.id, code: 'WELCOME10' } },
      update: {},
      create: {
        storeId: demoStore.id,
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minimumOrder: 50,
        usageLimit: 100,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    console.log('✅ Created coupon: WELCOME10');

    // ========================================
    // Print Login Credentials
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
    console.log('\n🛒 Storefront (Customer):');
    console.log('   URL: http://localhost:3001');
    console.log('   --------------------------------');
    console.log('   Customer Account:');
    console.log('   Email: customer@demo.com');
    console.log('   Password: Customer@123');
    console.log('\n🎁 Coupon Code: WELCOME10 (10% off, min $50)');
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

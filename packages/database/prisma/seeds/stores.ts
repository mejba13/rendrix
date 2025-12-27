import { PrismaClient } from '@prisma/client';

// Store configurations for the three business contexts
export const storeConfigs = {
  ramlit: {
    name: 'Ramlit Limited',
    slug: 'ramlit-limited',
    subdomain: 'ramlit-limited',
    industry: 'technology',
    description: 'Global software and IT services brand focused on secure, scalable solutions, AI integration, DevOps, cloud, and cybersecurity.',
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
      metaTitle: 'Ramlit Limited - Enterprise Software & IT Solutions',
      metaDescription: 'Transform your business with Ramlit\'s secure, scalable software solutions. Expert AI integration, DevOps, cloud services, and cybersecurity.',
    },
  },
  colorpark: {
    name: 'ColorPark',
    slug: 'colorpark',
    subdomain: 'colorpark',
    industry: 'design',
    description: 'Creative design agency offering logo design, branding, UI/UX, web design, social media graphics, illustrations, and product packaging.',
    settings: {
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      weightUnit: 'lb',
      dimensionUnit: 'in',
      taxesIncluded: false,
      enableReviews: true,
      enableWishlist: true,
      maintenanceMode: false,
    },
    seoSettings: {
      metaTitle: 'ColorPark - Creative Design Agency',
      metaDescription: 'Elevate your brand with ColorPark\'s premium design services. Logo design, branding, UI/UX, web design, and creative graphics.',
    },
  },
  xcybersecurity: {
    name: 'xCyberSecurity',
    slug: 'xcybersecurity',
    subdomain: 'xcybersecurity',
    industry: 'security',
    description: 'Cybersecurity services brand offering penetration testing, vulnerability assessments, managed security, compliance, incident response, and cloud security.',
    settings: {
      currency: 'USD',
      timezone: 'UTC',
      weightUnit: 'lb',
      dimensionUnit: 'in',
      taxesIncluded: false,
      enableReviews: true,
      enableWishlist: false,
      maintenanceMode: false,
    },
    seoSettings: {
      metaTitle: 'xCyberSecurity - Advanced Cybersecurity Solutions',
      metaDescription: 'Protect your digital assets with xCyberSecurity. Expert penetration testing, vulnerability assessments, managed security, and compliance services.',
    },
  },
};

export async function seedStores(
  prisma: PrismaClient,
  organizationId: string,
  themeId: string | null
) {
  console.log('  Creating stores for organization...');

  const stores: Record<string, any> = {};

  for (const [key, config] of Object.entries(storeConfigs)) {
    const store = await prisma.store.upsert({
      where: { subdomain: config.subdomain },
      update: {
        name: config.name,
        description: config.description,
        settings: config.settings,
        seoSettings: config.seoSettings,
      },
      create: {
        organizationId,
        name: config.name,
        slug: config.slug,
        subdomain: config.subdomain,
        industry: config.industry,
        description: config.description,
        themeId,
        settings: config.settings,
        seoSettings: config.seoSettings,
        status: 'active',
      },
    });
    stores[key] = store;
  }

  console.log(`  Created ${Object.keys(stores).length} stores`);
  return stores;
}

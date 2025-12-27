import { PrismaClient, Store } from '@prisma/client';

interface MediaData {
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string;
  folder: string;
  metadata: Record<string, any>;
}

// Media assets for each store
const mediaByStore: Record<string, MediaData[]> = {
  ramlit: [
    // Logo and Brand Assets
    {
      filename: 'ramlit-logo-primary.svg',
      mimeType: 'image/svg+xml',
      size: 12480,
      url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400',
      altText: 'Ramlit Limited Logo',
      folder: 'brand',
      metadata: { type: 'logo', variant: 'primary' },
    },
    {
      filename: 'ramlit-logo-white.svg',
      mimeType: 'image/svg+xml',
      size: 11856,
      url: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400',
      altText: 'Ramlit Limited Logo White',
      folder: 'brand',
      metadata: { type: 'logo', variant: 'white' },
    },
    {
      filename: 'ramlit-favicon.png',
      mimeType: 'image/png',
      size: 4560,
      url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=64',
      altText: 'Ramlit Favicon',
      folder: 'brand',
      metadata: { type: 'favicon' },
    },
    // Hero Banners
    {
      filename: 'hero-banner-technology.jpg',
      mimeType: 'image/jpeg',
      size: 245760,
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920',
      altText: 'Technology innovation banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'home' },
    },
    {
      filename: 'hero-banner-cloud.jpg',
      mimeType: 'image/jpeg',
      size: 198540,
      url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1920',
      altText: 'Cloud computing banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'cloud-services' },
    },
    {
      filename: 'hero-banner-ai.jpg',
      mimeType: 'image/jpeg',
      size: 287360,
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920',
      altText: 'AI and Machine Learning banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'ai-services' },
    },
    // Product/Service Images
    {
      filename: 'service-devops.jpg',
      mimeType: 'image/jpeg',
      size: 156800,
      url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
      altText: 'DevOps services illustration',
      folder: 'services',
      metadata: { type: 'service', category: 'devops' },
    },
    {
      filename: 'service-security.jpg',
      mimeType: 'image/jpeg',
      size: 142560,
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      altText: 'Security services illustration',
      folder: 'services',
      metadata: { type: 'service', category: 'security' },
    },
    {
      filename: 'service-development.jpg',
      mimeType: 'image/jpeg',
      size: 168450,
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      altText: 'Software development illustration',
      folder: 'services',
      metadata: { type: 'service', category: 'development' },
    },
    // Team/About Images
    {
      filename: 'team-collaboration.jpg',
      mimeType: 'image/jpeg',
      size: 178960,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      altText: 'Team collaboration photo',
      folder: 'about',
      metadata: { type: 'team' },
    },
    {
      filename: 'office-workspace.jpg',
      mimeType: 'image/jpeg',
      size: 195840,
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      altText: 'Modern office workspace',
      folder: 'about',
      metadata: { type: 'office' },
    },
    // Blog Thumbnails
    {
      filename: 'blog-kubernetes.jpg',
      mimeType: 'image/jpeg',
      size: 124560,
      url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600',
      altText: 'Kubernetes blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
    {
      filename: 'blog-ai-future.jpg',
      mimeType: 'image/jpeg',
      size: 134280,
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600',
      altText: 'AI future blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
  ],

  colorpark: [
    // Logo and Brand Assets
    {
      filename: 'colorpark-logo-primary.svg',
      mimeType: 'image/svg+xml',
      size: 15680,
      url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      altText: 'ColorPark Logo',
      folder: 'brand',
      metadata: { type: 'logo', variant: 'primary' },
    },
    {
      filename: 'colorpark-logo-dark.svg',
      mimeType: 'image/svg+xml',
      size: 14920,
      url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      altText: 'ColorPark Logo Dark',
      folder: 'brand',
      metadata: { type: 'logo', variant: 'dark' },
    },
    {
      filename: 'colorpark-favicon.png',
      mimeType: 'image/png',
      size: 5120,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64',
      altText: 'ColorPark Favicon',
      folder: 'brand',
      metadata: { type: 'favicon' },
    },
    // Hero Banners
    {
      filename: 'hero-creative-design.jpg',
      mimeType: 'image/jpeg',
      size: 267840,
      url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920',
      altText: 'Creative design hero banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'home' },
    },
    {
      filename: 'hero-branding.jpg',
      mimeType: 'image/jpeg',
      size: 234560,
      url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1920',
      altText: 'Branding services banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'branding' },
    },
    {
      filename: 'hero-web-design.jpg',
      mimeType: 'image/jpeg',
      size: 256480,
      url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920',
      altText: 'Web design banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'web-design' },
    },
    // Portfolio/Service Images
    {
      filename: 'portfolio-logo-design.jpg',
      mimeType: 'image/jpeg',
      size: 145680,
      url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
      altText: 'Logo design portfolio',
      folder: 'portfolio',
      metadata: { type: 'portfolio', category: 'logo' },
    },
    {
      filename: 'portfolio-ui-ux.jpg',
      mimeType: 'image/jpeg',
      size: 167840,
      url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800',
      altText: 'UI/UX design portfolio',
      folder: 'portfolio',
      metadata: { type: 'portfolio', category: 'ui-ux' },
    },
    {
      filename: 'portfolio-packaging.jpg',
      mimeType: 'image/jpeg',
      size: 178560,
      url: 'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800',
      altText: 'Packaging design portfolio',
      folder: 'portfolio',
      metadata: { type: 'portfolio', category: 'packaging' },
    },
    {
      filename: 'service-illustration.jpg',
      mimeType: 'image/jpeg',
      size: 134560,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      altText: 'Illustration services',
      folder: 'services',
      metadata: { type: 'service', category: 'illustration' },
    },
    {
      filename: 'service-social-media.jpg',
      mimeType: 'image/jpeg',
      size: 156780,
      url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
      altText: 'Social media design services',
      folder: 'services',
      metadata: { type: 'service', category: 'social-media' },
    },
    // Creative/Team Images
    {
      filename: 'creative-process.jpg',
      mimeType: 'image/jpeg',
      size: 189450,
      url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800',
      altText: 'Creative design process',
      folder: 'about',
      metadata: { type: 'process' },
    },
    {
      filename: 'design-studio.jpg',
      mimeType: 'image/jpeg',
      size: 178960,
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      altText: 'Design studio workspace',
      folder: 'about',
      metadata: { type: 'studio' },
    },
    // Blog Thumbnails
    {
      filename: 'blog-design-trends.jpg',
      mimeType: 'image/jpeg',
      size: 112450,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      altText: 'Design trends blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
    {
      filename: 'blog-color-psychology.jpg',
      mimeType: 'image/jpeg',
      size: 125680,
      url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      altText: 'Color psychology blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
  ],

  xcybersecurity: [
    // Logo and Brand Assets
    {
      filename: 'xcybersecurity-logo.svg',
      mimeType: 'image/svg+xml',
      size: 13450,
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
      altText: 'xCyberSecurity Logo',
      folder: 'brand',
      metadata: { type: 'logo', variant: 'primary' },
    },
    {
      filename: 'xcybersecurity-logo-white.svg',
      mimeType: 'image/svg+xml',
      size: 12680,
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
      altText: 'xCyberSecurity Logo White',
      folder: 'brand',
      metadata: { type: 'logo', variant: 'white' },
    },
    {
      filename: 'xcybersecurity-favicon.png',
      mimeType: 'image/png',
      size: 4890,
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=64',
      altText: 'xCyberSecurity Favicon',
      folder: 'brand',
      metadata: { type: 'favicon' },
    },
    // Hero Banners
    {
      filename: 'hero-security.jpg',
      mimeType: 'image/jpeg',
      size: 278450,
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920',
      altText: 'Cybersecurity hero banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'home' },
    },
    {
      filename: 'hero-pentest.jpg',
      mimeType: 'image/jpeg',
      size: 245680,
      url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1920',
      altText: 'Penetration testing banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'pentest' },
    },
    {
      filename: 'hero-compliance.jpg',
      mimeType: 'image/jpeg',
      size: 234560,
      url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920',
      altText: 'Compliance services banner',
      folder: 'banners',
      metadata: { type: 'hero', page: 'compliance' },
    },
    // Service Images
    {
      filename: 'service-penetration-testing.jpg',
      mimeType: 'image/jpeg',
      size: 156890,
      url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
      altText: 'Penetration testing services',
      folder: 'services',
      metadata: { type: 'service', category: 'pentest' },
    },
    {
      filename: 'service-vulnerability.jpg',
      mimeType: 'image/jpeg',
      size: 148560,
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      altText: 'Vulnerability assessment',
      folder: 'services',
      metadata: { type: 'service', category: 'vulnerability' },
    },
    {
      filename: 'service-soc.jpg',
      mimeType: 'image/jpeg',
      size: 167890,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      altText: 'SOC monitoring services',
      folder: 'services',
      metadata: { type: 'service', category: 'soc' },
    },
    {
      filename: 'service-incident-response.jpg',
      mimeType: 'image/jpeg',
      size: 145680,
      url: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800',
      altText: 'Incident response services',
      folder: 'services',
      metadata: { type: 'service', category: 'incident-response' },
    },
    {
      filename: 'service-compliance.jpg',
      mimeType: 'image/jpeg',
      size: 134560,
      url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      altText: 'Compliance services',
      folder: 'services',
      metadata: { type: 'service', category: 'compliance' },
    },
    // Security Team/About Images
    {
      filename: 'security-operations-center.jpg',
      mimeType: 'image/jpeg',
      size: 198560,
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      altText: 'Security operations center',
      folder: 'about',
      metadata: { type: 'soc' },
    },
    {
      filename: 'security-team.jpg',
      mimeType: 'image/jpeg',
      size: 187450,
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      altText: 'Security team meeting',
      folder: 'about',
      metadata: { type: 'team' },
    },
    // Blog Thumbnails
    {
      filename: 'blog-threat-landscape.jpg',
      mimeType: 'image/jpeg',
      size: 125680,
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
      altText: 'Threat landscape blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
    {
      filename: 'blog-soc2.jpg',
      mimeType: 'image/jpeg',
      size: 118450,
      url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
      altText: 'SOC 2 compliance blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
    {
      filename: 'blog-zero-trust.jpg',
      mimeType: 'image/jpeg',
      size: 134560,
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
      altText: 'Zero trust blog thumbnail',
      folder: 'blog',
      metadata: { type: 'blog-thumbnail' },
    },
  ],
};

export async function seedMedia(prisma: PrismaClient, stores: Record<string, Store>) {
  console.log('  Creating media assets for all stores...');

  let totalMedia = 0;

  for (const [storeKey, store] of Object.entries(stores)) {
    const mediaAssets = mediaByStore[storeKey] || [];

    for (const media of mediaAssets) {
      // Check if media already exists by URL
      const existing = await prisma.media.findFirst({
        where: {
          storeId: store.id,
          filename: media.filename,
        },
      });

      if (!existing) {
        await prisma.media.create({
          data: {
            storeId: store.id,
            filename: media.filename,
            mimeType: media.mimeType,
            size: media.size,
            url: media.url,
            altText: media.altText,
            folder: media.folder,
            metadata: media.metadata,
          },
        });
        totalMedia++;
      }
    }
  }

  console.log(`  Created ${totalMedia} media assets across all stores`);
}

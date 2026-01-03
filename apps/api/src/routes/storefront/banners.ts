import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';

// Banner Placement Types
const bannerPlacements = ['homepage_hero', 'section_banner', 'collection_banner', 'announcement_bar'] as const;

const listBannersSchema = z.object({
  placement: z.enum(bannerPlacements).optional(),
});

export async function storefrontBannerRoutes(app: FastifyInstance) {
  // Get active banners for storefront (public)
  app.get('/:storeId/banners', async (request, reply) => {
    const { storeId } = request.params as { storeId: string };
    const query = listBannersSchema.parse(request.query);
    const now = new Date();

    // Verify store exists and is active
    const store = await prisma.store.findFirst({
      where: {
        OR: [
          { id: storeId },
          { subdomain: storeId },
          { customDomain: storeId },
        ],
        status: 'active',
      },
    });

    if (!store) {
      return reply.status(404).send({
        success: false,
        error: 'Store not found',
      });
    }

    // Get active banners within their schedule
    const banners = await prisma.banner.findMany({
      where: {
        storeId: store.id,
        status: 'active',
        ...(query.placement && { placement: query.placement }),
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: [{ sortOrder: 'asc' }, { priority: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        imageUrlTablet: true,
        imageUrlMobile: true,
        ctaText: true,
        ctaUrl: true,
        ctaTarget: true,
        placement: true,
        backgroundColor: true,
        textColor: true,
        overlayOpacity: true,
      },
    });

    return reply.send({
      success: true,
      data: banners,
    });
  });

  // Get banners by placement (shorthand)
  app.get('/:storeId/banners/placement/:placement', async (request, reply) => {
    const { storeId, placement } = request.params as { storeId: string; placement: string };
    const now = new Date();

    if (!bannerPlacements.includes(placement as any)) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid placement',
      });
    }

    // Verify store exists and is active
    const store = await prisma.store.findFirst({
      where: {
        OR: [
          { id: storeId },
          { subdomain: storeId },
          { customDomain: storeId },
        ],
        status: 'active',
      },
    });

    if (!store) {
      return reply.status(404).send({
        success: false,
        error: 'Store not found',
      });
    }

    const banners = await prisma.banner.findMany({
      where: {
        storeId: store.id,
        status: 'active',
        placement,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: [{ sortOrder: 'asc' }, { priority: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        imageUrlTablet: true,
        imageUrlMobile: true,
        ctaText: true,
        ctaUrl: true,
        ctaTarget: true,
        placement: true,
        backgroundColor: true,
        textColor: true,
        overlayOpacity: true,
      },
    });

    return reply.send({
      success: true,
      data: banners,
    });
  });
}

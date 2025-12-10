import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma, paginate, createPaginationMeta } from '@rendrix/database';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ConflictError, ValidationError } from '../lib/error-handler';

const couponTypeSchema = z.enum([
  'percentage',
  'fixed_amount',
  'free_shipping',
  'buy_x_get_y',
]);

const createCouponSchema = z.object({
  code: z.string().min(3).max(50).transform((s) => s.toUpperCase()),
  type: couponTypeSchema,
  value: z.number().nonnegative().optional(),
  minimumOrder: z.number().nonnegative().optional(),
  maximumDiscount: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().optional(),
  perCustomerLimit: z.number().int().positive().optional(),
  applicableProducts: z.array(z.string().uuid()).default([]),
  applicableCategories: z.array(z.string().uuid()).default([]),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

const updateCouponSchema = createCouponSchema.partial();

const listCouponsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  search: z.string().optional(),
  type: couponTypeSchema.optional(),
  status: z.enum(['active', 'inactive', 'expired', 'all']).default('all'),
  sortBy: z.enum(['code', 'type', 'usageCount', 'startsAt', 'expiresAt', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function couponRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List coupons
  app.get('/', async (request, reply) => {
    const query = listCouponsSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;
    const now = new Date();

    const where: Record<string, unknown> = { storeId };

    if (query.search) {
      where.code = { contains: query.search, mode: 'insensitive' };
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.status !== 'all') {
      switch (query.status) {
        case 'active':
          where.isActive = true;
          where.OR = [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ];
          where.AND = [
            {
              OR: [
                { startsAt: null },
                { startsAt: { lte: now } },
              ],
            },
          ];
          break;
        case 'inactive':
          where.isActive = false;
          break;
        case 'expired':
          where.expiresAt = { lte: now };
          break;
      }
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
      }),
      prisma.coupon.count({ where }),
    ]);

    // Add computed status
    const couponsWithStatus = coupons.map((coupon) => ({
      ...coupon,
      status: getCouponStatus(coupon),
    }));

    return reply.send({
      success: true,
      data: couponsWithStatus,
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Get coupon stats
  app.get('/stats', async (request, reply) => {
    const storeId = request.currentStore!.id;
    const now = new Date();

    const [total, active, totalUsage] = await Promise.all([
      prisma.coupon.count({ where: { storeId } }),
      prisma.coupon.count({
        where: {
          storeId,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
      }),
      prisma.coupon.aggregate({
        where: { storeId },
        _sum: { usageCount: true },
      }),
    ]);

    return reply.send({
      success: true,
      data: {
        total,
        active,
        totalUsage: totalUsage._sum.usageCount || 0,
      },
    });
  });

  // Create coupon
  app.post(
    '/',
    { preHandler: [requirePermission('coupons:create')] },
    async (request, reply) => {
      const body = createCouponSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Validate coupon type requirements
      if (body.type === 'percentage' || body.type === 'fixed_amount') {
        if (body.value === undefined || body.value <= 0) {
          throw new ValidationError({ value: ['Value is required for this coupon type'] });
        }
      }

      if (body.type === 'percentage' && body.value && body.value > 100) {
        throw new ValidationError({ value: ['Percentage cannot exceed 100'] });
      }

      // Check for duplicate code
      const existing = await prisma.coupon.findUnique({
        where: { storeId_code: { storeId, code: body.code } },
      });

      if (existing) {
        throw new ConflictError('Coupon with this code already exists');
      }

      // Validate date range
      if (body.startsAt && body.expiresAt && body.startsAt >= body.expiresAt) {
        throw new ValidationError({
          expiresAt: ['Expiration date must be after start date'],
        });
      }

      const coupon = await prisma.coupon.create({
        data: {
          storeId,
          ...body,
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          ...coupon,
          status: getCouponStatus(coupon),
        },
      });
    }
  );

  // Get coupon by ID
  app.get('/:couponId', async (request, reply) => {
    const { couponId } = request.params as { couponId: string };

    const coupon = await prisma.coupon.findFirst({
      where: {
        id: couponId,
        storeId: request.currentStore!.id,
      },
    });

    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    return reply.send({
      success: true,
      data: {
        ...coupon,
        status: getCouponStatus(coupon),
      },
    });
  });

  // Update coupon
  app.patch(
    '/:couponId',
    { preHandler: [requirePermission('coupons:update')] },
    async (request, reply) => {
      const { couponId } = request.params as { couponId: string };
      const body = updateCouponSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const existing = await prisma.coupon.findFirst({
        where: { id: couponId, storeId },
      });

      if (!existing) {
        throw new NotFoundError('Coupon');
      }

      // Check code uniqueness if changing
      if (body.code && body.code !== existing.code) {
        const codeExists = await prisma.coupon.findFirst({
          where: { storeId, code: body.code, id: { not: couponId } },
        });
        if (codeExists) {
          throw new ConflictError('Coupon with this code already exists');
        }
      }

      // Validate date range
      const startsAt = body.startsAt ?? existing.startsAt;
      const expiresAt = body.expiresAt ?? existing.expiresAt;
      if (startsAt && expiresAt && startsAt >= expiresAt) {
        throw new ValidationError({
          expiresAt: ['Expiration date must be after start date'],
        });
      }

      const coupon = await prisma.coupon.update({
        where: { id: couponId },
        data: body,
      });

      return reply.send({
        success: true,
        data: {
          ...coupon,
          status: getCouponStatus(coupon),
        },
      });
    }
  );

  // Toggle coupon status
  app.post(
    '/:couponId/toggle',
    { preHandler: [requirePermission('coupons:update')] },
    async (request, reply) => {
      const { couponId } = request.params as { couponId: string };

      const existing = await prisma.coupon.findFirst({
        where: {
          id: couponId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Coupon');
      }

      const coupon = await prisma.coupon.update({
        where: { id: couponId },
        data: { isActive: !existing.isActive },
      });

      return reply.send({
        success: true,
        data: {
          ...coupon,
          status: getCouponStatus(coupon),
        },
      });
    }
  );

  // Delete coupon
  app.delete(
    '/:couponId',
    { preHandler: [requirePermission('coupons:delete')] },
    async (request, reply) => {
      const { couponId } = request.params as { couponId: string };

      const coupon = await prisma.coupon.findFirst({
        where: {
          id: couponId,
          storeId: request.currentStore!.id,
        },
      });

      if (!coupon) {
        throw new NotFoundError('Coupon');
      }

      await prisma.coupon.delete({ where: { id: couponId } });

      return reply.send({
        success: true,
        data: { message: 'Coupon deleted successfully' },
      });
    }
  );

  // Validate coupon (for checkout)
  app.post('/validate', async (request, reply) => {
    const validateSchema = z.object({
      code: z.string().transform((s) => s.toUpperCase()),
      subtotal: z.number().nonnegative(),
      productIds: z.array(z.string().uuid()).optional(),
      categoryIds: z.array(z.string().uuid()).optional(),
      customerId: z.string().uuid().optional(),
    });

    const body = validateSchema.parse(request.body);
    const storeId = request.currentStore!.id;
    const now = new Date();

    const coupon = await prisma.coupon.findUnique({
      where: { storeId_code: { storeId, code: body.code } },
    });

    if (!coupon) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_COUPON',
          message: 'Coupon not found',
        },
      });
    }

    // Check if active
    if (!coupon.isActive) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'COUPON_INACTIVE',
          message: 'This coupon is no longer active',
        },
      });
    }

    // Check start date
    if (coupon.startsAt && coupon.startsAt > now) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'COUPON_NOT_STARTED',
          message: 'This coupon is not yet valid',
        },
      });
    }

    // Check expiration
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'COUPON_EXPIRED',
          message: 'This coupon has expired',
        },
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'COUPON_LIMIT_REACHED',
          message: 'This coupon has reached its usage limit',
        },
      });
    }

    // Check minimum order
    if (coupon.minimumOrder && body.subtotal < Number(coupon.minimumOrder)) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'MINIMUM_ORDER_NOT_MET',
          message: `Minimum order of $${coupon.minimumOrder} required`,
        },
      });
    }

    // Check per-customer limit
    if (body.customerId && coupon.perCustomerLimit) {
      // This would require tracking coupon usage per customer
      // For now, skip this validation
    }

    // Check applicable products/categories
    const applicableProducts = coupon.applicableProducts as string[];
    const applicableCategories = coupon.applicableCategories as string[];

    if (applicableProducts.length > 0 && body.productIds) {
      const hasApplicable = body.productIds.some((id) =>
        applicableProducts.includes(id)
      );
      if (!hasApplicable) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'PRODUCTS_NOT_APPLICABLE',
            message: 'This coupon does not apply to the products in your cart',
          },
        });
      }
    }

    if (applicableCategories.length > 0 && body.categoryIds) {
      const hasApplicable = body.categoryIds.some((id) =>
        applicableCategories.includes(id)
      );
      if (!hasApplicable) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'CATEGORIES_NOT_APPLICABLE',
            message: 'This coupon does not apply to the categories in your cart',
          },
        });
      }
    }

    // Calculate discount
    let discount = 0;
    switch (coupon.type) {
      case 'percentage':
        discount = body.subtotal * (Number(coupon.value) / 100);
        break;
      case 'fixed_amount':
        discount = Number(coupon.value) || 0;
        break;
      case 'free_shipping':
        discount = 0; // Shipping discount handled separately
        break;
    }

    // Apply maximum discount cap
    if (coupon.maximumDiscount && discount > Number(coupon.maximumDiscount)) {
      discount = Number(coupon.maximumDiscount);
    }

    // Don't exceed subtotal
    if (discount > body.subtotal) {
      discount = body.subtotal;
    }

    return reply.send({
      success: true,
      data: {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
        },
        discount: Math.round(discount * 100) / 100,
        freeShipping: coupon.type === 'free_shipping',
      },
    });
  });
}

// Helper to determine coupon status
function getCouponStatus(coupon: {
  isActive: boolean;
  startsAt: Date | null;
  expiresAt: Date | null;
  usageLimit: number | null;
  usageCount: number;
}): 'active' | 'inactive' | 'expired' | 'scheduled' | 'exhausted' {
  const now = new Date();

  if (!coupon.isActive) {
    return 'inactive';
  }

  if (coupon.expiresAt && coupon.expiresAt < now) {
    return 'expired';
  }

  if (coupon.startsAt && coupon.startsAt > now) {
    return 'scheduled';
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return 'exhausted';
  }

  return 'active';
}

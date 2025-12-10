import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma, paginate, createPaginationMeta } from '@rendrix/database';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ConflictError } from '../lib/error-handler';
import { addressSchema } from '@rendrix/utils';

const createCustomerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  acceptsMarketing: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

const updateCustomerSchema = createCustomerSchema.partial();

const listCustomersSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  search: z.string().optional(),
  acceptsMarketing: z.coerce.boolean().optional(),
  tag: z.string().optional(),
  minOrders: z.coerce.number().int().nonnegative().optional(),
  maxOrders: z.coerce.number().int().nonnegative().optional(),
  minSpent: z.coerce.number().nonnegative().optional(),
  maxSpent: z.coerce.number().nonnegative().optional(),
  sortBy: z.enum(['email', 'firstName', 'lastName', 'totalOrders', 'totalSpent', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function customerRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List customers
  app.get('/', async (request, reply) => {
    const query = listCustomersSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where: Record<string, unknown> = { storeId };

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.acceptsMarketing !== undefined) {
      where.acceptsMarketing = query.acceptsMarketing;
    }

    if (query.tag) {
      where.tags = { has: query.tag };
    }

    if (query.minOrders !== undefined) {
      where.totalOrders = { ...((where.totalOrders as object) || {}), gte: query.minOrders };
    }
    if (query.maxOrders !== undefined) {
      where.totalOrders = { ...((where.totalOrders as object) || {}), lte: query.maxOrders };
    }

    if (query.minSpent !== undefined) {
      where.totalSpent = { ...((where.totalSpent as object) || {}), gte: query.minSpent };
    }
    if (query.maxSpent !== undefined) {
      where.totalSpent = { ...((where.totalSpent as object) || {}), lte: query.maxSpent };
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          _count: { select: { addresses: true, orders: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: customers.map((c) => ({
        ...c,
        addressesCount: c._count.addresses,
        ordersCount: c._count.orders,
        _count: undefined,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Get customer stats
  app.get('/stats', async (request, reply) => {
    const storeId = request.currentStore!.id;

    const [total, acceptsMarketing, newThisMonth, avgSpent] = await Promise.all([
      prisma.customer.count({ where: { storeId } }),
      prisma.customer.count({ where: { storeId, acceptsMarketing: true } }),
      prisma.customer.count({
        where: {
          storeId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.customer.aggregate({
        where: { storeId },
        _avg: { totalSpent: true },
      }),
    ]);

    return reply.send({
      success: true,
      data: {
        total,
        acceptsMarketing,
        newThisMonth,
        averageSpent: avgSpent._avg.totalSpent || 0,
      },
    });
  });

  // Get all tags used in customers
  app.get('/tags', async (request, reply) => {
    const storeId = request.currentStore!.id;

    const customers = await prisma.customer.findMany({
      where: { storeId },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    for (const customer of customers) {
      const tags = customer.tags as string[];
      for (const tag of tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return reply.send({
      success: true,
      data: tags,
    });
  });

  // Create customer
  app.post(
    '/',
    { preHandler: [requirePermission('customers:create')] },
    async (request, reply) => {
      const body = createCustomerSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Check for duplicate email
      const existing = await prisma.customer.findUnique({
        where: { storeId_email: { storeId, email: body.email } },
      });

      if (existing) {
        throw new ConflictError('Customer with this email already exists');
      }

      const customer = await prisma.customer.create({
        data: {
          storeId,
          ...body,
        },
        include: {
          _count: { select: { addresses: true, orders: true } },
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          ...customer,
          addressesCount: customer._count.addresses,
          ordersCount: customer._count.orders,
          _count: undefined,
        },
      });
    }
  );

  // Get customer by ID
  app.get('/:customerId', async (request, reply) => {
    const { customerId } = request.params as { customerId: string };

    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        storeId: request.currentStore!.id,
      },
      include: {
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
        orders: {
          orderBy: { placedAt: 'desc' },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            placedAt: true,
          },
        },
        _count: { select: { orders: true } },
      },
    });

    if (!customer) {
      throw new NotFoundError('Customer');
    }

    return reply.send({
      success: true,
      data: customer,
    });
  });

  // Update customer
  app.patch(
    '/:customerId',
    { preHandler: [requirePermission('customers:update')] },
    async (request, reply) => {
      const { customerId } = request.params as { customerId: string };
      const body = updateCustomerSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const existing = await prisma.customer.findFirst({
        where: { id: customerId, storeId },
      });

      if (!existing) {
        throw new NotFoundError('Customer');
      }

      // Check email uniqueness if changing
      if (body.email && body.email !== existing.email) {
        const emailExists = await prisma.customer.findFirst({
          where: { storeId, email: body.email, id: { not: customerId } },
        });
        if (emailExists) {
          throw new ConflictError('Customer with this email already exists');
        }
      }

      const customer = await prisma.customer.update({
        where: { id: customerId },
        data: body,
        include: {
          _count: { select: { addresses: true, orders: true } },
        },
      });

      return reply.send({
        success: true,
        data: {
          ...customer,
          addressesCount: customer._count.addresses,
          ordersCount: customer._count.orders,
          _count: undefined,
        },
      });
    }
  );

  // Delete customer
  app.delete(
    '/:customerId',
    { preHandler: [requirePermission('customers:delete')] },
    async (request, reply) => {
      const { customerId } = request.params as { customerId: string };

      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          storeId: request.currentStore!.id,
        },
      });

      if (!customer) {
        throw new NotFoundError('Customer');
      }

      await prisma.customer.delete({ where: { id: customerId } });

      return reply.send({
        success: true,
        data: { message: 'Customer deleted successfully' },
      });
    }
  );

  // ============ Customer Addresses ============

  // List customer addresses
  app.get('/:customerId/addresses', async (request, reply) => {
    const { customerId } = request.params as { customerId: string };

    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        storeId: request.currentStore!.id,
      },
    });

    if (!customer) {
      throw new NotFoundError('Customer');
    }

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return reply.send({
      success: true,
      data: addresses,
    });
  });

  // Add customer address
  app.post(
    '/:customerId/addresses',
    { preHandler: [requirePermission('customers:update')] },
    async (request, reply) => {
      const { customerId } = request.params as { customerId: string };
      const body = addressSchema.extend({
        isDefault: z.boolean().default(false),
      }).parse(request.body);

      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          storeId: request.currentStore!.id,
        },
      });

      if (!customer) {
        throw new NotFoundError('Customer');
      }

      // If this is set as default, unset other defaults
      if (body.isDefault) {
        await prisma.customerAddress.updateMany({
          where: { customerId },
          data: { isDefault: false },
        });
      }

      const address = await prisma.customerAddress.create({
        data: {
          customerId,
          ...body,
        },
      });

      return reply.status(201).send({
        success: true,
        data: address,
      });
    }
  );

  // Update customer address
  app.patch(
    '/:customerId/addresses/:addressId',
    { preHandler: [requirePermission('customers:update')] },
    async (request, reply) => {
      const { customerId, addressId } = request.params as {
        customerId: string;
        addressId: string;
      };
      const body = addressSchema
        .extend({ isDefault: z.boolean().optional() })
        .partial()
        .parse(request.body);

      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          storeId: request.currentStore!.id,
        },
      });

      if (!customer) {
        throw new NotFoundError('Customer');
      }

      const existing = await prisma.customerAddress.findFirst({
        where: { id: addressId, customerId },
      });

      if (!existing) {
        throw new NotFoundError('Address');
      }

      // If this is set as default, unset other defaults
      if (body.isDefault) {
        await prisma.customerAddress.updateMany({
          where: { customerId, id: { not: addressId } },
          data: { isDefault: false },
        });
      }

      const address = await prisma.customerAddress.update({
        where: { id: addressId },
        data: body,
      });

      return reply.send({
        success: true,
        data: address,
      });
    }
  );

  // Delete customer address
  app.delete(
    '/:customerId/addresses/:addressId',
    { preHandler: [requirePermission('customers:update')] },
    async (request, reply) => {
      const { customerId, addressId } = request.params as {
        customerId: string;
        addressId: string;
      };

      const customer = await prisma.customer.findFirst({
        where: {
          id: customerId,
          storeId: request.currentStore!.id,
        },
      });

      if (!customer) {
        throw new NotFoundError('Customer');
      }

      const existing = await prisma.customerAddress.findFirst({
        where: { id: addressId, customerId },
      });

      if (!existing) {
        throw new NotFoundError('Address');
      }

      await prisma.customerAddress.delete({ where: { id: addressId } });

      return reply.send({
        success: true,
        data: { message: 'Address deleted successfully' },
      });
    }
  );

  // Get customer orders
  app.get('/:customerId/orders', async (request, reply) => {
    const { customerId } = request.params as { customerId: string };
    const query = z
      .object({
        page: z.coerce.number().positive().default(1),
        limit: z.coerce.number().positive().max(100).default(20),
      })
      .parse(request.query);

    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });

    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        storeId: request.currentStore!.id,
      },
    });

    if (!customer) {
      throw new NotFoundError('Customer');
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        skip,
        take,
        orderBy: { placedAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          total: true,
          currency: true,
          placedAt: true,
          _count: { select: { items: true } },
        },
      }),
      prisma.order.count({ where: { customerId } }),
    ]);

    return reply.send({
      success: true,
      data: orders.map((o) => ({
        ...o,
        itemsCount: o._count.items,
        _count: undefined,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });
}

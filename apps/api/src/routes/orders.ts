import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { generateOrderNumber, paginate, createPaginationMeta } from '@rendrix/utils';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ValidationError } from '../lib/error-handler';

const addressSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  company: z.string().max(255).optional(),
  address1: z.string().min(1).max(255),
  address2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2),
  phone: z.string().max(50).optional(),
});

const createOrderSchema = z.object({
  customerId: z.string().uuid().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
  items: z.array(z.object({
    productId: z.string().uuid().optional(),
    variantId: z.string().uuid().optional(),
    name: z.string(),
    sku: z.string().optional(),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative(),
  })).min(1),
  notes: z.string().optional(),
});

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  notes: z.string().optional(),
  billingAddress: addressSchema.optional(),
  shippingAddress: addressSchema.optional(),
});

const listOrdersSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  paymentStatus: z.enum(['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed']).optional(),
  fulfillmentStatus: z.enum(['unfulfilled', 'partially_fulfilled', 'fulfilled', 'returned']).optional(),
  customerId: z.string().uuid().optional(),
  search: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(['createdAt', 'total', 'orderNumber']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const fulfillOrderSchema = z.object({
  items: z.array(z.object({
    orderItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
  carrier: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
});

export async function orderRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List orders
  app.get(
    '/',
    { preHandler: [requirePermission('orders:read')] },
    async (request, reply) => {
      const query = listOrdersSchema.parse(request.query);
      const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
      const storeId = request.currentStore!.id;

      const where = {
        storeId,
        ...(query.status && { status: query.status }),
        ...(query.paymentStatus && { paymentStatus: query.paymentStatus }),
        ...(query.fulfillmentStatus && { fulfillmentStatus: query.fulfillmentStatus }),
        ...(query.customerId && { customerId: query.customerId }),
        ...(query.search && {
          OR: [
            { orderNumber: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }),
        ...(query.dateFrom && { placedAt: { gte: query.dateFrom } }),
        ...(query.dateTo && { placedAt: { lte: query.dateTo } }),
      };

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take,
          orderBy: { [query.sortBy]: query.sortOrder },
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            items: { take: 3 },
            _count: { select: { items: true } },
          },
        }),
        prisma.order.count({ where }),
      ]);

      return reply.send({
        success: true,
        data: orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.customer,
          email: o.email,
          status: o.status,
          paymentStatus: o.paymentStatus,
          fulfillmentStatus: o.fulfillmentStatus,
          currency: o.currency,
          total: o.total,
          itemsCount: o._count.items,
          items: o.items,
          placedAt: o.placedAt,
          createdAt: o.createdAt,
        })),
        meta: createPaginationMeta(total, page, limit),
      });
    }
  );

  // Create order (manual order)
  app.post(
    '/',
    { preHandler: [requirePermission('orders:update')] },
    async (request, reply) => {
      const body = createOrderSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Calculate totals
      const subtotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = subtotal; // TODO: Add tax and shipping calculation

      // Create order
      const order = await prisma.order.create({
        data: {
          storeId,
          orderNumber: generateOrderNumber(),
          customerId: body.customerId,
          email: body.email,
          phone: body.phone,
          status: 'confirmed',
          paymentStatus: 'pending',
          fulfillmentStatus: 'unfulfilled',
          subtotal,
          total,
          billingAddress: body.billingAddress,
          shippingAddress: body.shippingAddress,
          notes: body.notes,
          items: {
            create: body.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              sku: item.sku,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });

      // Update inventory
      for (const item of body.items) {
        if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      return reply.status(201).send({
        success: true,
        data: order,
      });
    }
  );

  // Get order by ID
  app.get(
    '/:orderId',
    { preHandler: [requirePermission('orders:read')] },
    async (request, reply) => {
      const { orderId } = request.params as { orderId: string };

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          storeId: request.currentStore!.id,
        },
        include: {
          customer: true,
          items: {
            include: {
              product: { select: { id: true, name: true, images: { take: 1 } } },
              variant: { select: { id: true, name: true, imageUrl: true } },
            },
          },
          transactions: { orderBy: { createdAt: 'desc' } },
          fulfillments: {
            include: { items: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!order) {
        throw new NotFoundError('Order');
      }

      return reply.send({
        success: true,
        data: order,
      });
    }
  );

  // Update order
  app.patch(
    '/:orderId',
    { preHandler: [requirePermission('orders:update')] },
    async (request, reply) => {
      const { orderId } = request.params as { orderId: string };
      const body = updateOrderSchema.parse(request.body);

      const existing = await prisma.order.findFirst({
        where: {
          id: orderId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Order');
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: body,
        include: {
          items: true,
          customer: true,
        },
      });

      return reply.send({
        success: true,
        data: order,
      });
    }
  );

  // Fulfill order
  app.post(
    '/:orderId/fulfill',
    { preHandler: [requirePermission('orders:fulfill')] },
    async (request, reply) => {
      const { orderId } = request.params as { orderId: string };
      const body = fulfillOrderSchema.parse(request.body);

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          storeId: request.currentStore!.id,
        },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundError('Order');
      }

      if (order.fulfillmentStatus === 'fulfilled') {
        throw new ValidationError({
          order: ['Order is already fulfilled'],
        });
      }

      // Determine items to fulfill
      const itemsToFulfill = body.items || order.items.map((i) => ({
        orderItemId: i.id,
        quantity: i.quantity,
      }));

      // Create fulfillment
      const fulfillment = await prisma.fulfillment.create({
        data: {
          orderId,
          status: 'shipped',
          trackingNumber: body.trackingNumber,
          trackingUrl: body.trackingUrl,
          carrier: body.carrier,
          shippedAt: new Date(),
          items: {
            create: itemsToFulfill.map((item) => ({
              orderItemId: item.orderItemId,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Update order fulfillment status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          fulfillmentStatus: 'fulfilled',
          status: 'shipped',
        },
      });

      // TODO: Send shipment notification email if body.notifyCustomer

      return reply.status(201).send({
        success: true,
        data: fulfillment,
      });
    }
  );

  // Cancel order
  app.post(
    '/:orderId/cancel',
    { preHandler: [requirePermission('orders:update')] },
    async (request, reply) => {
      const { orderId } = request.params as { orderId: string };

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          storeId: request.currentStore!.id,
        },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundError('Order');
      }

      if (['cancelled', 'refunded', 'delivered'].includes(order.status)) {
        throw new ValidationError({
          order: [`Cannot cancel order with status: ${order.status}`],
        });
      }

      // Restore inventory
      for (const item of order.items) {
        if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
        }
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { quantity: { increment: item.quantity } },
          });
        }
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      });

      return reply.send({
        success: true,
        data: updatedOrder,
      });
    }
  );
}

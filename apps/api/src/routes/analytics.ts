import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { percentageChange } from '@rendrix/utils';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';

const dateRangeSchema = z.enum(['7d', '30d', '90d', '12m']).default('30d');

function getDateRange(range: string): { start: Date; end: Date; previousStart: Date; previousEnd: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  let start: Date;
  let previousStart: Date;
  let previousEnd: Date;

  switch (range) {
    case '7d':
      start = new Date(end);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(-1);
      previousStart = new Date(previousEnd);
      previousStart.setDate(previousStart.getDate() - 7);
      previousStart.setHours(0, 0, 0, 0);
      break;
    case '30d':
      start = new Date(end);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(-1);
      previousStart = new Date(previousEnd);
      previousStart.setDate(previousStart.getDate() - 30);
      previousStart.setHours(0, 0, 0, 0);
      break;
    case '90d':
      start = new Date(end);
      start.setDate(start.getDate() - 90);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(-1);
      previousStart = new Date(previousEnd);
      previousStart.setDate(previousStart.getDate() - 90);
      previousStart.setHours(0, 0, 0, 0);
      break;
    case '12m':
    default:
      start = new Date(end);
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(-1);
      previousStart = new Date(previousEnd);
      previousStart.setFullYear(previousStart.getFullYear() - 1);
      previousStart.setHours(0, 0, 0, 0);
      break;
  }

  return { start, end, previousStart, previousEnd };
}

function generateChartLabels(range: string): string[] {
  const now = new Date();

  switch (range) {
    case '7d':
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });
    case '30d':
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    case '90d':
      return ['Month 1', 'Month 2', 'Month 3'];
    case '12m':
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleDateString('en-US', { month: 'short' });
      });
    default:
      return [];
  }
}

export async function analyticsRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);
  app.addHook('preHandler', requirePermission('analytics:read'));

  // Get full analytics dashboard data
  app.get('/', async (request, reply) => {
    const rangeParam = (request.query as { range?: string }).range;
    const range = dateRangeSchema.parse(rangeParam);
    const storeId = request.currentStore!.id;
    const { start, end, previousStart, previousEnd } = getDateRange(range);

    // Current period stats
    const [currentRevenue, currentOrders, currentCustomers] = await Promise.all([
      prisma.order.aggregate({
        where: {
          storeId,
          placedAt: { gte: start, lte: end },
          paymentStatus: 'paid',
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.order.count({
        where: {
          storeId,
          placedAt: { gte: start, lte: end },
        },
      }),
      prisma.customer.count({
        where: {
          storeId,
          createdAt: { gte: start, lte: end },
        },
      }),
    ]);

    // Previous period stats for comparison
    const [prevRevenue, prevOrders, prevCustomers] = await Promise.all([
      prisma.order.aggregate({
        where: {
          storeId,
          placedAt: { gte: previousStart, lte: previousEnd },
          paymentStatus: 'paid',
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.order.count({
        where: {
          storeId,
          placedAt: { gte: previousStart, lte: previousEnd },
        },
      }),
      prisma.customer.count({
        where: {
          storeId,
          createdAt: { gte: previousStart, lte: previousEnd },
        },
      }),
    ]);

    const totalRevenue = Number(currentRevenue._sum.total || 0);
    const prevTotalRevenue = Number(prevRevenue._sum.total || 0);
    const avgOrderValue = currentOrders > 0 ? totalRevenue / currentOrders : 0;
    const prevAvgOrderValue = prevOrders > 0 ? Number(prevRevenue._sum.total || 0) / prevOrders : 0;

    // Top products by revenue
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId', 'name'],
      where: {
        order: {
          storeId,
          placedAt: { gte: start, lte: end },
          paymentStatus: 'paid',
        },
        productId: { not: null },
      },
      _sum: { total: true, quantity: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });

    // Get product images
    const productIds = topProducts
      .map((p: { productId: string | null }) => p.productId)
      .filter((id): id is string => id !== null);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        sku: true,
        images: { take: 1, orderBy: { position: 'asc' } },
      },
    });

    type ProductWithImage = typeof products[number];
    const productMap = new Map<string, ProductWithImage>(products.map((p) => [p.id, p]));

    // Top customers by total spent
    const topCustomers = await prisma.customer.findMany({
      where: {
        storeId,
        totalOrders: { gt: 0 },
      },
      orderBy: { totalSpent: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        totalSpent: true,
        totalOrders: true,
      },
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      where: { storeId },
      orderBy: { placedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        email: true,
        total: true,
        status: true,
        placedAt: true,
      },
    });

    // Revenue chart data - aggregate by time period
    const revenueByPeriod = await getRevenueByPeriod(storeId, start, end, range);

    return reply.send({
      success: true,
      data: {
        overview: {
          revenue: {
            total: totalRevenue,
            change: percentageChange(prevTotalRevenue, totalRevenue),
            previousTotal: prevTotalRevenue,
          },
          orders: {
            total: currentOrders,
            change: percentageChange(prevOrders, currentOrders),
            previousTotal: prevOrders,
          },
          customers: {
            total: currentCustomers,
            change: percentageChange(prevCustomers, currentCustomers),
            previousTotal: prevCustomers,
          },
          averageOrderValue: {
            total: avgOrderValue,
            change: percentageChange(prevAvgOrderValue, avgOrderValue),
            previousTotal: prevAvgOrderValue,
          },
        },
        revenueChart: {
          labels: generateChartLabels(range),
          data: revenueByPeriod,
        },
        ordersChart: {
          labels: generateChartLabels(range),
          data: await getOrdersByPeriod(storeId, start, end, range),
        },
        topProducts: topProducts.map((p: { productId: string | null; name: string; _sum: { total: unknown; quantity: number | null } }) => {
          const product = p.productId ? productMap.get(p.productId) : null;
          return {
            id: p.productId,
            name: p.name,
            sku: product?.sku || null,
            imageUrl: product?.images[0]?.url || null,
            revenue: Number(p._sum.total || 0),
            quantity: p._sum.quantity || 0,
          };
        }),
        topCustomers: topCustomers.map((c: { id: string; email: string; firstName: string | null; lastName: string | null; totalSpent: unknown; totalOrders: number }) => ({
          id: c.id,
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          totalSpent: Number(c.totalSpent),
          orderCount: c.totalOrders,
        })),
        recentOrders: recentOrders.map((o: { id: string; orderNumber: string; email: string; total: unknown; status: string; placedAt: Date }) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          email: o.email,
          total: Number(o.total),
          status: o.status,
          placedAt: o.placedAt.toISOString(),
        })),
      },
    });
  });

  // Revenue breakdown endpoint
  app.get('/revenue', async (request, reply) => {
    const rangeParam = (request.query as { range?: string }).range;
    const range = dateRangeSchema.parse(rangeParam);
    const storeId = request.currentStore!.id;
    const { start, end } = getDateRange(range);

    const revenueByPeriod = await getRevenueByPeriod(storeId, start, end, range);

    // Revenue by payment status
    const revenueByStatus = await prisma.order.groupBy({
      by: ['paymentStatus'],
      where: {
        storeId,
        placedAt: { gte: start, lte: end },
      },
      _sum: { total: true },
      _count: { _all: true },
    });

    return reply.send({
      success: true,
      data: {
        chart: {
          labels: generateChartLabels(range),
          data: revenueByPeriod,
        },
        byStatus: revenueByStatus.map((s: { paymentStatus: string; _sum: { total: unknown }; _count: { _all: number } }) => ({
          status: s.paymentStatus,
          total: Number(s._sum.total || 0),
          count: s._count._all,
        })),
      },
    });
  });

  // Products analytics endpoint
  app.get('/products', async (request, reply) => {
    const rangeParam = (request.query as { range?: string }).range;
    const range = dateRangeSchema.parse(rangeParam);
    const storeId = request.currentStore!.id;
    const { start, end } = getDateRange(range);

    // Top selling products
    const topSelling = await prisma.orderItem.groupBy({
      by: ['productId', 'name'],
      where: {
        order: {
          storeId,
          placedAt: { gte: start, lte: end },
          paymentStatus: 'paid',
        },
        productId: { not: null },
      },
      _sum: { total: true, quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 20,
    });

    // Low stock products
    const lowStock = await prisma.product.findMany({
      where: {
        storeId,
        trackInventory: true,
        quantity: { lte: 10 },
        status: 'active',
      },
      orderBy: { quantity: 'asc' },
      take: 10,
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
      },
    });

    return reply.send({
      success: true,
      data: {
        topSelling: topSelling.map((p: { productId: string | null; name: string; _sum: { total: unknown; quantity: number | null } }) => ({
          id: p.productId,
          name: p.name,
          revenue: Number(p._sum.total || 0),
          quantity: p._sum.quantity || 0,
        })),
        lowStock,
      },
    });
  });

  // Customers analytics endpoint
  app.get('/customers', async (request, reply) => {
    const rangeParam = (request.query as { range?: string }).range;
    const range = dateRangeSchema.parse(rangeParam);
    const storeId = request.currentStore!.id;
    const { start, end } = getDateRange(range);

    // New customers over time
    const newCustomers = await prisma.customer.count({
      where: {
        storeId,
        createdAt: { gte: start, lte: end },
      },
    });

    // Returning customers (customers with more than 1 order)
    const returningCustomers = await prisma.customer.count({
      where: {
        storeId,
        totalOrders: { gt: 1 },
      },
    });

    // Customer acquisition by period
    const customersByPeriod = await getCustomersByPeriod(storeId, start, end, range);

    // Marketing opt-in stats
    const marketingStats = await prisma.customer.groupBy({
      by: ['acceptsMarketing'],
      where: { storeId },
      _count: { _all: true },
    });

    return reply.send({
      success: true,
      data: {
        newCustomers,
        returningCustomers,
        chart: {
          labels: generateChartLabels(range),
          data: customersByPeriod,
        },
        marketingOptIn: {
          opted: marketingStats.find((s: { acceptsMarketing: boolean }) => s.acceptsMarketing)?._count._all || 0,
          notOpted: marketingStats.find((s: { acceptsMarketing: boolean }) => !s.acceptsMarketing)?._count._all || 0,
        },
      },
    });
  });
}

// Helper functions for aggregating data by period
async function getRevenueByPeriod(
  storeId: string,
  start: Date,
  end: Date,
  range: string
): Promise<number[]> {
  const orders = await prisma.order.findMany({
    where: {
      storeId,
      placedAt: { gte: start, lte: end },
      paymentStatus: 'paid',
    },
    select: {
      total: true,
      placedAt: true,
    },
  });

  return aggregateByPeriod(orders, range, (o) => Number(o.total), (o) => o.placedAt);
}

async function getOrdersByPeriod(
  storeId: string,
  start: Date,
  end: Date,
  range: string
): Promise<number[]> {
  const orders = await prisma.order.findMany({
    where: {
      storeId,
      placedAt: { gte: start, lte: end },
    },
    select: {
      placedAt: true,
    },
  });

  return aggregateByPeriod(orders, range, () => 1, (o) => o.placedAt);
}

async function getCustomersByPeriod(
  storeId: string,
  start: Date,
  end: Date,
  range: string
): Promise<number[]> {
  const customers = await prisma.customer.findMany({
    where: {
      storeId,
      createdAt: { gte: start, lte: end },
    },
    select: {
      createdAt: true,
    },
  });

  return aggregateByPeriod(customers, range, () => 1, (c) => c.createdAt);
}

function aggregateByPeriod<T>(
  items: T[],
  range: string,
  getValue: (item: T) => number,
  getDate: (item: T) => Date
): number[] {
  const now = new Date();
  let buckets: number[];
  let getBucketIndex: (date: Date) => number;

  switch (range) {
    case '7d':
      buckets = new Array(7).fill(0);
      getBucketIndex = (date) => {
        const daysDiff = Math.floor(
          (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
        );
        return 6 - Math.min(daysDiff, 6);
      };
      break;
    case '30d':
      buckets = new Array(4).fill(0);
      getBucketIndex = (date) => {
        const daysDiff = Math.floor(
          (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
        );
        return 3 - Math.min(Math.floor(daysDiff / 7), 3);
      };
      break;
    case '90d':
      buckets = new Array(3).fill(0);
      getBucketIndex = (date) => {
        const daysDiff = Math.floor(
          (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
        );
        return 2 - Math.min(Math.floor(daysDiff / 30), 2);
      };
      break;
    case '12m':
    default:
      buckets = new Array(12).fill(0);
      getBucketIndex = (date) => {
        const monthsDiff =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());
        return 11 - Math.min(monthsDiff, 11);
      };
      break;
  }

  for (const item of items) {
    const date = getDate(item);
    const index = getBucketIndex(date);
    if (index >= 0 && index < buckets.length) {
      buckets[index] += getValue(item);
    }
  }

  return buckets;
}

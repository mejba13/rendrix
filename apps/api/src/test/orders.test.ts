import { describe, it, expect, beforeEach } from 'vitest';
import { api } from './helpers/api';
import { createTestContext, authHeaders } from './helpers/auth';
import { testPrisma } from './setup';
import { v4 as uuid } from 'uuid';

describe('Orders', () => {
  let ctx: Awaited<ReturnType<typeof createTestContext>>;
  let productId: string;
  let customerId: string;

  beforeEach(async () => {
    ctx = await createTestContext();

    // Create a test product
    const product = await testPrisma.product.create({
      data: {
        storeId: ctx.store.id,
        name: 'Test Product',
        slug: 'test-product',
        status: 'active',
        price: 29.99,
        quantity: 100,
        trackInventory: true,
      },
    });
    productId = product.id;

    // Create a test customer
    const customer = await testPrisma.customer.create({
      data: {
        storeId: ctx.store.id,
        email: 'customer@example.com',
        firstName: 'Test',
        lastName: 'Customer',
      },
    });
    customerId = customer.id;
  });

  describe('GET /api/v1/stores/:storeId/orders', () => {
    beforeEach(async () => {
      // Create some test orders
      for (let i = 0; i < 5; i++) {
        await testPrisma.order.create({
          data: {
            storeId: ctx.store.id,
            orderNumber: `ORD-00${i + 1}`,
            email: `customer${i}@example.com`,
            status: i % 2 === 0 ? 'pending' : 'confirmed',
            paymentStatus: i % 2 === 0 ? 'pending' : 'paid',
            fulfillmentStatus: 'unfulfilled',
            currency: 'USD',
            subtotal: 100,
            total: 100,
          },
        });
      }
    });

    it('should list orders with pagination', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/orders?page=1&limit=3`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta.total).toBe(5);
      expect(response.body.meta.totalPages).toBe(2);
    });

    it('should filter orders by status', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/orders?status=pending`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.data.every((o: any) => o.status === 'pending')).toBe(true);
    });

    it('should search orders by email', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/orders?search=customer1`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.data[0].email).toContain('customer1');
    });
  });

  describe('GET /api/v1/stores/:storeId/orders/:orderId', () => {
    let orderId: string;

    beforeEach(async () => {
      const order = await testPrisma.order.create({
        data: {
          storeId: ctx.store.id,
          orderNumber: 'ORD-DETAIL-001',
          email: 'detail@example.com',
          customerId,
          status: 'confirmed',
          paymentStatus: 'paid',
          fulfillmentStatus: 'unfulfilled',
          currency: 'USD',
          subtotal: 59.98,
          total: 65.98,
          shippingTotal: 6,
          items: {
            create: [
              {
                productId,
                name: 'Test Product',
                quantity: 2,
                price: 29.99,
                total: 59.98,
              },
            ],
          },
        },
      });
      orderId = order.id;
    });

    it('should get order details', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: orderId,
          orderNumber: 'ORD-DETAIL-001',
          email: 'detail@example.com',
          status: 'confirmed',
          paymentStatus: 'paid',
        },
      });
      expect(response.body.data.items).toHaveLength(1);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/orders/${uuid()}`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/stores/:storeId/orders/:orderId', () => {
    let orderId: string;

    beforeEach(async () => {
      const order = await testPrisma.order.create({
        data: {
          storeId: ctx.store.id,
          orderNumber: 'ORD-UPDATE-001',
          email: 'update@example.com',
          status: 'pending',
          paymentStatus: 'pending',
          fulfillmentStatus: 'unfulfilled',
          currency: 'USD',
          subtotal: 100,
          total: 100,
        },
      });
      orderId = order.id;
    });

    it('should update order status', async () => {
      const response = await api.patch(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}`,
        { status: 'confirmed' },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('confirmed');
    });

    it('should update order notes', async () => {
      const response = await api.patch(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}`,
        { notes: 'Customer requested gift wrapping' },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.data.notes).toBe('Customer requested gift wrapping');
    });
  });

  describe('POST /api/v1/stores/:storeId/orders/:orderId/fulfill', () => {
    let orderId: string;
    let orderItemId: string;

    beforeEach(async () => {
      const order = await testPrisma.order.create({
        data: {
          storeId: ctx.store.id,
          orderNumber: 'ORD-FULFILL-001',
          email: 'fulfill@example.com',
          status: 'confirmed',
          paymentStatus: 'paid',
          fulfillmentStatus: 'unfulfilled',
          currency: 'USD',
          subtotal: 100,
          total: 100,
          items: {
            create: [
              {
                productId,
                name: 'Test Product',
                quantity: 3,
                price: 33.33,
                total: 99.99,
              },
            ],
          },
        },
        include: { items: true },
      });
      orderId = order.id;
      orderItemId = order.items[0].id;
    });

    it('should create fulfillment with tracking info', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}/fulfill`,
        {
          items: [{ orderItemId, quantity: 3 }],
          trackingNumber: 'TRACK123456',
          trackingUrl: 'https://tracking.example.com/TRACK123456',
          carrier: 'FedEx',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          trackingNumber: 'TRACK123456',
          carrier: 'FedEx',
        },
      });

      // Verify order fulfillment status
      const order = await testPrisma.order.findUnique({
        where: { id: orderId },
      });
      expect(order?.fulfillmentStatus).toBe('fulfilled');
    });

    it('should create partial fulfillment', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}/fulfill`,
        {
          items: [{ orderItemId, quantity: 1 }],
          trackingNumber: 'PARTIAL123',
          carrier: 'UPS',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(201);

      // Verify partial fulfillment status
      const order = await testPrisma.order.findUnique({
        where: { id: orderId },
      });
      expect(order?.fulfillmentStatus).toBe('partially_fulfilled');
    });

    it('should fail for unfulfillable quantity', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}/fulfill`,
        {
          items: [{ orderItemId, quantity: 10 }], // More than ordered
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/stores/:storeId/orders/:orderId/cancel', () => {
    let orderId: string;

    beforeEach(async () => {
      const order = await testPrisma.order.create({
        data: {
          storeId: ctx.store.id,
          orderNumber: 'ORD-CANCEL-001',
          email: 'cancel@example.com',
          status: 'pending',
          paymentStatus: 'pending',
          fulfillmentStatus: 'unfulfilled',
          currency: 'USD',
          subtotal: 100,
          total: 100,
          items: {
            create: [
              {
                productId,
                name: 'Test Product',
                quantity: 2,
                price: 50,
                total: 100,
              },
            ],
          },
        },
      });
      orderId = order.id;
    });

    it('should cancel order and restore inventory', async () => {
      // Get initial product quantity
      const productBefore = await testPrisma.product.findUnique({
        where: { id: productId },
      });
      const quantityBefore = productBefore?.quantity || 0;

      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}/cancel`,
        { reason: 'Customer changed mind' },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('cancelled');

      // Verify inventory restored
      const productAfter = await testPrisma.product.findUnique({
        where: { id: productId },
      });
      expect(productAfter?.quantity).toBe(quantityBefore + 2);
    });

    it('should fail to cancel fulfilled order', async () => {
      // Mark as fulfilled
      await testPrisma.order.update({
        where: { id: orderId },
        data: { fulfillmentStatus: 'fulfilled' },
      });

      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/orders/${orderId}/cancel`,
        {},
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/stores/:storeId/orders/stats', () => {
    beforeEach(async () => {
      // Create orders with various statuses
      const statuses = [
        { status: 'pending', paymentStatus: 'pending' },
        { status: 'confirmed', paymentStatus: 'paid' },
        { status: 'confirmed', paymentStatus: 'paid' },
        { status: 'cancelled', paymentStatus: 'refunded' },
      ];

      for (const s of statuses) {
        await testPrisma.order.create({
          data: {
            storeId: ctx.store.id,
            orderNumber: `ORD-STAT-${Math.random().toString(36).substring(7)}`,
            email: 'stats@example.com',
            status: s.status,
            paymentStatus: s.paymentStatus,
            fulfillmentStatus: 'unfulfilled',
            currency: 'USD',
            subtotal: 50,
            total: 50,
          },
        });
      }
    });

    it('should return order statistics', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/orders/stats`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          total: 4,
          pending: 1,
          confirmed: 2,
          cancelled: 1,
        },
      });
    });
  });
});

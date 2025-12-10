import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './helpers/api';
import { createTestContext, authHeaders } from './helpers/auth';
import { testPrisma } from './setup';
import { v4 as uuid } from 'uuid';

describe('Payments', () => {
  let ctx: Awaited<ReturnType<typeof createTestContext>>;
  let orderId: string;

  beforeEach(async () => {
    ctx = await createTestContext();

    // Create a test order
    const order = await testPrisma.order.create({
      data: {
        id: uuid(),
        storeId: ctx.store.id,
        orderNumber: 'ORD-TEST-001',
        email: 'customer@example.com',
        status: 'pending',
        paymentStatus: 'pending',
        fulfillmentStatus: 'unfulfilled',
        currency: 'USD',
        subtotal: 100,
        total: 100,
        items: {
          create: [
            {
              name: 'Test Product',
              quantity: 1,
              price: 100,
              total: 100,
            },
          ],
        },
      },
    });
    orderId = order.id;
  });

  describe('GET /api/v1/stores/:storeId/payments/methods', () => {
    it('should return available payment methods', async () => {
      const response = await api.get(
        `/api/v1/stores/${ctx.store.id}/payments/methods`,
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/stores/:storeId/payments/create', () => {
    it('should create a Stripe payment intent', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/create`,
        {
          orderId,
          paymentMethod: 'stripe',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          paymentMethod: 'stripe',
          clientSecret: expect.any(String),
          paymentIntentId: expect.any(String),
        },
      });

      // Verify transaction was created
      const transaction = await testPrisma.orderTransaction.findFirst({
        where: { orderId, gateway: 'stripe' },
      });
      expect(transaction).toBeDefined();
      expect(transaction?.status).toBe('pending');
    });

    it('should create a PayPal order', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/create`,
        {
          orderId,
          paymentMethod: 'paypal',
          returnUrl: 'https://example.com/success',
          cancelUrl: 'https://example.com/cancel',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          paymentMethod: 'paypal',
          paypalOrderId: expect.any(String),
          approvalUrl: expect.any(String),
        },
      });

      // Verify transaction was created
      const transaction = await testPrisma.orderTransaction.findFirst({
        where: { orderId, gateway: 'paypal' },
      });
      expect(transaction).toBeDefined();
      expect(transaction?.status).toBe('pending');
    });

    it('should fail for non-existent order', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/create`,
        {
          orderId: uuid(),
          paymentMethod: 'stripe',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail for already paid order', async () => {
      // Mark order as paid
      await testPrisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'paid' },
      });

      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/create`,
        {
          orderId,
          paymentMethod: 'stripe',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/stores/:storeId/payments/paypal/capture', () => {
    it('should capture PayPal payment', async () => {
      // Create pending PayPal transaction
      await testPrisma.orderTransaction.create({
        data: {
          orderId,
          type: 'charge',
          status: 'pending',
          amount: 100,
          currency: 'USD',
          gateway: 'paypal',
          gatewayTransactionId: 'PAY-123',
        },
      });

      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/paypal/capture`,
        {
          orderId,
          paypalOrderId: 'PAY-123',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          orderId,
          paymentStatus: 'paid',
        },
      });

      // Verify order status
      const order = await testPrisma.order.findUnique({
        where: { id: orderId },
      });
      expect(order?.paymentStatus).toBe('paid');
      expect(order?.status).toBe('confirmed');
    });

    it('should fail without pending transaction', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/paypal/capture`,
        {
          orderId,
          paypalOrderId: 'INVALID-PAY',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/stores/:storeId/payments/refund', () => {
    beforeEach(async () => {
      // Update order to paid
      await testPrisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'paid', status: 'confirmed' },
      });

      // Create successful payment transaction
      await testPrisma.orderTransaction.create({
        data: {
          orderId,
          type: 'charge',
          status: 'success',
          amount: 100,
          currency: 'USD',
          gateway: 'stripe',
          gatewayTransactionId: 'pi_test123',
        },
      });
    });

    it('should process full refund via Stripe', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/refund`,
        {
          orderId,
          reason: 'Customer requested refund',
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          refundId: expect.any(String),
          amount: 100,
        },
      });

      // Verify order status
      const order = await testPrisma.order.findUnique({
        where: { id: orderId },
      });
      expect(order?.paymentStatus).toBe('refunded');

      // Verify refund transaction was created
      const refundTx = await testPrisma.orderTransaction.findFirst({
        where: { orderId, type: 'refund' },
      });
      expect(refundTx).toBeDefined();
    });

    it('should process partial refund', async () => {
      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/refund`,
        {
          orderId,
          amount: 50,
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(200);
      expect(response.body.data.amount).toBe(50);

      // Verify order status
      const order = await testPrisma.order.findUnique({
        where: { id: orderId },
      });
      expect(order?.paymentStatus).toBe('partially_refunded');
    });

    it('should fail for unpaid order', async () => {
      // Reset order to pending
      await testPrisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'pending' },
      });

      const response = await api.post(
        `/api/v1/stores/${ctx.store.id}/payments/refund`,
        {
          orderId,
        },
        authHeaders(ctx.user.accessToken, ctx.organization.id)
      );

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import Stripe from 'stripe';
import { prisma } from '@rendrix/database';
import { authenticate, requireOrganization, requireStore, requirePermission } from '../lib/auth';
import { NotFoundError, ValidationError, ForbiddenError } from '../lib/error-handler';
import { env } from '../config/env';
import {
  createPayPalOrder,
  capturePayPalOrder,
  refundPayPalPayment,
  verifyWebhookSignature,
  isPayPalConfigured,
} from '../lib/paypal';

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

const createPaymentIntentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: z.enum(['stripe', 'paypal']),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

const capturePayPalSchema = z.object({
  orderId: z.string().uuid(),
  paypalOrderId: z.string(),
});

export async function paymentRoutes(app: FastifyInstance) {
  // Get available payment methods for a store
  app.get(
    '/methods',
    { preHandler: [authenticate, requireOrganization, requireStore] },
    async (request, reply) => {
      const methods: Array<{ id: string; name: string; enabled: boolean }> = [];

      if (stripe) {
        methods.push({
          id: 'stripe',
          name: 'Credit/Debit Card',
          enabled: true,
        });
      }

      if (isPayPalConfigured()) {
        methods.push({
          id: 'paypal',
          name: 'PayPal',
          enabled: true,
        });
      }

      return reply.send({
        success: true,
        data: methods,
      });
    }
  );

  // Create payment for an order
  app.post(
    '/create',
    { preHandler: [authenticate, requireOrganization, requireStore] },
    async (request, reply) => {
      const body = createPaymentIntentSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Get the order
      const order = await prisma.order.findFirst({
        where: { id: body.orderId, storeId },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new NotFoundError('Order');
      }

      if (order.paymentStatus === 'paid') {
        throw new ValidationError({
          order: ['This order has already been paid'],
        });
      }

      const returnUrl = body.returnUrl || `${env.APP_URL}/checkout/success?orderId=${order.id}`;
      const cancelUrl = body.cancelUrl || `${env.APP_URL}/checkout/cancel?orderId=${order.id}`;

      if (body.paymentMethod === 'stripe') {
        if (!stripe) {
          throw new ForbiddenError('Stripe is not configured');
        }

        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(order.total) * 100), // Convert to cents
          currency: order.currency.toLowerCase(),
          metadata: {
            storeId,
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
          description: `Order #${order.orderNumber}`,
        });

        // Save transaction record
        await prisma.orderTransaction.create({
          data: {
            orderId: order.id,
            type: 'charge',
            status: 'pending',
            amount: order.total,
            currency: order.currency,
            gateway: 'stripe',
            gatewayTransactionId: paymentIntent.id,
          },
        });

        return reply.send({
          success: true,
          data: {
            paymentMethod: 'stripe',
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
          },
        });
      } else if (body.paymentMethod === 'paypal') {
        if (!isPayPalConfigured()) {
          throw new ForbiddenError('PayPal is not configured');
        }

        // Create PayPal order
        const paypalOrder = await createPayPalOrder({
          amount: Number(order.total),
          currency: order.currency,
          orderId: order.id,
          orderNumber: order.orderNumber,
          returnUrl,
          cancelUrl,
          items: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: Number(item.price),
          })),
        });

        // Save transaction record
        await prisma.orderTransaction.create({
          data: {
            orderId: order.id,
            type: 'charge',
            status: 'pending',
            amount: order.total,
            currency: order.currency,
            gateway: 'paypal',
            gatewayTransactionId: paypalOrder.id,
          },
        });

        // Get approval URL
        const approvalUrl = paypalOrder.links.find((link) => link.rel === 'approve')?.href;

        return reply.send({
          success: true,
          data: {
            paymentMethod: 'paypal',
            paypalOrderId: paypalOrder.id,
            approvalUrl,
          },
        });
      }

      throw new ValidationError({ paymentMethod: ['Invalid payment method'] });
    }
  );

  // Capture PayPal payment (called after user approves on PayPal)
  app.post(
    '/paypal/capture',
    { preHandler: [authenticate, requireOrganization, requireStore] },
    async (request, reply) => {
      const body = capturePayPalSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      if (!isPayPalConfigured()) {
        throw new ForbiddenError('PayPal is not configured');
      }

      // Get the order
      const order = await prisma.order.findFirst({
        where: { id: body.orderId, storeId },
      });

      if (!order) {
        throw new NotFoundError('Order');
      }

      // Get the pending transaction
      const transaction = await prisma.orderTransaction.findFirst({
        where: {
          orderId: order.id,
          gateway: 'paypal',
          gatewayTransactionId: body.paypalOrderId,
          status: 'pending',
        },
      });

      if (!transaction) {
        throw new NotFoundError('Transaction');
      }

      try {
        // Capture the payment
        const capture = await capturePayPalOrder(body.paypalOrderId);

        if (capture.status !== 'COMPLETED') {
          throw new Error(`PayPal capture status: ${capture.status}`);
        }

        const captureDetails = capture.purchase_units[0]?.payments?.captures?.[0];

        // Update transaction
        await prisma.orderTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'success',
            gatewayTransactionId: captureDetails?.id || body.paypalOrderId,
          },
        });

        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'confirmed',
            paymentStatus: 'paid',
          },
        });

        return reply.send({
          success: true,
          data: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            paymentStatus: 'paid',
            captureId: captureDetails?.id,
          },
        });
      } catch (error) {
        // Update transaction as failed
        await prisma.orderTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        throw error;
      }
    }
  );

  // Process refund
  app.post(
    '/refund',
    { preHandler: [authenticate, requireOrganization, requireStore, requirePermission('orders:refund')] },
    async (request, reply) => {
      const refundSchema = z.object({
        orderId: z.string().uuid(),
        amount: z.number().positive().optional(), // Partial refund amount
        reason: z.string().optional(),
      });

      const body = refundSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Get the order
      const order = await prisma.order.findFirst({
        where: { id: body.orderId, storeId },
        include: {
          transactions: {
            where: { status: 'success', type: 'charge' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!order) {
        throw new NotFoundError('Order');
      }

      if (order.paymentStatus !== 'paid') {
        throw new ValidationError({
          order: ['Order has not been paid'],
        });
      }

      const transaction = order.transactions[0];
      if (!transaction) {
        throw new ValidationError({
          order: ['No payment transaction found'],
        });
      }

      const refundAmount = body.amount || Number(order.total);
      let refundResult: { id: string; status: string } | undefined;

      if (transaction.gateway === 'stripe') {
        if (!stripe) {
          throw new ForbiddenError('Stripe is not configured');
        }

        const refund = await stripe.refunds.create({
          payment_intent: transaction.gatewayTransactionId!,
          amount: Math.round(refundAmount * 100),
          reason: 'requested_by_customer',
        });

        refundResult = { id: refund.id, status: refund.status };
      } else if (transaction.gateway === 'paypal') {
        if (!isPayPalConfigured()) {
          throw new ForbiddenError('PayPal is not configured');
        }

        const refund = await refundPayPalPayment(
          transaction.gatewayTransactionId!,
          refundAmount,
          order.currency
        );

        refundResult = { id: refund.id, status: refund.status };
      } else {
        throw new ValidationError({
          order: ['Unknown payment gateway'],
        });
      }

      // Create refund transaction
      await prisma.orderTransaction.create({
        data: {
          orderId: order.id,
          type: 'refund',
          status: refundResult.status === 'succeeded' || refundResult.status === 'COMPLETED' ? 'success' : 'pending',
          amount: refundAmount,
          currency: order.currency,
          gateway: transaction.gateway,
          gatewayTransactionId: refundResult.id,
        },
      });

      // Update order status if full refund
      if (refundAmount >= Number(order.total)) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'refunded',
          },
        });
      } else {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'partially_refunded',
          },
        });
      }

      return reply.send({
        success: true,
        data: {
          refundId: refundResult.id,
          amount: refundAmount,
          status: refundResult.status,
        },
      });
    }
  );

  // Stripe webhook for order payments
  app.post('/webhook/stripe', async (request, reply) => {
    if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
      return reply.status(400).send({ error: 'Webhook not configured' });
    }

    const sig = request.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody as Buffer,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return reply.status(400).send({ error: 'Webhook signature verification failed' });
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          // Update transaction
          await prisma.orderTransaction.updateMany({
            where: {
              orderId,
              gatewayTransactionId: paymentIntent.id,
            },
            data: { status: 'success' },
          });

          // Update order
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'confirmed',
              paymentStatus: 'paid',
            },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.orderTransaction.updateMany({
            where: {
              orderId,
              gatewayTransactionId: paymentIntent.id,
            },
            data: {
              status: 'failed',
              errorMessage: paymentIntent.last_payment_error?.message,
            },
          });
        }
        break;
      }
    }

    return reply.send({ received: true });
  });

  // PayPal webhook
  app.post('/webhook/paypal', async (request, reply) => {
    if (!isPayPalConfigured()) {
      return reply.status(400).send({ error: 'PayPal not configured' });
    }

    // Verify webhook signature
    const headers = request.headers as Record<string, string>;
    const body = JSON.stringify(request.body);

    const isValid = await verifyWebhookSignature(headers, body);
    if (!isValid && env.NODE_ENV === 'production') {
      return reply.status(400).send({ error: 'Invalid webhook signature' });
    }

    const event = request.body as {
      event_type: string;
      resource: {
        id: string;
        custom_id?: string;
        supplementary_data?: {
          related_ids?: {
            order_id?: string;
          };
        };
        status?: string;
      };
    };

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const orderId = event.resource.custom_id ||
          event.resource.supplementary_data?.related_ids?.order_id;

        if (orderId) {
          await prisma.orderTransaction.updateMany({
            where: {
              orderId,
              gateway: 'paypal',
              status: 'pending',
            },
            data: {
              status: 'success',
              gatewayTransactionId: event.resource.id,
            },
          });

          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'confirmed',
              paymentStatus: 'paid',
            },
          });
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED': {
        const orderId = event.resource.custom_id ||
          event.resource.supplementary_data?.related_ids?.order_id;

        if (orderId) {
          await prisma.orderTransaction.updateMany({
            where: {
              orderId,
              gateway: 'paypal',
              status: 'pending',
            },
            data: {
              status: 'failed',
              errorMessage: `Payment ${event.resource.status || 'failed'}`,
            },
          });
        }
        break;
      }
    }

    return reply.send({ received: true });
  });
}

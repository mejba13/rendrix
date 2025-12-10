import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { createStripePaymentIntent, isStripeConfigured } from '../../lib/stripe';
import { createPayPalOrder, capturePayPalOrder, isPayPalConfigured } from '../../lib/paypal';

const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
});

const checkoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
});

const paymentSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['stripe', 'paypal']),
  returnUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});

export async function storefrontCheckoutRoutes(app: FastifyInstance) {
  // Create checkout / order
  app.post(
    '/',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Body: z.infer<typeof checkoutSchema>;
      }>,
      reply
    ) => {
      const { storeId } = request.params;
      const body = checkoutSchema.parse(request.body);

      // Verify store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return reply.status(404).send({
          success: false,
          error: { code: 'STORE_NOT_FOUND', message: 'Store not found' },
        });
      }

      // Validate items and calculate totals
      let subtotal = 0;
      const orderItems: Array<{
        productId: string;
        variantId?: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
      }> = [];

      for (const item of body.items) {
        const product = await prisma.product.findFirst({
          where: {
            id: item.productId,
            storeId,
            status: 'active',
          },
          include: {
            variants: true,
          },
        });

        if (!product) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'PRODUCT_NOT_FOUND',
              message: `Product ${item.productId} not found`,
            },
          });
        }

        let price = product.price;
        let availableQuantity = product.quantity;
        let itemName = product.name;

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant) {
            return reply.status(400).send({
              success: false,
              error: {
                code: 'VARIANT_NOT_FOUND',
                message: `Variant ${item.variantId} not found`,
              },
            });
          }
          price = variant.price;
          availableQuantity = variant.quantity;
          itemName = `${product.name} - ${variant.name}`;
        }

        if (item.quantity > availableQuantity) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INSUFFICIENT_STOCK',
              message: `Insufficient stock for ${itemName}`,
            },
          });
        }

        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          name: itemName,
          quantity: item.quantity,
          price,
          total: itemTotal,
        });
      }

      // Calculate shipping, tax, discount
      const shippingTotal = subtotal >= 100 ? 0 : 9.99;
      const taxTotal = subtotal * 0.08; // 8% tax
      let discountTotal = 0;

      // Apply coupon if provided
      if (body.couponCode) {
        const coupon = await prisma.coupon.findFirst({
          where: {
            storeId,
            code: body.couponCode.toUpperCase(),
            status: 'active',
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        });

        if (coupon) {
          if (coupon.type === 'percentage') {
            discountTotal = subtotal * (coupon.value / 100);
          } else {
            discountTotal = Math.min(coupon.value, subtotal);
          }

          // Update coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } },
          });
        }
      }

      const total = subtotal + shippingTotal + taxTotal - discountTotal;

      // Generate order number
      const orderCount = await prisma.order.count({ where: { storeId } });
      const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

      // Create order
      const order = await prisma.order.create({
        data: {
          storeId,
          orderNumber,
          email: body.email,
          status: 'pending',
          paymentStatus: 'pending',
          fulfillmentStatus: 'unfulfilled',
          currency: 'USD',
          subtotal,
          shippingTotal,
          taxTotal,
          discountTotal,
          total,
          shippingAddress: body.shippingAddress as any,
          billingAddress: (body.sameAsShipping ? body.shippingAddress : body.billingAddress) as any,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Reserve inventory
      for (const item of orderItems) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { quantity: { decrement: item.quantity } },
          });
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      return reply.status(201).send({
        success: true,
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          email: order.email,
          subtotal: order.subtotal,
          shippingTotal: order.shippingTotal,
          taxTotal: order.taxTotal,
          discountTotal: order.discountTotal,
          total: order.total,
          items: order.items,
        },
      });
    }
  );

  // Create payment for order
  app.post(
    '/payment',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Body: z.infer<typeof paymentSchema>;
      }>,
      reply
    ) => {
      const { storeId } = request.params;
      const body = paymentSchema.parse(request.body);

      const order = await prisma.order.findFirst({
        where: {
          id: body.orderId,
          storeId,
        },
      });

      if (!order) {
        return reply.status(404).send({
          success: false,
          error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        });
      }

      if (order.paymentStatus === 'paid') {
        return reply.status(400).send({
          success: false,
          error: { code: 'ALREADY_PAID', message: 'Order is already paid' },
        });
      }

      if (body.paymentMethod === 'stripe') {
        if (!isStripeConfigured()) {
          return reply.status(400).send({
            success: false,
            error: { code: 'STRIPE_NOT_CONFIGURED', message: 'Stripe is not configured' },
          });
        }

        const paymentIntent = await createStripePaymentIntent({
          amount: order.total,
          currency: order.currency,
          orderId: order.id,
          customerEmail: order.email,
          metadata: {
            storeId,
            orderNumber: order.orderNumber,
          },
        });

        // Create transaction record
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

        return {
          success: true,
          data: {
            paymentMethod: 'stripe',
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
          },
        };
      }

      if (body.paymentMethod === 'paypal') {
        if (!isPayPalConfigured()) {
          return reply.status(400).send({
            success: false,
            error: { code: 'PAYPAL_NOT_CONFIGURED', message: 'PayPal is not configured' },
          });
        }

        const paypalOrder = await createPayPalOrder({
          amount: order.total,
          currency: order.currency,
          orderId: order.id,
          returnUrl: body.returnUrl || `${process.env.STOREFRONT_URL}/checkout/success`,
          cancelUrl: body.cancelUrl || `${process.env.STOREFRONT_URL}/checkout`,
        });

        // Create transaction record
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

        return {
          success: true,
          data: {
            paymentMethod: 'paypal',
            paypalOrderId: paypalOrder.id,
            approvalUrl: paypalOrder.approvalUrl,
          },
        };
      }

      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_PAYMENT_METHOD', message: 'Invalid payment method' },
      });
    }
  );

  // Capture PayPal payment
  app.post(
    '/paypal/capture',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Body: { orderId: string; paypalOrderId: string };
      }>,
      reply
    ) => {
      const { storeId } = request.params;
      const { orderId, paypalOrderId } = request.body;

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          storeId,
        },
      });

      if (!order) {
        return reply.status(404).send({
          success: false,
          error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        });
      }

      // Find pending transaction
      const transaction = await prisma.orderTransaction.findFirst({
        where: {
          orderId: order.id,
          gatewayTransactionId: paypalOrderId,
          status: 'pending',
        },
      });

      if (!transaction) {
        return reply.status(404).send({
          success: false,
          error: { code: 'TRANSACTION_NOT_FOUND', message: 'Pending transaction not found' },
        });
      }

      try {
        const capturedPayment = await capturePayPalOrder(paypalOrderId);

        // Update transaction
        await prisma.orderTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'success',
            gatewayTransactionId: capturedPayment.captureId,
          },
        });

        // Update order
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'paid',
            status: 'confirmed',
          },
        });

        return {
          success: true,
          data: {
            orderId: order.id,
            paymentStatus: 'paid',
          },
        };
      } catch (error) {
        // Update transaction as failed
        await prisma.orderTransaction.update({
          where: { id: transaction.id },
          data: { status: 'failed' },
        });

        return reply.status(400).send({
          success: false,
          error: { code: 'CAPTURE_FAILED', message: 'Failed to capture payment' },
        });
      }
    }
  );

  // Validate coupon
  app.post(
    '/coupons/validate',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Body: { code: string; cartTotal: number };
      }>,
      reply
    ) => {
      const { storeId } = request.params;
      const { code, cartTotal } = request.body;

      const coupon = await prisma.coupon.findFirst({
        where: {
          storeId,
          code: code.toUpperCase(),
          status: 'active',
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (!coupon) {
        return {
          success: true,
          data: { valid: false, discount: 0 },
        };
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return {
          success: true,
          data: { valid: false, discount: 0, reason: 'Coupon usage limit reached' },
        };
      }

      // Check minimum order amount
      if (coupon.minimumOrderAmount && cartTotal < coupon.minimumOrderAmount) {
        return {
          success: true,
          data: {
            valid: false,
            discount: 0,
            reason: `Minimum order amount is $${coupon.minimumOrderAmount}`,
          },
        };
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = cartTotal * (coupon.value / 100);
      } else {
        discount = Math.min(coupon.value, cartTotal);
      }

      return {
        success: true,
        data: {
          valid: true,
          discount,
          coupon: {
            type: coupon.type,
            value: coupon.value,
          },
        },
      };
    }
  );
}

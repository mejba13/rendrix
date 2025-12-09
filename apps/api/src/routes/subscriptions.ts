import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import Stripe from 'stripe';
import { prisma } from '@rendrix/database';
import { authenticate, requireOrganization, requirePermission } from '../lib/auth';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/error-handler';
import { env } from '../config/env';

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

const createCheckoutSchema = z.object({
  planSlug: z.enum(['pro', 'premium', 'enterprise']),
  billingInterval: z.enum(['monthly', 'yearly']).default('monthly'),
});

export async function subscriptionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  // Get available plans
  app.get('/plans', async (request, reply) => {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return reply.send({
      success: true,
      data: plans.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceMonthly: p.priceMonthly,
        priceYearly: p.priceYearly,
        features: p.features,
        limits: p.limits,
      })),
    });
  });

  // Get current subscription
  app.get(
    '/current',
    { preHandler: [requireOrganization] },
    async (request, reply) => {
      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: request.currentOrganization!.id },
        include: { plan: true },
      });

      if (!subscription) {
        throw new NotFoundError('Subscription');
      }

      // Get usage stats
      const [storesCount, productsCount] = await Promise.all([
        prisma.store.count({
          where: { organizationId: request.currentOrganization!.id },
        }),
        prisma.product.count({
          where: {
            store: { organizationId: request.currentOrganization!.id },
          },
        }),
      ]);

      const limits = subscription.plan.limits as Record<string, number | null>;

      return reply.send({
        success: true,
        data: {
          id: subscription.id,
          plan: {
            name: subscription.plan.name,
            slug: subscription.plan.slug,
            features: subscription.plan.features,
            limits: subscription.plan.limits,
          },
          status: subscription.status,
          billingInterval: subscription.billingInterval,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAt: subscription.cancelAt,
          usage: {
            stores: { used: storesCount, limit: limits.maxStores },
            products: { used: productsCount, limit: limits.maxProducts },
          },
        },
      });
    }
  );

  // Create checkout session
  app.post(
    '/checkout',
    { preHandler: [requireOrganization, requirePermission('organization:billing:manage')] },
    async (request, reply) => {
      if (!stripe) {
        throw new ForbiddenError('Stripe is not configured');
      }

      const body = createCheckoutSchema.parse(request.body);

      // Get plan
      const plan = await prisma.plan.findUnique({
        where: { slug: body.planSlug },
      });

      if (!plan) {
        throw new NotFoundError('Plan');
      }

      const priceId =
        body.billingInterval === 'monthly'
          ? plan.stripePriceIdMonthly
          : plan.stripePriceIdYearly;

      if (!priceId) {
        throw new ValidationError({
          plan: ['This plan is not available for online purchase'],
        });
      }

      // Get or create Stripe customer
      let subscription = await prisma.subscription.findFirst({
        where: { organizationId: request.currentOrganization!.id },
      });

      let customerId = subscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: request.currentUser!.email,
          metadata: {
            organizationId: request.currentOrganization!.id,
          },
        });
        customerId = customer.id;

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { stripeCustomerId: customerId },
          });
        }
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${env.APP_URL}/settings/billing?success=true`,
        cancel_url: `${env.APP_URL}/settings/billing?canceled=true`,
        metadata: {
          organizationId: request.currentOrganization!.id,
          planId: plan.id,
        },
      });

      return reply.send({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    }
  );

  // Create billing portal session
  app.post(
    '/portal',
    { preHandler: [requireOrganization, requirePermission('organization:billing:manage')] },
    async (request, reply) => {
      if (!stripe) {
        throw new ForbiddenError('Stripe is not configured');
      }

      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: request.currentOrganization!.id },
      });

      if (!subscription?.stripeCustomerId) {
        throw new ValidationError({
          subscription: ['No billing information found'],
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${env.APP_URL}/settings/billing`,
      });

      return reply.send({
        success: true,
        data: { url: session.url },
      });
    }
  );

  // Cancel subscription
  app.delete(
    '/current',
    { preHandler: [requireOrganization, requirePermission('organization:billing:manage')] },
    async (request, reply) => {
      if (!stripe) {
        throw new ForbiddenError('Stripe is not configured');
      }

      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: request.currentOrganization!.id },
      });

      if (!subscription?.stripeSubscriptionId) {
        throw new ValidationError({
          subscription: ['No active subscription to cancel'],
        });
      }

      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          cancelAt: subscription.currentPeriodEnd,
        },
      });

      return reply.send({
        success: true,
        data: {
          message: 'Subscription will be canceled at the end of the billing period',
          cancelAt: subscription.currentPeriodEnd,
        },
      });
    }
  );

  // Stripe webhook
  app.post('/webhook', async (request, reply) => {
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
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;
        const planId = session.metadata?.planId;

        if (organizationId && planId && session.subscription) {
          await prisma.subscription.updateMany({
            where: { organizationId },
            data: {
              planId,
              stripeSubscriptionId: session.subscription as string,
              status: 'active',
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAt: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null,
            canceledAt: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000)
              : null,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Downgrade to free plan
        const freePlan = await prisma.plan.findUnique({
          where: { slug: 'free' },
        });

        if (freePlan) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              planId: freePlan.id,
              status: 'active',
              stripeSubscriptionId: null,
              cancelAt: null,
              canceledAt: new Date(),
            },
          });
        }
        break;
      }
    }

    return reply.send({ received: true });
  });
}

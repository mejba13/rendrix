import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../app';
import type { FastifyInstance } from 'fastify';

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      customers: {
        create: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
      },
      paymentIntents: {
        create: vi.fn().mockResolvedValue({
          id: 'pi_test123',
          client_secret: 'pi_test123_secret',
        }),
      },
      refunds: {
        create: vi.fn().mockResolvedValue({
          id: 're_test123',
          status: 'succeeded',
        }),
      },
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            id: 'cs_test123',
            url: 'https://checkout.stripe.com/test',
          }),
        },
      },
      billingPortal: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            url: 'https://billing.stripe.com/test',
          }),
        },
      },
      subscriptions: {
        update: vi.fn().mockResolvedValue({}),
      },
      webhooks: {
        constructEvent: vi.fn(),
      },
    })),
  };
});

// Mock PayPal
vi.mock('../lib/paypal', () => ({
  createPayPalOrder: vi.fn().mockResolvedValue({
    id: 'PAY-123',
    status: 'CREATED',
    links: [
      { href: 'https://paypal.com/approve', rel: 'approve', method: 'GET' },
    ],
  }),
  capturePayPalOrder: vi.fn().mockResolvedValue({
    id: 'PAY-123',
    status: 'COMPLETED',
    purchase_units: [
      {
        payments: {
          captures: [
            {
              id: 'CAP-123',
              status: 'COMPLETED',
              amount: { currency_code: 'USD', value: '100.00' },
            },
          ],
        },
      },
    ],
    payer: {
      name: { given_name: 'John', surname: 'Doe' },
      email_address: 'john@example.com',
      payer_id: 'PAYER123',
    },
  }),
  refundPayPalPayment: vi.fn().mockResolvedValue({
    id: 'REF-123',
    status: 'COMPLETED',
    amount: { currency_code: 'USD', value: '100.00' },
  }),
  verifyWebhookSignature: vi.fn().mockResolvedValue(true),
  isPayPalConfigured: vi.fn().mockReturnValue(true),
}));

// Test database client
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/rendrix_test',
    },
  },
});

// Global app instance
let app: FastifyInstance;

// Setup and teardown
beforeAll(async () => {
  // Clean database
  await cleanDatabase();

  // Build app
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await testPrisma.$disconnect();
});

afterEach(async () => {
  // Clean up after each test
  await cleanDatabase();
});

async function cleanDatabase() {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  if (tables.length > 0) {
    try {
      await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.error('Error cleaning database:', error);
    }
  }
}

// Export for tests
export { app, testPrisma };

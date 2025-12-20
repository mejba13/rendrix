import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { hashPassword, verifyPassword } from '../../lib/auth';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../lib/error-handler';
import { env } from '../../config/env';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

// Customer token payload
interface CustomerTokenPayload {
  sub: string; // Customer ID
  email: string;
  storeId: string;
  type: 'customer';
}

export async function storefrontAuthRoutes(app: FastifyInstance) {
  // Customer registration
  app.post(
    '/:storeId/auth/register',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Body: z.infer<typeof registerSchema>;
      }>,
      reply
    ) => {
      const { storeId } = request.params;
      const body = registerSchema.parse(request.body);

      // Verify store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        throw new NotFoundError('Store not found');
      }

      // Check if customer already exists in this store
      const existingCustomer = await prisma.customer.findUnique({
        where: {
          storeId_email: {
            storeId,
            email: body.email,
          },
        },
      });

      if (existingCustomer) {
        throw new ConflictError('An account with this email already exists');
      }

      // Hash password
      const passwordHash = await hashPassword(body.password);

      // Create customer
      const customer = await prisma.customer.create({
        data: {
          storeId,
          email: body.email,
          passwordHash,
          firstName: body.firstName,
          lastName: body.lastName,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      // Generate access token
      const payload: CustomerTokenPayload = {
        sub: customer.id,
        email: customer.email,
        storeId,
        type: 'customer',
      };

      const accessToken = request.server.jwt.sign(payload, {
        expiresIn: '7d', // Longer expiry for customers
      });

      return reply.status(201).send({
        success: true,
        data: {
          customer: {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
          },
          accessToken,
        },
      });
    }
  );

  // Customer login
  app.post(
    '/:storeId/auth/login',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Body: z.infer<typeof loginSchema>;
      }>,
      reply
    ) => {
      const { storeId } = request.params;
      const body = loginSchema.parse(request.body);

      // Find customer
      const customer = await prisma.customer.findUnique({
        where: {
          storeId_email: {
            storeId,
            email: body.email,
          },
        },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!customer || !customer.passwordHash) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Verify password
      const isValid = await verifyPassword(body.password, customer.passwordHash);

      if (!isValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate access token
      const payload: CustomerTokenPayload = {
        sub: customer.id,
        email: customer.email,
        storeId,
        type: 'customer',
      };

      const accessToken = request.server.jwt.sign(payload, {
        expiresIn: '7d',
      });

      return reply.send({
        success: true,
        data: {
          customer: {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
          },
          accessToken,
        },
      });
    }
  );

  // Get customer profile (protected)
  app.get(
    '/:storeId/account/profile',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
      }>,
      reply
    ) => {
      const { storeId } = request.params;

      // Verify token
      let payload: CustomerTokenPayload;
      try {
        await request.jwtVerify();
        payload = request.user as CustomerTokenPayload;
      } catch {
        throw new UnauthorizedError('Invalid or expired token');
      }

      // Verify this is a customer token for this store
      if (payload.type !== 'customer' || payload.storeId !== storeId) {
        throw new UnauthorizedError('Invalid token for this store');
      }

      const customer = await prisma.customer.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          totalOrders: true,
          totalSpent: true,
          createdAt: true,
        },
      });

      if (!customer) {
        throw new NotFoundError('Customer not found');
      }

      return reply.send({
        success: true,
        data: customer,
      });
    }
  );

  // Get customer orders (protected)
  app.get(
    '/:storeId/account/orders',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
      }>,
      reply
    ) => {
      const { storeId } = request.params;

      // Verify token
      let payload: CustomerTokenPayload;
      try {
        await request.jwtVerify();
        payload = request.user as CustomerTokenPayload;
      } catch {
        throw new UnauthorizedError('Invalid or expired token');
      }

      // Verify this is a customer token for this store
      if (payload.type !== 'customer' || payload.storeId !== storeId) {
        throw new UnauthorizedError('Invalid token for this store');
      }

      const orders = await prisma.order.findMany({
        where: {
          storeId,
          customerId: payload.sub,
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          subtotal: true,
          shippingTotal: true,
          taxTotal: true,
          discountTotal: true,
          total: true,
          placedAt: true,
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
              price: true,
              total: true,
            },
          },
        },
        orderBy: { placedAt: 'desc' },
      });

      return reply.send({
        success: true,
        data: orders,
      });
    }
  );
}

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';

import { env } from './config/env';
import { logger } from './lib/logger';
import { errorHandler } from './lib/error-handler';

// Routes
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { organizationRoutes } from './routes/organizations';
import { storeRoutes } from './routes/stores';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { subscriptionRoutes } from './routes/subscriptions';
import { healthRoutes } from './routes/health';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: logger,
    trustProxy: true,
  });

  // Register plugins
  await app.register(cors, {
    origin: env.CORS_ORIGINS,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    },
  });

  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(userRoutes, { prefix: '/api/v1/users' });
  await app.register(organizationRoutes, { prefix: '/api/v1/organizations' });
  await app.register(storeRoutes, { prefix: '/api/v1/stores' });
  await app.register(productRoutes, { prefix: '/api/v1/stores/:storeId/products' });
  await app.register(orderRoutes, { prefix: '/api/v1/stores/:storeId/orders' });
  await app.register(subscriptionRoutes, { prefix: '/api/v1/subscriptions' });

  return app;
}

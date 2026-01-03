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
import { categoryRoutes } from './routes/categories';
import { orderRoutes } from './routes/orders';
import { customerRoutes } from './routes/customers';
import { couponRoutes } from './routes/coupons';
import { mediaRoutes } from './routes/media';
import { analyticsRoutes } from './routes/analytics';
import { paymentRoutes } from './routes/payments';
import { subscriptionRoutes } from './routes/subscriptions';
import { healthRoutes } from './routes/health';
import { blogRoutes } from './routes/blogs';
import { pageRoutes } from './routes/pages';
import { menuRoutes } from './routes/menus';
import { bannerRoutes } from './routes/banners';
import { themeRoutes } from './routes/themes';
import { themeManagementRoutes } from './routes/theme-management';

// Storefront routes (public)
import { storefrontProductRoutes } from './routes/storefront/products';
import { storefrontCategoryRoutes } from './routes/storefront/categories';
import { storefrontCheckoutRoutes } from './routes/storefront/checkout';
import { storefrontStoreRoutes } from './routes/storefront/store';
import { storefrontAuthRoutes } from './routes/storefront/auth';
import { storefrontMenuRoutes } from './routes/storefront/menus';
import { storefrontBannerRoutes } from './routes/storefront/banners';

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
  await app.register(categoryRoutes, { prefix: '/api/v1/stores/:storeId/categories' });
  await app.register(orderRoutes, { prefix: '/api/v1/stores/:storeId/orders' });
  await app.register(customerRoutes, { prefix: '/api/v1/stores/:storeId/customers' });
  await app.register(couponRoutes, { prefix: '/api/v1/stores/:storeId/coupons' });
  await app.register(mediaRoutes, { prefix: '/api/v1/stores/:storeId/media' });
  await app.register(analyticsRoutes, { prefix: '/api/v1/stores/:storeId/analytics' });
  await app.register(paymentRoutes, { prefix: '/api/v1/stores/:storeId/payments' });
  await app.register(subscriptionRoutes, { prefix: '/api/v1/subscriptions' });
  await app.register(blogRoutes, { prefix: '/api/v1/stores/:storeId/blogs' });
  await app.register(pageRoutes, { prefix: '/api/v1/stores/:storeId/pages' });
  await app.register(menuRoutes, { prefix: '/api/v1/stores/:storeId/menus' });
  await app.register(bannerRoutes, { prefix: '/api/v1/stores/:storeId/banners' });
  await app.register(themeRoutes, { prefix: '/api/v1/themes' });
  await app.register(themeManagementRoutes, { prefix: '/api/v1/themes/manage' });

  // Public storefront routes (no auth required)
  await app.register(storefrontStoreRoutes, { prefix: '/api/v1/storefront' });
  await app.register(storefrontProductRoutes, { prefix: '/api/v1/storefront/:storeId/products' });
  await app.register(storefrontCategoryRoutes, { prefix: '/api/v1/storefront/:storeId/categories' });
  await app.register(storefrontCheckoutRoutes, { prefix: '/api/v1/storefront/:storeId/checkout' });
  await app.register(storefrontAuthRoutes, { prefix: '/api/v1/storefront' });
  await app.register(storefrontMenuRoutes, { prefix: '/api/v1/storefront' });
  await app.register(storefrontBannerRoutes, { prefix: '/api/v1/storefront' });

  return app;
}

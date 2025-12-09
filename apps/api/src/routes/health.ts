import { FastifyInstance } from 'fastify';
import { prisma } from '@rendrix/database';
import { redis } from '../lib/redis';

export async function healthRoutes(app: FastifyInstance) {
  // Basic health check
  app.get('/', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  // Detailed health check with dependencies
  app.get('/ready', async () => {
    const checks: Record<string, { status: string; latency?: number }> = {};

    // Check database
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      checks.database = {
        status: 'healthy',
        latency: Date.now() - dbStart,
      };
    } catch (error) {
      checks.database = { status: 'unhealthy' };
    }

    // Check Redis
    try {
      const redisStart = Date.now();
      await redis.ping();
      checks.redis = {
        status: 'healthy',
        latency: Date.now() - redisStart,
      };
    } catch (error) {
      checks.redis = { status: 'unhealthy' };
    }

    const isHealthy = Object.values(checks).every((c) => c.status === 'healthy');

    return {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    };
  });
}

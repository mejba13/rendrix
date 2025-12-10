import 'dotenv/config';
import { buildApp } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';
import { startEmailWorker, stopEmailWorker } from './jobs/email';

async function start() {
  try {
    const app = await buildApp();

    // Start background workers
    startEmailWorker();

    await app.listen({
      host: env.HOST,
      port: env.PORT,
    });

    logger.info(`Server running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await stopEmailWorker();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await stopEmailWorker();
  process.exit(0);
});

start();

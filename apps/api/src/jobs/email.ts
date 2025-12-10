import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../lib/logger';
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTeamInviteEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendSubscriptionReceiptEmail,
  isEmailConfigured,
} from '../lib/email';

// Email job types
export type EmailJobType =
  | 'welcome'
  | 'verification'
  | 'password-reset'
  | 'team-invite'
  | 'order-confirmation'
  | 'order-shipped'
  | 'subscription-receipt';

export interface EmailJobData {
  type: EmailJobType;
  to: string;
  data: Record<string, any>;
}

// Create email queue
export const emailQueue = new Queue<EmailJobData>('email', {
  connection: {
    url: env.REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 1000, // Keep last 1000 failed jobs
  },
});

// Email worker
async function processEmailJob(job: Job<EmailJobData>) {
  const { type, to, data } = job.data;

  logger.info({ jobId: job.id, type, to }, 'Processing email job');

  if (!isEmailConfigured()) {
    logger.warn({ jobId: job.id }, 'Email not configured, skipping job');
    return { success: false, reason: 'Email not configured' };
  }

  let result;

  switch (type) {
    case 'welcome':
      result = await sendWelcomeEmail(to, data as any);
      break;

    case 'verification':
      result = await sendVerificationEmail(to, data as any);
      break;

    case 'password-reset':
      result = await sendPasswordResetEmail(to, data as any);
      break;

    case 'team-invite':
      result = await sendTeamInviteEmail(to, data as any);
      break;

    case 'order-confirmation':
      result = await sendOrderConfirmationEmail(to, data as any);
      break;

    case 'order-shipped':
      result = await sendOrderShippedEmail(to, data as any);
      break;

    case 'subscription-receipt':
      result = await sendSubscriptionReceiptEmail(to, data as any);
      break;

    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  if (!result.success) {
    throw new Error(result.error || 'Failed to send email');
  }

  return result;
}

// Create worker
let emailWorker: Worker<EmailJobData> | null = null;

export function startEmailWorker() {
  if (emailWorker) {
    return;
  }

  emailWorker = new Worker<EmailJobData>('email', processEmailJob, {
    connection: {
      url: env.REDIS_URL,
    },
    concurrency: 5,
  });

  emailWorker.on('completed', (job) => {
    logger.info({ jobId: job.id, type: job.data.type }, 'Email job completed');
  });

  emailWorker.on('failed', (job, error) => {
    logger.error(
      { jobId: job?.id, type: job?.data.type, error: error.message },
      'Email job failed'
    );
  });

  logger.info('Email worker started');
}

export async function stopEmailWorker() {
  if (emailWorker) {
    await emailWorker.close();
    emailWorker = null;
    logger.info('Email worker stopped');
  }
}

// Helper functions to enqueue emails
export async function queueWelcomeEmail(
  to: string,
  data: { firstName: string; loginUrl?: string }
) {
  return emailQueue.add('welcome', { type: 'welcome', to, data });
}

export async function queueVerificationEmail(
  to: string,
  data: { firstName: string; verificationUrl: string }
) {
  return emailQueue.add('verification', { type: 'verification', to, data });
}

export async function queuePasswordResetEmail(
  to: string,
  data: { firstName?: string; resetUrl: string }
) {
  return emailQueue.add('password-reset', { type: 'password-reset', to, data });
}

export async function queueTeamInviteEmail(
  to: string,
  data: {
    inviterName: string;
    organizationName: string;
    role: string;
    inviteUrl: string;
  }
) {
  return emailQueue.add('team-invite', { type: 'team-invite', to, data });
}

export async function queueOrderConfirmationEmail(
  to: string,
  data: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: string;
    orderUrl: string;
    storeName: string;
  }
) {
  return emailQueue.add('order-confirmation', {
    type: 'order-confirmation',
    to,
    data,
  });
}

export async function queueOrderShippedEmail(
  to: string,
  data: {
    orderNumber: string;
    customerName: string;
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    orderUrl: string;
    storeName: string;
  }
) {
  return emailQueue.add('order-shipped', { type: 'order-shipped', to, data });
}

export async function queueSubscriptionReceiptEmail(
  to: string,
  data: {
    customerName: string;
    planName: string;
    amount: number;
    billingPeriod: string;
    nextBillingDate: string;
    invoiceUrl?: string;
  }
) {
  return emailQueue.add('subscription-receipt', {
    type: 'subscription-receipt',
    to,
    data,
  });
}

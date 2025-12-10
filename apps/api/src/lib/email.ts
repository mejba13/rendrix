import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from './logger';

// Initialize Resend client
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export function isEmailConfigured(): boolean {
  return resend !== null;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!resend) {
    logger.warn('Email not configured, skipping send');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: options.from || env.EMAIL_FROM,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      tags: options.tags,
    });

    if (result.error) {
      logger.error({ error: result.error }, 'Failed to send email');
      return { success: false, error: result.error.message };
    }

    logger.info({ messageId: result.data?.id, to: options.to }, 'Email sent successfully');
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    logger.error({ error }, 'Failed to send email');
    return { success: false, error: 'Failed to send email' };
  }
}

// Email template helpers
export interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined;
}

function replaceTemplateVariables(template: string, data: EmailTemplateData): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] || ''));
}

// Base template wrapper
function wrapInBaseTemplate(content: string, previewText?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${previewText ? `<meta name="description" content="${previewText}">` : ''}
  <title>Rendrix</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 24px; font-weight: bold; color: #111; text-decoration: none; }
    .content { background: #fff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 32px; }
    .button { display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0; }
    .button:hover { background: #333; }
    .footer { text-align: center; margin-top: 32px; color: #6b7280; font-size: 14px; }
    .muted { color: #6b7280; }
    h1 { margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111; }
    p { margin: 0 0 16px 0; color: #374151; }
    .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
  </style>
</head>
<body style="background: #f9fafb;">
  <div class="container">
    <div class="header">
      <a href="${env.APP_URL}" class="logo">Rendrix</a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Rendrix. All rights reserved.</p>
      <p class="muted">You received this email because you have an account with Rendrix.</p>
    </div>
  </div>
</body>
</html>
`;
}

// Welcome email
export async function sendWelcomeEmail(
  to: string,
  data: { firstName: string; loginUrl?: string }
): Promise<SendEmailResult> {
  const content = `
    <h1>Welcome to Rendrix!</h1>
    <p>Hi ${data.firstName},</p>
    <p>Thank you for joining Rendrix! We're excited to have you on board.</p>
    <p>With Rendrix, you can create and manage multiple ecommerce stores from a single dashboard. Get started by creating your first store.</p>
    <a href="${data.loginUrl || env.APP_URL}" class="button">Get Started</a>
    <p class="muted">If you have any questions, feel free to reply to this email.</p>
  `;

  return sendEmail({
    to,
    subject: 'Welcome to Rendrix!',
    html: wrapInBaseTemplate(content, 'Welcome to Rendrix - your multi-store ecommerce platform'),
  });
}

// Email verification
export async function sendVerificationEmail(
  to: string,
  data: { firstName: string; verificationUrl: string }
): Promise<SendEmailResult> {
  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi ${data.firstName},</p>
    <p>Please verify your email address by clicking the button below:</p>
    <a href="${data.verificationUrl}" class="button">Verify Email</a>
    <p class="muted">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    <div class="divider"></div>
    <p class="muted" style="font-size: 12px;">Or copy and paste this URL into your browser:<br>${data.verificationUrl}</p>
  `;

  return sendEmail({
    to,
    subject: 'Verify your email address',
    html: wrapInBaseTemplate(content, 'Please verify your email address'),
  });
}

// Password reset
export async function sendPasswordResetEmail(
  to: string,
  data: { firstName?: string; resetUrl: string }
): Promise<SendEmailResult> {
  const content = `
    <h1>Reset Your Password</h1>
    ${data.firstName ? `<p>Hi ${data.firstName},</p>` : ''}
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <a href="${data.resetUrl}" class="button">Reset Password</a>
    <p class="muted">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    <div class="divider"></div>
    <p class="muted" style="font-size: 12px;">Or copy and paste this URL into your browser:<br>${data.resetUrl}</p>
  `;

  return sendEmail({
    to,
    subject: 'Reset your password',
    html: wrapInBaseTemplate(content, 'Reset your Rendrix password'),
  });
}

// Team invitation
export async function sendTeamInviteEmail(
  to: string,
  data: {
    inviterName: string;
    organizationName: string;
    role: string;
    inviteUrl: string;
  }
): Promise<SendEmailResult> {
  const content = `
    <h1>You're Invited!</h1>
    <p>${data.inviterName} has invited you to join <strong>${data.organizationName}</strong> on Rendrix as a <strong>${data.role}</strong>.</p>
    <a href="${data.inviteUrl}" class="button">Accept Invitation</a>
    <p class="muted">This invitation will expire in 7 days.</p>
  `;

  return sendEmail({
    to,
    subject: `Join ${data.organizationName} on Rendrix`,
    html: wrapInBaseTemplate(content, `${data.inviterName} invited you to join ${data.organizationName}`),
  });
}

// Order confirmation
export async function sendOrderConfirmationEmail(
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
): Promise<SendEmailResult> {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const content = `
    <h1>Order Confirmed!</h1>
    <p>Hi ${data.customerName},</p>
    <p>Thank you for your order from ${data.storeName}! We've received your order and it's being processed.</p>

    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-weight: 500;">Order #${data.orderNumber}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; text-align: left;">Item</th>
          <th style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; text-align: center;">Qty</th>
          <th style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="margin-top: 16px; text-align: right;">
      <p style="margin: 4px 0;"><span class="muted">Subtotal:</span> $${data.subtotal.toFixed(2)}</p>
      <p style="margin: 4px 0;"><span class="muted">Shipping:</span> $${data.shipping.toFixed(2)}</p>
      <p style="margin: 4px 0;"><span class="muted">Tax:</span> $${data.tax.toFixed(2)}</p>
      <p style="margin: 4px 0; font-weight: 600; font-size: 18px;">Total: $${data.total.toFixed(2)}</p>
    </div>

    <div class="divider"></div>

    <p style="font-weight: 500;">Shipping Address</p>
    <p class="muted">${data.shippingAddress.replace(/\n/g, '<br>')}</p>

    <a href="${data.orderUrl}" class="button">View Order</a>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmed - #${data.orderNumber}`,
    html: wrapInBaseTemplate(content, `Your order #${data.orderNumber} has been confirmed`),
  });
}

// Order shipped
export async function sendOrderShippedEmail(
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
): Promise<SendEmailResult> {
  const content = `
    <h1>Your Order Has Shipped!</h1>
    <p>Hi ${data.customerName},</p>
    <p>Great news! Your order from ${data.storeName} is on its way.</p>

    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 500;">Order #${data.orderNumber}</p>
      ${data.carrier ? `<p style="margin: 0 0 4px 0;"><span class="muted">Carrier:</span> ${data.carrier}</p>` : ''}
      ${data.trackingNumber ? `<p style="margin: 0;"><span class="muted">Tracking:</span> ${data.trackingNumber}</p>` : ''}
    </div>

    ${
      data.trackingUrl
        ? `<a href="${data.trackingUrl}" class="button">Track Your Package</a>`
        : `<a href="${data.orderUrl}" class="button">View Order</a>`
    }

    <p class="muted">You'll receive another email when your order is delivered.</p>
  `;

  return sendEmail({
    to,
    subject: `Your order has shipped - #${data.orderNumber}`,
    html: wrapInBaseTemplate(content, `Your order #${data.orderNumber} is on its way`),
  });
}

// Subscription receipt
export async function sendSubscriptionReceiptEmail(
  to: string,
  data: {
    customerName: string;
    planName: string;
    amount: number;
    billingPeriod: string;
    nextBillingDate: string;
    invoiceUrl?: string;
  }
): Promise<SendEmailResult> {
  const content = `
    <h1>Payment Receipt</h1>
    <p>Hi ${data.customerName},</p>
    <p>Thank you for your payment. Here's your receipt:</p>

    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0;"><span class="muted">Plan:</span> ${data.planName}</p>
      <p style="margin: 0 0 8px 0;"><span class="muted">Amount:</span> $${data.amount.toFixed(2)} / ${data.billingPeriod}</p>
      <p style="margin: 0;"><span class="muted">Next billing date:</span> ${data.nextBillingDate}</p>
    </div>

    ${data.invoiceUrl ? `<a href="${data.invoiceUrl}" class="button">View Invoice</a>` : ''}

    <p class="muted">If you have any questions about your subscription, please contact support.</p>
  `;

  return sendEmail({
    to,
    subject: `Payment Receipt - ${data.planName}`,
    html: wrapInBaseTemplate(content, `Your ${data.planName} subscription payment receipt`),
  });
}

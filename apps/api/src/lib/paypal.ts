import { env } from '../config/env';

// PayPal API Base URLs
const PAYPAL_API_BASE = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com',
};

const paypalApiBase = PAYPAL_API_BASE[env.PAYPAL_MODE || 'sandbox'];

// Access token cache
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get PayPal access token
 */
export async function getAccessToken(): Promise<string> {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal is not configured');
  }

  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry - 60000) {
    return accessToken;
  }

  const auth = Buffer.from(
    `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get PayPal access token: ${error}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return accessToken;
}

/**
 * Create a PayPal order
 */
export interface CreateOrderParams {
  amount: number;
  currency: string;
  orderId: string;
  orderNumber: string;
  returnUrl: string;
  cancelUrl: string;
  items?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export async function createPayPalOrder(
  params: CreateOrderParams
): Promise<PayPalOrder> {
  const token = await getAccessToken();

  const orderPayload: Record<string, unknown> = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: params.orderId,
        description: `Order #${params.orderNumber}`,
        custom_id: params.orderId,
        amount: {
          currency_code: params.currency,
          value: params.amount.toFixed(2),
          breakdown: params.items
            ? {
                item_total: {
                  currency_code: params.currency,
                  value: params.items
                    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
                    .toFixed(2),
                },
              }
            : undefined,
        },
        items: params.items?.map((item) => ({
          name: item.name.substring(0, 127), // PayPal limit
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: params.currency,
            value: item.unitPrice.toFixed(2),
          },
        })),
      },
    ],
    application_context: {
      brand_name: 'Rendrix Store',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
    },
  };

  const response = await fetch(`${paypalApiBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to create PayPal order: ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

/**
 * Capture a PayPal order (complete the payment)
 */
export interface CapturedPayment {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
  payer: {
    name: { given_name: string; surname: string };
    email_address: string;
    payer_id: string;
  };
}

export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<CapturedPayment> {
  const token = await getAccessToken();

  const response = await fetch(
    `${paypalApiBase}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to capture PayPal order: ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrder(
  paypalOrderId: string
): Promise<PayPalOrder & { status: string; purchase_units: unknown[] }> {
  const token = await getAccessToken();

  const response = await fetch(
    `${paypalApiBase}/v2/checkout/orders/${paypalOrderId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get PayPal order: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Refund a PayPal payment
 */
export interface RefundResult {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
}

export async function refundPayPalPayment(
  captureId: string,
  amount?: number,
  currency?: string
): Promise<RefundResult> {
  const token = await getAccessToken();

  const body: Record<string, unknown> = {};
  if (amount && currency) {
    body.amount = {
      value: amount.toFixed(2),
      currency_code: currency,
    };
  }

  const response = await fetch(
    `${paypalApiBase}/v2/payments/captures/${captureId}/refund`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refund PayPal payment: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  if (!env.PAYPAL_WEBHOOK_ID) {
    return false;
  }

  const token = await getAccessToken();

  const verifyPayload = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id: env.PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(body),
  };

  const response = await fetch(
    `${paypalApiBase}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(verifyPayload),
    }
  );

  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  return result.verification_status === 'SUCCESS';
}

/**
 * Check if PayPal is configured
 */
export function isPayPalConfigured(): boolean {
  return !!(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET);
}

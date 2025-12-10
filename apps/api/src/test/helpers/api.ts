import { app } from '../setup';
import type { FastifyInstance } from 'fastify';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

/**
 * Make an API request for testing
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body } = options;

  const response = await app.inject({
    method,
    url: path,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    payload: body,
  });

  let responseBody: T;
  try {
    responseBody = JSON.parse(response.body) as T;
  } catch {
    responseBody = response.body as T;
  }

  return {
    status: response.statusCode,
    body: responseBody,
    headers: response.headers as Record<string, string>,
  };
}

/**
 * API request shortcuts
 */
export const api = {
  get: <T = unknown>(path: string, headers?: Record<string, string>) =>
    apiRequest<T>(path, { method: 'GET', headers }),

  post: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(path, { method: 'POST', body, headers }),

  put: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(path, { method: 'PUT', body, headers }),

  patch: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) =>
    apiRequest<T>(path, { method: 'PATCH', body, headers }),

  delete: <T = unknown>(path: string, headers?: Record<string, string>) =>
    apiRequest<T>(path, { method: 'DELETE', headers }),
};

/**
 * Expect helper for common assertions
 */
export function expectSuccess<T extends { success: boolean }>(response: ApiResponse<T>) {
  if (!response.body.success) {
    throw new Error(
      `Expected success but got: ${JSON.stringify(response.body, null, 2)}`
    );
  }
}

export function expectError(
  response: ApiResponse<{ success: boolean; error?: { code: string } }>,
  expectedCode?: string
) {
  if (response.body.success) {
    throw new Error('Expected error but got success');
  }

  if (expectedCode && response.body.error?.code !== expectedCode) {
    throw new Error(
      `Expected error code ${expectedCode} but got ${response.body.error?.code}`
    );
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  token?: string;
  organizationId?: string;
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private organizationId: string | null = null;

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  setOrganizationId(orgId: string | null) {
    this.organizationId = orgId;

    if (typeof window !== 'undefined') {
      if (orgId) {
        localStorage.setItem('organizationId', orgId);
      } else {
        localStorage.removeItem('organizationId');
      }
    }
  }

  loadOrganizationId() {
    if (typeof window !== 'undefined') {
      this.organizationId = localStorage.getItem('organizationId');
    }
  }

  async fetch<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { token, organizationId, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {}),
    };

    // Add authorization header
    const authToken = token || this.accessToken;
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Add organization context
    const orgId = organizationId || this.organizationId;
    if (orgId) {
      headers['X-Organization-Id'] = orgId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token refresh
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request
          return this.fetch(endpoint, options);
        }
      }

      throw new ApiError(
        data.error?.message || 'An error occurred',
        data.error?.code || 'UNKNOWN_ERROR',
        response.status,
        data.error?.details
      );
    }

    return data;
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        // Redirect to login when refresh fails
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return false;
      }

      const data = await response.json();
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    } catch {
      this.clearTokens();
      // Redirect to login on error
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return false;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.fetch<{
      success: boolean;
      data: {
        user: { id: string; email: string; firstName: string | null; lastName: string | null };
        organizations: { id: string; name: string; slug: string; role: string }[];
        tokens: { accessToken: string; refreshToken: string };
      };
    }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);

    if (response.data.organizations.length > 0) {
      this.setOrganizationId(response.data.organizations[0].id);
    }

    return response.data;
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const response = await this.fetch<{
      success: boolean;
      data: {
        user: { id: string; email: string; firstName: string | null; lastName: string | null };
        organizations: { id: string; name: string; slug: string; role: string }[];
        tokens: { accessToken: string; refreshToken: string };
      };
    }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    this.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);

    // Set organization ID from auto-created organization
    if (response.data.organizations.length > 0) {
      this.setOrganizationId(response.data.organizations[0].id);
    }

    return response.data;
  }

  async logout() {
    try {
      await this.fetch('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } finally {
      this.clearTokens();
      this.setOrganizationId(null);
    }
  }

  async getMe() {
    return this.fetch<{
      success: boolean;
      data: {
        user: {
          id: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          avatarUrl: string | null;
        };
        organizations: { id: string; name: string; slug: string; role: string }[];
      };
    }>('/api/v1/auth/me');
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient();

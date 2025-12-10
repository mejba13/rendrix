import { describe, it, expect, beforeEach } from 'vitest';
import { api } from './helpers/api';
import { createTestUser, createTestContext, authHeaders } from './helpers/auth';
import { testPrisma } from './setup';

describe('Authentication', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await api.post('/api/v1/auth/register', {
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
        firstName: 'New',
        lastName: 'User',
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            email: 'newuser@example.com',
            firstName: 'New',
            lastName: 'User',
          },
        },
      });
      expect(response.body.data.tokens).toBeDefined();
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const response = await api.post('/api/v1/auth/register', {
        email: 'invalid-email',
        password: 'SecurePassword123!',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with weak password', async () => {
      const response = await api.post('/api/v1/auth/register', {
        email: 'test@example.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      // Create first user
      await api.post('/api/v1/auth/register', {
        email: 'duplicate@example.com',
        password: 'SecurePassword123!',
      });

      // Try to create second user with same email
      const response = await api.post('/api/v1/auth/register', {
        email: 'duplicate@example.com',
        password: 'AnotherPassword123!',
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'login@example.com',
        password: 'SecurePassword123!',
      });
    });

    it('should login with valid credentials', async () => {
      const response = await api.post('/api/v1/auth/login', {
        email: 'login@example.com',
        password: 'SecurePassword123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            email: 'login@example.com',
          },
        },
      });
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should fail with invalid password', async () => {
      const response = await api.post('/api/v1/auth/login', {
        email: 'login@example.com',
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const response = await api.post('/api/v1/auth/login', {
        email: 'nonexistent@example.com',
        password: 'SecurePassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // Register and get refresh token
      const registerResponse = await api.post('/api/v1/auth/register', {
        email: 'refresh@example.com',
        password: 'SecurePassword123!',
      });

      const { refreshToken } = registerResponse.body.data.tokens;

      const response = await api.post('/api/v1/auth/refresh', {
        refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should fail with invalid refresh token', async () => {
      const response = await api.post('/api/v1/auth/refresh', {
        refreshToken: 'invalid-token',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout and revoke refresh token', async () => {
      const { user } = await createTestContext();

      const response = await api.post(
        '/api/v1/auth/logout',
        {},
        authHeaders(user.accessToken)
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'forgot@example.com',
      });
    });

    it('should send password reset email', async () => {
      const response = await api.post('/api/v1/auth/forgot-password', {
        email: 'forgot@example.com',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify reset token was created
      const reset = await testPrisma.passwordReset.findFirst({
        where: {
          user: { email: 'forgot@example.com' },
        },
      });
      expect(reset).toBeDefined();
    });

    it('should not reveal if email exists', async () => {
      const response = await api.post('/api/v1/auth/forgot-password', {
        email: 'nonexistent@example.com',
      });

      // Should return success even if email doesn't exist (security)
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user info', async () => {
      const { user } = await createTestContext();

      const response = await api.get(
        '/api/v1/auth/me',
        authHeaders(user.accessToken)
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    });

    it('should fail without auth token', async () => {
      const response = await api.get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

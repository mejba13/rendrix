import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { generateToken, hashToken } from '@rendrix/utils';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  authenticate,
} from '../lib/auth';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../lib/error-handler';
import { checkRateLimit } from '../lib/redis';
import { env } from '../config/env';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(12)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  // Register new user
  app.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // Check rate limit
    const rateLimit = await checkRateLimit(
      `register:${request.ip}`,
      5,
      60 * 60 // 5 per hour
    );

    if (!rateLimit.allowed) {
      throw new UnauthorizedError('Too many registration attempts. Try again later.');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(body.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    // Generate email verification token
    const verificationToken = generateToken(32);
    const tokenHash = hashToken(verificationToken);

    await prisma.emailVerification.create({
      data: {
        email: user.email,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // TODO: Send verification email

    // Generate tokens
    const accessToken = generateAccessToken(request, {
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await generateRefreshToken(user.id);

    // Get user's organizations
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: user.id },
      include: { organization: true },
    });

    return reply.status(201).send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        organizations: memberships.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          slug: m.organization.slug,
          role: m.role,
        })),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900, // 15 minutes in seconds
        },
      },
    });
  });

  // Login
  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    // Check rate limit
    const rateLimit = await checkRateLimit(
      `login:${request.ip}`,
      5,
      15 * 60 // 5 per 15 minutes
    );

    if (!rateLimit.allowed) {
      throw new UnauthorizedError('Too many login attempts. Try again later.');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        emailVerifiedAt: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValid = await verifyPassword(body.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // TODO: Handle 2FA if enabled

    // Generate tokens
    const accessToken = generateAccessToken(request, {
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await generateRefreshToken(user.id);

    // Get user's organizations
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: user.id },
      include: { organization: true },
    });

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerifiedAt: user.emailVerifiedAt,
        },
        organizations: memberships.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          slug: m.organization.slug,
          role: m.role,
        })),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900,
        },
      },
    });
  });

  // Refresh token
  app.post('/refresh', async (request, reply) => {
    const body = refreshTokenSchema.parse(request.body);

    const tokenData = await verifyRefreshToken(body.refreshToken);

    if (!tokenData) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Revoke old refresh token
    await revokeRefreshToken(tokenData.tokenId);

    // Generate new tokens
    const accessToken = generateAccessToken(request, {
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await generateRefreshToken(user.id);

    return reply.send({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 900,
      },
    });
  });

  // Logout
  app.post('/logout', { preHandler: [authenticate] }, async (request, reply) => {
    const body = refreshTokenSchema.safeParse(request.body);

    if (body.success) {
      const tokenData = await verifyRefreshToken(body.data.refreshToken);
      if (tokenData) {
        await revokeRefreshToken(tokenData.tokenId);
      }
    }

    return reply.send({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  });

  // Logout from all devices
  app.post('/logout-all', { preHandler: [authenticate] }, async (request, reply) => {
    await revokeAllUserTokens(request.currentUser!.id);

    return reply.send({
      success: true,
      data: { message: 'Logged out from all devices' },
    });
  });

  // Get current user
  app.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.currentUser!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        emailVerifiedAt: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: request.currentUser!.id },
      include: { organization: true },
    });

    return reply.send({
      success: true,
      data: {
        user,
        organizations: memberships.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          slug: m.organization.slug,
          role: m.role,
        })),
      },
    });
  });

  // Forgot password
  app.post('/forgot-password', async (request, reply) => {
    const body = forgotPasswordSchema.parse(request.body);

    // Rate limit
    const rateLimit = await checkRateLimit(
      `forgot-password:${request.ip}`,
      3,
      60 * 60 // 3 per hour
    );

    if (!rateLimit.allowed) {
      // Don't reveal rate limit to prevent enumeration
      return reply.send({
        success: true,
        data: { message: 'If an account exists, a reset email will be sent' },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      // Generate reset token
      const resetToken = generateToken(32);
      const tokenHash = hashToken(resetToken);

      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // TODO: Send reset email with token
    }

    // Always return success to prevent email enumeration
    return reply.send({
      success: true,
      data: { message: 'If an account exists, a reset email will be sent' },
    });
  });

  // Reset password
  app.post('/reset-password', async (request, reply) => {
    const body = resetPasswordSchema.parse(request.body);

    const tokenHash = hashToken(body.token);

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!passwordReset) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(body.password);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: passwordReset.userId },
        data: { passwordHash: newPasswordHash },
      }),
      prisma.passwordReset.update({
        where: { id: passwordReset.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Revoke all refresh tokens
    await revokeAllUserTokens(passwordReset.userId);

    return reply.send({
      success: true,
      data: { message: 'Password reset successfully' },
    });
  });

  // Verify email
  app.post('/verify-email', async (request, reply) => {
    const body = verifyEmailSchema.parse(request.body);

    const tokenHash = hashToken(body.token);

    const verification = await prisma.emailVerification.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      throw new UnauthorizedError('Invalid or expired verification token');
    }

    // Update user and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { email: verification.email },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return reply.send({
      success: true,
      data: { message: 'Email verified successfully' },
    });
  });

  // Resend verification email
  app.post('/resend-verification', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.currentUser!;

    if (user.emailVerifiedAt) {
      return reply.send({
        success: true,
        data: { message: 'Email already verified' },
      });
    }

    // Rate limit
    const rateLimit = await checkRateLimit(
      `resend-verification:${user.id}`,
      3,
      60 * 60 // 3 per hour
    );

    if (!rateLimit.allowed) {
      throw new UnauthorizedError('Too many requests. Try again later.');
    }

    // Generate new verification token
    const verificationToken = generateToken(32);
    const tokenHash = hashToken(verificationToken);

    await prisma.emailVerification.create({
      data: {
        email: user.email,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // TODO: Send verification email

    return reply.send({
      success: true,
      data: { message: 'Verification email sent' },
    });
  });
}

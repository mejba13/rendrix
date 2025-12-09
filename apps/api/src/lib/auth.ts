import { FastifyRequest, FastifyReply } from 'fastify';
import { hash, compare } from 'bcryptjs';
import { prisma } from '@rendrix/database';
import { generateToken, hashToken } from '@rendrix/utils';
import { env } from '../config/env';
import { UnauthorizedError, ForbiddenError } from './error-handler';
import type { MemberRole, Permission, ROLE_PERMISSIONS } from '@rendrix/types';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Token generation
export interface TokenPayload {
  sub: string; // User ID
  email: string;
  orgId?: string;
  role?: MemberRole;
}

export function generateAccessToken(
  request: FastifyRequest,
  payload: TokenPayload
): string {
  return request.server.jwt.sign(payload, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = generateToken(48);
  const tokenHash = hashToken(token);

  // Parse expiry duration
  const expiryMatch = env.JWT_REFRESH_EXPIRY.match(/(\d+)([dhms])/);
  let expiryMs = 7 * 24 * 60 * 60 * 1000; // Default 7 days

  if (expiryMatch) {
    const value = parseInt(expiryMatch[1]);
    const unit = expiryMatch[2];
    switch (unit) {
      case 'd':
        expiryMs = value * 24 * 60 * 60 * 1000;
        break;
      case 'h':
        expiryMs = value * 60 * 60 * 1000;
        break;
      case 'm':
        expiryMs = value * 60 * 1000;
        break;
      case 's':
        expiryMs = value * 1000;
        break;
    }
  }

  const expiresAt = new Date(Date.now() + expiryMs);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return token;
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string; tokenId: string } | null> {
  const tokenHash = hashToken(token);

  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!storedToken) {
    return null;
  }

  return {
    userId: storedToken.userId,
    tokenId: storedToken.id,
  };
}

export async function revokeRefreshToken(tokenId: string): Promise<void> {
  await prisma.refreshToken.update({
    where: { id: tokenId },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
}

// Authentication middleware
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  // Add user info to request
  const payload = request.user as TokenPayload;

  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  request.currentUser = user;
}

// Optional authentication middleware
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
    const payload = request.user as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerifiedAt: true,
      },
    });

    if (user) {
      request.currentUser = user;
    }
  } catch {
    // Ignore errors - authentication is optional
  }
}

// Organization context middleware
export async function requireOrganization(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const orgId = request.headers['x-organization-id'] as string;

  if (!orgId) {
    throw new ForbiddenError('Organization context required');
  }

  // Verify user is a member of the organization
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: request.currentUser!.id,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!membership) {
    throw new ForbiddenError('Not a member of this organization');
  }

  request.currentOrganization = membership.organization;
  request.currentMembership = membership;
}

// Store context middleware
export async function requireStore(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const storeId = (request.params as { storeId?: string }).storeId;

  if (!storeId) {
    throw new ForbiddenError('Store context required');
  }

  // Verify store belongs to current organization
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      organizationId: request.currentOrganization!.id,
    },
  });

  if (!store) {
    throw new ForbiddenError('Store not found or not accessible');
  }

  request.currentStore = store;
}

// Permission check middleware factory
export function requirePermission(permission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const membership = request.currentMembership;

    if (!membership) {
      throw new ForbiddenError('Organization context required');
    }

    // Owner and admin have all permissions
    if (membership.role === 'owner' || membership.role === 'admin') {
      return;
    }

    // Check if the user's role has the required permission
    const rolePermissions = getRolePermissions(membership.role as MemberRole);
    const hasPermission = rolePermissions.includes(permission);

    // Also check custom permissions
    const customPermissions = membership.permissions as string[];
    const hasCustomPermission = customPermissions.includes(permission);

    if (!hasPermission && !hasCustomPermission) {
      throw new ForbiddenError('Insufficient permissions');
    }
  };
}

function getRolePermissions(role: MemberRole): Permission[] {
  const PERMISSIONS = {
    owner: ['*'] as Permission[],
    admin: ['*'] as Permission[],
    manager: [
      'organization:read',
      'stores:read',
      'stores:update',
      'products:create',
      'products:read',
      'products:update',
      'products:delete',
      'orders:read',
      'orders:update',
      'orders:fulfill',
      'customers:read',
      'customers:update',
      'analytics:read',
    ] as Permission[],
    staff: [
      'stores:read',
      'products:read',
      'products:update',
      'orders:read',
      'orders:update',
      'customers:read',
    ] as Permission[],
    viewer: [
      'stores:read',
      'products:read',
      'orders:read',
      'customers:read',
      'analytics:read',
    ] as Permission[],
  };

  return PERMISSIONS[role] || [];
}

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      emailVerifiedAt: Date | null;
    };
    currentOrganization?: {
      id: string;
      name: string;
      slug: string;
      ownerId: string;
    };
    currentMembership?: {
      id: string;
      role: string;
      permissions: unknown;
    };
    currentStore?: {
      id: string;
      name: string;
      slug: string;
      organizationId: string;
    };
  }
}

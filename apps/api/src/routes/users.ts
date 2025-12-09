import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { authenticate, hashPassword, verifyPassword } from '../lib/auth';
import { UnauthorizedError, ValidationError } from '../lib/error-handler';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(12)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export async function userRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('preHandler', authenticate);

  // Update profile
  app.patch('/profile', async (request, reply) => {
    const body = updateProfileSchema.parse(request.body);

    const user = await prisma.user.update({
      where: { id: request.currentUser!.id },
      data: body,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        emailVerifiedAt: true,
        updatedAt: true,
      },
    });

    return reply.send({
      success: true,
      data: user,
    });
  });

  // Change password
  app.post('/change-password', async (request, reply) => {
    const body = changePasswordSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { id: request.currentUser!.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedError('Cannot change password for OAuth accounts');
    }

    // Verify current password
    const isValid = await verifyPassword(body.currentPassword, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Check new password is different
    const isSame = await verifyPassword(body.newPassword, user.passwordHash);

    if (isSame) {
      throw new ValidationError({
        newPassword: ['New password must be different from current password'],
      });
    }

    // Hash and update password
    const newPasswordHash = await hashPassword(body.newPassword);

    await prisma.user.update({
      where: { id: request.currentUser!.id },
      data: { passwordHash: newPasswordHash },
    });

    return reply.send({
      success: true,
      data: { message: 'Password changed successfully' },
    });
  });

  // Delete account
  app.delete('/account', async (request, reply) => {
    const userId = request.currentUser!.id;

    // Check if user owns any organizations
    const ownedOrgs = await prisma.organization.findMany({
      where: { ownerId: userId },
    });

    if (ownedOrgs.length > 0) {
      throw new ValidationError({
        account: ['Transfer or delete your organizations before deleting your account'],
      });
    }

    // Delete user (cascade will handle memberships, tokens, etc.)
    await prisma.user.delete({
      where: { id: userId },
    });

    return reply.send({
      success: true,
      data: { message: 'Account deleted successfully' },
    });
  });
}

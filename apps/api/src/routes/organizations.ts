import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { generateUniqueSlug, generateToken, hashToken } from '@rendrix/utils';
import { authenticate, requireOrganization, requirePermission } from '../lib/auth';
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  ValidationError,
} from '../lib/error-handler';

const createOrganizationSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  settings: z.record(z.unknown()).optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email().toLowerCase(),
  role: z.enum(['admin', 'manager', 'staff', 'viewer']).default('staff'),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'staff', 'viewer']),
});

export async function organizationRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('preHandler', authenticate);

  // List user's organizations
  app.get('/', async (request, reply) => {
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: request.currentUser!.id },
      include: {
        organization: {
          include: {
            subscription: {
              include: { plan: true },
            },
            _count: {
              select: { stores: true, members: true },
            },
          },
        },
      },
    });

    const organizations = memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      role: m.role,
      plan: m.organization.subscription?.plan?.name || 'Free',
      storesCount: m.organization._count.stores,
      membersCount: m.organization._count.members,
      joinedAt: m.joinedAt,
    }));

    return reply.send({
      success: true,
      data: organizations,
    });
  });

  // Create organization
  app.post('/', async (request, reply) => {
    const body = createOrganizationSchema.parse(request.body);

    // Generate unique slug if not provided
    const slug =
      body.slug ||
      (await generateUniqueSlug(body.name, async (s) => {
        const exists = await prisma.organization.findUnique({ where: { slug: s } });
        return !!exists;
      }));

    // Check if slug is taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      throw new ConflictError('Organization slug already exists');
    }

    // Get free plan
    const freePlan = await prisma.plan.findUnique({
      where: { slug: 'free' },
    });

    if (!freePlan) {
      throw new Error('Free plan not found. Please run database seed.');
    }

    // Create organization with subscription
    const organization = await prisma.$transaction(async (tx) => {
      // Create subscription first
      const subscription = await tx.subscription.create({
        data: {
          planId: freePlan.id,
          organizationId: '', // Placeholder, will update
          status: 'active',
          billingInterval: 'monthly',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      // Create organization
      const org = await tx.organization.create({
        data: {
          name: body.name,
          slug,
          ownerId: request.currentUser!.id,
          subscriptionId: subscription.id,
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
          },
        },
      });

      // Update subscription with organization ID
      await tx.subscription.update({
        where: { id: subscription.id },
        data: { organizationId: org.id },
      });

      // Add user as owner
      await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: request.currentUser!.id,
          role: 'owner',
          permissions: [],
        },
      });

      return org;
    });

    return reply.status(201).send({
      success: true,
      data: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    });
  });

  // Get organization by ID
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Check membership
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: id,
          userId: request.currentUser!.id,
        },
      },
      include: {
        organization: {
          include: {
            subscription: {
              include: { plan: true },
            },
            _count: {
              select: { stores: true, members: true },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundError('Organization');
    }

    const org = membership.organization;

    return reply.send({
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        settings: org.settings,
        role: membership.role,
        subscription: org.subscription
          ? {
              plan: org.subscription.plan.name,
              status: org.subscription.status,
              currentPeriodEnd: org.subscription.currentPeriodEnd,
            }
          : null,
        stats: {
          stores: org._count.stores,
          members: org._count.members,
        },
        createdAt: org.createdAt,
      },
    });
  });

  // Update organization
  app.patch(
    '/:id',
    {
      preHandler: [
        async (req, rep) => {
          req.headers['x-organization-id'] = (req.params as { id: string }).id;
        },
        requireOrganization,
        requirePermission('organization:update'),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = updateOrganizationSchema.parse(request.body);

      const organization = await prisma.organization.update({
        where: { id },
        data: body,
        select: {
          id: true,
          name: true,
          slug: true,
          settings: true,
          updatedAt: true,
        },
      });

      return reply.send({
        success: true,
        data: organization,
      });
    }
  );

  // Delete organization
  app.delete(
    '/:id',
    {
      preHandler: [
        async (req, rep) => {
          req.headers['x-organization-id'] = (req.params as { id: string }).id;
        },
        requireOrganization,
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      // Only owner can delete
      if (request.currentOrganization!.ownerId !== request.currentUser!.id) {
        throw new ForbiddenError('Only the owner can delete the organization');
      }

      // Check if there are any stores
      const storesCount = await prisma.store.count({
        where: { organizationId: id },
      });

      if (storesCount > 0) {
        throw new ValidationError({
          organization: ['Delete all stores before deleting the organization'],
        });
      }

      await prisma.organization.delete({ where: { id } });

      return reply.send({
        success: true,
        data: { message: 'Organization deleted successfully' },
      });
    }
  );

  // List organization members
  app.get(
    '/:id/members',
    {
      preHandler: [
        async (req, rep) => {
          req.headers['x-organization-id'] = (req.params as { id: string }).id;
        },
        requireOrganization,
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const members = await prisma.organizationMember.findMany({
        where: { organizationId: id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { joinedAt: 'asc' },
      });

      return reply.send({
        success: true,
        data: members.map((m) => ({
          id: m.id,
          user: m.user,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
      });
    }
  );

  // Invite member
  app.post(
    '/:id/members/invite',
    {
      preHandler: [
        async (req, rep) => {
          req.headers['x-organization-id'] = (req.params as { id: string }).id;
        },
        requireOrganization,
        requirePermission('organization:members:manage'),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = inviteMemberSchema.parse(request.body);

      // Check if user is already a member
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existingUser) {
        const existingMember = await prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: id,
              userId: existingUser.id,
            },
          },
        });

        if (existingMember) {
          throw new ConflictError('User is already a member of this organization');
        }
      }

      // Check for existing pending invite
      const existingInvite = await prisma.organizationInvite.findFirst({
        where: {
          organizationId: id,
          email: body.email,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingInvite) {
        throw new ConflictError('An invite has already been sent to this email');
      }

      // Create invite
      const token = generateToken(32);
      const tokenHash = hashToken(token);

      const invite = await prisma.organizationInvite.create({
        data: {
          organizationId: id,
          email: body.email,
          role: body.role,
          tokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // TODO: Send invite email with token

      return reply.status(201).send({
        success: true,
        data: {
          id: invite.id,
          email: invite.email,
          role: invite.role,
          expiresAt: invite.expiresAt,
        },
      });
    }
  );

  // Update member role
  app.patch(
    '/:id/members/:userId',
    {
      preHandler: [
        async (req, rep) => {
          req.headers['x-organization-id'] = (req.params as { id: string }).id;
        },
        requireOrganization,
        requirePermission('organization:members:manage'),
      ],
    },
    async (request, reply) => {
      const { id, userId } = request.params as { id: string; userId: string };
      const body = updateMemberRoleSchema.parse(request.body);

      // Can't change owner's role
      if (request.currentOrganization!.ownerId === userId) {
        throw new ForbiddenError("Cannot change owner's role");
      }

      // Can't change your own role
      if (request.currentUser!.id === userId) {
        throw new ForbiddenError('Cannot change your own role');
      }

      const member = await prisma.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: id,
            userId,
          },
        },
        data: { role: body.role },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: {
          id: member.id,
          user: member.user,
          role: member.role,
        },
      });
    }
  );

  // Remove member
  app.delete(
    '/:id/members/:userId',
    {
      preHandler: [
        async (req, rep) => {
          req.headers['x-organization-id'] = (req.params as { id: string }).id;
        },
        requireOrganization,
        requirePermission('organization:members:manage'),
      ],
    },
    async (request, reply) => {
      const { id, userId } = request.params as { id: string; userId: string };

      // Can't remove owner
      if (request.currentOrganization!.ownerId === userId) {
        throw new ForbiddenError('Cannot remove the owner from the organization');
      }

      await prisma.organizationMember.delete({
        where: {
          organizationId_userId: {
            organizationId: id,
            userId,
          },
        },
      });

      return reply.send({
        success: true,
        data: { message: 'Member removed successfully' },
      });
    }
  );
}

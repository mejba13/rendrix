import { testPrisma } from '../setup';
import { hashPassword } from '../../lib/auth';
import { v4 as uuid } from 'uuid';

export interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TestOrganization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

export interface TestStore {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
}

// Create a test user
export async function createTestUser(
  overrides: Partial<TestUser> = {}
): Promise<TestUser & { accessToken: string }> {
  const id = overrides.id || uuid();
  const email = overrides.email || `test-${id}@example.com`;
  const password = overrides.password || 'TestPassword123!';
  const firstName = overrides.firstName || 'Test';
  const lastName = overrides.lastName || 'User';

  const passwordHash = await hashPassword(password);

  const user = await testPrisma.user.create({
    data: {
      id,
      email,
      passwordHash,
      firstName,
      lastName,
      emailVerifiedAt: new Date(),
    },
  });

  // Generate a mock access token
  const accessToken = `test_token_${user.id}`;

  return {
    id: user.id,
    email,
    password,
    firstName,
    lastName,
    accessToken,
  };
}

// Create a test organization
export async function createTestOrganization(
  ownerId: string,
  overrides: Partial<TestOrganization> = {}
): Promise<TestOrganization> {
  const id = overrides.id || uuid();
  const name = overrides.name || `Test Organization ${id.substring(0, 8)}`;
  const slug = overrides.slug || `test-org-${id.substring(0, 8)}`;

  const organization = await testPrisma.organization.create({
    data: {
      id,
      name,
      slug,
      ownerId,
    },
  });

  // Create membership for owner
  await testPrisma.organizationMember.create({
    data: {
      organizationId: organization.id,
      userId: ownerId,
      role: 'owner',
    },
  });

  // Create a free subscription
  const freePlan = await testPrisma.plan.upsert({
    where: { slug: 'free' },
    update: {},
    create: {
      name: 'Free',
      slug: 'free',
      description: 'Free plan for testing',
      priceMonthly: 0,
      priceYearly: 0,
      features: { basic: true },
      limits: { maxStores: 1, maxProducts: 100 },
    },
  });

  await testPrisma.subscription.create({
    data: {
      organizationId: organization.id,
      planId: freePlan.id,
      status: 'active',
    },
  });

  return {
    id: organization.id,
    name,
    slug,
    ownerId,
  };
}

// Create a test store
export async function createTestStore(
  organizationId: string,
  overrides: Partial<TestStore> = {}
): Promise<TestStore> {
  const id = overrides.id || uuid();
  const name = overrides.name || `Test Store ${id.substring(0, 8)}`;
  const slug = overrides.slug || `test-store-${id.substring(0, 8)}`;

  const store = await testPrisma.store.create({
    data: {
      id,
      name,
      slug,
      organizationId,
    },
  });

  return {
    id: store.id,
    name,
    slug,
    organizationId,
  };
}

// Create a complete test context (user + org + store)
export async function createTestContext() {
  const user = await createTestUser();
  const organization = await createTestOrganization(user.id);
  const store = await createTestStore(organization.id);

  return { user, organization, store };
}

// Generate auth headers
export function authHeaders(
  accessToken: string,
  organizationId?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (organizationId) {
    headers['X-Organization-Id'] = organizationId;
  }

  return headers;
}

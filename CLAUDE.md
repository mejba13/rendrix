# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rendrix is a multi-tenant SaaS platform for creating and managing multiple ecommerce stores. It uses a monorepo architecture with Turborepo.

## Commands

### Development
```bash
pnpm dev                    # Start all apps (web on :3000, api on :4000)
pnpm build                  # Build all apps and packages
pnpm lint                   # Lint all packages
pnpm type-check             # TypeScript type checking
pnpm clean                  # Clean all build outputs
```

### Testing
```bash
pnpm test                                       # Run all tests
pnpm --filter @rendrix/api test                 # Test API only
pnpm --filter @rendrix/api test src/test/auth.test.ts  # Run single test file
pnpm --filter @rendrix/api test:coverage        # Test with coverage
```

### Database (Prisma)
```bash
pnpm db:generate            # Generate Prisma client
pnpm db:push                # Push schema to database (development)
pnpm db:migrate             # Run migrations
pnpm db:seed                # Seed database with initial data
pnpm db:studio              # Open Prisma Studio GUI
```

### Running Individual Apps
```bash
pnpm --filter @rendrix/api dev      # API only
pnpm --filter @rendrix/web dev      # Web only
```

### Building Packages (required before apps when modifying shared code)
```bash
pnpm --filter @rendrix/database build   # Build database package
pnpm --filter @rendrix/types build      # Build types package
pnpm --filter @rendrix/utils build      # Build utils package
```

### Infrastructure
```bash
docker-compose up -d        # Start PostgreSQL, Redis, Meilisearch, MinIO, Mailhog
```

### Demo Credentials (after seeding)
- Admin: admin@rendrix.com / Admin@123456
- Demo: demo@rendrix.com / Demo@123456

## Architecture

### Monorepo Structure
- **apps/api**: Fastify REST API server (port 4000)
- **apps/web**: Next.js 14 dashboard with App Router (port 3000)
- **packages/database**: Prisma schema, client, and seed scripts
- **packages/types**: Shared TypeScript types for entities, auth, billing
- **packages/utils**: Shared validation schemas (Zod), formatters, helpers
- **packages/config**: ESLint and TypeScript configurations

### Multi-Tenant Data Model
The platform uses a shared database with tenant-scoped tables:
- **Platform-level** (shared): `users`, `organizations`, `subscriptions`, `plans`, `themes`
- **Tenant-scoped** (filtered by `organization_id`): `stores`, `products`, `orders`, `customers`, `coupons`

Each `Organization` is a tenant that can have multiple `Store` instances. Stores are isolated by `organization_id` and store content (products, orders, customers) is isolated by `store_id`.

### API Authentication
- JWT access tokens (15-minute expiry) with refresh token rotation
- Authenticated requests require: `Authorization: Bearer <token>`
- Organization-scoped requests require: `X-Organization-Id: <uuid>`
- Store-scoped routes are nested under `/api/v1/stores/:storeId/...`

### Key Technologies
- **Backend**: Fastify, Prisma (PostgreSQL), Redis (ioredis), BullMQ, Stripe
- **Frontend**: Next.js 14 App Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS
- **Validation**: Zod (shared between frontend and backend via @rendrix/utils)

### Route Organization (API)
Routes are in `apps/api/src/routes/`:
- `auth.ts` - Authentication (login, register, refresh, password reset)
- `organizations.ts` - Organization CRUD and member management
- `stores.ts` - Store CRUD and settings
- `products.ts` - Product catalog management
- `orders.ts` - Order processing and fulfillment
- `subscriptions.ts` - Stripe subscription management

### Frontend Pages (Web)
Uses Next.js App Router with route groups:
- `(auth)/` - Login and registration pages
- `(dashboard)/` - Protected dashboard pages with sidebar layout

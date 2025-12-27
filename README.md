# Rendrix - Master Your Commerce Universe

<p align="center">
  <<img width="2001" height="1440" alt="index" src="https://github.com/user-attachments/assets/d92275e8-024b-41ef-8fe6-cd1c2e530e32" />

</p>
<p align="center">
<img width="2024" height="1426" alt="dashboard" src="https://github.com/user-attachments/assets/036dbd47-a504-41c0-bfea-959bb83c5b81" />
</p>

<p align="center">
  <strong>A comprehensive multi-tenant SaaS platform for creating, managing, and scaling multiple ecommerce stores from a single unified dashboard.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

Rendrix empowers entrepreneurs and businesses to launch and manage multiple ecommerce stores across diverse verticals—Toys, Kitchen, Nail Care, Home Decor, Garments, Beauty, Sports, Gadgets, and Home Appliances—all from one powerful dashboard.

### Why Rendrix?

- **Multi-Store Management**: Run multiple stores with different brands and niches
- **Enterprise-Grade Security**: PCI-DSS compliant payment processing, GDPR ready
- **Scalable Architecture**: Built to handle 10,000+ concurrent tenants
- **Modern Tech Stack**: Next.js 14, Fastify, PostgreSQL, Redis
- **Flexible Pricing**: Free tier to Enterprise with usage-based scaling

---

## Features

### Core Platform
- ✅ Multi-tenant architecture with complete data isolation
- ✅ JWT-based authentication with refresh token rotation
- ✅ Role-based access control (Owner, Admin, Manager, Staff, Viewer)
- ✅ Organization & team management with invitations
- ✅ Subscription management with Stripe integration

### Store Management
- ✅ Instant store provisioning with industry templates
- ✅ Custom domain support with automatic SSL
- ✅ Theme marketplace with live customization
- ✅ SEO configuration per store
- ✅ Store cloning for quick launches

### Commerce Features
- ✅ Product catalog with variants and attributes
- ✅ Category management with hierarchy
- ✅ Inventory tracking with low-stock alerts
- ✅ Order management with fulfillment workflows
- ✅ Customer database with purchase history
- ✅ Coupon system (percentage, fixed, BOGO, free shipping)

### Integrations
- ✅ Payment gateways (Stripe, PayPal ready)
- ✅ Email notifications
- 🔄 Social commerce (Meta, TikTok, Pinterest) - Coming Soon
- 🔄 Marketing automation - Coming Soon
- 🔄 Analytics dashboard - Coming Soon

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible UI components |
| TanStack Query | Server state management |
| Zustand | Client state management |
| React Hook Form | Form handling with Zod validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | JavaScript runtime |
| Fastify | High-performance web framework |
| Prisma | Type-safe ORM |
| PostgreSQL 16 | Primary database |
| Redis 7 | Caching & session storage |
| BullMQ | Background job processing |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Turborepo | Monorepo build system |
| pnpm | Fast package manager |
| GitHub Actions | CI/CD pipelines |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/rendrix.git
   cd rendrix
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL, Redis, Meilisearch, MinIO, and Mailhog.

4. **Set up environment variables**
   ```bash
   # API configuration
   cp apps/api/.env.example apps/api/.env

   # Web configuration
   cp apps/web/.env.example apps/web/.env
   ```

   Edit the `.env` files with your configuration. Generate secure secrets:
   ```bash
   # Generate JWT secrets
   openssl rand -base64 64
   ```

5. **Initialize the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # Seed with initial data (plans, themes, demo user)
   pnpm db:seed
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

7. **Access the applications**
   - Web Dashboard: http://localhost:3000
   - API Server: http://localhost:4000
   - API Health: http://localhost:4000/health
   - Mailhog UI: http://localhost:8025
   - MinIO Console: http://localhost:9001

### Demo Credentials

After seeding, you can login with:
- **Email**: demo@rendrix.com
- **Password**: demo123456

---

## Docker Setup

### Prerequisites

- Docker 24.0+
- Docker Compose 2.20+

### Quick Start (Development)

Run the entire stack with a single command:

```bash
# Start all services (apps + infrastructure)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Development Mode

Development mode includes hot reload for all applications:

```bash
# Build and start development containers
docker-compose up -d --build

# Start only infrastructure (run apps locally)
docker-compose up -d postgres redis meilisearch minio mailhog

# Rebuild after dependency changes
docker-compose up -d --build --force-recreate api web storefront
```

### Production Mode

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api=3 --scale web=2
```

### Service Ports

| Service | Development | Production |
|---------|-------------|------------|
| Web Dashboard | 3000 | 3000 |
| Customer Storefront | 3001 | 3001 |
| API Server | 4000 | 4000 |
| PostgreSQL | 5432 | - (internal) |
| Redis | 6379 | - (internal) |
| Meilisearch | 7700 | - (internal) |
| MinIO | 9000, 9001 | - |
| Mailhog | 1025, 8025 | - |

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables for production:
- `JWT_SECRET` - Secure JWT signing key (min 32 chars)
- `JWT_REFRESH_SECRET` - Secure refresh token key
- `DB_PASSWORD` - PostgreSQL password
- `REDIS_PASSWORD` - Redis password
- `MEILISEARCH_KEY` - Meilisearch master key

### Common Docker Commands

```bash
# View container logs
docker-compose logs -f api
docker-compose logs -f web

# Execute commands in container
docker-compose exec api sh
docker-compose exec postgres psql -U postgres -d rendrix

# Restart a specific service
docker-compose restart api

# View running containers
docker-compose ps

# Clean up (remove containers, networks, volumes)
docker-compose down -v

# Prune unused Docker resources
docker system prune -a
```

### Troubleshooting

**Port conflicts:**
```bash
# Check what's using a port
lsof -i :3000
# Kill the process or change the port in docker-compose.yml
```

**Container won't start:**
```bash
# Check logs for errors
docker-compose logs api

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Hot reload not working:**
```bash
# On macOS, ensure file events are propagating
# The WATCHPACK_POLLING=true env var is set for Next.js apps

# Restart the container
docker-compose restart web
```

**Database connection issues:**
```bash
# Ensure postgres is healthy
docker-compose ps postgres

# Check DATABASE_URL points to 'postgres' (container name), not 'localhost'
# Inside containers: postgresql://postgres:postgres@postgres:5432/rendrix
```

---

## Project Structure

```
rendrix/
├── apps/
│   ├── api/                    # Fastify REST API
│   │   ├── src/
│   │   │   ├── config/         # Environment configuration
│   │   │   ├── lib/            # Core utilities (auth, redis, errors)
│   │   │   ├── routes/         # API route handlers
│   │   │   ├── app.ts          # Fastify app setup
│   │   │   └── index.ts        # Entry point
│   │   └── package.json
│   │
│   ├── web/                    # Next.js dashboard
│   │   ├── src/
│   │   │   ├── app/            # App router pages
│   │   │   ├── components/     # React components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utilities (api client)
│   │   │   └── store/          # Zustand stores
│   │   └── package.json
│   │
│   └── storefront/             # Public storefront (planned)
│
├── packages/
│   ├── config/                 # Shared configurations
│   │   ├── eslint/             # ESLint configs
│   │   └── typescript/         # TypeScript configs
│   │
│   ├── database/               # Prisma schema & client
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Seed data
│   │   └── src/
│   │       ├── client.ts       # Prisma client singleton
│   │       └── utils.ts        # Database utilities
│   │
│   ├── types/                  # Shared TypeScript types
│   │   └── src/
│   │       ├── entities.ts     # Entity types
│   │       ├── auth.ts         # Auth types & permissions
│   │       ├── billing.ts      # Subscription types
│   │       └── ...
│   │
│   └── utils/                  # Shared utilities
│       └── src/
│           ├── validation.ts   # Zod schemas
│           ├── formatters.ts   # Currency, date formatters
│           ├── helpers.ts      # General utilities
│           └── constants.ts    # Shared constants
│
├── docker-compose.yml          # Development services
├── docker-compose.prod.yml     # Production services
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspaces
└── package.json                # Root package.json
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login with email/password |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout (revoke refresh token) |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |
| POST | `/api/v1/auth/verify-email` | Verify email address |

### Organization Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/organizations` | List user's organizations |
| POST | `/api/v1/organizations` | Create organization |
| GET | `/api/v1/organizations/:id` | Get organization details |
| PATCH | `/api/v1/organizations/:id` | Update organization |
| DELETE | `/api/v1/organizations/:id` | Delete organization |
| GET | `/api/v1/organizations/:id/members` | List members |
| POST | `/api/v1/organizations/:id/members/invite` | Invite member |
| DELETE | `/api/v1/organizations/:id/members/:userId` | Remove member |

### Store Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/stores` | List stores |
| POST | `/api/v1/stores` | Create store |
| GET | `/api/v1/stores/:storeId` | Get store details |
| PATCH | `/api/v1/stores/:storeId` | Update store |
| DELETE | `/api/v1/stores/:storeId` | Delete store |
| GET | `/api/v1/stores/:storeId/settings` | Get settings |
| PATCH | `/api/v1/stores/:storeId/settings` | Update settings |
| GET | `/api/v1/stores/:storeId/seo` | Get SEO settings |
| PATCH | `/api/v1/stores/:storeId/seo` | Update SEO settings |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/stores/:storeId/products` | List products |
| POST | `/api/v1/stores/:storeId/products` | Create product |
| GET | `/api/v1/stores/:storeId/products/:productId` | Get product |
| PATCH | `/api/v1/stores/:storeId/products/:productId` | Update product |
| DELETE | `/api/v1/stores/:storeId/products/:productId` | Delete product |
| POST | `/api/v1/stores/:storeId/products/bulk` | Bulk operations |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/stores/:storeId/orders` | List orders |
| POST | `/api/v1/stores/:storeId/orders` | Create manual order |
| GET | `/api/v1/stores/:storeId/orders/:orderId` | Get order |
| PATCH | `/api/v1/stores/:storeId/orders/:orderId` | Update order |
| POST | `/api/v1/stores/:storeId/orders/:orderId/fulfill` | Fulfill order |
| POST | `/api/v1/stores/:storeId/orders/:orderId/cancel` | Cancel order |

### Subscription Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/subscriptions/plans` | List available plans |
| GET | `/api/v1/subscriptions/current` | Get current subscription |
| POST | `/api/v1/subscriptions/checkout` | Create Stripe checkout |
| POST | `/api/v1/subscriptions/portal` | Get billing portal URL |
| DELETE | `/api/v1/subscriptions/current` | Cancel subscription |

### Request Headers

All authenticated requests require:
```
Authorization: Bearer <access_token>
X-Organization-Id: <organization_uuid>  # For organization-scoped requests
```

---

## Scripts

### Root Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps and packages
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript type checking
pnpm test             # Run all tests
pnpm clean            # Clean all build outputs

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations (development)
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Formatting
pnpm format           # Format all files with Prettier
```

### App-Specific Commands

```bash
# API
pnpm --filter @rendrix/api dev
pnpm --filter @rendrix/api build
pnpm --filter @rendrix/api test

# Web
pnpm --filter @rendrix/web dev
pnpm --filter @rendrix/web build
pnpm --filter @rendrix/web start
```

---

## Environment Variables

### API (`apps/api/.env`)

```env
# Required
DATABASE_URL="postgresql://user:pass@localhost:5432/rendrix"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-32-char-minimum-secret"
JWT_REFRESH_SECRET="your-32-char-minimum-refresh-secret"

# Optional
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
```

### Web (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Deployment

### Docker Production Build

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Vercel Deployment (Web)

1. Connect your repository to Vercel
2. Set the root directory to `apps/web`
3. Add environment variables
4. Deploy

### Railway/Render (API)

1. Connect your repository
2. Set the root directory to `apps/api`
3. Add environment variables
4. Set build command: `pnpm install && pnpm build`
5. Set start command: `pnpm start`

---

## Subscription Plans

| Feature | Free | Pro ($29/mo) | Premium ($79/mo) | Enterprise |
|---------|------|--------------|------------------|------------|
| Stores | 1 | 3 | 10 | Unlimited |
| Products | 50 | 500 | 5,000 | Unlimited |
| Team Members | 1 | 5 | 15 | Unlimited |
| Custom Domains | 0 | 3 | 10 | Unlimited |
| Bandwidth | 1 GB | 10 GB | 100 GB | Unlimited |
| Basic Themes | ✅ | ✅ | ✅ | ✅ |
| Premium Themes | ❌ | ✅ | ✅ | ✅ |
| SEO Tools | ❌ | ✅ | ✅ | ✅ |
| Marketing Suite | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| White Label | ❌ | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ | ✅ |
| Dedicated Support | ❌ | ❌ | ❌ | ✅ |

---

## Security

### Authentication
- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens (15-minute expiry)
- Refresh token rotation
- Rate limiting on auth endpoints
- Two-factor authentication support

### Data Protection
- Row-Level Security (RLS) for tenant isolation
- All data encrypted in transit (TLS 1.3)
- PCI-DSS compliant payment tokenization
- GDPR-ready data handling

### API Security
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Use conventional commits
- Update documentation

---

## Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo setup with Turborepo
- [x] Authentication system
- [x] Organization management
- [x] Store CRUD operations
- [x] Subscription billing

### Phase 2: Store Management
- [ ] Theme marketplace
- [ ] Custom domain management
- [ ] SEO configuration UI
- [ ] Store templates

### Phase 3: Commerce Core
- [ ] Product import/export
- [ ] Inventory management UI
- [ ] Order fulfillment UI
- [ ] Payment gateway UI

### Phase 4: Marketing & Growth
- [ ] Email marketing integration
- [ ] Social commerce connectors
- [ ] Analytics dashboard
- [ ] Promotional tools

### Phase 5: Enterprise
- [ ] White-label capabilities
- [ ] Public API
- [ ] Webhooks
- [ ] Advanced permissions

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- Documentation: [docs.rendrix.com](https://docs.rendrix.com)
- Issues: [GitHub Issues](https://github.com/your-org/rendrix/issues)
- Email: support@rendrix.com

---

<p align="center">
  Built with ❤️ by the Rendrix Team
</p>

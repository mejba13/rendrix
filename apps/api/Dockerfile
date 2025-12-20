# syntax=docker/dockerfile:1

# ============================================
# API Dockerfile - Multi-stage build
# ============================================

# Base stage with Node.js and pnpm
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# ============================================
# Dependencies stage - install all deps
# ============================================
FROM base AS deps
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files for workspace resolution
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Builder stage - build the application
# ============================================
FROM base AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/utils/node_modules ./packages/utils/node_modules
COPY --from=deps /app/packages/config/node_modules ./packages/config/node_modules

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter @rendrix/database db:generate

# Build packages first, then the API
RUN pnpm turbo build --filter=@rendrix/api

# ============================================
# Production runner stage
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify
USER fastify

# Copy built application
COPY --from=builder --chown=fastify:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=fastify:nodejs /app/apps/api/package.json ./apps/api/

# Copy workspace packages (built)
COPY --from=builder --chown=fastify:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=fastify:nodejs /app/packages/database/package.json ./packages/database/
COPY --from=builder --chown=fastify:nodejs /app/packages/types/dist ./packages/types/dist
COPY --from=builder --chown=fastify:nodejs /app/packages/types/package.json ./packages/types/
COPY --from=builder --chown=fastify:nodejs /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder --chown=fastify:nodejs /app/packages/utils/package.json ./packages/utils/

# Copy Prisma schema and generated client
COPY --from=builder --chown=fastify:nodejs /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=fastify:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=fastify:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy workspace configuration
COPY --from=builder --chown=fastify:nodejs /app/package.json ./
COPY --from=builder --chown=fastify:nodejs /app/pnpm-workspace.yaml ./

# Install production dependencies only
COPY --from=deps /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["node", "dist/index.js"]

# ============================================
# Development stage - for local development
# ============================================
FROM base AS development
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy packages source code (needed for building)
COPY packages/database ./packages/database
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils
COPY packages/config ./packages/config

# Generate Prisma client with correct binary targets for Debian
# Remove any existing generated client to force fresh generation
RUN rm -rf node_modules/.prisma node_modules/@prisma/client/runtime/*.node 2>/dev/null || true
RUN cd packages/database && npx prisma generate
RUN pnpm turbo build --filter=@rendrix/database --filter=@rendrix/types --filter=@rendrix/utils

WORKDIR /app

EXPOSE 4000

CMD ["pnpm", "--filter", "@rendrix/api", "dev"]

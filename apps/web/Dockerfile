# syntax=docker/dockerfile:1

# ============================================
# Web Dashboard Dockerfile - Multi-stage build
# ============================================

# Base stage with Node.js and pnpm
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
RUN apk add --no-cache libc6-compat

# ============================================
# Dependencies stage - install all deps
# ============================================
FROM base AS deps
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files for workspace resolution
COPY apps/web/package.json ./apps/web/
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
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/utils/node_modules ./packages/utils/node_modules
COPY --from=deps /app/packages/config/node_modules ./packages/config/node_modules

# Copy source code
COPY . .

# Set environment for build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Build packages first, then the web app
RUN pnpm turbo build --filter=@rendrix/web

# ============================================
# Production runner stage
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

WORKDIR /app/apps/web

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# ============================================
# Development stage - for local development
# ============================================
FROM base AS development
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy config files needed for development (tsconfig, next.config, etc.)
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/next.config.js ./apps/web/
COPY apps/web/tailwind.config.ts ./apps/web/
COPY apps/web/postcss.config.js ./apps/web/
COPY packages/types/tsconfig.json ./packages/types/
COPY packages/utils/tsconfig.json ./packages/utils/
COPY packages/config/ ./packages/config/

# Copy package source files for building
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils

# Build shared packages before starting dev server
RUN pnpm turbo build --filter=@rendrix/types --filter=@rendrix/utils

WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "--filter", "@rendrix/web", "dev"]

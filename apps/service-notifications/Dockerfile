# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiamos archivos raíz del monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copiamos packages compartidos
COPY packages ./packages

# Copiamos el servicio
COPY apps/service-notifications ./apps/service-notifications

# Instalamos dependencias del workspace
RUN pnpm install --frozen-lockfile

# Build SOLO este servicio
RUN pnpm --filter service-notifications build


# ---------- PRODUCTION ----------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/service-notifications/package.json ./apps/service-notifications/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/service-notifications/dist ./apps/service-notifications/dist

WORKDIR /app/apps/service-notifications

EXPOSE 3000

CMD ["node", "dist/main.js"]

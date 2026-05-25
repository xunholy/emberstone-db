# syntax=docker/dockerfile:1.7

# ─── Stage 1: deps ────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

# ─── Stage 2: build (Astro Node SSR output) ──────────────────────────
# `output: 'server'` in astro.config.mjs + @astrojs/node adapter →
# emits dist/server (the Node entrypoint) + dist/client (hashed static
# assets to be served by the same Node server). The committed data
# dump JSON files are bundled at module-load time.
FROM deps AS build
COPY . .
RUN npm run build

# ─── Stage 3: runtime ────────────────────────────────────────────────
# Minimal Node runtime. Astro's standalone Node adapter ships a
# self-contained `server/entry.mjs`; we only need its dist/ + the
# installed node_modules.
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080

# Non-root user (node:22-alpine ships `node` UID 1000 by default).
RUN apk add --no-cache curl

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=8s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8080/db/healthz || exit 1

CMD ["node", "./dist/server/entry.mjs"]

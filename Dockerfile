# syntax=docker/dockerfile:1.7

# ─── Stage 1: deps ────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# `npm ci` if a lock is present; fall back to install so first-time
# builds without a committed lock still succeed.
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

# ─── Stage 2: data dump (optional, skipped if no DB creds) ────────────
# In production we set MANGOS_DBHOST etc. via build args so the dump
# script populates src/data/generated/ before the Astro build runs.
# When unset, the build falls back to the committed sample snapshot
# so CI / local builds without a live DB still produce a working site.
FROM deps AS dump
ARG MANGOS_DBHOST=""
ARG MANGOS_DBPORT="3306"
ARG MANGOS_DBUSER=""
ARG MANGOS_DBPASS=""
ARG MANGOS_WORLD_DBNAME="classicmangos"
ENV MANGOS_DBHOST=${MANGOS_DBHOST} \
    MANGOS_DBPORT=${MANGOS_DBPORT} \
    MANGOS_DBUSER=${MANGOS_DBUSER} \
    MANGOS_DBPASS=${MANGOS_DBPASS} \
    MANGOS_WORLD_DBNAME=${MANGOS_WORLD_DBNAME}
COPY . .
RUN if [ -n "$MANGOS_DBHOST" ] && [ -n "$MANGOS_DBUSER" ]; then \
      echo "[Dockerfile] DB creds present — running dump-db…" && \
      npm run dump-db; \
    else \
      echo "[Dockerfile] no DB creds — using committed sample snapshot."; \
    fi

# ─── Stage 3: build ──────────────────────────────────────────────────
FROM dump AS build
RUN npm run build

# ─── Stage 4: runtime ────────────────────────────────────────────────
# Static output served by a minimal nginx. The Astro `base: '/db'`
# means files land under /db/ — nginx serves them from there directly
# so the upstream HTTPRoute path-routing works without a rewrite.
FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl
COPY --from=build /app/dist /usr/share/nginx/html/db
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
  listen 8080 default_server;
  listen [::]:8080 default_server;
  server_name _;

  # Aggressive long-cache for hashed static assets; short-cache for HTML
  # so deploys are visible quickly after a reconcile.
  location /db/_astro/ {
    expires 1y;
    add_header Cache-Control "public, immutable" always;
    try_files $uri =404;
  }
  location /db/fonts/ {
    expires 1y;
    add_header Cache-Control "public, immutable" always;
    try_files $uri =404;
  }
  location /db/ {
    add_header Cache-Control "public, max-age=300, s-maxage=600, stale-while-revalidate=86400" always;
    try_files $uri $uri/index.html $uri.html /db/404/index.html;
  }
  # Healthcheck for k8s probes.
  location = /healthz {
    access_log off;
    return 200 "ok\n";
    add_header Content-Type text/plain;
  }
  # Anything not /db/* is owned by the portal upstream — we don't serve
  # it. The HTTPRoute should never send us those paths, but reply 404
  # cleanly if anyone hits us directly.
  location / {
    return 404;
  }
}
NGINX

# nginx-alpine listens on 80 by default; we listen on 8080 to fit under
# the Pod SecurityContext requirements (non-root). Run as nginx user.
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8080/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]

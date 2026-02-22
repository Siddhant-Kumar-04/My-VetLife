# ── Stage 1: deps ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# ── Stage 2: runner ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Create non-root user for security
RUN addgroup -S vetlife && adduser -S vetlife -G vetlife

WORKDIR /app

# Copy production deps from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY --chown=vetlife:vetlife . .

# Remove dev/local files that shouldn't be in image
RUN rm -f .env .env.example seeder.js

# Switch to non-root user
USER vetlife

#Cloud Run sets PORT env var automatically (default 8080)
# Our server.js already uses: process.env.PORT || 5000
EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]

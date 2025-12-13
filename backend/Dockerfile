FROM node:20-trixie-slim AS builder

WORKDIR /app

# Copy package files (including lockfile) for deterministic installs
COPY package*.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source code
COPY src ./src

# For low-RAM VPSes, run `tsc` with a conservative memory cap (512MB).
# If this still fails, see the swapfile and alternative build instructions below.
ENV NODE_OPTIONS=--max_old_space_size=512

# Build TypeScript explicitly with the memory cap (avoid possible shell env issues)
RUN node --max_old_space_size=512 ./node_modules/.bin/tsc

# Production stage
FROM node:20-trixie-slim

WORKDIR /app

# Copy package files and lockfile
COPY package*.json ./
COPY package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit --no-fund

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
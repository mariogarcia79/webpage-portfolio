FROM node:20-trixie-slim

WORKDIR /app

# This Dockerfile intentionally skips building TypeScript. It expects a
# prebuilt `dist/` directory (compiled JS) to be present in the build context.
# This is useful for low-RAM CI/VPS where running `tsc` inside the container
# may fail or be slow. Build locally (or in CI) and then build the image on the
# VPS.

# Copy package files (including lockfile) for deterministic installs
COPY package*.json ./
COPY package-lock.json ./

# Copy compiled output
COPY dist ./dist

# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit --no-fund

EXPOSE 4000

CMD ["node", "dist/index.js"]
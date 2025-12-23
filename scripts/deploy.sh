#!/usr/bin/bash
# Setup everything needed for containers
git pull
./scripts/setup-prometheus.sh

# Rebuild and redeploy containers
docker compose build --no-cache
docker compose down
# Clean up old containers and volumes
./scripts/clean.sh
docker compose up -d 
#!/usr/bin/bash

# Setup everything needed for containers
git pull
./scripts/setup-prometheus.sh

# Build images
docker compose build --no-cache

# Remove old stack (if exists)
docker stack rm webpage
sleep 5

# Deploy the stack
docker stack deploy -c docker-compose.yml webpage

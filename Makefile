# Makefile for local build + simple deployment helpers
# - Builds backend locally (npm ci + npm run build)
# - Packages compiled `dist/` and package files under `build/backend/` for transfer
# - Docker helpers for compose and building backend image (expects prebuilt `dist/`)

SHELL := /bin/bash
BACKEND_DIR := backend
BUILD_DIR := build/backend
RSYNC := rsync -av --delete

# Configure these when using `make deploy-backend`:
SSH_USER ?= user
SSH_HOST ?= vps.example.com
SSH_DEST ?= /home/$(SSH_USER)/webpage-portfolio/backend

.PHONY: all backend-build backend-package deploy-backend docker-build docker-up docker-down \
        docker-build-backend-image clean

all: backend-build

backend-build:
	@echo "Building backend (npm ci + npm run build) in '$(BACKEND_DIR)'"
	cd $(BACKEND_DIR) && npm ci && npm run build

backend-package: backend-build
	@echo "Packaging backend into '$(BUILD_DIR)'"
	mkdir -p $(BUILD_DIR)
	$(RSYNC) $(BACKEND_DIR)/dist $(BUILD_DIR)/dist
	@cp $(BACKEND_DIR)/package*.json $(BUILD_DIR)/ 2>/dev/null || true

# Deploy backend artifacts to a remote host using rsync. Requires SSH_USER/SSH_HOST/SSH_DEST.
deploy-backend: backend-package
	@if [ "$(SSH_USER)" = "user" ]; then \
	  echo "Set SSH_USER, SSH_HOST and SSH_DEST environment variables before using deploy-backend."; exit 1; \
	fi
	$(RSYNC) $(BUILD_DIR)/ $(SSH_USER)@$(SSH_HOST):$(SSH_DEST)/

# Docker compose helpers
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

# Build a backend image locally that expects `dist/` present in ./backend (it will be copied from build step)
docker-build-backend-image: backend-package
	@echo "Building backend Docker image (expects prebuilt dist in ./backend)"
	# Copy packaged dist into backend/ for context then build. This avoids running tsc in the image.
	mkdir -p $(BACKEND_DIR)/dist
	$(RSYNC) $(BUILD_DIR)/dist $(BACKEND_DIR)/dist
	docker build -t webpage-portfolio-backend:latest ./backend

clean:
	rm -rf build

# End of Makefile

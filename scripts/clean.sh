#!/usr/bin/bash
docker system prune -a --volumes --exclude mongo-data
docker volume rm prometheus-data
#docker network prune -f
#docker builder prune -f
echo "Cleaned up old containers, volumes, networks, and build cache."
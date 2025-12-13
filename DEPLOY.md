### Instructions to deploy
First, clone into the server.
After the clone, run:
```bash
docker compose build --no-cache
docker compose up -d
docker compose logs -f
```
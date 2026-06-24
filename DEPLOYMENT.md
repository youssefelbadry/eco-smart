# Deployment Guide

## Environment Variables
Set these in your hosting provider, not in source control.

- `APP_NAME` - e.g. `ECO Smart Backend`
- `APP_ENV` - `production` or `development`
- `APP_DEBUG` - `false` in production
- `APP_URL` - your public URL, e.g. `https://eco-smart.example.com`
- `MYSQL_PUBLIC_URL` - `mysql://user:pass@host:port/database`
- `JWT_SECRET` - strong secret for signing JWT tokens
- `JWT_EXPIRATION` - token lifetime in seconds, e.g. `86400`
- `RATE_LIMIT_MAX` - requests per window, e.g. `120`
- `RATE_LIMIT_WINDOW` - window in seconds, e.g. `60`
- `LOG_PATH` - `./logs`
- `LOG_LEVEL` - `debug`

## Docker Deployment
1. Add a Dockerfile at repository root.
2. Add `.dockerignore` to prevent secrets and logs from being copied.
3. Use a provider that supports Docker containers (Railway, Render, Fly.io, etc.).
4. Set environment variables in the provider dashboard.

## Local Test
If Docker is available and running, use:

```bash
docker build -t eco-smart-local .
docker run -p 8080:80 --env-file .env eco-smart-local
```

Then test:

```bash
curl -i http://localhost:8080/health.html
curl -i http://localhost:8080/probe
```

## Important Notes
- Vercel does not support PHP apps unless you use a custom Docker deployment.
- Your `MYSQL_PUBLIC_URL` must be accessible from the deployed app.
- The 403 you are seeing is likely from the host platform or firewall, not PHP code.

# Vercel Deployment Checklist (ECO Smart PHP Backend)

## Critical finding

This project is a **PHP + Apache** API. Vercel does **not** execute PHP.

Live proof from `https://eco-smart-iota.vercel.app`:

| Request | Result | Meaning |
|---------|--------|---------|
| `GET /health.html` | 200 | Static file served |
| `GET /index.php` | 200 | Raw PHP source served as static file (`content-type: application/x-httpd-php`) |
| `POST /api_login.php` | 403 | Vercel blocks PHP: `{"error":{"code":"403","message":"Forbidden"}}` with header `x-vercel-mitigated: deny` |
| `GET /probe` | 404 | No PHP router execution |

The 403 JSON shape (`error.code`, `error.message`) is **Vercel platform format**, not this app's `ResponseHelper` format (`success`, `message`, `data`).

## Pre-deploy checks on Vercel

- [ ] Confirm you are **not** expecting PHP execution on Vercel
- [ ] Confirm `vercel.json` does **not** exist (none is required; none can enable PHP)
- [ ] Confirm project root / output directory is `public/` (Vercel default for this repo)
- [ ] Confirm only static assets (`health.html`) are expected to work on Vercel

## What Vercel cannot provide for this project

- [ ] PHP 8.x runtime
- [ ] Apache + `.htaccess` / `mod_rewrite`
- [ ] Server-side JWT validation in PHP controllers
- [ ] MySQL PDO connections from PHP
- [ ] POST body handling for `/api_*.php` endpoints

## Required runtime (use instead of Vercel)

- [ ] PHP >= 8.0 with extensions: `pdo`, `pdo_mysql`, `json`, `mbstring`, `openssl`
- [ ] Apache with `mod_rewrite` and `AllowOverride All`, **or** Docker using repo `Dockerfile`
- [ ] Document root must be `public/`
- [ ] Environment variables from `.env.example` set on host

## Recommended host: Railway (matches current MySQL setup)

- [ ] Connect GitHub repo to Railway
- [ ] Use `railway.toml` + root `Dockerfile` (builder = DOCKERFILE)
- [ ] Add Railway MySQL plugin or set `MYSQL_PUBLIC_URL`
- [ ] Set `JWT_SECRET`, `APP_URL` (Railway public domain), `APP_ENV=production`, `APP_DEBUG=false`
- [ ] Deploy and wait for health check: `GET /health.html` → 200
- [ ] Test API: `POST /api_login.php` → JSON from PHP (401/400/200), **not** Vercel 403

## Post-deploy API verification (Railway or Docker, not Vercel)

- [ ] `GET /health.html` → 200
- [ ] `GET /probe` → 200 JSON `{"success":true,...}`
- [ ] `POST /api_login.php` with credentials → 200 or 401 from app
- [ ] `GET /api_devices_list.php` without token → 401 `Missing Bearer token`
- [ ] `GET /api_devices_list.php` with valid JWT → 200

## Update Postman after migration

- [ ] Change base URL from `https://eco-smart-iota.vercel.app` to Railway/Docker URL
- [ ] Retest all endpoints against PHP host

## If you must keep a Vercel domain

- [ ] Deploy PHP API to Railway first
- [ ] Use Vercel only as static frontend, **or** add a reverse proxy project (Node/Edge) that forwards `/api_*` to Railway (not included in this repo)

## Environment variables for production host

Copy from `.env.example`:

- `APP_NAME`, `APP_ENV`, `APP_DEBUG`, `APP_URL`
- `MYSQL_PUBLIC_URL` (or `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_CHARSET`)
- `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_ALGORITHM`
- `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW`
- `LOG_PATH`, `LOG_LEVEL`

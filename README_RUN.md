Quick run and composer setup

1. Update `.env` in the project root with your database and JWT settings.

2. Install composer dependencies (if composer is available):

```powershell
composer install --no-interaction
```

3. Start built-in PHP server for local testing:

```powershell
php -S localhost:8000 -t public
```

Notes:
- If `composer` or `php` are not on PATH, install them or run inside a container.
- Database credentials are configured in `.env` (DB_HOST/DB_NAME/DB_USER/DB_PASS). Update and import `ecosmart.sql` into your MySQL instance.

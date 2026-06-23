# ECO Smart Backend - Setup Guide

**Version:** 1.0.0  
**Last Updated:** June 24, 2026

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Development Setup](#development-setup)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software

- **PHP:** 8.0 or higher
- **MySQL / MariaDB:** 5.7 or higher / 10.3 or higher
- **Web Server:** Apache 2.4+ or Nginx 1.18+ (or PHP built-in server for development)
- **Composer:** 2.0+ (if using dependencies)

### Required PHP Extensions

```bash
php -m | grep -E "(pdo|pdo_mysql|json|mbstring|openssl)"
```

Required extensions:
- `pdo` - Database abstraction layer
- `pdo_mysql` - MySQL driver for PDO
- `json` - JSON encoding/decoding
- `mbstring` - Multibyte string functions
- `openssl` - Cryptographic functions
- `hash` - Hash functions (usually built-in)

### Optional PHP Extensions

- `apcu` - User cache (for rate limiting and caching)
- `redis` - Redis client (for advanced caching)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/eco-smart-backend.git
cd eco-smart-backend
```

### Step 2: Verify PHP Version

```bash
php --version
# Should output: PHP 8.0.x or higher
```

### Step 3: Verify PHP Extensions

```bash
php -m
```

Ensure the required extensions are listed.

### Step 4: Install Dependencies (if any)

```bash
composer install
```

---

## Configuration

### Step 1: Create or update the Environment File

If needed, copy the example environment file and then update `.env` in the project root:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Application
APP_NAME="ECO Smart Backend"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=smart_home_energy
DB_USER=root
DB_PASS=your_secure_password
DB_CHARSET=utf8mb4

# JWT
JWT_SECRET=your_very_long_random_secret_key_at_least_32_characters
JWT_EXPIRATION=86400

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_SECONDS=300

# Logging
LOG_LEVEL=debug
LOG_PATH=logs
```

### Step 3: Generate JWT Secret

Generate a secure random JWT secret:

```bash
php -r "echo bin2hex(random_bytes(32));"
```

Copy the output and set it as `JWT_SECRET` in your `.env` file.

---

## Database Setup

### Step 1: Create Database

```bash
mysql -u root -p -e "CREATE DATABASE smart_home_energy CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
```

### Step 2: Import Schema

```bash
mysql -u root -p smart_home_energy < ecosmart.sql
```

### Step 3: Verify Database Connection

Create a test script `test_db.php`:

```php
<?php
require_once 'config/config.php';

try {
    $pdo = getDbConnection();
    echo "Database connection successful!\n";
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "Users in database: " . $result['count'] . "\n";
} catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}
```

Run the test:

```bash
php test_db.php
```

### Step 4: Create Admin User (Optional)

```bash
mysql -u root -p smart_home_energy -e "
INSERT INTO users (name, email, password, email_verified_at, created_at, updated_at)
VALUES ('Admin User', 'admin@ecosmart.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW(), NOW());
"
```

Default password: `password` (change immediately after first login)

---

## Running the Application

### Development Mode (PHP Built-in Server)

```bash
php -S localhost:8000 -t public
```

The application will be available at `http://localhost:8000`

### Production Mode (Apache)

#### Apache Configuration

Create `.htaccess` file in the project root:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect to HTTPS in production
    # RewriteCond %{HTTPS} off
    # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Redirect to public directory
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ /public/$1 [L]
</IfModule>
```

Create virtual host configuration:

```apache
<VirtualHost *:80>
    ServerName ecosmart.local
    DocumentRoot /path/to/eco-smart-backend/public
    
    <Directory /path/to/eco-smart-backend/public>
        AllowOverride All
        Require all granted
        
        <FilesMatch "\.php$">
            SetHandler application/x-httpd-php
        </FilesMatch>
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/ecosmart_error.log
    CustomLog ${APACHE_LOG_DIR}/ecosmart_access.log combined
</VirtualHost>
```

### Production Mode (Nginx)

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name ecosmart.local;
    root /path/to/eco-smart-backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\. {
        deny all;
    }

    error_log /var/log/nginx/ecosmart_error.log;
    access_log /var/log/nginx/ecosmart_access.log;
}
```

---

## Verification

### Step 1: Test Health Endpoint

```bash
curl http://localhost:8000/api_system_health.php?home_id=1
```

Expected response:
```json
{
  "success": true,
  "data": {
    "health_percent": 0,
    "online_devices": 0,
    "active_warnings": 0
  }
}
```

### Step 2: Test Registration

```bash
curl -X POST http://localhost:8000/api_signup.php \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"SecurePass123!","accepted_terms":1}'
```

### Step 3: Test Login

```bash
curl -X POST http://localhost:8000/api_login.php \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"test@example.com","password":"SecurePass123!"}'
```

Save the returned token for next test.

### Step 4: Test Protected Endpoint

```bash
curl http://localhost:8000/api_devices_list.php?home_id=1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check credentials in `.env`
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Check firewall settings

### Issue: JWT Token Invalid

**Solution:**
1. Verify `JWT_SECRET` is set in `.env`
2. Ensure secret is at least 32 characters
3. Check token hasn't expired (default 24 hours)

### Issue: Permission Denied on Logs Directory

**Solution:**
```bash
mkdir -p logs
chmod 755 logs
```

### Issue: CORS Errors

**Solution:**
Add CORS headers to your API endpoints or configure your web server.

### Issue: 404 Not Found

**Solution:**
1. Verify web server configuration
2. Check file permissions
3. Ensure `.htaccess` is being read (Apache)

### Issue: PHP Extensions Missing

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install php8.0-mysql php8.0-json php8.0-mbstring php8.0-openssl

# CentOS/RHEL
sudo yum install php80-mysqlnd php80-json php80-mbstring php80-openssl

# macOS (Homebrew)
brew install php@8.0
```

---

## Development Setup

### Step 1: Enable Error Reporting

In development mode, enable detailed error reporting:

```php
// In config/config.php
if (getenv('APP_ENV') === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
```

### Step 2: Configure Xdebug (Optional)

Install Xdebug for debugging:

```bash
# Ubuntu/Debian
sudo apt-get install php-xdebug

# macOS
brew install php@8.0-xdebug
```

Configure in `php.ini`:
```ini
[xdebug]
zend_extension=xdebug.so
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
```

### Step 3: Set Up Git Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run PHP linter
php -l config/**/*.php
php -l controllers/**/*.php
php -l services/**/*.php

# Run static analysis
vendor/bin/phpstan analyse --level=5
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Production Deployment

### Step 1: Environment Configuration

Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`:

```env
APP_ENV=production
APP_DEBUG=false
```

### Step 2: File Permissions

Set appropriate file permissions:

```bash
# Set ownership
sudo chown -R www-data:www-data /path/to/eco-smart-backend

# Set permissions
sudo chmod -R 755 /path/to/eco-smart-backend
sudo chmod -R 644 /path/to/eco-smart-backend/**/*.php
sudo chmod 600 /path/to/eco-smart-backend/.env
```

### Step 3: Enable HTTPS

Configure SSL certificate:

```apache
<VirtualHost *:443>
    ServerName ecosmart.example.com
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    # ... rest of configuration
</VirtualHost>
```

### Step 4: Configure Firewall

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### Step 5: Set Up Process Monitor (Optional)

Use Supervisor to keep PHP-FPM running:

```ini
[program:php-fpm]
command=/usr/sbin/php-fpm8.0 -F
autostart=true
autorestart=true
user=www-data
```

### Step 6: Configure Backups

Set up automated database backups:

```bash
# Add to crontab
0 2 * * * /usr/bin/mysqldump -u root -pPASSWORD smart_home_energy | gzip > /backups/ecosmart_$(date +\%Y\%m\%d).sql.gz
```

---

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong JWT secret (32+ characters)
- [ ] Enable HTTPS
- [ ] Set `APP_DEBUG=false`
- [ ] Configure firewall
- [ ] Set up file permissions correctly
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up logging
- [ ] Configure backups
- [ ] Review security headers
- [ ] Test all endpoints
- [ ] Run security scan

---

## Performance Optimization

### Enable OPcache

Edit `php.ini`:

```ini
[opcache]
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
```

### Enable Database Query Cache

Edit MySQL configuration:

```ini
[mysqld]
query_cache_type=1
query_cache_size=64M
```

### Use Redis for Caching (Optional)

Install Redis:

```bash
sudo apt-get install redis-server
```

Configure in `.env`:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

---

## Monitoring

### Set Up Log Rotation

Create `/etc/logrotate.d/ecosmart`:

```
/path/to/eco-smart-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### Set Up Error Monitoring

Consider using services like:
- Sentry
- Bugsnag
- Rollbar

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/YOUR_USERNAME/eco-smart-backend/issues
- Documentation: https://github.com/YOUR_USERNAME/eco-smart-backend/wiki
- Email: support@ecosmart.com

---

## Additional Resources

- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Setup Guide Status:** Complete  
**Last Updated:** June 24, 2026

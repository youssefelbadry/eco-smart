#!/bin/bash

# ECO Smart Backend - Setup Script
# This script helps set up the project for development

set -e

echo "=========================================="
echo "ECO Smart Backend - Setup Script"
echo "=========================================="
echo ""

# Check PHP version
echo "Checking PHP version..."
PHP_VERSION=$(php -r "echo PHP_VERSION;")
echo "PHP Version: $PHP_VERSION"

# Check if PHP 8.0+
if [[ $(echo "$PHP_VERSION" | cut -d. -f1) -lt 8 ]]; then
    echo "ERROR: PHP 8.0 or higher is required"
    exit 1
fi

echo "✓ PHP version check passed"
echo ""

# Check required PHP extensions
echo "Checking required PHP extensions..."
REQUIRED_EXTENSIONS=("pdo" "pdo_mysql" "json" "mbstring" "openssl")

for ext in "${REQUIRED_EXTENSIONS[@]}"; do
    if php -m | grep -q "^$ext$"; then
        echo "✓ $ext is installed"
    else
        echo "✗ $ext is missing"
        MISSING_EXTENSIONS+=("$ext")
    fi
done

if [ ${#MISSING_EXTENSIONS[@]} -gt 0 ]; then
    echo ""
    echo "ERROR: Missing PHP extensions: ${MISSING_EXTENSIONS[*]}"
    echo "Please install them before continuing"
    exit 1
fi

echo ""

# Check Composer
echo "Checking Composer..."
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | cut -d' ' -f3)
    echo "✓ Composer is installed (version $COMPOSER_VERSION)"
else
    echo "✗ Composer is not installed"
    echo "Install Composer from https://getcomposer.org/"
    exit 1
fi

echo ""

# Check MySQL
echo "Checking MySQL/MariaDB..."
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version)
    echo "✓ MySQL is installed ($MYSQL_VERSION)"
elif command -v mariadb &> /dev/null; then
    MARIADB_VERSION=$(mariadb --version)
    echo "✓ MariaDB is installed ($MARIADB_VERSION)"
else
    echo "✗ MySQL/MariaDB is not installed"
    echo "Please install MySQL or MariaDB"
    exit 1
fi

echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo "⚠  Please edit .env with your configuration"
else
    echo "✓ .env file already exists"
fi

echo ""

# Create logs directory
echo "Creating logs directory..."
mkdir -p logs
echo "✓ Logs directory created"

echo ""

# Install Composer dependencies
echo "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist
echo "✓ Composer dependencies installed"

echo ""

# Set permissions
echo "Setting file permissions..."
chmod 755 logs
chmod 644 .env
echo "✓ File permissions set"

echo ""

# Check database connection
echo "Testing database connection..."
php -r "
require_once 'vendor/autoload.php';
\$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
\$dotenv->load();

try {
    \$dsn = 'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=' . getenv('DB_CHARSET');
    \$pdo = new PDO(\$dsn, getenv('DB_USER'), getenv('DB_PASS'));
    echo '✓ Database connection successful';
} catch (PDOException \$e) {
    echo '✗ Database connection failed: ' . \$e->getMessage();
    exit(1);
}
"

echo ""

# Check if database exists and has tables
echo "Checking database tables..."
TABLES=$(php -r "
require_once 'vendor/autoload.php';
\$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
\$dotenv->load();
\$dsn = 'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=' . getenv('DB_CHARSET');
\$pdo = new PDO(\$dsn, getenv('DB_USER'), getenv('DB_PASS'));
\$stmt = \$pdo->query('SHOW TABLES');
echo \$stmt->rowCount();
")

if [ "$TABLES" -eq 0 ]; then
    echo "Database is empty. Importing schema..."
    mysql -h $(grep DB_HOST .env | cut -d '=' -f2) -u $(grep DB_USER .env | cut -d '=' -f2) -p$(grep DB_PASS .env | cut -d '=' -f2) $(grep DB_NAME .env | cut -d '=' -f2) < database/ecosmart.sql
    echo "✓ Database schema imported"
else
    echo "✓ Database has $TABLES tables"
fi

echo ""

echo "=========================================="
echo "Setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Run: php -S localhost:8000"
echo "3. Open http://localhost:8000 in your browser"
echo ""
echo "For more information, see SETUP_GUIDE.md"

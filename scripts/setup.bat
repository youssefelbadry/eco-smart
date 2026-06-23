@echo off
REM ECO Smart Backend - Setup Script for Windows
REM This script helps set up the project for development

echo ==========================================
echo ECO Smart Backend - Setup Script
echo ==========================================
echo.

REM Check PHP version
echo Checking PHP version...
php -r "echo PHP_VERSION;" > temp_php_version.txt
set /p PHP_VERSION=<temp_php_version.txt
del temp_php_version.txt
echo PHP Version: %PHP_VERSION%

REM Simple version check (major version)
for /f "tokens=1 delims=." %%a in ("%PHP_VERSION%") do set PHP_MAJOR=%%a
if %PHP_MAJOR% LSS 8 (
    echo ERROR: PHP 8.0 or higher is required
    exit /b 1
)

echo [OK] PHP version check passed
echo.

REM Check required PHP extensions
echo Checking required PHP extensions...
php -m | findstr /C:"pdo" >nul && echo [OK] pdo is installed || echo [MISSING] pdo is not installed
php -m | findstr /C:"pdo_mysql" >nul && echo [OK] pdo_mysql is installed || echo [MISSING] pdo_mysql is not installed
php -m | findstr /C:"json" >nul && echo [OK] json is installed || echo [MISSING] json is not installed
php -m | findstr /C:"mbstring" >nul && echo [OK] mbstring is installed || echo [MISSING] mbstring is not installed
php -m | findstr /C:"openssl" >nul && echo [OK] openssl is installed || echo [MISSING] openssl is not installed
echo.

REM Check Composer
echo Checking Composer...
composer --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Composer is installed
) else (
    echo [ERROR] Composer is not installed
    echo Install Composer from https://getcomposer.org/
    exit /b 1
)
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env >nul
    echo [OK] .env file created
    echo [WARNING] Please edit .env with your configuration
) else (
    echo [OK] .env file already exists
)
echo.

REM Create logs directory
echo Creating logs directory...
if not exist logs mkdir logs
echo [OK] Logs directory created
echo.

REM Install Composer dependencies
echo Installing Composer dependencies...
composer install --no-interaction --prefer-dist
if %errorlevel% equ 0 (
    echo [OK] Composer dependencies installed
) else (
    echo [ERROR] Composer install failed
    exit /b 1
)
echo.

REM Set permissions (Windows doesn't need chmod, but we'll create the directory)
echo Logs directory already exists
echo.

echo ==========================================
echo Setup completed successfully!
echo ==========================================
echo.
echo Next steps:
echo 1. Edit .env with your configuration
echo 2. Run: php -S localhost:8000
echo 3. Open http://localhost:8000 in your browser
echo.
echo For more information, see SETUP_GUIDE.md
echo.
pause

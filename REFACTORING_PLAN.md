# ECO Smart Backend - Refactoring Plan

**Date:** June 24, 2026  
**Status:** Planning Phase

---

## Current Structure

```
eco-smart-backend/
├── config_db.php (gitignored)
├── config_db.example.php
├── jwt_helper.php
├── auth_guard.php
├── api_response.php
├── api_login.php
├── api_signup.php
├── api_forgot_password.php
├── api_reset_password.php
├── api_devices_list.php
├── api_devices_dashboard.php
├── api_categories_counts.php
├── api_usage_overview.php
├── api_usage_trend.php
├── api_alerts_list.php
├── api_alerts_counts.php
├── api_alerts_trend.php
├── api_alert_acknowledge_all.php
├── api_system_health.php
├── login_view.php
├── signup_view.php
├── devices_view.php
├── alerts_view.php
├── usage_view.php
├── ecosmart.sql
├── README.md
└── .gitignore
```

---

## Proposed Structure

```
eco-smart-backend/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── CHANGELOG.md
├── composer.json
├── composer.lock
├── ecosmart.sql
│
├── config/
│   ├── app.php
│   ├── database.php
│   └── constants.php
│
├── public/
│   ├── index.php
│   ├── .htaccess
│   └── uploads/
│
├── src/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── DeviceController.php
│   │   ├── UsageController.php
│   │   ├── AlertController.php
│   │   └── SystemController.php
│   │
│   ├── Middleware/
│   │   ├── AuthMiddleware.php
│   │   ├── RateLimitMiddleware.php
│   │   ├── CorsMiddleware.php
│   │   └── ValidationMiddleware.php
│   │
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── DeviceService.php
│   │   ├── UsageService.php
│   │   ├── AlertService.php
│   │   └── JwtService.php
│   │
│   ├── Repositories/
│   │   ├── UserRepository.php
│   │   ├── DeviceRepository.php
│   │   ├── UsageRepository.php
│   │   └── AlertRepository.php
│   │
│   ├── Helpers/
│   │   ├── ResponseHelper.php
│   │   ├── ValidationHelper.php
│   │   ├── SanitizationHelper.php
│   │   └── LogHelper.php
│   │
│   ├── Auth/
│   │   ├── Jwt.php
│   │   └── Guard.php
│   │
│   └── Models/
│       ├── User.php
│       ├── Device.php
│       ├── Alert.php
│       └── Usage.php
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── ecosmart.sql
│
├── logs/
│   ├── application.log
│   ├── error.log
│   └── access.log
│
├── docs/
│   ├── PROJECT_ANALYSIS.md
│   ├── DATABASE_DOCUMENTATION.md
│   ├── API_DOCUMENTATION.md
│   ├── SETUP_GUIDE.md
│   ├── SECURITY_REVIEW.md
│   └── CHANGELOG.md
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── scripts/
│   ├── start.sh
│   ├── stop.sh
│   └── setup.sh
│
└── views/
    ├── login.php
    ├── signup.php
    ├── devices.php
    ├── alerts.php
    └── usage.php
```

---

## File Mapping

### Configuration Files
- `config_db.example.php` → `config/database.php`
- `config_db.php` → Environment variables (`.env`)

### Helper Files
- `jwt_helper.php` → `src/Auth/Jwt.php`
- `auth_guard.php` → `src/Auth/Guard.php` and `src/Middleware/AuthMiddleware.php`
- `api_response.php` → `src/Helpers/ResponseHelper.php`

### API Endpoints → Controllers
- `api_login.php` → `src/Controllers/AuthController.php::login()`
- `api_signup.php` → `src/Controllers/AuthController.php::register()`
- `api_forgot_password.php` → `src/Controllers/AuthController.php::forgotPassword()`
- `api_reset_password.php` → `src/Controllers/AuthController.php::resetPassword()`
- `api_devices_list.php` → `src/Controllers/DeviceController.php::list()`
- `api_devices_dashboard.php` → `src/Controllers/DeviceController.php::dashboard()`
- `api_categories_counts.php` → `src/Controllers/DeviceController.php::categoryCounts()`
- `api_usage_overview.php` → `src/Controllers/UsageController.php::overview()`
- `api_usage_trend.php` → `src/Controllers/UsageController.php::trend()`
- `api_alerts_list.php` → `src/Controllers/AlertController.php::list()`
- `api_alerts_counts.php` → `src/Controllers/AlertController.php::counts()`
- `api_alerts_trend.php` → `src/Controllers/AlertController.php::trend()`
- `api_alert_acknowledge_all.php` → `src/Controllers/AlertController.php::acknowledgeAll()`
- `api_system_health.php` → `src/Controllers/SystemController.php::health()`

### View Files
- `login_view.php` → `views/login.php`
- `signup_view.php` → `views/signup.php`
- `devices_view.php` → `views/devices.php`
- `alerts_view.php` → `views/alerts.php`
- `usage_view.php` → `views/usage.php`

### Database
- `ecosmart.sql` → `database/ecosmart.sql`

### Documentation
- All `.md` files → `docs/`

---

## Implementation Steps

### Phase 1: Create New Structure
1. Create all new directories
2. Create `.env.example` file
3. Create `composer.json` file
4. Create `public/index.php` as entry point

### Phase 2: Move Configuration
1. Move and refactor `config_db.example.php` to `config/database.php`
2. Create `config/app.php` for application config
3. Create `config/constants.php` for constants
4. Update to use environment variables

### Phase 3: Move Helpers
1. Move `jwt_helper.php` to `src/Auth/Jwt.php`
2. Move `auth_guard.php` to `src/Auth/Guard.php`
3. Move `api_response.php` to `src/Helpers/ResponseHelper.php`
4. Update all includes/requires

### Phase 4: Create Controllers
1. Create `src/Controllers/AuthController.php`
2. Create `src/Controllers/DeviceController.php`
3. Create `src/Controllers/UsageController.php`
4. Create `src/Controllers/AlertController.php`
5. Create `src/Controllers/SystemController.php`
6. Move logic from API files to controllers

### Phase 5: Create Middleware
1. Create `src/Middleware/AuthMiddleware.php`
2. Create `src/Middleware/CorsMiddleware.php`
3. Create `src/Middleware/RateLimitMiddleware.php`
4. Create `src/Middleware/ValidationMiddleware.php`

### Phase 6: Create Services
1. Create `src/Services/AuthService.php`
2. Create `src/Services/DeviceService.php`
3. Create `src/Services/UsageService.php`
4. Create `src/Services/AlertService.php`
5. Create `src/Services/JwtService.php`

### Phase 7: Create Repositories
1. Create `src/Repositories/UserRepository.php`
2. Create `src/Repositories/DeviceRepository.php`
3. Create `src/Repositories/UsageRepository.php`
4. Create `src/Repositories/AlertRepository.php`

### Phase 8: Create Additional Helpers
1. Create `src/Helpers/ValidationHelper.php`
2. Create `src/Helpers/SanitizationHelper.php`
3. Create `src/Helpers/LogHelper.php`

### Phase 9: Move Views
1. Move all view files to `views/`
2. Update references in views

### Phase 10: Move Database
1. Move `ecosmart.sql` to `database/`
2. Create `database/migrations/` directory
3. Create `database/seeds/` directory

### Phase 11: Move Documentation
1. Move all `.md` files to `docs/`
2. Update README.md with new structure

### Phase 12: Create Entry Point
1. Create `public/index.php`
2. Set up routing
3. Configure autoloader

### Phase 13: Create Scripts
1. Create `scripts/setup.sh`
2. Create `scripts/start.sh`
3. Create `scripts/stop.sh`

### Phase 14: Testing
1. Test all endpoints
2. Verify database connections
3. Test authentication flow
4. Verify logging works

### Phase 15: Cleanup
1. Delete old API files
2. Delete old helper files
3. Update `.gitignore`
4. Update documentation

---

## Routing Strategy

### Simple Router Implementation

```php
// public/index.php
require_once '../vendor/autoload.php';
require_once '../config/app.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    'POST /api/login' => ['AuthController', 'login'],
    'POST /api/signup' => ['AuthController', 'register'],
    'GET /api/devices' => ['DeviceController', 'list'],
    // ... more routes
];

$routeKey = "{$method} {$uri}";

if (isset($routes[$routeKey])) {
    [$controller, $action] = $routes[$routeKey];
    $controllerClass = "App\\Controllers\\{$controller}";
    $instance = new $controllerClass();
    $instance->$action();
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Not found']);
}
```

---

## Autoloading

### Composer Autoloader

```json
// composer.json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

Run:
```bash
composer dump-autoload
```

---

## Environment Variables

### .env.example

```env
APP_NAME="ECO Smart Backend"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=smart_home_energy
DB_USER=root
DB_PASS=your_password
DB_CHARSET=utf8mb4

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=86400

LOG_LEVEL=debug
LOG_PATH=../logs
```

---

## Risk Assessment

### Low Risk
- Moving files to new directories
- Creating new helper classes
- Adding documentation

### Medium Risk
- Changing include paths
- Implementing routing
- Refactoring controllers
- Database connection changes

### High Risk
- Breaking existing API endpoints
- Authentication flow changes
- Database schema changes
- Environment variable migration

### Mitigation Strategies
1. Create feature branch for refactoring
2. Implement comprehensive testing
3. Use git for version control
4. Deploy to staging environment first
5. Have rollback plan ready

---

## Rollback Plan

If refactoring fails:
1. Revert to previous commit
2. Restore old file structure
3. Verify functionality
4. Document failure points
5. Plan alternative approach

---

## Success Criteria

1. All existing API endpoints work correctly
2. Authentication flow unchanged from user perspective
3. Database connections work properly
4. Logging system functional
5. No data loss
6. Performance not degraded
7. Security improvements implemented
8. Documentation updated

---

## Timeline Estimate

- Phase 1-2: 2 hours
- Phase 3-5: 4 hours
- Phase 6-8: 6 hours
- Phase 9-11: 2 hours
- Phase 12-14: 4 hours
- Phase 15: 2 hours

**Total Estimated Time:** 20 hours

---

## Notes

- This refactoring will break existing API endpoints temporarily
- Client applications will need to be updated with new base URL if changed
- Database migration scripts will be needed for schema alignment
- Consider implementing API versioning to maintain backward compatibility

---

**Refactoring Plan Status:** Complete  
**Next Step:** Begin Phase 1 implementation

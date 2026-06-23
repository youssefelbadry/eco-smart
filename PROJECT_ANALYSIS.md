# ECO Smart Backend - Project Analysis Report

**Date:** June 24, 2026  
**Analyst:** Senior PHP Backend Architect  
**Project:** ECO Smart Home Energy Backend API

---

## Executive Summary

This report provides a comprehensive analysis of the ECO Smart Home Energy Backend API project. The project is a PHP-based RESTful API for managing smart home energy consumption, IoT devices, alerts, and user authentication. The analysis reveals several critical security issues, architectural improvements needed, and opportunities for code organization enhancement.

---

## 1. Project Overview

### 1.1 Technology Stack
- **Language:** PHP 8.x
- **Database:** MySQL / MariaDB (InnoDB engine)
- **Authentication:** Custom JWT implementation (HS256)
- **Database Access:** PDO with prepared statements
- **Architecture:** Flat file structure (no framework)

### 1.2 Current Structure
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

## 2. API Endpoints Analysis

### 2.1 Authentication Endpoints

#### POST /api_login.php
**Purpose:** User login and JWT token generation  
**Authentication:** Not required  
**Request Body:**
```json
{
  "email_or_username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login success",
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "full_name": "string",
    "username": "string",
    "email_address": "string"
  }
}
```
**Issues Found:**
- ❌ **CRITICAL:** JWT secret hardcoded in file
- ❌ **CRITICAL:** No rate limiting on login attempts
- ❌ **MEDIUM:** No login attempt logging to database
- ❌ **LOW:** No IP-based blocking after failed attempts

#### POST /api_signup.php
**Purpose:** User registration  
**Authentication:** Not required  
**Request Body:**
```json
{
  "full_name": "string",
  "username": "string (optional)",
  "email": "string",
  "password": "string",
  "accepted_terms": 0|1
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```
**Issues Found:**
- ❌ **CRITICAL:** No email validation
- ❌ **CRITICAL:** No password strength requirements
- ❌ **HIGH:** No email verification
- ❌ **MEDIUM:** Username field referenced but not in HTML form
- ❌ **LOW:** No CAPTCHA or bot protection

#### POST /api_forgot_password.php
**Purpose:** Request password reset token  
**Authentication:** Not required  
**Request Body:**
```json
{
  "email": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Reset token generated",
  "reset_token_demo": "token_string"
}
```
**Issues Found:**
- ❌ **CRITICAL:** Reset token returned in response (security leak)
- ❌ **HIGH:** No email actually sent (token only returned)
- ❌ **MEDIUM:** No rate limiting
- ❌ **LOW:** Token expiration not validated before generation

#### POST /api_reset_password.php
**Purpose:** Reset password with token  
**Authentication:** Not required  
**Request Body:**
```json
{
  "reset_token": "string",
  "new_password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```
**Issues Found:**
- ❌ **HIGH:** No password strength validation
- ❌ **MEDIUM:** No logging of password reset events
- ❌ **LOW:** No notification sent to user on successful reset

### 2.2 Device Endpoints

#### GET /api_devices_list.php
**Purpose:** List devices with filters and sorting  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer
- `search` (optional): string
- `category_id` (optional): integer
- `status` (optional): string
- `sort_by` (optional): string (default: "last_seen_at")
- `sort_dir` (optional): string (default: "DESC")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "device_name": "string",
      "location_text": "string",
      "status": "online|offline|warning",
      "metric_label": "string",
      "metric_value": "string",
      "last_seen_at": "datetime",
      "health_score": integer,
      "warning_level": "string",
      "is_online": boolean,
      "category_name": "string"
    }
  ]
}
```
**Issues Found:**
- ❌ **CRITICAL:** SQL injection risk in sort_by parameter (not properly escaped)
- ❌ **HIGH:** No pagination (could return thousands of records)
- ❌ **MEDIUM:** No authorization check (user can access any home_id)
- ❌ **LOW:** No caching for frequently accessed data

#### GET /api_devices_dashboard.php
**Purpose:** Dashboard view with comprehensive device data  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer
- `search` (optional): string
- `category_id` (optional): integer
- `status_filter` (optional): string
- `sort_by` (optional): string

**Response:**
```json
{
  "success": true,
  "filters": {...},
  "system_health": {...},
  "all_devices_count": integer,
  "latest_sync": {...},
  "categories": [...],
  "devices": [...]
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check (user can access any home_id)
- ❌ **MEDIUM:** Multiple database queries (N+1 problem potential)
- ❌ **LOW:** No pagination

#### GET /api_categories_counts.php
**Purpose:** Get device counts per category  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer

**Response:**
```json
{
  "success": true,
  "all_devices_count": integer,
  "categories": [...]
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ⚠️ **LOW:** Minimal issues

### 2.3 Energy Usage Endpoints

#### GET /api_usage_overview.php
**Purpose:** Get daily/weekly/monthly energy usage summary  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer

**Response:**
```json
{
  "success": true,
  "data": {
    "daily": {...},
    "weekly": {...},
    "monthly": {...}
  }
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ❌ **MEDIUM:** Assumes specific table structure (energy_usage_summary) not in SQL
- ⚠️ **LOW:** Minimal issues

#### GET /api_usage_trend.php
**Purpose:** Get hourly energy trend for today  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "point_time": "datetime",
      "usage_kwh": decimal
    }
  ]
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ⚠️ **LOW:** Minimal issues

### 2.4 Alerts Endpoints

#### GET /api_alerts_list.php
**Purpose:** List alerts with filters  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer
- `tab` (optional): string (all, critical, high, medium, resolved)
- `search` (optional): string
- `status` (optional): string

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ❌ **MEDIUM:** Hardcoded LIMIT 100
- ⚠️ **LOW:** Minimal issues

#### GET /api_alerts_counts.php
**Purpose:** Get alert counts by severity  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer

**Response:**
```json
{
  "success": true,
  "data": {
    "critical_count": integer,
    "high_count": integer,
    "medium_count": integer,
    "low_count": integer,
    "info_count": integer
  }
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ⚠️ **LOW:** Minimal issues

#### GET /api_alerts_trend.php
**Purpose:** Get alerts trend for last 7 days  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "day_date": "date",
      "total_alerts": integer
    }
  ]
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ⚠️ **LOW:** Minimal issues

#### POST /api_alert_acknowledge_all.php
**Purpose:** Acknowledge all active alerts  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "home_id": integer,
  "user_id": integer
}
```
**Response:**
```json
{
  "success": true,
  "message": "All active alerts acknowledged",
  "affected_rows": integer
}
```
**Issues Found:**
- ❌ **CRITICAL:** No authorization check (any user can acknowledge any home's alerts)
- ❌ **HIGH:** No validation that user_id matches JWT token
- ⚠️ **LOW:** Minimal issues

### 2.5 System Endpoints

#### GET /api_system_health.php
**Purpose:** System health check  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `home_id` (required): integer

**Response:**
```json
{
  "success": true,
  "data": {
    "health_percent": integer,
    "online_devices": integer,
    "active_warnings": integer
  }
}
```
**Issues Found:**
- ❌ **HIGH:** No authorization check
- ❌ **MEDIUM:** Uses wrong column name (is_resolved instead of status)
- ⚠️ **LOW:** Minimal issues

---

## 3. Critical Security Issues

### 3.1 Authentication & Authorization
1. **No Authorization Layer**: All protected endpoints check for JWT validity but don't verify if the user has access to the requested `home_id`. Any authenticated user can access any home's data.
2. **Hardcoded JWT Secret**: The JWT secret is hardcoded in multiple files (`auth_guard.php` and `api_login.php`) with the value `"super_secret_key_change_me_2026"`.
3. **No Token Refresh Mechanism**: Tokens expire after 24 hours with no refresh token mechanism.
4. **No Session Management**: JWT tokens are not stored or tracked in the database, making it impossible to revoke tokens.

### 3.2 Input Validation
1. **SQL Injection Risk**: In `api_devices_list.php`, the `sort_by` parameter is directly interpolated into the SQL query without proper validation.
2. **No Email Validation**: Email inputs are not validated for format or existence.
3. **No Password Strength Requirements**: Passwords can be any string with no minimum complexity requirements.
4. **Missing Input Sanitization**: User inputs are not sanitized beyond PDO parameter binding.

### 3.3 Data Exposure
1. **Password Reset Token Leak**: The `api_forgot_password.php` endpoint returns the reset token in the response, exposing it to anyone intercepting the request.
2. **No Rate Limiting**: No rate limiting on authentication endpoints, making brute force attacks possible.
3. **Error Information Leakage**: Database errors are caught but generic messages are returned, which is good. However, stack traces could be exposed in debug mode.

### 3.4 Cross-Site Scripting (XSS)
1. **No Content Security Policy**: No CSP headers are set.
2. **No XSS Protection**: No XSS protection headers or input sanitization for reflected data.

---

## 4. Code Quality Issues

### 4.1 Duplicated Code
1. **Database Connection**: Every file includes `config_db.php` directly.
2. **Authentication Check**: Every protected endpoint includes `auth_guard.php` and calls `requireAuth()`.
3. **Input Parsing**: Multiple files duplicate the logic for parsing JSON/POST input.
4. **Response Formatting**: Each endpoint manually constructs JSON responses instead of using a centralized helper.

### 4.2 Missing Error Handling
1. **No Try-Catch Blocks**: Most database operations lack try-catch blocks for error handling.
2. **No Logging**: No logging system exists for errors, warnings, or debug information.
3. **Generic Error Messages**: Error messages are generic and don't help with debugging.

### 4.3 Code Organization
1. **Flat Structure**: All files are in the root directory with no logical organization.
2. **Mixed Concerns**: Business logic, database queries, and response formatting are all mixed in single files.
3. **No Separation of Concerns**: No clear separation between controllers, services, repositories, or models.

### 4.4 Database Issues
1. **Schema Mismatch**: The code references tables (`device_categories`, `energy_usage_summary`, `system_alerts`) that don't exist in the provided SQL file.
2. **Missing Tables**: The SQL file has tables (`users`, `devices`, `alerts`) but the code expects different table structures.
3. **No Foreign Keys**: While the SQL has some foreign key constraints, many relationships are not enforced.
4. **No Indexes**: Missing indexes on frequently queried columns (home_id, user_id in various tables).

---

## 5. Database Schema Analysis

### 5.1 Tables in SQL File
1. `alerts` - Device alerts
2. `appliances` - Appliance energy data
3. `cache` - Application cache
4. `cache_locks` - Cache locking mechanism
5. `daily_usage` - Daily energy usage
6. `devices` - IoT devices
7. `device_logs` - Device action logs
8. `device_readings` - Device sensor readings
9. `energy_reductions` - Energy reduction goals
10. `energy_savings` - Energy savings tracking
11. `energy_targets` - Monthly energy targets
12. `failed_jobs` - Failed job queue
13. `hourly_usage` - Hourly energy usage
14. `jobs` - Job queue
15. `job_batches` - Job batch tracking
16. `migrations` - Database migrations
17. `monthly_usage` - Monthly energy usage
18. `password_reset_tokens` - Password reset tokens
19. `personal_access_tokens` - API tokens
20. `recommendations` - Energy saving recommendations
21. `sessions` - User sessions
22. `tariff_rates` - Electricity tariff rates
23. `users` - User accounts
24. `weekly_usage` - Weekly energy usage

### 5.2 Tables Referenced in Code (Not in SQL)
1. `device_categories` - Device categories (expected by code)
2. `energy_usage_summary` - Energy usage summaries (expected by code)
3. `system_alerts` - System alerts (expected by code)
4. `homes` - Smart homes (mentioned in README)
5. `login_attempts` - Login attempt logging (mentioned in README)
6. `password_resets` - Password reset tokens (different structure in code)
7. `social_accounts` - OAuth accounts (mentioned in README)
8. `sync_logs` - Device sync logs (expected by code)
9. `user_sessions` - User JWT sessions (mentioned in README)

### 5.3 Critical Schema Mismatches
- **Users Table**: Code expects `full_name`, `username`, `email_address`, `password_hash` but SQL has `name`, `email`, `password`
- **Devices Table**: Code expects columns like `device_name`, `location_text`, `health_score` which don't exist in SQL
- **Alerts Table**: Code expects `system_alerts` table with different structure than `alerts` table

---

## 6. Missing Features

### 6.1 Security
- Rate limiting
- IP-based blocking
- Email verification
- Two-factor authentication
- Password strength enforcement
- Account lockout after failed attempts
- CORS configuration

### 6.2 Functionality
- User profile management
- Device management (CRUD)
- Alert management (individual acknowledge, delete)
- Energy goal setting
- Report generation
- Data export
- Real-time notifications (WebSocket/SSE)

### 6.3 Infrastructure
- Logging system
- Monitoring
- Health checks
- Backup system
- Caching layer
- Queue system for background jobs

---

## 7. Performance Issues

1. **No Pagination**: List endpoints return all records without pagination
2. **No Caching**: Frequently accessed data (categories, device counts) is not cached
3. **N+1 Query Problem**: Some endpoints make multiple database queries in loops
4. **No Database Indexes**: Missing indexes on foreign keys and frequently queried columns
5. **No Connection Pooling**: Each request creates a new database connection

---

## 8. Recommendations

### 8.1 Immediate (Critical)
1. Implement authorization layer to verify user access to home_id
2. Move JWT secret to environment variables
3. Fix SQL injection vulnerability in sort_by parameter
4. Remove password reset token from API response
5. Add rate limiting to authentication endpoints
6. Implement password strength validation
7. Fix database schema mismatches

### 8.2 Short Term (High Priority)
1. Refactor to professional folder structure
2. Implement centralized error handling
3. Add logging system
4. Create environment variable configuration
5. Add input validation layer
6. Implement pagination
7. Add database indexes
8. Create API documentation

### 8.3 Medium Term
1. Implement token refresh mechanism
2. Add email verification
3. Create user management endpoints
4. Implement caching layer
5. Add monitoring and health checks
6. Create comprehensive test suite

### 8.4 Long Term
1. Consider migrating to a framework (Laravel, Symfony)
2. Implement WebSocket for real-time updates
3. Add background job processing
4. Implement microservices architecture
5. Add analytics and reporting

---

## 9. Conclusion

The ECO Smart Backend project has a solid foundation with good basic security practices (PDO prepared statements, password hashing). However, it requires significant improvements in security, code organization, and error handling before it can be considered production-ready. The most critical issues are the lack of authorization, hardcoded secrets, and SQL injection vulnerabilities.

The project would benefit greatly from a structured refactoring to implement proper separation of concerns, centralized configuration, and comprehensive error handling and logging.

---

**Report Status:** Complete  
**Next Steps:** Proceed with folder structure refactoring and security improvements

# ECO Smart Backend - API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000`  
**Content Type:** `application/json`  
**Authentication:** JWT Bearer Token

---

## Table of Contents

1. [Authentication](#authentication)
2. [Devices](#devices)
3. [Energy Usage](#energy-usage)
4. [Alerts](#alerts)
5. [System](#system)
6. [Error Responses](#error-responses)
7. [Authentication Flow](#authentication-flow)

---

## Authentication

### Overview

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained by logging in via the `/api_login.php` endpoint.

---

### POST /api_login.php

Login and obtain JWT token.

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email_or_username": "string",
  "password": "string"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email_or_username | string | Yes | User's email or username |
| password | string | Yes | User's password |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login success",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "username": "johndoe",
    "email_address": "john@example.com"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "email_or_username and password required"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api_login.php \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"john@example.com","password":"password123"}'
```

---

### POST /api_signup.php

Register a new user account.

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

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

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| full_name | string | Yes | User's full name |
| username | string | No | Username (optional) |
| email | string | Yes | User's email address |
| password | string | Yes | User's password |
| accepted_terms | integer | Yes | 1 if terms accepted, 0 otherwise |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "full_name, email, password required"
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Email or username already exists"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api_signup.php \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","email":"john@example.com","password":"password123","accepted_terms":1}'
```

---

### POST /api_forgot_password.php

Request a password reset token.

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If email exists, reset link was generated"
}
```

**Response (200 OK - Demo Mode):**
```json
{
  "success": true,
  "message": "Reset token generated",
  "reset_token_demo": "abc123def456..."
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "email required"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api_forgot_password.php \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

---

### POST /api_reset_password.php

Reset password using token.

**Authentication:** Not required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "reset_token": "string",
  "new_password": "string"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| reset_token | string | Yes | Password reset token |
| new_password | string | Yes | New password |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "reset_token and new_password required"
}
```

**Response (400 Bad Request - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Response (400 Bad Request - Token Used):**
```json
{
  "success": false,
  "message": "Token already used"
}
```

**Response (400 Bad Request - Token Expired):**
```json
{
  "success": false,
  "message": "Token expired"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api_reset_password.php \
  -H "Content-Type: application/json" \
  -d '{"reset_token":"abc123def456","new_password":"newpassword123"}'
```

---

## Devices

### GET /api_devices_list.php

List devices with filters and sorting.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |
| search | string | No | Search by device name or location |
| category_id | integer | No | Filter by category ID |
| status | string | No | Filter by status (online, offline, warning) |
| sort_by | string | No | Sort field (last_seen_at, device_name, health_score) |
| sort_dir | string | No | Sort direction (ASC, DESC) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "device_name": "Smart AC",
      "location_text": "Living Room",
      "status": "online",
      "metric_label": "Temperature",
      "metric_value": "24°C",
      "last_seen_at": "2026-06-18 10:30:00",
      "health_score": 95,
      "warning_level": "low",
      "is_online": true,
      "category_name": "Climate"
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Missing Bearer token"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_devices_list.php?home_id=1&search=ac&status=online&sort_by=last_seen_at&sort_dir=DESC" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### GET /api_devices_dashboard.php

Get comprehensive dashboard data for devices.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |
| search | string | No | Search term |
| category_id | integer | No | Filter by category ID |
| status_filter | string | No | Filter by status |
| sort_by | string | No | Sort option (name_asc, name_desc, last_seen_desc, health_desc) |

**Response (200 OK):**
```json
{
  "success": true,
  "filters": {
    "home_id": 1,
    "search": "",
    "category_id": 0,
    "status_filter": "",
    "sort_by": "last_seen_desc"
  },
  "system_health": {
    "percent": 85,
    "online_devices": 8,
    "warnings_count": 2
  },
  "all_devices_count": 10,
  "latest_sync": {
    "id": 1,
    "sync_status": "completed",
    "devices_scanned": 10,
    "devices_updated": 8,
    "created_at": "2026-06-18 10:00:00"
  },
  "categories": [
    {
      "id": 1,
      "category_name": "Lighting",
      "devices_count": 4
    }
  ],
  "devices": [...]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_devices_dashboard.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### GET /api_categories_counts.php

Get device counts per category.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |

**Response (200 OK):**
```json
{
  "success": true,
  "all_devices_count": 10,
  "categories": [
    {
      "id": 1,
      "category_name": "Lighting",
      "devices_count": 4
    },
    {
      "id": 2,
      "category_name": "Climate",
      "devices_count": 2
    },
    {
      "id": 3,
      "category_name": "Appliances",
      "devices_count": 4
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_categories_counts.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

## Energy Usage

### GET /api_usage_overview.php

Get daily, weekly, and monthly energy usage summary.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "daily": {
      "period_type": "daily",
      "usage_kwh": 15.5,
      "baseline_kwh": 18.0,
      "target_kwh": 20.0,
      "achievement_percent": 85,
      "period_start": "2026-06-18",
      "period_end": "2026-06-18"
    },
    "weekly": {
      "period_type": "weekly",
      "usage_kwh": 120.5,
      "baseline_kwh": 140.0,
      "target_kwh": 150.0,
      "achievement_percent": 80,
      "period_start": "2026-06-15",
      "period_end": "2026-06-21"
    },
    "monthly": {
      "period_type": "monthly",
      "usage_kwh": 450.0,
      "baseline_kwh": 500.0,
      "target_kwh": 550.0,
      "achievement_percent": 82,
      "period_start": "2026-06-01",
      "period_end": "2026-06-30"
    }
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_usage_overview.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### GET /api_usage_trend.php

Get hourly energy trend for today.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "point_time": "2026-06-18 00:00:00",
      "usage_kwh": 0.5
    },
    {
      "point_time": "2026-06-18 01:00:00",
      "usage_kwh": 0.3
    },
    {
      "point_time": "2026-06-18 02:00:00",
      "usage_kwh": 0.2
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_usage_trend.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

## Alerts

### GET /api_alerts_list.php

List alerts with filters.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |
| tab | string | No | Filter tab (all, critical, high, medium, resolved) |
| search | string | No | Search term |
| status | string | No | Filter by status |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "High Energy Usage",
      "message": "Device consumed 5.2 kWh during peak hour",
      "alert_type": "high_consumption",
      "severity": "high",
      "status": "active",
      "source_component": "Smart AC",
      "service_name": "climate",
      "created_at": "2026-06-18 14:30:00"
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_alerts_list.php?home_id=1&tab=high&status=active" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### GET /api_alerts_counts.php

Get alert counts by severity.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "critical_count": 2,
    "high_count": 5,
    "medium_count": 8,
    "low_count": 3,
    "info_count": 1
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_alerts_counts.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### GET /api_alerts_trend.php

Get alerts trend for the last 7 days.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "day_date": "2026-06-12",
      "total_alerts": 5
    },
    {
      "day_date": "2026-06-13",
      "total_alerts": 8
    },
    {
      "day_date": "2026-06-14",
      "total_alerts": 3
    },
    {
      "day_date": "2026-06-15",
      "total_alerts": 6
    },
    {
      "day_date": "2026-06-16",
      "total_alerts": 4
    },
    {
      "day_date": "2026-06-17",
      "total_alerts": 7
    },
    {
      "day_date": "2026-06-18",
      "total_alerts": 2
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_alerts_trend.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### POST /api_alert_acknowledge_all.php

Acknowledge all active alerts for a home.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "home_id": integer,
  "user_id": integer
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |
| user_id | integer | Yes | User ID acknowledging the alerts |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All active alerts acknowledged",
  "affected_rows": 5
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id and user_id are required"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api_alert_acknowledge_all.php \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"home_id":1,"user_id":1}'
```

---

## System

### GET /api_system_health.php

Get system health metrics.

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| home_id | integer | Yes | Home ID |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "health_percent": 85,
    "online_devices": 8,
    "active_warnings": 2
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "home_id is required"
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api_system_health.php?home_id=1" \
  -H "Authorization: Bearer your_jwt_token"
```

---

## Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

### Common Error Messages

| Message | Cause |
|---------|-------|
| "Missing Bearer token" | Authorization header missing |
| "Invalid or expired token" | JWT token is invalid or expired |
| "home_id is required" | Required query parameter missing |
| "Database connection failed" | Cannot connect to database |
| "Invalid credentials" | Wrong email/username or password |
| "Email or username already exists" | Duplicate registration attempt |

---

## Authentication Flow

### Step 1: Register User
```bash
POST /api_signup.php
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "accepted_terms": 1
}
```

### Step 2: Login
```bash
POST /api_login.php
{
  "email_or_username": "john@example.com",
  "password": "securePassword123"
}
```

### Step 3: Store Token
Save the returned JWT token for use in subsequent requests.

### Step 4: Access Protected Endpoints
```bash
GET /api_devices_list.php?home_id=1
Authorization: Bearer <your_jwt_token>
```

### Step 5: Refresh Token (Not Implemented)
Currently, there is no token refresh mechanism. Users must re-login after 24 hours.

---

## Rate Limiting

**Status:** Not Implemented

Currently, there is no rate limiting on any endpoints. This is a security vulnerability that should be addressed.

---

## CORS

**Status:** Not Configured

CORS headers are not set. This may cause issues when calling the API from a different domain.

---

## Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api_login.php \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"test@example.com","password":"password"}'

# Get devices (replace TOKEN with actual token)
curl -X GET "http://localhost:8000/api_devices_list.php?home_id=1" \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the provided Postman collection
2. Set the base URL variable
3. Run the login request to get a token
4. Use the token in the Authorization header for protected endpoints

---

## Notes

### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": 1,
    "email": "john@example.com",
    "iat": 1700000000,
    "exp": 1700086400
  }
}
```

### Token Expiration
- Tokens expire after 24 hours
- There is no refresh token mechanism
- Users must re-login after expiration

### Database Schema Notes
The API expects a specific database schema that may differ from the provided SQL file. See DATABASE_DOCUMENTATION.md for details.

---

## Changelog

### Version 1.0.0 (June 24, 2026)
- Initial API documentation
- Documented all 14 endpoints
- Added authentication flow documentation
- Added error response documentation

---

**Documentation Status:** Complete  
**Last Updated:** June 24, 2026  
**Maintainer:** Backend Team

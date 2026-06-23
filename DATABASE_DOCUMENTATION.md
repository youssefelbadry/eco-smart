# ECO Smart Backend - Database Documentation

**Date:** June 24, 2026  
**Database Name:** ecosmart  
**Engine:** MySQL / MariaDB (InnoDB)  
**Charset:** utf8mb4  
**Collation:** utf8mb4_unicode_ci

---

## Table of Contents

1. [Overview](#overview)
2. [User Management Tables](#user-management-tables)
3. [Device Management Tables](#device-management-tables)
4. [Energy Usage Tables](#energy-usage-tables)
5. [Alert & Notification Tables](#alert--notification-tables)
6. [System Tables](#system-tables)
7. [Relationships](#relationships)
8. [Index Analysis](#index-analysis)
9. [Schema Mismatches](#schema-mismatches)
10. [Recommended Improvements](#recommended-improvements)

---

## Overview

The database consists of 24 tables organized into the following categories:
- **User Management:** 3 tables
- **Device Management:** 4 tables
- **Energy Usage:** 5 tables
- **Alerts & Notifications:** 2 tables
- **System:** 10 tables

---

## User Management Tables

### users

**Purpose:** Store user account information

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | User unique identifier |
| name | varchar(255) | NOT NULL | User's full name |
| email | varchar(255) | NOT NULL, UNIQUE | User's email address |
| email_verified_at | timestamp | NULLABLE | Email verification timestamp |
| password | varchar(255) | NOT NULL | Hashed password (bcrypt) |
| remember_token | varchar(100) | NULLABLE | "Remember me" token |
| created_at | timestamp | NULLABLE | Account creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (email)

**Relationships:**
- One-to-many with devices (user_id)
- One-to-many with daily_usage (user_id)
- One-to-many with hourly_usage (user_id)
- One-to-many with monthly_usage (user_id)
- One-to-many with weekly_usage (user_id)
- One-to-many with alerts (user_id)
- One-to-many with appliances (user_id)
- One-to-many with energy_reductions (user_id)
- One-to-many with energy_savings (user_id)
- One-to-many with energy_targets (user_id)
- One-to-many with recommendations (user_id)

**Notes:**
- Password should be hashed using PASSWORD_BCRYPT
- Email field has unique constraint to prevent duplicate registrations

---

### sessions

**Purpose:** Store user session data

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | varchar(255) | PRIMARY KEY | Session ID |
| user_id | bigint(20) UNSIGNED | NULLABLE, INDEXED | Associated user ID |
| ip_address | varchar(45) | NULLABLE | User's IP address |
| user_agent | text | NULLABLE | Browser user agent |
| payload | longtext | NOT NULL | Session data |
| last_activity | int(11) | NOT NULL, INDEXED | Last activity timestamp (Unix) |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (last_activity)

**Relationships:**
- Many-to-one with users (user_id)

---

### password_reset_tokens

**Purpose:** Store password reset tokens

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| email | varchar(255) | PRIMARY KEY | User's email address |
| token | varchar(255) | NOT NULL | Reset token |
| created_at | timestamp | NULLABLE | Token creation timestamp |

**Indexes:**
- PRIMARY KEY (email)

**Notes:**
- This table structure differs from what the code expects
- Code expects a `password_resets` table with different structure

---

## Device Management Tables

### devices

**Purpose:** Store IoT device information

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Device unique identifier |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | Owner user ID |
| name | varchar(255) | NOT NULL | Device name |
| category | varchar(255) | NULLABLE | Device category |
| location | varchar(255) | NULLABLE | Device location |
| status | enum('online','offline','warning') | NOT NULL, DEFAULT 'offline' | Device status |
| is_on | tinyint(1) | NOT NULL, DEFAULT 0 | Device power state |
| meta_key | varchar(255) | NULLABLE | Metadata key |
| meta_value | varchar(255) | NULLABLE | Metadata value |
| meta_unit | varchar(255) | NULLABLE | Metadata unit |
| last_seen | timestamp | NULLABLE | Last communication timestamp |
| created_at | timestamp | NULLABLE | Device creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |
| deleted_at | timestamp | NULLABLE | Soft delete timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)
- One-to-many with alerts (device_id)
- One-to-many with device_logs (device_id)
- One-to-many with device_readings (device_id)
- One-to-many with appliances (device_id)

**Notes:**
- Code expects different column names: `device_name`, `location_text`, `health_score`, `warning_level`, `is_online`
- Code expects a `device_categories` relationship that doesn't exist in this schema

---

### device_logs

**Purpose:** Store device action logs

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Log entry ID |
| device_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | Associated device ID |
| action | varchar(255) | NOT NULL | Action performed (turn_on, turn_off, etc.) |
| source | varchar(255) | NULLABLE | Action source (manual, auto, api) |
| details | text | NULLABLE | Action details |
| metadata | longtext | NULLABLE, JSON VALIDATED | Additional metadata (JSON) |
| ip_address | varchar(45) | NULLABLE | IP address of requester |
| user_agent | text | NULLABLE | Browser user agent |
| created_at | timestamp | NULLABLE | Log creation timestamp |
| updated_at | timestamp | NULLABLE | Log update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (device_id)

**Relationships:**
- Many-to-one with devices (device_id)

---

### device_readings

**Purpose:** Store device sensor readings

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Reading ID |
| device_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | Associated device ID |
| value | decimal(10,2) | NULLABLE | Sensor value |
| recorded_at | timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Reading timestamp |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (device_id)

**Relationships:**
- Many-to-one with devices (device_id)

---

### appliances

**Purpose:** Store appliance energy consumption data

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Appliance ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | Owner user ID |
| device_id | bigint(20) UNSIGNED | NULLABLE, INDEXED | Associated device ID |
| name | varchar(255) | NOT NULL | Appliance name |
| category | varchar(255) | NULLABLE | Appliance category |
| daily_kwh | decimal(10,2) | NOT NULL | Daily energy consumption (kWh) |
| runtime_hours | decimal(10,2) | NOT NULL | Daily runtime (hours) |
| monthly_cost | decimal(10,2) | NOT NULL | Estimated monthly cost |
| percentage | decimal(5,2) | NOT NULL, DEFAULT 0.00 | Percentage of total usage |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (device_id)

**Relationships:**
- Many-to-one with users (user_id)
- Many-to-one with devices (device_id)

---

## Energy Usage Tables

### daily_usage

**Purpose:** Store daily energy consumption

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Record ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| usage_date | date | NOT NULL | Date of usage |
| kwh | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Energy consumed (kWh) |
| cost | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Cost of energy |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)

---

### hourly_usage

**Purpose:** Store hourly energy consumption

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Record ID |
| user_id | bigint(20) UNSIGNED | NULLABLE, INDEXED | User ID |
| usage_date | date | NULLABLE | Date of usage |
| hour | int(11) | NULLABLE | Hour (0-23) |
| kwh | decimal(10,2) | NULLABLE | Energy consumed (kWh) |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)

---

### weekly_usage

**Purpose:** Store weekly energy consumption

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Record ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| week_start | date | NOT NULL | Week start date |
| week_end | date | NOT NULL | Week end date |
| total_kwh | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Total energy (kWh) |
| total_cost | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Total cost |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id, week_start)

**Relationships:**
- Many-to-one with users (user_id)

---

### monthly_usage

**Purpose:** Store monthly energy consumption

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Record ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| month | date | NOT NULL | Month (first day) |
| total_kwh | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Total energy (kWh) |
| total_cost | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Total cost |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id, month)

**Relationships:**
- Many-to-one with users (user_id)

---

### tariff_rates

**Purpose:** Store electricity tariff rates by time

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Rate ID |
| time_start | time | NOT NULL | Rate start time |
| time_end | time | NOT NULL | Rate end time |
| rate | decimal(10,4) | NOT NULL | Rate per kWh |
| description | varchar(255) | NULLABLE | Rate description |
| created_at | timestamp | NULLABLE | Record creation timestamp |
| updated_at | timestamp | NULLABLE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)

**Notes:**
- Used to calculate energy costs based on time of use
- Sample data includes off-peak, morning, peak, and night rates

---

## Alert & Notification Tables

### alerts

**Purpose:** Store device alerts

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Alert ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| device_id | bigint(20) UNSIGNED | NULLABLE, INDEXED | Associated device ID |
| type | varchar(255) | NOT NULL | Alert type |
| message | text | NOT NULL | Alert message |
| severity | enum('low','medium','high','critical') | NOT NULL, DEFAULT 'low' | Alert severity |
| is_read | tinyint(1) | NOT NULL, DEFAULT 0 | Read status |
| is_resolved | tinyint(1) | NOT NULL, DEFAULT 0 | Resolved status |
| resolved_at | timestamp | NULLABLE | Resolution timestamp |
| created_at | timestamp | NULLABLE | Alert creation timestamp |
| updated_at | timestamp | NULLABLE | Alert update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (device_id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)
- Many-to-one with devices (device_id)

**Notes:**
- Code expects a `system_alerts` table with different structure
- Code expects columns: `title`, `alert_type`, `severity`, `status`, `source_component`, `service_name`

---

### recommendations

**Purpose:** Store energy saving recommendations

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Recommendation ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| title | varchar(255) | NOT NULL | Recommendation title |
| description | text | NOT NULL | Detailed description |
| potential_savings | decimal(10,2) | NULLABLE | Potential savings amount |
| is_read | tinyint(1) | NOT NULL, DEFAULT 0 | Read status |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)

---

## System Tables

### energy_targets

**Purpose:** Store monthly energy targets

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Target ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| target_kwh | decimal(10,2) | NOT NULL | Target energy (kWh) |
| month | date | NOT NULL | Target month |
| achieved | tinyint(1) | NOT NULL, DEFAULT 0 | Achievement status |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (user_id, month)

**Relationships:**
- Many-to-one with users (user_id)

---

### energy_reductions

**Purpose:** Store energy reduction goals

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Goal ID |
| user_id | bigint(20) UNSIGNED | NOT NULL, INDEXED | User ID |
| title | varchar(255) | NOT NULL | Goal title |
| target_percentage | decimal(5,2) | NOT NULL | Target reduction % |
| target_kwh | decimal(10,2) | NOT NULL | Target reduction (kWh) |
| baseline_kwh | decimal(10,2) | NOT NULL | Baseline consumption |
| current_kwh | decimal(10,2) | NOT NULL, DEFAULT 0.00 | Current consumption |
| reduction_achieved | decimal(5,2) | NOT NULL, DEFAULT 0.00 | Reduction achieved % |
| start_date | date | NOT NULL | Goal start date |
| end_date | date | NOT NULL | Goal end date |
| status | enum('active','completed','failed') | NOT NULL, DEFAULT 'active' | Goal status |
| weekly_progress | longtext | NULLABLE, JSON VALIDATED | Weekly progress data |
| notes | text | NULLABLE | Additional notes |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)

---

### energy_savings

**Purpose:** Track energy savings achievements

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Savings ID |
| user_id | bigint(20) UNSIGNED | NULLABLE, INDEXED | User ID |
| money_saved | decimal(10,2) | NULLABLE | Money saved |
| co2_reduced_kg | decimal(10,2) | NULLABLE | CO2 reduced (kg) |
| efficiency_percent | decimal(5,2) | NULLABLE | Efficiency percentage |
| period_start | date | NULLABLE | Period start |
| period_end | date | NULLABLE | Period end |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (user_id)

**Relationships:**
- Many-to-one with users (user_id)

---

### cache

**Purpose:** Application cache storage

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| key | varchar(255) | PRIMARY KEY | Cache key |
| value | mediumtext | NOT NULL | Cached value |
| expiration | int(11) | NOT NULL, INDEXED | Expiration timestamp |

**Indexes:**
- PRIMARY KEY (key)
- INDEX (expiration)

---

### cache_locks

**Purpose:** Cache locking mechanism

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| key | varchar(255) | PRIMARY KEY | Lock key |
| owner | varchar(255) | NOT NULL | Lock owner |
| expiration | int(11) | NOT NULL, INDEXED | Lock expiration |

**Indexes:**
- PRIMARY KEY (key)
- INDEX (expiration)

---

### jobs

**Purpose:** Job queue for background tasks

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Job ID |
| queue | varchar(255) | NOT NULL, INDEXED | Queue name |
| payload | longtext | NOT NULL | Job payload |
| attempts | tinyint(3) UNSIGNED | NOT NULL | Number of attempts |
| reserved_at | int(10) UNSIGNED | NULLABLE | Reservation timestamp |
| available_at | int(10) UNSIGNED | NOT NULL | Available timestamp |
| created_at | int(10) UNSIGNED | NOT NULL | Creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (queue)

---

### failed_jobs

**Purpose:** Store failed jobs

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Failed job ID |
| uuid | varchar(255) | NOT NULL, UNIQUE | Job UUID |
| connection | text | NOT NULL | Connection name |
| queue | text | NOT NULL | Queue name |
| payload | longtext | NOT NULL | Job payload |
| exception | longtext | NOT NULL | Exception message |
| failed_at | timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Failure timestamp |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (uuid)

---

### job_batches

**Purpose:** Track job batches

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | varchar(255) | PRIMARY KEY | Batch ID |
| name | varchar(255) | NOT NULL | Batch name |
| total_jobs | int(11) | NOT NULL | Total jobs in batch |
| pending_jobs | int(11) | NOT NULL | Pending jobs |
| failed_jobs | int(11) | NOT NULL | Failed jobs |
| failed_job_ids | longtext | NOT NULL | Failed job IDs |
| options | mediumtext | NULLABLE | Batch options |
| cancelled_at | int(11) | NULLABLE | Cancellation timestamp |
| created_at | int(11) | NOT NULL | Creation timestamp |
| finished_at | int(11) | NULLABLE | Completion timestamp |

**Indexes:**
- PRIMARY KEY (id)

---

### migrations

**Purpose:** Track database migrations

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | int(10) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Migration ID |
| migration | varchar(255) | NOT NULL | Migration name |
| batch | int(11) | NOT NULL | Batch number |

**Indexes:**
- PRIMARY KEY (id)

---

### personal_access_tokens

**Purpose:** API access tokens

| Column | Type | Attributes | Description |
|--------|------|------------|-------------|
| id | bigint(20) UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Token ID |
| tokenable_type | varchar(255) | NOT NULL | Token owner type |
| tokenable_id | bigint(20) UNSIGNED | NOT NULL | Token owner ID |
| name | text | NOT NULL | Token name |
| token | varchar(64) | NOT NULL, UNIQUE | Token hash |
| abilities | text | NULLABLE | Token abilities |
| last_used_at | timestamp | NULLABLE, INDEXED | Last used timestamp |
| expires_at | timestamp | NULLABLE, INDEXED | Expiration timestamp |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (token)
- INDEX (tokenable_type, tokenable_id)
- INDEX (expires_at)

---

## Relationships

### User Relationships
- **users** (1) → (N) devices
- **users** (1) → (N) daily_usage
- **users** (1) → (N) hourly_usage
- **users** (1) → (N) weekly_usage
- **users** (1) → (N) monthly_usage
- **users** (1) → (N) alerts
- **users** (1) → (N) appliances
- **users** (1) → (N) energy_reductions
- **users** (1) → (N) energy_savings
- **users** (1) → (N) energy_targets
- **users** (1) → (N) recommendations

### Device Relationships
- **devices** (N) → (1) users
- **devices** (1) → (N) device_logs
- **devices** (1) → (N) device_readings
- **devices** (1) → (N) alerts
- **devices** (1) → (N) appliances

### Alert Relationships
- **alerts** (N) → (1) users
- **alerts** (N) → (1) devices

---

## Index Analysis

### Missing Indexes
1. **devices**: Should have index on (user_id, status) for filtering
2. **daily_usage**: Should have composite index on (user_id, usage_date)
3. **alerts**: Should have index on (user_id, is_resolved, severity)
4. **device_readings**: Should have index on (device_id, recorded_at)
5. **hourly_usage**: Should have composite index on (user_id, usage_date, hour)

### Existing Indexes
The database has appropriate primary keys and foreign key indexes. However, many composite indexes for common query patterns are missing.

---

## Schema Mismatches

### Critical Mismatches Between Code and Database

#### users Table
**Code Expects:**
- `full_name` (string)
- `username` (string, nullable)
- `email_address` (string)
- `password_hash` (string)

**Database Has:**
- `name` (string)
- `email` (string)
- `password` (string)

**Impact:** HIGH - Authentication endpoints will fail

#### devices Table
**Code Expects:**
- `device_name` (string)
- `location_text` (string)
- `home_id` (integer)
- `category_id` (integer)
- `health_score` (integer)
- `warning_level` (string)
- `is_online` (boolean)
- `last_seen_at` (datetime)

**Database Has:**
- `name` (string)
- `location` (string)
- `user_id` (integer)
- `category` (string)
- `status` (enum)
- `is_on` (boolean)
- `last_seen` (datetime)

**Impact:** CRITICAL - All device endpoints will fail

#### alerts Table
**Code Expects:**
- Table name: `system_alerts`
- `home_id` (integer)
- `title` (string)
- `alert_type` (string)
- `severity` (string)
- `status` (string)
- `source_component` (string)
- `service_name` (string)

**Database Has:**
- Table name: `alerts`
- `user_id` (integer)
- `device_id` (integer)
- `type` (string)
- `message` (text)
- `severity` (enum)
- `is_resolved` (boolean)

**Impact:** CRITICAL - All alert endpoints will fail

#### Missing Tables in Database
The code expects these tables that don't exist:
- `device_categories` - Device categories lookup
- `energy_usage_summary` - Energy usage summaries
- `homes` - Smart homes
- `login_attempts` - Login attempt logging
- `password_resets` - Password reset tokens (different structure)
- `social_accounts` - OAuth accounts
- `sync_logs` - Device sync logs
- `user_sessions` - JWT session tracking

---

## Recommended Improvements

### 1. Schema Alignment
Create migration scripts to:
1. Rename `users.name` to `users.full_name`
2. Rename `users.email` to `users.email_address`
3. Rename `users.password` to `users.password_hash`
4. Add `users.username` column
5. Create `device_categories` table
6. Create `homes` table
7. Update `devices` table structure
8. Create `system_alerts` table or update `alerts` table
9. Create `energy_usage_summary` table
10. Create `password_resets` table with proper structure

### 2. Add Missing Indexes
```sql
CREATE INDEX idx_devices_user_status ON devices(user_id, status);
CREATE INDEX idx_daily_usage_user_date ON daily_usage(user_id, usage_date);
CREATE INDEX idx_alerts_user_resolved_severity ON alerts(user_id, is_resolved, severity);
CREATE INDEX idx_device_readings_device_time ON device_readings(device_id, recorded_at);
CREATE INDEX idx_hourly_usage_user_date_hour ON hourly_usage(user_id, usage_date, hour);
```

### 3. Add Foreign Key Constraints
```sql
ALTER TABLE devices ADD CONSTRAINT fk_devices_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE alerts ADD CONSTRAINT fk_alerts_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE alerts ADD CONSTRAINT fk_alerts_device 
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL;
```

### 4. Add Data Validation
- Add CHECK constraints for valid data ranges
- Add triggers for data consistency
- Add default values where appropriate

---

## Conclusion

The database schema is comprehensive but has significant mismatches with the application code. The most critical issue is that the code expects a different table structure than what exists in the database. This must be resolved before the application can function properly.

**Priority Actions:**
1. Align database schema with code expectations
2. Add missing tables
3. Add missing indexes for performance
4. Add foreign key constraints for data integrity
5. Create migration scripts for version control

---

**Documentation Status:** Complete  
**Next Steps:** Create database migration scripts to align schema with code

# 🏠 ECO Smart Home Energy — Backend API

A PHP backend system for managing smart home energy consumption, devices, alerts, and user authentication.

---

## 📋 Project Overview

**ECO Smart Home Energy** is a RESTful API backend built with plain PHP and MySQL (PDO). It powers a smart home dashboard that tracks energy usage, monitors IoT devices, and sends system alerts.

---

## 🗃️ Database

- **Name:** `smart_home_energy`
- **Engine:** MySQL / MariaDB (InnoDB)
- **Charset:** utf8mb4

### Tables

| Table | Description |
|-------|-------------|
| `users` | Registered users with hashed passwords |
| `homes` | Smart homes linked to users |
| `devices` | IoT devices per home |
| `device_categories` | Categories: Lighting, Climate, Security, etc. |
| `energy_usage_points` | Hourly energy readings (kWh) |
| `energy_usage_summary` | Daily / weekly / monthly summaries |
| `system_alerts` | Device alerts with severity levels |
| `login_attempts` | Security log for login tries |
| `password_resets` | Password reset tokens |
| `social_accounts` | OAuth / Google login links |
| `sync_logs` | Device sync history |
| `user_sessions` | Active session tokens |

---

## 🔌 API Endpoints

### Auth
| Method | File | Description |
|--------|------|-------------|
| POST | `api_signup.php` | Register new user |
| POST | `api_login.php` | Login & get JWT token |
| POST | `api_forgot_password.php` | Request password reset |
| POST | `api_reset_password.php` | Reset password with token |

### Devices
| Method | File | Description |
|--------|------|-------------|
| GET | `api_devices_list.php` | List devices with filters & sort |
| GET | `api_devices_dashboard.php` | Dashboard view with search |
| GET | `api_categories_counts.php` | Devices count per category |

### Energy Usage
| Method | File | Description |
|--------|------|-------------|
| GET | `api_usage_overview.php` | Daily / weekly / monthly summary |
| GET | `api_usage_trend.php` | Hourly trend for today |

### Alerts
| Method | File | Description |
|--------|------|-------------|
| GET | `api_alerts_list.php` | List alerts with filters |
| GET | `api_alerts_counts.php` | Count by severity |
| GET | `api_alerts_trend.php` | Alerts trend (last 7 days) |
| POST | `api_alert_acknowledge_all.php` | Acknowledge all active alerts |

### System
| Method | File | Description |
|--------|------|-------------|
| GET | `api_system_health.php` | System health check |

---

## 🔐 Authentication

All protected endpoints require a **JWT token** in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

JWT is implemented manually using HS256 and configured through `.env`.

---

## ⚙️ Setup & Installation

### Requirements
- PHP 8.x
- MySQL / MariaDB
- Apache or Nginx (or PHP built-in server for dev)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/eco-smart-backend.git
cd eco-smart-backend
```

2. **Create the database**
```bash
mysql -u root -p -e "CREATE DATABASE smart_home_energy CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mysql -u root -p smart_home_energy < database/smart_home_energy.sql
```

3. **Configure the database connection**

Update the existing `.env` file with your database values:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ecosmart
DB_USER=root
DB_PASS=YOUR_PASSWORD
DB_CHARSET=utf8mb4
```

4. **Set your JWT secret**

Update the `.env` file with your secret and app settings:

```dotenv
JWT_SECRET=your_very_long_secret_key_here
JWT_EXPIRATION=86400
```

5. **Install dependencies**

If Composer is available:

```bash
composer install --no-interaction
```

6. **Run locally**

```bash
php -S localhost:8000 -t public
```

---

## 📁 Project Structure

```
eco-smart-backend/
├── .env                     # Environment config (NOT in git)
├── config/                  # App configuration files
│   ├── app.php
│   └── database.php
├── public/                  # Public web root and router
├── src/                     # PHP application source
├── api_login.php
├── api_signup.php
├── api_forgot_password.php
├── api_reset_password.php
│
├── api_devices_list.php
├── api_devices_dashboard.php
├── api_categories_counts.php
│
├── api_usage_overview.php
├── api_usage_trend.php
│
├── api_alerts_list.php
├── api_alerts_counts.php
├── api_alerts_trend.php
├── api_alert_acknowledge_all.php
│
├── api_system_health.php
│
├── login_view.php           # Simple HTML test views
├── signup_view.php
├── devices_view.php
├── alerts_view.php
├── usage_view.php
│
└── database/
    └── smart_home_energy.sql
```

---

## 🛡️ Security Notes

- Passwords hashed with `PASSWORD_BCRYPT`
- SQL injection prevented via PDO prepared statements
- Login attempts are logged in `login_attempts` table
- JWT tokens expire and are stored in `user_sessions`
- `.env` is excluded from version control

---

## 👤 Author

Built with ❤️ using PHP & MySQL.

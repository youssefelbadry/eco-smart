<?php

require_once __DIR__ . '/../bootstrap.php';

use App\Helpers\ResponseHelper;
// bootstrap.php already loads environment variables and autoloading.
$config = require __DIR__ . '/../config/app.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    'POST' => [
        '/api_login.php' => function () use ($config) { require __DIR__ . '/../src/Controllers/AuthController.php'; },
        '/api_signup.php' => function () use ($config) { require __DIR__ . '/../src/Controllers/AuthController.php'; },
        '/api_forgot_password.php' => function () use ($config) { require __DIR__ . '/../src/Controllers/AuthController.php'; },
        '/api_reset_password.php' => function () use ($config) { require __DIR__ . '/../src/Controllers/AuthController.php'; },
        '/api_alert_acknowledge_all.php' => function () use ($config) { require __DIR__ . '/../src/Controllers/AlertController.php'; },
    ],
    'GET' => [
        '/api_devices_list.php' => function () { require __DIR__ . '/../src/Controllers/DeviceController.php'; },
        '/api_devices_dashboard.php' => function () { require __DIR__ . '/../src/Controllers/DeviceController.php'; },
        '/api_categories_counts.php' => function () { require __DIR__ . '/../src/Controllers/DeviceController.php'; },
        '/api_usage_overview.php' => function () { require __DIR__ . '/../src/Controllers/UsageController.php'; },
        '/api_usage_trend.php' => function () { require __DIR__ . '/../src/Controllers/UsageController.php'; },
        '/api_alerts_list.php' => function () { require __DIR__ . '/../src/Controllers/AlertController.php'; },
        '/api_alerts_counts.php' => function () { require __DIR__ . '/../src/Controllers/AlertController.php'; },
        '/api_alerts_trend.php' => function () { require __DIR__ . '/../src/Controllers/AlertController.php'; },
        '/api_system_health.php' => function () { require __DIR__ . '/../src/Controllers/SystemController.php'; },
    ],
];

if (!isset($routes[$method][$path])) {
    ResponseHelper::error('Endpoint not found', 404);
}

$routes[$method][$path]();

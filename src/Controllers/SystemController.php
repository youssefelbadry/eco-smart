<?php

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Auth\Guard;
use App\Repositories\DeviceRepository;
use App\Repositories\AlertRepository;

$config = require __DIR__ . '/../../config/app.php';
$guard = new Guard($config['jwt_secret']);
$user = $guard->authenticate();
$deviceRepo = new DeviceRepository();
$alertRepo = new AlertRepository();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ResponseHelper::error('Method not allowed', 405);
}

$health = $deviceRepo->getHealthSummary((int)$user['sub']);

ResponseHelper::success([
    'health_percent' => (int)($health['health_percent'] ?? 0),
    'online_devices' => (int)($health['online_devices'] ?? 0),
    'active_warnings' => (int)($health['warnings_count'] ?? 0),
]);

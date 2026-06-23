<?php

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Services\UsageService;
use App\Auth\Guard;

$config = require __DIR__ . '/../../config/app.php';
$guard = new Guard($config['jwt_secret']);
$user = $guard->authenticate();
$service = new UsageService();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ResponseHelper::error('Method not allowed', 405);
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($path) {
    case '/api_usage_overview.php':
        $data = $service->getOverview((int)$user['sub']);
        ResponseHelper::success(['data' => $data]);
        break;

    case '/api_usage_trend.php':
        $data = $service->getTrend((int)$user['sub']);
        ResponseHelper::success(['data' => $data]);
        break;

    default:
        ResponseHelper::error('Endpoint not found', 404);
}

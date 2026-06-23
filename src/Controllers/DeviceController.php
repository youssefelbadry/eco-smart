<?php

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\RequestHelper;
use App\Services\DeviceService;
use App\Auth\Guard;

$config = require __DIR__ . '/../../config/app.php';
$guard = new Guard($config['jwt_secret']);
$user = $guard->authenticate();
$service = new DeviceService();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ResponseHelper::error('Method not allowed', 405);
}

$search = RequestHelper::getQueryString('search', '');
$status = RequestHelper::getQueryString('status', '');
$category = RequestHelper::getQueryString('category', '');
$sortBy = RequestHelper::getQueryString('sort_by', 'name');
$sortDir = RequestHelper::getQueryString('sort_dir', 'DESC');

switch ($path) {
    case '/api_devices_list.php':
        $data = $service->getDevices((int)$user['sub'], $search, $status, $category, $sortBy, $sortDir);
        ResponseHelper::success(['data' => $data]);
        break;

    case '/api_devices_dashboard.php':
        $devices = $service->getDevices((int)$user['sub'], $search, $status, $category, $sortBy, $sortDir);
        $categories = $service->getCategoryCounts((int)$user['sub']);
        $total = $service->getTotalDevices((int)$user['sub']);
        $health = $service->getHealthSummary((int)$user['sub']);

        ResponseHelper::success([
            'filters' => [
                'search' => $search,
                'status' => $status,
                'category' => $category,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
            ],
            'system_health' => [
                'percent' => (int)($health['health_percent'] ?? 0),
                'online_devices' => (int)($health['online_devices'] ?? 0),
                'warnings_count' => (int)($health['warnings_count'] ?? 0),
            ],
            'all_devices_count' => $total,
            'categories' => $categories,
            'devices' => $devices,
        ]);
        break;

    case '/api_categories_counts.php':
        $categories = $service->getCategoryCounts((int)$user['sub']);
        $total = $service->getTotalDevices((int)$user['sub']);
        ResponseHelper::success([
            'all_devices_count' => $total,
            'categories' => $categories,
        ]);
        break;

    default:
        ResponseHelper::error('Endpoint not found', 404);
}

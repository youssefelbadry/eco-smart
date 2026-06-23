<?php

namespace App\Controllers;

use App\Helpers\ResponseHelper;
use App\Helpers\RequestHelper;
use App\Services\AlertService;
use App\Auth\Guard;

$config = require __DIR__ . '/../../config/app.php';
$guard = new Guard($config['jwt_secret']);
$user = $guard->authenticate();
$service = new AlertService();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($path) {
    case '/api_alerts_list.php':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            ResponseHelper::error('Method not allowed', 405);
        }

        $tab = RequestHelper::getQueryString('tab', 'all');
        $search = RequestHelper::getQueryString('search', '');
        $status = RequestHelper::getQueryString('status', '');
        $data = $service->listAlerts((int)$user['sub'], $tab, $search, $status);
        ResponseHelper::success(['data' => $data]);
        break;

    case '/api_alerts_counts.php':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            ResponseHelper::error('Method not allowed', 405);
        }

        $data = $service->getCounts((int)$user['sub']);
        ResponseHelper::success(['data' => $data]);
        break;

    case '/api_alerts_trend.php':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            ResponseHelper::error('Method not allowed', 405);
        }

        $data = $service->getTrend((int)$user['sub']);
        ResponseHelper::success(['data' => $data]);
        break;

    case '/api_alert_acknowledge_all.php':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            ResponseHelper::error('Method not allowed', 405);
        }

        $count = $service->acknowledgeAll((int)$user['sub']);
        ResponseHelper::success(['affected_rows' => $count], 'All active alerts acknowledged');
        break;

    default:
        ResponseHelper::error('Endpoint not found', 404);
}

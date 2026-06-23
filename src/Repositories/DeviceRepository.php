<?php

namespace App\Repositories;

use App\Helpers\DbHelper;

class DeviceRepository
{
    public function getDevices(int $userId, string $search = '', string $status = '', string $category = '', string $sortBy = 'name', string $sortDir = 'DESC'): array
    {
        $allowedSort = [
            'name' => 'd.name',
            'status' => 'd.status',
            'category' => 'd.category',
            'last_seen' => 'd.last_seen',
        ];

        $sortColumn = $allowedSort[$sortBy] ?? 'd.name';
        $sortDirection = strtoupper($sortDir) === 'ASC' ? 'ASC' : 'DESC';

        $sql = "SELECT
            d.id,
            d.name AS device_name,
            d.location AS location_text,
            d.status,
            d.category AS category_name,
            d.meta_key AS metric_label,
            d.meta_value AS metric_value,
            d.last_seen AS last_seen_at,
            CASE WHEN d.status = 'online' THEN 100 ELSE 0 END AS health_score,
            d.is_on AS is_online
        FROM devices d
        WHERE d.user_id = :user_id";

        $params = [':user_id' => $userId];

        if ($search !== '') {
            $sql .= " AND (d.name LIKE :search OR d.location LIKE :search OR d.category LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        if ($status !== '') {
            $sql .= " AND d.status = :status";
            $params[':status'] = $status;
        }

        if ($category !== '') {
            $sql .= " AND d.category = :category";
            $params[':category'] = $category;
        }

        $sql .= " ORDER BY {$sortColumn} {$sortDirection}";

        $stmt = DbHelper::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getCategoryCounts(int $userId): array
    {
        $sql = "SELECT d.category AS category_name, COUNT(*) AS devices_count
                FROM devices d
                WHERE d.user_id = :user_id
                GROUP BY d.category
                ORDER BY d.category ASC";

        $stmt = DbHelper::getConnection()->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getTotalDevices(int $userId): int
    {
        $stmt = DbHelper::getConnection()->prepare('SELECT COUNT(*) AS total FROM devices WHERE user_id = :user_id');
        $stmt->execute([':user_id' => $userId]);
        $row = $stmt->fetch();
        return (int)($row['total'] ?? 0);
    }

    public function getHealthSummary(int $userId): array
    {
        $stmt = DbHelper::getConnection()->prepare(
            'SELECT
                COALESCE(ROUND(AVG(CASE WHEN status = "online" THEN 100 ELSE 0 END)), 0) AS health_percent,
                SUM(CASE WHEN status = "online" THEN 1 ELSE 0 END) AS online_devices,
                SUM(CASE WHEN status = "warning" THEN 1 ELSE 0 END) AS warnings_count
            FROM devices
            WHERE user_id = :user_id'
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetch() ?: ['health_percent' => 0, 'online_devices' => 0, 'warnings_count' => 0];
    }
}

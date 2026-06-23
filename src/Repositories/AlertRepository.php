<?php

namespace App\Repositories;

use App\Helpers\DbHelper;

class AlertRepository
{
    public function listAlerts(int $userId, string $tab = 'all', string $search = '', string $status = ''): array
    {
        $sql = 'SELECT id, type, message, severity, is_read, is_resolved, resolved_at, created_at FROM alerts WHERE user_id = :user_id';
        $params = [':user_id' => $userId];

        if ($tab === 'critical' || $tab === 'high' || $tab === 'medium') {
            $sql .= ' AND severity = :severity AND is_resolved = 0';
            $params[':severity'] = $tab;
        } elseif ($tab === 'resolved') {
            $sql .= ' AND is_resolved = 1';
        }

        if ($status !== '') {
            if ($status === 'active') {
                $sql .= ' AND is_resolved = 0';
            } elseif ($status === 'resolved') {
                $sql .= ' AND is_resolved = 1';
            }
        }

        if ($search !== '') {
            $sql .= ' AND (type LIKE :search OR message LIKE :search)';
            $params[':search'] = "%{$search}%";
        }

        $sql .= ' ORDER BY created_at DESC LIMIT 100';
        $stmt = DbHelper::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function counts(int $userId): array
    {
        $stmt = DbHelper::getConnection()->prepare(
            'SELECT
                SUM(CASE WHEN severity = "critical" AND is_resolved = 0 THEN 1 ELSE 0 END) AS critical_count,
                SUM(CASE WHEN severity = "high"     AND is_resolved = 0 THEN 1 ELSE 0 END) AS high_count,
                SUM(CASE WHEN severity = "medium"   AND is_resolved = 0 THEN 1 ELSE 0 END) AS medium_count,
                SUM(CASE WHEN severity = "low"      AND is_resolved = 0 THEN 1 ELSE 0 END) AS low_count,
                SUM(CASE WHEN severity = "info"     AND is_resolved = 0 THEN 1 ELSE 0 END) AS info_count
            FROM alerts
            WHERE user_id = :user_id'
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetch() ?: [];
    }

    public function trend(int $userId): array
    {
        $stmt = DbHelper::getConnection()->prepare(
            'SELECT DATE(created_at) AS day_date, COUNT(*) AS total_alerts
             FROM alerts
             WHERE user_id = :user_id
               AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(created_at)
             ORDER BY day_date ASC'
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function acknowledgeAll(int $userId): int
    {
        $stmt = DbHelper::getConnection()->prepare(
            'UPDATE alerts
             SET is_read = 1, is_resolved = 1, resolved_at = NOW()
             WHERE user_id = :user_id AND is_resolved = 0'
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->rowCount();
    }
}

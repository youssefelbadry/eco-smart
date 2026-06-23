<?php

namespace App\Repositories;

use App\Helpers\DbHelper;

class UsageRepository
{
    public function getOverview(int $userId): array
    {
        $pdo = DbHelper::getConnection();

        $dailyStmt = $pdo->prepare(
            'SELECT usage_date, kwh, cost FROM daily_usage WHERE user_id = :user_id AND usage_date = CURDATE() LIMIT 1'
        );
        $dailyStmt->execute([':user_id' => $userId]);
        $daily = $dailyStmt->fetch();

        $weeklyStmt = $pdo->prepare(
            'SELECT week_start, week_end, total_kwh, total_cost FROM weekly_usage WHERE user_id = :user_id AND week_start <= CURDATE() ORDER BY week_start DESC LIMIT 1'
        );
        $weeklyStmt->execute([':user_id' => $userId]);
        $weekly = $weeklyStmt->fetch();

        $monthlyStmt = $pdo->prepare(
            'SELECT month, total_kwh, total_cost FROM monthly_usage WHERE user_id = :user_id AND month <= DATE_FORMAT(CURDATE(), "%Y-%m-01") ORDER BY month DESC LIMIT 1'
        );
        $monthlyStmt->execute([':user_id' => $userId]);
        $monthly = $monthlyStmt->fetch();

        return [
            'daily' => [
                'period_type' => 'daily',
                'usage_kwh' => $daily['kwh'] ?? 0,
                'baseline_kwh' => 0,
                'target_kwh' => 0,
                'achievement_percent' => 0,
                'period_start' => $daily['usage_date'] ?? null,
                'period_end' => $daily['usage_date'] ?? null,
                'cost' => $daily['cost'] ?? 0,
            ],
            'weekly' => [
                'period_type' => 'weekly',
                'usage_kwh' => $weekly['total_kwh'] ?? 0,
                'baseline_kwh' => 0,
                'target_kwh' => 0,
                'achievement_percent' => 0,
                'period_start' => $weekly['week_start'] ?? null,
                'period_end' => $weekly['week_end'] ?? null,
                'cost' => $weekly['total_cost'] ?? 0,
            ],
            'monthly' => [
                'period_type' => 'monthly',
                'usage_kwh' => $monthly['total_kwh'] ?? 0,
                'baseline_kwh' => 0,
                'target_kwh' => 0,
                'achievement_percent' => 0,
                'period_start' => $monthly['month'] ?? null,
                'period_end' => $monthly['month'] ?? null,
                'cost' => $monthly['total_cost'] ?? 0,
            ],
        ];
    }

    public function getTrend(int $userId): array
    {
        $pdo = DbHelper::getConnection();
        $stmt = $pdo->prepare(
            'SELECT CONCAT(usage_date, " ", LPAD(hour, 2, "0"), ":00:00") AS point_time, kwh AS usage_kwh
             FROM hourly_usage
             WHERE user_id = :user_id
               AND usage_date = CURDATE()
             ORDER BY hour ASC'
        );
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }
}

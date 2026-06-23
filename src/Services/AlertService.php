<?php

namespace App\Services;

use App\Repositories\AlertRepository;

class AlertService
{
    private AlertRepository $repository;

    public function __construct()
    {
        $this->repository = new AlertRepository();
    }

    public function listAlerts(int $userId, string $tab = 'all', string $search = '', string $status = ''): array
    {
        return $this->repository->listAlerts($userId, $tab, $search, $status);
    }

    public function getCounts(int $userId): array
    {
        return $this->repository->counts($userId);
    }

    public function getTrend(int $userId): array
    {
        return $this->repository->trend($userId);
    }

    public function acknowledgeAll(int $userId): int
    {
        return $this->repository->acknowledgeAll($userId);
    }
}

<?php

namespace App\Services;

use App\Repositories\DeviceRepository;

class DeviceService
{
    private DeviceRepository $repository;

    public function __construct()
    {
        $this->repository = new DeviceRepository();
    }

    public function getDevices(int $userId, string $search = '', string $status = '', string $category = '', string $sortBy = 'name', string $sortDir = 'DESC'): array
    {
        return $this->repository->getDevices($userId, $search, $status, $category, $sortBy, $sortDir);
    }

    public function getCategoryCounts(int $userId): array
    {
        return $this->repository->getCategoryCounts($userId);
    }

    public function getTotalDevices(int $userId): int
    {
        return $this->repository->getTotalDevices($userId);
    }

    public function getHealthSummary(int $userId): array
    {
        return $this->repository->getHealthSummary($userId);
    }
}

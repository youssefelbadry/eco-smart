<?php

namespace App\Services;

use App\Repositories\UsageRepository;

class UsageService
{
    private UsageRepository $repository;

    public function __construct()
    {
        $this->repository = new UsageRepository();
    }

    public function getOverview(int $userId): array
    {
        return $this->repository->getOverview($userId);
    }

    public function getTrend(int $userId): array
    {
        return $this->repository->getTrend($userId);
    }
}

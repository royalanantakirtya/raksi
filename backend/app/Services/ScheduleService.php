<?php

namespace App\Services;

use App\Models\Schedule;
use App\Repositories\ScheduleRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class ScheduleService
{
    public function __construct(private ScheduleRepositoryInterface $scheduleRepository) {}

    public function getSchedules(array $filters = []): Collection
    {
        return $this->scheduleRepository->getSchedules($filters);
    }

    public function findById(int $id): Schedule
    {
        return $this->scheduleRepository->findById($id);
    }
}

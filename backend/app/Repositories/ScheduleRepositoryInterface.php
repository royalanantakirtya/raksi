<?php

namespace App\Repositories;

use App\Models\Schedule;
use Illuminate\Database\Eloquent\Collection;

interface ScheduleRepositoryInterface
{
    public function getSchedules(array $filters): Collection;
    public function findById(int $id): Schedule;
}

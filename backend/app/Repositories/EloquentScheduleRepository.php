<?php

namespace App\Repositories;

use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class EloquentScheduleRepository implements ScheduleRepositoryInterface
{
    public function getSchedules(array $filters): Collection
    {
        $query = Schedule::query();

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['tanggal'])) {
            $query->where('tanggal', $filters['tanggal']);
        } else {
            $query->where('tanggal', Carbon::today()->toDateString());
        }

        return $query->with(['location', 'visitType'])->get();
    }

    public function findById(int $id): Schedule
    {
        return Schedule::with(['location', 'visitType.checklistTemplates', 'user'])
            ->findOrFail($id);
    }
}

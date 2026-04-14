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

        // Filter out schedules that already have a visit record
        $query->whereNotExists(function ($q) {
            $q->select(\Illuminate\Support\Facades\DB::raw(1))
              ->from('visits')
              ->whereColumn('visits.location_id', 'schedules.location_id')
              ->whereColumn('visits.user_id', 'schedules.user_id')
              ->whereColumn('visits.tanggal', 'schedules.tanggal');
        });

        return $query->with(['location', 'visitType'])->get();
    }

    public function findById(int $id): Schedule
    {
        return Schedule::with(['location', 'visitType.checklistTemplates', 'user'])
            ->findOrFail($id);
    }
}

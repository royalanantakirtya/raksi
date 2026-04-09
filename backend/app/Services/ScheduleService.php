<?php

namespace App\Services;

use App\Models\Schedule;

class ScheduleService
{
  public function getSchedules(array $filters)
  {
    $query = Schedule::query();

    if (isset($filters['date'])) {
      $query->where('date', $filters['date']);
    }

    // Add more filters as needed

    return $query->get();
  }
}

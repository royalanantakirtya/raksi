<?php

namespace App\Http\Controllers;

use App\Services\ScheduleService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function __construct(private ScheduleService $scheduleService) {}

    public function index(Request $request)
    {
        $schedules = $this->scheduleService->getSchedules($request->all());
        return ScheduleResource::collection($schedules);
    }

    public function show($id)
    {
        $schedule = Schedule::with(['location', 'visitType', 'user'])->findOrFail($id);
        return new ScheduleResource($schedule);
    }
}

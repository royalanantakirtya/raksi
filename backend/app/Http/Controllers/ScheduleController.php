<?php

namespace App\Http\Controllers;

use App\Services\ScheduleService;
use App\Http\Resources\ScheduleResource;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function __construct(private ScheduleService $scheduleService) {}

    public function index(Request $request)
    {
        $filters = $request->all();
        $filters['user_id'] = $request->user()->id;
        $schedules = $this->scheduleService->getSchedules($filters);
        return ScheduleResource::collection($schedules);
    }

    public function show(int $id)
    {
        $schedule = $this->scheduleService->findById($id);
        return new ScheduleResource($schedule);
    }
}


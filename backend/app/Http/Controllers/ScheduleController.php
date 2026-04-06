<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $schedules = Schedule::where('user_id', $request->user()->id)
            ->where('tanggal', $today)
            ->with(['location', 'visitType'])
            ->get();

        return response()->json($schedules);
    }

    public function show($id)
    {
        $schedule = Schedule::with(['location', 'visitType', 'user'])->findOrFail($id);
        return response()->json($schedule);
    }
}

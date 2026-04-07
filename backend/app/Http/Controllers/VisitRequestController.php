<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\VisitRequest;

class VisitRequestController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->visitRequests()->with(['location', 'visitType'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'visit_type_id' => 'required|exists:visit_types,id',
            'notes' => 'nullable|string'
        ]);

        $visitRequest = VisitRequest::create([
            'user_id' => $request->user()->id,
            'location_id' => $validated['location_id'],
            'visit_type_id' => $validated['visit_type_id'],
            'notes' => $validated['notes'],
            'status' => 'pending'
        ]);

        return response()->json($visitRequest, 201);
    }
}

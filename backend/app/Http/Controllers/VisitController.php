<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Services\VisitService;
use App\Http\Requests\StoreVisitRequest;

class VisitController extends Controller
{
    public function __construct(private VisitService $visitService) {}

    public function store(StoreVisitRequest $request)
    {
        $visit = $this->visitService->store($request->validated(), $request->user()->id);
        return response()->json(['message' => 'Berhasil disimpan.', 'visit' => $visit], 201);
    }

    public function show($id)
    {
        $visit = Visit::with(['user', 'location', 'visitType', 'responses', 'findings'])->findOrFail($id);
        return new VisitResource($visit);
    }
}

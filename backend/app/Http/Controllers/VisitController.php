<?php

namespace App\Http\Controllers;

use App\Services\VisitService;
use App\Http\Requests\StoreVisitRequest;
use App\Http\Resources\VisitResource;

/**
 * VisitController - Ver: 1.0.5 (Last Sync: 2026-04-10)
 */
class VisitController extends Controller
{
    public function __construct(private VisitService $visitService) {}

    public function index(\Illuminate\Http\Request $request)
    {
        $visits = $this->visitService->fetchAllVisits($request->user()->id);
        return VisitResource::collection($visits);
    }

    public function store(StoreVisitRequest $request)
    {
        $visit = $this->visitService->store($request->validated(), $request->user()->id);
        return response()->json(['message' => 'Laporan kunjungan berhasil disimpan.', 'visit' => $visit], 201);
    }

    public function show(int $id)
    {
        $visit = $this->visitService->findById($id);
        return new VisitResource($visit);
    }
}

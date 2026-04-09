<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\VisitRequestService;
use App\Http\Requests\StoreVisitRequestRequest;
use App\Transformers\VisitRequestResource;

class VisitRequestController extends Controller
{
    public function __construct(private VisitRequestService $visitRequestService) {}

    public function index(Request $request)
    {
        $visitRequests = $request->user()->visitRequests()->with(['location', 'visitType'])->latest()->get();
        return VisitRequestResource::collection($visitRequests);
    }

    public function store(StoreVisitRequestRequest $request)
    {
        $visitRequest = $this->visitRequestService->store($request->validated());
        return response()->json(['message' => 'Visit request created.', 'visitRequest' => $visitRequest], 201);
    }
}

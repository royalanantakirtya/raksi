<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\VisitRequestService;
use App\Http\Requests\StoreVisitRequestRequest;
use App\Http\Resources\VisitRequestResource;

class VisitRequestController extends Controller
{
    public function __construct(private VisitRequestService $visitRequestService) {}

    public function index(Request $request)
    {
        $visitRequests = $this->visitRequestService->getForUser($request->user()->id);
        return VisitRequestResource::collection($visitRequests);
    }

    public function store(StoreVisitRequestRequest $request)
    {
        $visitRequest = $this->visitRequestService->store($request->validated(), $request->user()->id);
        return response()->json(['message' => 'Visit request created.', 'visitRequest' => $visitRequest], 201);
    }
}

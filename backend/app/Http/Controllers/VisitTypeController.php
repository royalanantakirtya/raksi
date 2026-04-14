<?php

namespace App\Http\Controllers;

use App\Models\VisitType;
use App\Http\Resources\VisitTypeResource;
use Illuminate\Http\Request;

class VisitTypeController extends Controller
{
    public function index()
    {
        $types = VisitType::all();
        return VisitTypeResource::collection($types);
    }

    public function show($id)
    {
        $visitType = VisitType::with('checklistTemplates')->findOrFail($id);
        return new VisitTypeResource($visitType);
    }
}

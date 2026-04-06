<?php

namespace App\Http\Controllers;

use App\Models\VisitType;
use Illuminate\Http\Request;

class VisitTypeController extends Controller
{
    public function index()
    {
        return response()->json(VisitType::all());
    }

    public function show($id)
    {
        $visitType = VisitType::with('checklistTemplates')->findOrFail($id);
        return response()->json($visitType);
    }
}

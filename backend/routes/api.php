<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\VisitTypeController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Core Features
    Route::get('/locations', [LocationController::class, 'index']);
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
    Route::post('/visits', [VisitController::class, 'store']);
    Route::get('/visits/{id}', [VisitController::class, 'show']);
    Route::get('/visit-types', [VisitTypeController::class, 'index']);
    Route::get('/visit-types/{id}', [VisitTypeController::class, 'show']);

    // Visit Requests (Unscheduled Approval)
    Route::get('/visit-requests', [\App\Http\Controllers\VisitRequestController::class, 'index']);
    Route::post('/visit-requests', [\App\Http\Controllers\VisitRequestController::class, 'store']);
});

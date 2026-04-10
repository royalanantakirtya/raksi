<?php

namespace App\Repositories;

use App\Models\VisitRequest;
use Illuminate\Database\Eloquent\Collection;

class EloquentVisitRequestRepository implements VisitRequestRepositoryInterface
{
    public function getForUser(int $userId): Collection
    {
        return VisitRequest::where('user_id', $userId)
            ->with(['location', 'visitType'])
            ->latest()
            ->get();
    }

    public function create(array $data): VisitRequest
    {
        return VisitRequest::create($data);
    }

    public function findById(int $id): VisitRequest
    {
        return VisitRequest::with(['location', 'visitType', 'user'])
            ->findOrFail($id);
    }
}

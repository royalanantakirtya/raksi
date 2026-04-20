<?php

namespace App\Repositories;

use App\Models\Visit;
use Illuminate\Database\Eloquent\Collection;

class EloquentVisitRepository implements VisitRepositoryInterface
{
    public function create(array $data): Visit
    {
        return Visit::create($data);
    }

    public function findById(int $id): Visit
    {
        return Visit::with(['user', 'location', 'visitType', 'responses.template', 'findings'])
            ->findOrFail($id);
    }

    public function getAll(?int $userId = null): Collection
    {
        $query = Visit::with(['user', 'location', 'visitType', 'responses.template', 'findings']);
        
        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->latest()->get();
    }
}

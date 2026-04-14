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
        return Visit::with(['user', 'location', 'visitType', 'responses', 'findings'])
            ->findOrFail($id);
    }

    public function getAll(): Collection
    {
        return Visit::with(['user', 'location', 'visitType', 'responses', 'findings'])->latest()->get();
    }
}

<?php

namespace App\Repositories;

use App\Models\News;
use Illuminate\Database\Eloquent\Collection;

class EloquentNewsRepository implements NewsRepositoryInterface
{
    public function getAll(): Collection
    {
        return News::latest()->get();
    }

    public function create(array $data): News
    {
        return News::create($data);
    }
}

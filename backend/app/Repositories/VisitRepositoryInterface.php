<?php

namespace App\Repositories;

use App\Models\Visit;
use Illuminate\Database\Eloquent\Collection;

interface VisitRepositoryInterface
{
    public function create(array $data): Visit;
    public function findById(int $id): Visit;
    public function getAll(): Collection;
}

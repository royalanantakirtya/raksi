<?php

namespace App\Repositories;

use App\Models\VisitRequest;
use Illuminate\Database\Eloquent\Collection;

interface VisitRequestRepositoryInterface
{
    public function getForUser(int $userId): Collection;
    public function create(array $data): VisitRequest;
    public function findById(int $id): VisitRequest;
}

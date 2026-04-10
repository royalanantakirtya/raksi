<?php

namespace App\Repositories;

use App\Models\News;
use Illuminate\Database\Eloquent\Collection;

interface NewsRepositoryInterface
{
  public function getAll(): Collection;
  public function create(array $data): News;
}

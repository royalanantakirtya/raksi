<?php

namespace App\Repositories;

use App\Models\User;

interface UserRepositoryInterface
{
  public function findByKodeUser(string $kodeUser): ?User;
  public function findById(int $id): ?User;
}

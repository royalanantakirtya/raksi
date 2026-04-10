<?php

namespace App\Repositories;

use App\Models\User;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findByKodeUser(string $kodeUser): ?User
    {
        return User::where('kode_user', $kodeUser)->first();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }
}

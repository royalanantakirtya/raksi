<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private UserRepositoryInterface $userRepository) {}

    public function login(string $kodeUser, string $password): array
    {
        $user = $this->userRepository->findByKodeUser($kodeUser);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'kode_user' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        
        return [
            'token' => $token,
            'user' => $user
        ];
    }

    public function logout(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }

    public function me(Request $request): User
    {
        return $request->user();
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\AuthService;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();
        $result = $this->authService->login($validated['kode_user'], $validated['password']);
        return response()->json($result);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request);
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        $user = $this->authService->me($request);
        return response()->json($user);
    }
}

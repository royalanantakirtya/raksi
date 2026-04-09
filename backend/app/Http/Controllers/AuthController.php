<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\AuthService;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(Request $request)
    {
        $token = $this->authService->login($request->only(['email', 'password']));
        return response()->json(['token' => $token]);
    }

    public function logout()
    {
        $this->authService->logout();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me()
    {
        $user = $this->authService->me();
        return response()->json($user);
    }
}

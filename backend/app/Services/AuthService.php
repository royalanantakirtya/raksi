<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class AuthService
{
  public function __construct()
  {
    if (!in_array(HasApiTokens::class, class_uses(User::class))) {
      throw new \Exception('User model must use HasApiTokens trait for Sanctum.');
    }
  }

  public function login(array $credentials)
  {
    $user = User::where('email', $credentials['email'])->first();

    if (!$user || !Hash::check($credentials['password'], $user->password)) {
      throw new \Exception('Invalid credentials');
    }

    return $user->createToken('auth_token')->plainTextToken;
  }

  public function logout()
  {
    Auth::user()->tokens()->delete();
  }

  public function me()
  {
    return Auth::user();
  }

  // Debug tokens method
  public function debugTokens()
  {
    $tokens = Auth::user()->tokens();
    dd($tokens);
  }
}

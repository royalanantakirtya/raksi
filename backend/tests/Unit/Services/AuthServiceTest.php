<?php

namespace Tests\Unit\Services;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use App\Services\AuthService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Mockery;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    private $userRepository;
    private $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->authService = new AuthService($this->userRepository);
    }

    public function test_login_success(): void
    {
        $password = 'password123';
        $user = User::create([
            'kode_user' => 'U001',
            'nama_user' => 'Test User',
            'password' => Hash::make($password),
            'peran' => 'petugas',
            'cabang' => 'Pusat', // satisfy not null constraint
        ]);

        $this->userRepository->shouldReceive('findByKodeUser')
            ->once()
            ->with('U001')
            ->andReturn($user);

        $result = $this->authService->login('U001', $password);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('token', $result);
        $this->assertArrayHasKey('user', $result);
        $this->assertIsString($result['token']);
        $this->assertEquals($user, $result['user']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::create([
            'kode_user' => 'U001',
            'nama_user' => 'Test User',
            'password' => Hash::make('correct_password'),
            'peran' => 'petugas',
            'cabang' => 'Pusat',
        ]);

        $this->userRepository->shouldReceive('findByKodeUser')
            ->once()
            ->with('U001')
            ->andReturn($user);

        $this->expectException(ValidationException::class);

        $this->authService->login('U001', 'wrong_password');
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}

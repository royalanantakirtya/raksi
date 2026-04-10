<?php

namespace Tests\Unit\Services;

use App\Models\Visit;
use App\Repositories\VisitRepositoryInterface;
use App\Services\VisitService;
use Mockery;
use Tests\TestCase;

class VisitServiceTest extends TestCase
{
    private $visitRepository;
    private $visitService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->visitRepository = Mockery::mock(VisitRepositoryInterface::class);
        $this->visitService = new VisitService($this->visitRepository);
    }

    public function test_find_by_id(): void
    {
        $visit = new Visit();
        $this->visitRepository->shouldReceive('findById')
            ->once()
            ->with(1)
            ->andReturn($visit);

        $result = $this->visitService->findById(1);

        $this->assertEquals($visit, $result);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}

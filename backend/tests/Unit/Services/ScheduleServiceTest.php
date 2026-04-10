<?php

namespace Tests\Unit\Services;

use App\Models\Schedule;
use App\Repositories\ScheduleRepositoryInterface;
use App\Services\ScheduleService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Tests\TestCase;

class ScheduleServiceTest extends TestCase
{
    private $scheduleRepository;
    private $scheduleService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->scheduleRepository = Mockery::mock(ScheduleRepositoryInterface::class);
        $this->scheduleService = new ScheduleService($this->scheduleRepository);
    }

    public function test_get_schedules(): void
    {
        $filters = ['user_id' => 1];
        $expectedSchedules = new Collection([new Schedule()]);

        $this->scheduleRepository->shouldReceive('getSchedules')
            ->once()
            ->with($filters)
            ->andReturn($expectedSchedules);

        $result = $this->scheduleService->getSchedules($filters);

        $this->assertEquals($expectedSchedules, $result);
    }

    public function test_find_by_id(): void
    {
        $schedule = new Schedule();
        $this->scheduleRepository->shouldReceive('findById')
            ->once()
            ->with(1)
            ->andReturn($schedule);

        $result = $this->scheduleService->findById(1);

        $this->assertEquals($schedule, $result);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}

<?php

namespace Tests\Unit\Services;

use App\Models\VisitRequest;
use App\Repositories\VisitRequestRepositoryInterface;
use App\Services\VisitRequestService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Tests\TestCase;

class VisitRequestServiceTest extends TestCase
{
    private $visitRequestRepository;
    private $visitRequestService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->visitRequestRepository = Mockery::mock(VisitRequestRepositoryInterface::class);
        $this->visitRequestService = new VisitRequestService($this->visitRequestRepository);
    }

    public function test_get_for_user(): void
    {
        $userId = 1;
        $expectedRequests = new Collection([new VisitRequest()]);

        $this->visitRequestRepository->shouldReceive('getForUser')
            ->once()
            ->with($userId)
            ->andReturn($expectedRequests);

        $result = $this->visitRequestService->getForUser($userId);

        $this->assertEquals($expectedRequests, $result);
    }

    public function test_store_request(): void
    {
        $userId = 1;
        $data = [
            'location_id' => 1,
            'visit_type_id' => 1,
            'notes' => 'Some notes'
        ];
        $visitRequest = new VisitRequest();

        $this->visitRequestRepository->shouldReceive('create')
            ->once()
            ->with([
                'user_id'       => $userId,
                'location_id'   => $data['location_id'],
                'visit_type_id' => $data['visit_type_id'],
                'notes'         => $data['notes'],
                'status'        => 'pending',
            ])
            ->andReturn($visitRequest);

        $result = $this->visitRequestService->store($data, $userId);

        $this->assertEquals($visitRequest, $result);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}

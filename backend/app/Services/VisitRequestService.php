<?php

namespace App\Services;

use App\Models\VisitRequest;
use App\Repositories\VisitRequestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VisitRequestService
{
    public function __construct(private VisitRequestRepositoryInterface $visitRequestRepository) {}

    public function getForUser(int $userId): Collection
    {
        return $this->visitRequestRepository->getForUser($userId);
    }

    public function store(array $data, int $userId): VisitRequest
    {
        return $this->visitRequestRepository->create([
            'user_id'       => $userId,
            'location_id'   => $data['location_id'],
            'visit_type_id' => $data['visit_type_id'],
            'notes'         => $data['notes'] ?? null,
            'status'        => 'pending',
        ]);
    }
}

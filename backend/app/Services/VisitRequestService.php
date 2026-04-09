<?php

namespace App\Services;

use App\Models\VisitRequest;

class VisitRequestService
{
  public function store(array $data): VisitRequest
  {
    return VisitRequest::create($data);
  }
}

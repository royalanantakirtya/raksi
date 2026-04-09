<?php

namespace App\Services;

use App\Models\Visit;
use App\Models\VisitResponse;
use Illuminate\Support\Facades\DB;

class VisitService
{
  public function store(array $data, int $userId): Visit
  {
    return DB::transaction(function () use ($data, $userId) {
      $visit = Visit::create([
        'kode_kunjungan' => $data['kode_kunjungan'],
        'user_id' => $userId,
        // ... other fields
      ]);

      foreach ($data['responses'] as $response) {
        VisitResponse::create([
          'visit_id' => $visit->id,
          'template_id' => $response['template_id'],
          'value' => $response['value'],
        ]);
      }

      return $visit->load('responses');
    });
  }
}

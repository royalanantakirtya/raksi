<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FindingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visit_id' => $this->visit_id,
            'tipe_temuan' => $this->tipe_temuan,
            'lokasi_detail' => $this->lokasi_detail,
            'deskripsi' => $this->deskripsi,
            'foto' => $this->foto,
            'status' => $this->status,
            'rekomendasi' => $this->rekomendasi,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode_kunjungan' => $this->kode_kunjungan,
            'tanggal' => $this->tanggal,
            'user_id' => $this->user_id,
            'location_id' => $this->location_id,
            'id_mesin' => $this->id_mesin,
            'visit_type_id' => $this->visit_type_id,
            'terjadwal' => $this->terjadwal,
            'waktu_mulai' => $this->waktu_mulai,
            'waktu_selesai' => $this->waktu_selesai,
            'durasi' => $this->durasi,
            'user' => new UserResource($this->whenLoaded('user')),
            'location' => new LocationResource($this->whenLoaded('location')),
            'visit_type' => new VisitTypeResource($this->whenLoaded('visitType')),
            'responses' => VisitResponseResource::collection($this->whenLoaded('responses')),
            'findings' => FindingResource::collection($this->whenLoaded('findings')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

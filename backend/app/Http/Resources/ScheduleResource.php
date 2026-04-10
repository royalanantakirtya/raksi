<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
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
            'kode_jadwal' => $this->kode_jadwal,
            'tanggal' => $this->tanggal,
            'user_id' => $this->user_id,
            'location_id' => $this->location_id,
            'id_mesin' => $this->id_mesin,
            'visit_type_id' => $this->visit_type_id,
            'periode_awal' => $this->periode_awal,
            'periode_akhir' => $this->periode_akhir,
            'user' => new UserResource($this->whenLoaded('user')),
            'location' => new LocationResource($this->whenLoaded('location')),
            'visit_type' => new VisitTypeResource($this->whenLoaded('visitType')),
        ];
    }
}

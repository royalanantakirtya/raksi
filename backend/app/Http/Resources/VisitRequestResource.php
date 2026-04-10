<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitRequestResource extends JsonResource
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
            'user_id' => $this->user_id,
            'location_id' => $this->location_id,
            'visit_type_id' => $this->visit_type_id,
            'notes' => $this->notes,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'user' => new UserResource($this->whenLoaded('user')),
            'location' => new LocationResource($this->whenLoaded('location')),
            'visit_type' => new VisitTypeResource($this->whenLoaded('visitType')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

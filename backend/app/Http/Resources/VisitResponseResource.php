<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitResponseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visit_id' => $this->visit_id,
            'template_id' => $this->template_id,
            'value' => $this->value,
            'template' => new ChecklistTemplateResource($this->whenLoaded('template')),
        ];
    }
}

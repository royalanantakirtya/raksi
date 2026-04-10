<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\VisitTypeResource;

class ChecklistTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visit_type_id' => $this->visit_type_id,
            'field_name' => $this->field_name,
            'label' => $this->label,
            'field_type' => $this->field_type,
            'options' => $this->options,
            'is_required' => $this->is_required,
            'visit_type' => new VisitTypeResource($this->whenLoaded('visitType')),
        ];
    }
}

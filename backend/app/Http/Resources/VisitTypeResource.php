<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_tipe' => $this->nama_tipe,
            'slug' => $this->slug,
            'checklist_templates' => ChecklistTemplateResource::collection($this->whenLoaded('checklistTemplates')),
        ];
    }
}

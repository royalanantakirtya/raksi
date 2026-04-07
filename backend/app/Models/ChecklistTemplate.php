<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChecklistTemplate extends Model
{
    protected $fillable = ['visit_type_id', 'field_name', 'label', 'field_type', 'options', 'is_required'];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_required' => 'boolean',
        ];
    }

    public function visitType()
    {
        return $this->belongsTo(VisitType::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitResponse extends Model
{
    protected $fillable = ['visit_id', 'template_id', 'value'];

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    public function template()
    {
        return $this->belongsTo(ChecklistTemplate::class);
    }
}

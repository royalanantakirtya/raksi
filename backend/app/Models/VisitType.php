<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChecklistTemplate;

class VisitType extends Model
{
    protected $fillable = ['nama_tipe'];

    public function checklistTemplates()
    {
        return $this->hasMany(ChecklistTemplate::class);
    }
}

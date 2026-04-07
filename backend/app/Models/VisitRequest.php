<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitRequest extends Model
{
    protected $fillable = ['user_id', 'location_id', 'visit_type_id', 'status', 'notes', 'approved_by', 'approved_at'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function location() {
        return $this->belongsTo(Location::class);
    }

    public function visitType() {
        return $this->belongsTo(VisitType::class);
    }
}

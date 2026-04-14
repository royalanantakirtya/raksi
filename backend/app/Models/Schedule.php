<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = ['kode_jadwal', 'tanggal', 'user_id', 'location_id', 'id_mesin', 'visit_type_id', 'periode_awal', 'periode_akhir', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function visitType()
    {
        return $this->belongsTo(VisitType::class);
    }
}

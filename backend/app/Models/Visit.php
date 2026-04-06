<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = ['kode_kunjungan', 'tanggal', 'user_id', 'location_id', 'id_mesin', 'visit_type_id', 'terjadwal', 'waktu_mulai', 'waktu_selesai', 'durasi'];

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

    public function responses()
    {
        return $this->hasMany(VisitResponse::class);
    }

    public function findings()
    {
        return $this->hasMany(Finding::class);
    }
}

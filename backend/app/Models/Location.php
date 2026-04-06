<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['kode_lokasi', 'lokasi', 'alamat', 'latitude', 'longitude'];
}

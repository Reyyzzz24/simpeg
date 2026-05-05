<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    protected $table = 'pegawai';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lembur()
    {
        return $this->hasMany(Lembur::class);
    }
    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }
}

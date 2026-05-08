<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';
    protected $guarded = [];
    public const STATUS_KERJA_OPTIONS = ['tetap', 'ptt'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function overtimes()
    {
        return $this->hasMany(Overtime::class, 'pegawai_id');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }
}

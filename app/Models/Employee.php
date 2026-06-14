<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';
    protected $guarded = [];
    public const STATUS_KERJA_OPTIONS = ['tetap', 'ptt'];
    protected $casts = [
        'tahun_lulus' => 'integer',
        'tahun_masuk_kerja' => 'integer',
        'position_ids' => 'array',
    ];

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

    public function getPositions()
    {
        $userId = $this->user_id;
        if (!$userId) return collect();

        $up = UserPosition::where('user_id', $userId)->first();
        if (!$up || empty($up->position_ids)) return collect();

        return Position::whereIn('id', $up->position_ids)->get();
    }
}

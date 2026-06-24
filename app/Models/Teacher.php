<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Teacher extends Model
{
    protected $table = 'teachers';
    protected $guarded = [];
    public const STATUS_KERJA_OPTIONS = ['tetap', 'ptt'];

    protected $casts = [
        'position_ids' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi tunggal (jika masih digunakan untuk satu posisi saja)
     */
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    /**
     * Ganti nama method menjadi getPositions() 
     * agar tidak dideteksi sebagai relasi oleh Eloquent.
     */
    public function getPositions()
    {
        $userId = $this->user_id;
        if (!$userId) {
            return collect();
        }

        $up = UserPosition::where('user_id', $userId)->first();
        if (!$up || empty($up->position_ids)) {
            return collect();
        }

        return Position::whereIn('id', $up->position_ids)->get();
    }
    public function profile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    public function overtimes()
    {
        return $this->hasMany(Overtime::class, 'pegawai_id', 'user_id');
    }
}

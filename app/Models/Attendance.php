<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $table = 'attendances';

    protected $fillable = [
        'user_id',
        'tanggal',
        'jam_masuk',
        'jam_pulang',
        'status_disiplin',
        'total_jam_ajar',
        'jenis_ajar',
        'jam_teori',
        'jam_praktik',
        'jam_normatif_teori',
        'jam_produktif_teori',
        'jam_produktif_praktik',
        'jam_eskul',
        'ada_piket',
        'durasi_hadir_menit',
        'selisih_jam_ajar_menit',
        'status_validasi_ajar',
    ];

    protected function casts(): array
    {
        return [
            'jam_teori' => 'float',
            'jam_praktik' => 'float',
            'jam_normatif_teori' => 'float',
            'jam_produktif_teori' => 'float',
            'jam_produktif_praktik' => 'float',
            'jam_eskul' => 'float',
            'ada_piket' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

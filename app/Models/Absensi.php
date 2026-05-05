<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Absensi extends Model
{
    protected $table = 'absensi'; 

    protected $fillable = [
        'user_id', 
        'tanggal', 
        'jam_masuk', 
        'jam_pulang', 
        'status_disiplin', 
        'total_jam_ajar', 
        'jenis_ajar',
        'durasi_hadir_menit',
        'selisih_jam_ajar_menit',
        'status_validasi_ajar',
    ];

    /**
     * Get the user that owns the absensi record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Overtime extends Model
{
    protected $table = 'overtimes';

    protected $fillable = [
        'pegawai_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'tugas',
        'is_approved',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'is_approved' => 'boolean',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'pegawai_id', 'user_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'pegawai_id', 'user_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'pegawai_id');
    }
}

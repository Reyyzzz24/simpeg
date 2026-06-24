<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'user_id',
        'periode',
        'total_gaji',
        'jabatan_snapshot',
        'position_ids_snapshot',
    ];

    protected $casts = [
        'position_ids_snapshot' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(PayrollDetail::class);
    }

    public function adjustments()
    {
        return $this->hasMany(PayrollAdjustment::class, 'user_id', 'user_id');
    }
}

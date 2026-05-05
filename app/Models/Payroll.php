<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = ['user_id', 'periode', 'total_gaji'];

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
        return $this->hasMany(PayrollAdjustment::class, 'user_id', 'user_id')
            ->whereColumn('periode', 'periode');
    }
}

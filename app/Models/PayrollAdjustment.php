<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollAdjustment extends Model
{
    protected $fillable = [
        'user_id',
        'component_id',
        'amount_type',
        'formula_type',
        'formula_interval_minutes',
        'amount',
        'note',
        'periode',
    ];

    protected $casts = [
        'formula_interval_minutes' => 'integer',
        'amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function component()
    {
        return $this->belongsTo(SalaryComponent::class);
    }
}
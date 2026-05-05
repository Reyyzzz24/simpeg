<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalaryRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'role',
        'sub_role',
        'position_id',
        'is_active',
    ];

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
    public function salaryRuleComponents(): HasMany
    {
        return $this->hasMany(SalaryRuleComponent::class);
    }
}

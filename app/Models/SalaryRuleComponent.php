<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryRuleComponent extends Model
{
    use HasFactory;

    protected $fillable = [
        'salary_rule_id',
        'component_id',
        'amount_type',   // fixed | percentage | formula
        'amount',
    ];

    /**
     * Parent rule
     */
    public function rule(): BelongsTo
    {
        return $this->belongsTo(SalaryRule::class, 'salary_rule_id');
    }

    /**
     * Komponen gaji (master)
     */
    public function component(): BelongsTo
    {
        return $this->belongsTo(SalaryComponent::class, 'component_id');
    }

    /**
     * Scope aktif (opsional kalau nanti kamu tambah is_active)
     */
    public function scopeActive($query)
    {
        return $query->whereHas('rule', function ($q) {
            $q->where('is_active', 1);
        });
    }

    /**
     * Hitung nilai component berdasarkan tipe
     */
    public function calculate($baseSalary = 0, $context = [])
    {
        return match ($this->amount_type) {

            // nominal tetap
            'fixed' => $this->amount ?? 0,

            // persentase dari base salary
            'percentage' => ($baseSalary * ($this->amount ?? 0)) / 100,

            // formula custom (nanti bisa dikembangkan)
            'formula' => $this->evaluateFormula($context),

            default => 0,
        };
    }

    /**
     * Evaluasi formula (placeholder)
     */
    protected function evaluateFormula(array $context = [])
    {
        // contoh sederhana (nanti bisa upgrade ke expression engine)
        return 0;
    }
}
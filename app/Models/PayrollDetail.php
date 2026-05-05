<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollDetail extends Model
{
    protected $fillable = ['payroll_id', 'component_id', 'amount'];

    public function payroll()
    {
        return $this->belongsTo(Payroll::class);
    }

    public function component()
    {
        return $this->belongsTo(SalaryComponent::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PositionAllowance extends Model
{
    protected $fillable = ['position_id', 'component_id', 'amount'];
    public function position()
    {
        return $this->belongsTo(Position::class);
    }
    public function component()
    {
        return $this->belongsTo(SalaryComponent::class);
    }
}

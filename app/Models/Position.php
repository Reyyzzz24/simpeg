<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = ['name'];

    public function allowances()
    {
        return $this->hasMany(PositionAllowance::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryComponent extends Model
{
    protected $fillable = ['name', 'code', 'type', 'default_amount'];

    public function rules()
    {
        return $this->hasMany(SalaryRule::class, 'component_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPosition extends Model
{
    protected $fillable = ['user_id', 'position_ids'];

    protected $casts = [
        'position_ids' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // helper to retrieve Position models for the saved ids
    public function getPositionsAttribute()
    {
        if (empty($this->position_ids)) {
            return collect();
        }

        return Position::whereIn('id', $this->position_ids)->get();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $table = 'guru';
    protected $guarded = [];
    public const STATUS_KERJA_OPTIONS = ['tetap', 'ptt'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}

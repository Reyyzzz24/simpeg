<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AppSetting extends Model
{
    protected $appends = ['logo_url'];

    protected $fillable = [
        'app_name',
        'branch_name',
        'logo_path',
        'primary_color',
        'phone',
        'address',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            [],
            [
                'app_name' => 'SIMPEG',
                'primary_color' => '#2563eb',
            ],
        );
    }

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? Storage::url($this->logo_path) : null;
    }
}

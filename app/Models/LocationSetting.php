<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationSetting extends Model
{
    protected $fillable = [
        'latitude',
        'longitude',
        'radius_meters',
        'enabled',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'radius_meters' => 'integer',
        'enabled' => 'boolean',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            [],
            [
                'latitude' => null,
                'longitude' => null,
                'radius_meters' => 100,
                'enabled' => true,
            ],
        );
    }

    public function isConfigured(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }

    public function toArraySetting(): array
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'radius_meters' => $this->radius_meters,
            'enabled' => $this->enabled,
            'configured' => $this->isConfigured(),
        ];
    }
}

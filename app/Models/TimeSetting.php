<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSetting extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'masuk_start',
        'masuk_end',
        'pulang_start',
        'pulang_end',
    ];

    protected $casts = [
        'masuk_start' => 'datetime:H:i',
        'masuk_end' => 'datetime:H:i',
        'pulang_start' => 'datetime:H:i',
        'pulang_end' => 'datetime:H:i',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            [],
            [
                'masuk_start' => '06:00',
                'masuk_end' => '08:00',
                'pulang_start' => '16:00',
                'pulang_end' => '18:00',
            ],
        );
    }

    public function toTimeWindow(): array
    {
        return [
            'masuk_start' => $this->formatTime($this->masuk_start, '06:00'),
            'masuk_end' => $this->formatTime($this->masuk_end, '08:00'),
            'pulang_start' => $this->formatTime($this->pulang_start, '16:00'),
            'pulang_end' => $this->formatTime($this->pulang_end, '18:00'),
        ];
    }

    private function formatTime(mixed $value, string $fallback): string
    {
        if ($value instanceof \DateTimeInterface) {
            return $value->format('H:i');
        }

        return $value ? substr((string) $value, 0, 5) : $fallback;
    }
}

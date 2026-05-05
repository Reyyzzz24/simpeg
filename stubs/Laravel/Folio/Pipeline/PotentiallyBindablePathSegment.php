<?php

namespace Laravel\Folio\Pipeline;

class PotentiallyBindablePathSegment
{
    protected string $segment;

    public function __construct(string $segment)
    {
        $this->segment = $segment;
    }

    public function variable(): string
    {
        return 'param';
    }

    public function field(): ?string
    {
        return null;
    }

    public function bindable(): bool
    {
        return false;
    }

    public function class(): string
    {
        return '';
    }
}

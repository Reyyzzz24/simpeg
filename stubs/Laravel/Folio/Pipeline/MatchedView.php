<?php

namespace Laravel\Folio\Pipeline;

use Illuminate\Support\Collection;

class MatchedView
{
    public function __construct(string $path, array $args = [], string $mountPath = null)
    {
    }

    public function inlineMiddleware(): Collection
    {
        return collect([]);
    }
}

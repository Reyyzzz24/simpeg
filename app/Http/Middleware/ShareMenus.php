<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use App\Services\MenuService;
use Symfony\Component\HttpFoundation\Response;

class ShareMenus
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            View::share('userMenus', MenuService::getUserMenus());
        }
        
        return $next($request);
    }
}

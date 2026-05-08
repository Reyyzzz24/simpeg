<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;

class MenuService
{
    public static function getUserMenus(): Collection
    {
        $user = Auth::user();
        
        if (!$user) {
            return collect([]);
        }

        $allMenus = config('menus.items', []);
        
        return collect($allMenus)->filter(function ($menu) use ($user) {
            if (isset($menu['permission'])) {
                return $user->hasPermission($menu['permission']);
            }
            
            if (isset($menu['roles']) && is_array($menu['roles'])) {
                return collect($menu['roles'])->contains(function ($role) use ($user) {
                    return $user->hasRole($role);
                });
            }
            
            if (isset($menu['submenus']) && is_array($menu['submenus'])) {
                $menu['submenus'] = collect($menu['submenus'])->filter(function ($submenu) use ($user) {
                    if (isset($submenu['permission'])) {
                        return $user->hasPermission($submenu['permission']);
                    }
                    
                    if (isset($submenu['roles']) && is_array($submenu['roles'])) {
                        return collect($submenu['roles'])->contains(function ($role) use ($user) {
                            return $user->hasRole($role);
                        });
                    }
                    
                    return true;
                })->toArray();
                
                return !empty($menu['submenus']);
            }
            
            return true;
        });
    }

    public static function canAccessMenu(string $menuKey): bool
    {
        $user = Auth::user();
        
        if (!$user) {
            return false;
        }

        $allMenus = config('menus.items', []);
        $menu = collect($allMenus)->firstWhere('key', $menuKey);
        
        if (!$menu) {
            return false;
        }

        if (isset($menu['permission'])) {
            return $user->hasPermission($menu['permission']);
        }
        
        if (isset($menu['roles']) && is_array($menu['roles'])) {
            return collect($menu['roles'])->contains(function ($role) use ($user) {
                return $user->hasRole($role);
            });
        }
        
        return true;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPermission extends Model
{
    protected $fillable = [
        'user_id',
        'permission_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    // Scope to get user name
    public function scopeWithUserName($query)
    {
        return $query->join('users', 'user_permissions.user_id', '=', 'users.id')
                    ->select('user_permissions.*', 'users.name as user_name');
    }

    // Scope to get permission name
    public function scopeWithPermissionName($query)
    {
        return $query->join('permissions', 'user_permissions.permission_id', '=', 'permissions.id')
                    ->select('user_permissions.*', 'permissions.name as permission_name');
    }

    // Scope to get both user and permission names
    public function scopeWithNames($query)
    {
        return $query->join('users', 'user_permissions.user_id', '=', 'users.id')
                    ->join('permissions', 'user_permissions.permission_id', '=', 'permissions.id')
                    ->select('user_permissions.*', 'users.name as user_name', 'permissions.name as permission_name');
    }
}

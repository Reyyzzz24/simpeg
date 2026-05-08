<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\Employee;
use App\Models\Teacher;
use App\Models\Attendance;
use App\Models\Role;
use App\Models\Permission;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'face_hash',
        'face_registered_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'face_hash',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'face_registered_at' => 'datetime',
        ];
    }

    public function pegawai()
    {
        return $this->hasOne(Employee::class, 'user_id');
    }

    public function guru()
    {
        return $this->hasOne(Teacher::class, 'user_id');
    }

    public function absensi()
    {
        return $this->hasMany(Attendance::class, 'user_id');
    }
    public function positions()
    {
        return $this->belongsToMany(
            Position::class,
            'user_positions',
            'user_id',
            'position_id'
        );
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions', 'user_id', 'permission_id');
    }

    public function hasRole($role): bool
    {
        if (is_string($role)) {
            return $this->roles()->where('name', $role)->exists();
        }
        return $this->roles()->where('id', $role)->exists();
    }

    public function hasPermission($permission): bool
    {
        if (is_string($permission)) {
            return $this->permissions()->where('name', $permission)->exists() ||
                   $this->roles()->whereHas('permissions', function ($query) use ($permission) {
                       $query->where('name', $permission);
                   })->exists();
        }
        return $this->permissions()->where('id', $permission)->exists() ||
               $this->roles()->whereHas('permissions', function ($query) use ($permission) {
                   $query->where('id', $permission);
               })->exists();
    }
}

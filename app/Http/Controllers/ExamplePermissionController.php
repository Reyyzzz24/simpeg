<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamplePermissionController extends Controller
{
    public function index()
    {
        // Example: Check permission in controller
        if (!auth()->user()->hasPermission('users.view')) {
            abort(403, 'You do not have permission to view users.');
        }

        $users = User::with('roles', 'permissions')->get();
        
        return Inertia::render('examples/permissions', [
            'users' => $users,
            'userPermissions' => auth()->user()->permissions,
            'userRoles' => auth()->user()->roles,
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        // Example: Check specific permission
        if (!auth()->user()->hasPermission('users.assign-role')) {
            abort(403, 'You do not have permission to assign roles.');
        }

        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $role = Role::findOrFail($request->role_id);
        $user->roles()->syncWithoutDetaching([$role->id]);

        return back()->with('success', 'Role assigned successfully.');
    }

    public function assignPermission(Request $request, User $user)
    {
        // Example: Check if user has specific role
        if (!auth()->user()->hasRole('superadmin') && !auth()->user()->hasRole('admin')) {
            abort(403, 'Only administrators can assign permissions.');
        }

        $request->validate([
            'permission_id' => 'required|exists:permissions,id'
        ]);

        $permission = Permission::findOrFail($request->permission_id);
        $user->permissions()->syncWithoutDetaching([$permission->id]);

        return back()->with('success', 'Permission assigned successfully.');
    }

    public function revokeRole(User $user, Role $role)
    {
        // Example: Multiple permission checks
        if (!auth()->user()->hasPermission('users.edit') || !auth()->user()->hasPermission('users.assign-role')) {
            abort(403, 'You do not have permission to modify user roles.');
        }

        // Prevent removing superadmin role if not superadmin
        if ($role->name === 'superadmin' && !auth()->user()->hasRole('superadmin')) {
            abort(403, 'Only superadmins can modify superadmin roles.');
        }

        $user->roles()->detach($role->id);

        return back()->with('success', 'Role revoked successfully.');
    }

    public function checkUserPermissions(User $user)
    {
        // Example: Get all user permissions (direct + from roles)
        $directPermissions = $user->permissions()->pluck('name')->toArray();
        $rolePermissions = $user->roles()->with('permissions')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name')
            ->toArray();

        $allPermissions = array_unique(array_merge($directPermissions, $rolePermissions));

        return response()->json([
            'user' => $user->name,
            'direct_permissions' => $directPermissions,
            'role_permissions' => $rolePermissions,
            'all_permissions' => $allPermissions,
            'can_view_users' => $user->hasPermission('users.view'),
            'can_create_users' => $user->hasPermission('users.create'),
            'can_edit_users' => $user->hasPermission('users.edit'),
            'can_delete_users' => $user->hasPermission('users.delete'),
        ]);
    }
}

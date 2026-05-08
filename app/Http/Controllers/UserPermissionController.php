<?php

namespace App\Http\Controllers;

use App\Models\UserPermission;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPermissionController extends Controller
{
    public function index()
    {
        $userPermissions = UserPermission::withNames()
            ->orderBy('users.name')
            ->orderBy('permissions.name')
            ->get();

        $stats = [
            'total' => UserPermission::count(),
        ];

        $users = User::orderBy('name')->get(['id', 'name', 'email']);
        $permissions = Permission::orderBy('name')->get(['id', 'name']);

        return Inertia::render('user-permissions/index', [
            'userPermissions' => $userPermissions,
            'stats' => $stats,
            'users' => $users,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'permission_id' => 'required|exists:permissions,id',
        ]);

        // Check if this user permission already exists
        $exists = UserPermission::where('user_id', $request->user_id)
            ->where('permission_id', $request->permission_id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'user_id' => 'User already has this permission.',
            ]);
        }

        UserPermission::create([
            'user_id' => $request->user_id,
            'permission_id' => $request->permission_id,
        ]);

        return back();
    }

    public function update(Request $request, UserPermission $userPermission)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'permission_id' => 'required|exists:permissions,id',
        ]);

        // Check if this user permission already exists (excluding current record)
        $exists = UserPermission::where('user_id', $request->user_id)
            ->where('permission_id', $request->permission_id)
            ->where('id', '!=', $userPermission->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'user_id' => 'User already has this permission.',
            ]);
        }

        $userPermission->update([
            'user_id' => $request->user_id,
            'permission_id' => $request->permission_id,
        ]);

        return back();
    }

    public function destroy(UserPermission $userPermission)
    {
        $userPermission->delete();
        return back();
    }
}

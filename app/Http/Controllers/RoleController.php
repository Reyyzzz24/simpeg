<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::query()
            ->orderBy('name', 'asc')
            ->with('permissions:id,name')
            ->get()
            ->map(fn (Role $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'guard_name' => $r->guard_name,
                'created_at' => $r->created_at?->toDateString(),
                'permission_ids' => $r->permissions->pluck('id')->values(),
            ]);

        $permissions = Permission::query()
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'guard_name' => $p->guard_name,
            ]);

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'stats' => ['total' => $roles->count()],
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'guard_name' => 'required|string|max:255',
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => $validated['guard_name'],
        ]);

        if (!empty($validated['permission_ids'])) {
            $role->permissions()->sync($validated['permission_ids']);
        }

        return back()->with('success', 'Role berhasil ditambahkan.');
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'guard_name' => 'required|string|max:255',
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role->update([
            'name' => $validated['name'],
            'guard_name' => $validated['guard_name'],
        ]);

        $role->permissions()->sync($validated['permission_ids'] ?? []);

        return back()->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role)
    {
        // Prevent delete role yang masih dipakai user.
        $isUsed = User::where('role', $role->name)->exists();
        if ($isUsed) {
            return back()->with('error', 'Role ini masih digunakan oleh user.');
        }

        $role->delete();

        return back()->with('success', 'Role berhasil dihapus.');
    }
}


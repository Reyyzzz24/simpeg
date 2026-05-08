<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::query()
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'guard_name' => $p->guard_name,
                'created_at' => $p->created_at?->toDateString(),
            ]);

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
            'stats' => ['total' => $permissions->count()],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'required|string|max:255',
        ]);

        Permission::create($validated);

        return back()->with('success', 'Permission berhasil ditambahkan.');
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'guard_name' => 'required|string|max:255',
        ]);

        $permission->update($validated);

        return back()->with('success', 'Permission berhasil diperbarui.');
    }

    public function destroy(Permission $permission)
    {
        // Pivot table cascadeOnDelete will clean up assignments.
        $permission->delete();

        return back()->with('success', 'Permission berhasil dihapus.');
    }
}


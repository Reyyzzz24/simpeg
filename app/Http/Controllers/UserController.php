<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Employee;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::orderBy('name', 'asc')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role ?? 'user',
                    'created_at' => $u->created_at?->toDateString(),
                ];
            });

        $stats = [
            'total' => $users->count(),
        ];

        $roles = Role::query()
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn (Role $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'guard_name' => $r->guard_name,
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'stats' => $stats,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string|exists:roles,name',
            'password' => 'required|string|min:8',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);

            $this->syncUserRole($user);

            if ($user->role === 'guru') {
                Teacher::create([
                    'user_id' => $user->id,
                    'nama' => $user->name,
                    'status_kerja' => 'tetap',
                ]);
            }

            if ($user->role === 'pegawai') {
                Employee::create([
                    'user_id' => $user->id,
                    'nama' => $user->name,
                    'status_kerja' => 'tetap',
                ]);
            }
        });

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|string|exists:roles,name',
            'password' => 'nullable|string|min:8',
        ]);

        $oldRole = $user->role;
        $previousRoleNames = $user->roles()->pluck('name')->push($oldRole)->unique()->values()->all();

        DB::transaction(function () use ($user, $validated, $oldRole, $previousRoleNames) {
            $payload = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ];

            if (!empty($validated['password'])) {
                $payload['password'] = Hash::make($validated['password']);
            }

            $user->update($payload);

            $this->syncUserRole($user, $previousRoleNames);

            if ($oldRole !== $user->role) {

                $user->guru()->delete();
                $user->pegawai()->delete();

                if ($user->role === 'guru') {
                    Teacher::create([
                        'user_id' => $user->id,
                        'nama' => $user->name,
                        'status_kerja' => 'tetap',
                    ]);
                }

                if ($user->role === 'pegawai') {
                    Employee::create([
                        'user_id' => $user->id,
                        'nama' => $user->name,
                        'status_kerja' => 'tetap',
                    ]);
                }
            } else {

                if ($user->guru) {
                    $user->guru->update([
                        'nama' => $user->name,
                    ]);
                }

                if ($user->pegawai) {
                    $user->pegawai->update([
                        'nama' => $user->name,
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    private function syncUserRole(User $user, array $previousRoleNames = []): void
    {
        $role = Role::where('name', $user->role)->firstOrFail();

        $staleRoleNames = collect($previousRoleNames)
            ->reject(fn ($roleName) => $roleName === $user->role)
            ->filter()
            ->values();

        if ($staleRoleNames->isNotEmpty()) {
            $stalePermissionIds = Role::query()
                ->whereIn('name', $staleRoleNames)
                ->with('permissions:id')
                ->get()
                ->pluck('permissions')
                ->flatten()
                ->pluck('id')
                ->unique()
                ->values()
                ->all();

            if (!empty($stalePermissionIds)) {
                $user->permissions()->detach($stalePermissionIds);
            }
        }

        $user->roles()->sync([$role->id]);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}

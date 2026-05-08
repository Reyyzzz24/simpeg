<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Get all users with their roles
        $users = DB::table('users')
            ->join('user_roles', 'users.id', '=', 'user_roles.user_id')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->select('users.id as user_id', 'users.name as user_name', 'roles.name as role_name')
            ->get();

        // Get all permissions
        $permissions = DB::table('permissions')->pluck('id', 'name')->toArray();

        $now = Carbon::now();

        foreach ($users as $user) {
            $rolePermissions = $this->getRolePermissions($user->role_name, $permissions);
            
            foreach ($rolePermissions as $permissionName) {
                if (isset($permissions[$permissionName])) {
                    DB::table('user_permissions')->updateOrInsert([
                        'user_id' => $user->user_id,
                        'permission_id' => $permissions[$permissionName],
                    ], [
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }
        }

        $this->command->info('User permissions seeded successfully!');
    }

    private function getRolePermissions(string $role, array $availablePermissions): array
    {
        switch ($role) {
            case 'superadmin':
                // Superadmin gets all permissions
                return array_keys($availablePermissions);

            case 'admin':
                return [
                    'dashboard.view',
                    'users.view', 'users.create', 'users.edit',
                    'roles.view', 'permissions.view',
                    'employees.view', 'employees.create', 'employees.edit',
                    'teachers.view', 'teachers.create', 'teachers.edit',
                    'presence.view', 'presence.create', 'presence.edit',
                    'overtime.view', 'overtime.create', 'overtime.edit',
                    'payroll.view', 'payroll.create',
                    'positions.view', 'positions.create', 'positions.edit',
                    'salary-components.view', 'salary-rules.view',
                    'reports.view',
                    'announcements.view', 'announcements.create', 'announcements.edit',
                    'time-settings.view', 'time-settings.edit',
                ];

            case 'pegawai':
                return [
                    'dashboard.view',
                    'presence.view', 'presence.self', 'presence.self.history',
                    'overtime.view', 'overtime.create',
                    'payroll.view',
                    'announcements.view',
                ];

            case 'guru':
                return [
                    'dashboard.view',
                    'presence.view', 'presence.self', 'presence.self.history', 
                    'presence.teacher.checkout', 'presence.teacher.checkout.store',
                    'overtime.view', 'overtime.create',
                    'payroll.view',
                    'announcements.view',
                ];

            case 'user':
                return [
                    'dashboard.view',
                    'announcements.view',
                ];

            default:
                return [];
        }
    }
}

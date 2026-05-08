<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Get role IDs
        $superadminRole = DB::table('roles')->where('name', 'superadmin')->first();
        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        $pegawaiRole = DB::table('roles')->where('name', 'pegawai')->first();
        $guruRole = DB::table('roles')->where('name', 'guru')->first();
        $userRole = DB::table('roles')->where('name', 'user')->first();

        // Get all permissions
        $allPermissions = DB::table('permissions')->pluck('id', 'name')->toArray();

        // Superadmin gets all permissions
        if ($superadminRole) {
            foreach ($allPermissions as $permissionId) {
                DB::table('role_has_permissions')->updateOrInsert([
                    'role_id' => $superadminRole->id,
                    'permission_id' => $permissionId,
                ]);
            }
        }

        // Admin permissions (most but not all)
        if ($adminRole) {
            $adminPermissions = [
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

            foreach ($adminPermissions as $permissionName) {
                if (isset($allPermissions[$permissionName])) {
                    DB::table('role_has_permissions')->updateOrInsert([
                        'role_id' => $adminRole->id,
                        'permission_id' => $allPermissions[$permissionName],
                    ]);
                }
            }
        }

        // Pegawai permissions
        if ($pegawaiRole) {
            $pegawaiPermissions = [
                'dashboard.view',
                'presence.view', 'presence.self', 'presence.self.history',
                'overtime.view', 'overtime.create',
                'payroll.view',
                'announcements.view',
            ];

            foreach ($pegawaiPermissions as $permissionName) {
                if (isset($allPermissions[$permissionName])) {
                    DB::table('role_has_permissions')->updateOrInsert([
                        'role_id' => $pegawaiRole->id,
                        'permission_id' => $allPermissions[$permissionName],
                    ]);
                }
            }
        }

        // Guru permissions
        if ($guruRole) {
            $guruPermissions = [
                'dashboard.view',
                'presence.view', 'presence.self', 'presence.self.history', 'presence.teacher.checkout', 'presence.teacher.checkout.store',
                'overtime.view', 'overtime.create',
                'payroll.view',
                'announcements.view',
            ];

            foreach ($guruPermissions as $permissionName) {
                if (isset($allPermissions[$permissionName])) {
                    DB::table('role_has_permissions')->updateOrInsert([
                        'role_id' => $guruRole->id,
                        'permission_id' => $allPermissions[$permissionName],
                    ]);
                }
            }
        }

        // Basic user permissions
        if ($userRole) {
            $userPermissions = [
                'dashboard.view',
                'announcements.view',
            ];

            foreach ($userPermissions as $permissionName) {
                if (isset($allPermissions[$permissionName])) {
                    DB::table('role_has_permissions')->updateOrInsert([
                        'role_id' => $userRole->id,
                        'permission_id' => $allPermissions[$permissionName],
                    ]);
                }
            }
        }

        // Create default superadmin user if not exists
        if ($superadminRole && !DB::table('users')->where('email', 'superadmin@example.com')->exists()) {
            $superadminUserId = DB::table('users')->insertGetId([
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Assign superadmin role to user
            DB::table('user_roles')->updateOrInsert([
                'user_id' => $superadminUserId,
                'role_id' => $superadminRole->id,
            ], [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

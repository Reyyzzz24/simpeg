<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('guard_name')->index();
            $table->timestamps();
        });

        // Seed default permissions ala sistem akademik/siakad: module.action
        $modules = [
            'roles',
            'permissions',
            'users',
            'dashboard',
            'presence',
            'overtime',
            'payroll',
            'positions',
            'salary-components',
            'salary-rules',
            'reports',
            'announcements',
            'employees',
            'teachers',
        ];

        $actionsByModule = [
            '*' => ['view', 'create', 'edit', 'delete'],
            'users' => ['view', 'create', 'edit', 'delete', 'assign-role', 'reset-password'],
            'dashboard' => ['view'],
            'reports' => ['view'],
        ];

        foreach ($modules as $module) {
            $actions = $actionsByModule[$module] ?? $actionsByModule['*'];
            foreach ($actions as $action) {
                $name = "{$module}.{$action}";
                DB::table('permissions')->updateOrInsert(
                    ['name' => $name, 'guard_name' => 'web'],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};


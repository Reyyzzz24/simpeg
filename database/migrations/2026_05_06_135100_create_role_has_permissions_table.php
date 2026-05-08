<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_has_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->unsignedBigInteger('role_id');

            $table->primary(['permission_id', 'role_id']);

            $table->foreign('permission_id')
                ->references('id')
                ->on('permissions')
                ->cascadeOnDelete();

            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->cascadeOnDelete();
        });

        // Assign default: role superadmin gets all permissions.
        $superadminRoleId = DB::table('roles')->where('name', 'superadmin')->value('id');
        if ($superadminRoleId) {
            $permissionIds = DB::table('permissions')->pluck('id')->toArray();
            foreach ($permissionIds as $pid) {
                DB::table('role_has_permissions')->updateOrInsert([
                    'permission_id' => $pid,
                    'role_id' => $superadminRoleId,
                ], []);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('role_has_permissions');
    }
};


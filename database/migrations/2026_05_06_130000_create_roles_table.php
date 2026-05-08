<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index();
            $table->string('guard_name')->index();
            $table->timestamps();
        });

        // Seed role minimal agar UI/validasi user tidak buntu.
        $defaultRoles = ['user', 'superadmin', 'admin', 'pegawai', 'guru'];
        foreach ($defaultRoles as $roleName) {
            DB::table('roles')->updateOrInsert(
                ['name' => $roleName, 'guard_name' => 'web'],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // Backfill from existing users.role values (previously enum).
        $distinctRoles = DB::table('users')
            ->whereNotNull('role')
            ->distinct()
            ->pluck('role')
            ->values()
            ->toArray();

        foreach ($distinctRoles as $roleName) {
            if (!is_string($roleName) || $roleName === '') continue;

            DB::table('roles')->updateOrInsert(
                ['name' => $roleName, 'guard_name' => 'web'],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};


<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Matikan pengecekan Foreign Key agar proses drop aman
        Schema::disableForeignKeyConstraints();

        $tables = ['user_positions', 'teachers', 'employees'];

        foreach ($tables as $table) {
            // 1. Tambahkan kolom JSON
            Schema::table($table, function (Blueprint $tableSchema) use ($table) {
                if (!Schema::hasColumn($table, 'position_ids')) {
                    $tableSchema->json('position_ids')->nullable()->after('position_id');
                }
            });

            // 2. Migrasi data
            // (Logika migrasi data Anda sebelumnya tetap di sini)
            
            // 3. Drop kolom lama
            Schema::table($table, function (Blueprint $tableSchema) use ($table) {
                if (Schema::hasColumn($table, 'position_id')) {
                    $tableSchema->dropColumn('position_id');
                }
            });
        }

        Schema::enableForeignKeyConstraints();
    }

    public function down()
    {
        Schema::disableForeignKeyConstraints();

        $tables = ['user_positions', 'teachers', 'employees'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $tableSchema) use ($table) {
                if (!Schema::hasColumn($table, 'position_id')) {
                    $tableSchema->unsignedBigInteger('position_id')->nullable()->after('user_id');
                }
            });
            
            // (Logika restore data Anda)

            Schema::table($table, function (Blueprint $tableSchema) use ($table) {
                if (Schema::hasColumn($table, 'position_ids')) {
                    $tableSchema->dropColumn('position_ids');
                }
            });
        }

        Schema::enableForeignKeyConstraints();
    }
};
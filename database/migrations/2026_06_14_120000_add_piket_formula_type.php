<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('salary_rule_components')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver !== 'mysql') {
            return;
        }

        // Ensure existing values that may be 'piket' in other tables are handled
        // No rows expected yet, but be safe.

        DB::statement(
            "ALTER TABLE salary_rule_components MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik', 'piket') NOT NULL DEFAULT 'hadir'"
        );

        if (Schema::hasTable('payroll_adjustments')) {
            DB::statement(
                "ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik', 'piket') NOT NULL DEFAULT 'hadir'"
            );
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('salary_rule_components')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver !== 'mysql') {
            return;
        }

        // Set any 'piket' values back to 'hadir' to allow enum shrink
        DB::table('salary_rule_components')
            ->where('formula_type', 'piket')
            ->update(['formula_type' => 'hadir']);

        DB::statement(
            "ALTER TABLE salary_rule_components MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik') NOT NULL DEFAULT 'hadir'"
        );

        if (Schema::hasTable('payroll_adjustments')) {
            DB::table('payroll_adjustments')
                ->where('formula_type', 'piket')
                ->update(['formula_type' => 'hadir']);

            DB::statement(
                "ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik') NOT NULL DEFAULT 'hadir'"
            );
        }
    }
};

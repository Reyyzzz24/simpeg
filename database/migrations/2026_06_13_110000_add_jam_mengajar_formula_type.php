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

        if ($driver === 'mysql') {
            DB::statement(
                "ALTER TABLE salary_rule_components MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar') NOT NULL DEFAULT 'hadir'"
            );

            if (Schema::hasTable('payroll_adjustments')) {
                DB::statement(
                    "ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar') NOT NULL DEFAULT 'hadir'"
                );
            }
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

        DB::table('salary_rule_components')
            ->where('formula_type', 'jam_mengajar')
            ->update(['formula_type' => 'hadir']);

        if (Schema::hasTable('payroll_adjustments')) {
            DB::table('payroll_adjustments')
                ->where('formula_type', 'jam_mengajar')
                ->update(['formula_type' => 'hadir']);
        }

        DB::statement(
            "ALTER TABLE salary_rule_components MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur') NOT NULL DEFAULT 'hadir'"
        );

        if (Schema::hasTable('payroll_adjustments')) {
            DB::statement(
                "ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur') NOT NULL DEFAULT 'hadir'"
            );
        }
    }
};

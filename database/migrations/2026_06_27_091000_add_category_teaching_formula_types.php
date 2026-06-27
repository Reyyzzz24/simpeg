<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private string $expandedEnum = "ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik', 'jam_mengajar_normatif_teori', 'jam_mengajar_produktif_teori', 'jam_mengajar_produktif_praktik', 'piket') NOT NULL DEFAULT 'hadir'";

    private string $previousEnum = "ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik', 'piket') NOT NULL DEFAULT 'hadir'";

    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('salary_rule_components')) {
            DB::statement("ALTER TABLE salary_rule_components MODIFY COLUMN formula_type {$this->expandedEnum}");
        }

        if (Schema::hasTable('payroll_adjustments')) {
            DB::statement("ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type {$this->expandedEnum}");
        }
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        $newTypes = [
            'jam_mengajar_normatif_teori',
            'jam_mengajar_produktif_teori',
            'jam_mengajar_produktif_praktik',
        ];

        if (Schema::hasTable('salary_rule_components')) {
            DB::table('salary_rule_components')
                ->whereIn('formula_type', $newTypes)
                ->update(['formula_type' => 'jam_mengajar_teori']);

            DB::statement("ALTER TABLE salary_rule_components MODIFY COLUMN formula_type {$this->previousEnum}");
        }

        if (Schema::hasTable('payroll_adjustments')) {
            DB::table('payroll_adjustments')
                ->whereIn('formula_type', $newTypes)
                ->update(['formula_type' => 'jam_mengajar_teori']);

            DB::statement("ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type {$this->previousEnum}");
        }
    }
};

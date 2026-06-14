<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('payroll_adjustments')) {
            DB::statement("ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik', 'piket') NOT NULL DEFAULT 'hadir'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('payroll_adjustments')) {
            DB::statement("ALTER TABLE payroll_adjustments MODIFY COLUMN formula_type ENUM('hadir', 'jam_kerja', 'lembur', 'jam_mengajar_teori', 'jam_mengajar_praktik') NOT NULL DEFAULT 'hadir'");
        }
    }
};

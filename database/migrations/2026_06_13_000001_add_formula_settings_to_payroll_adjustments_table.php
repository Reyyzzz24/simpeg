<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payroll_adjustments', function (Blueprint $table) {
            if (! Schema::hasColumn('payroll_adjustments', 'amount_type')) {
                $table->enum('amount_type', ['fixed', 'percentage', 'formula'])
                    ->default('fixed')
                    ->after('component_id');
            }

            if (! Schema::hasColumn('payroll_adjustments', 'formula_type')) {
                $table->enum('formula_type', ['hadir', 'jam_kerja'])
                    ->default('hadir')
                    ->after('amount_type');
            }

            if (! Schema::hasColumn('payroll_adjustments', 'formula_interval_minutes')) {
                $table->unsignedSmallInteger('formula_interval_minutes')
                    ->nullable()
                    ->after('formula_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payroll_adjustments', function (Blueprint $table) {
            if (Schema::hasColumn('payroll_adjustments', 'formula_interval_minutes')) {
                $table->dropColumn('formula_interval_minutes');
            }

            if (Schema::hasColumn('payroll_adjustments', 'formula_type')) {
                $table->dropColumn('formula_type');
            }

            if (Schema::hasColumn('payroll_adjustments', 'amount_type')) {
                $table->dropColumn('amount_type');
            }
        });
    }
};

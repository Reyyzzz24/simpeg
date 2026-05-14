<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salary_rule_components', function (Blueprint $table) {
            if (! Schema::hasColumn('salary_rule_components', 'formula_type')) {
                $table->enum('formula_type', ['hadir', 'jam_kerja'])
                    ->default('hadir')
                    ->after('amount_type');
            }

            if (! Schema::hasColumn('salary_rule_components', 'formula_interval_minutes')) {
                $table->unsignedSmallInteger('formula_interval_minutes')
                    ->nullable()
                    ->after('formula_type');
            }
        });

        DB::table('salary_rule_components')
            ->where('amount_type', 'formula')
            ->whereNull('formula_interval_minutes')
            ->update([
                'formula_type' => 'hadir',
                'formula_interval_minutes' => 30,
            ]);
    }

    public function down(): void
    {
        Schema::table('salary_rule_components', function (Blueprint $table) {
            if (Schema::hasColumn('salary_rule_components', 'formula_interval_minutes')) {
                $table->dropColumn('formula_interval_minutes');
            }

            if (Schema::hasColumn('salary_rule_components', 'formula_type')) {
                $table->dropColumn('formula_type');
            }
        });
    }
};

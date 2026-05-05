<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salary_rules', function (Blueprint $table) {

            // =========================
            // 1. DROP FOREIGN KEY DULU
            // =========================
            if (Schema::hasColumn('salary_rules', 'position_id')) {
                $table->dropForeign(['position_id']);
            }

            if (Schema::hasColumn('salary_rules', 'component_id')) {
                $table->dropForeign(['component_id']);
            }

            // =========================
            // 2. DROP COLUMN
            // =========================
            if (Schema::hasColumn('salary_rules', 'position_id')) {
                $table->dropColumn('position_id');
            }

            if (Schema::hasColumn('salary_rules', 'component_id')) {
                $table->dropColumn('component_id');
            }

            if (Schema::hasColumn('salary_rules', 'value')) {
                $table->dropColumn('value');
            }

            // =========================
            // 3. NEW STRUCTURE
            // =========================
            if (!Schema::hasColumn('salary_rules', 'name')) {
                $table->string('name')->after('id');
            }

            if (!Schema::hasColumn('salary_rules', 'sub_role')) {
                $table->string('sub_role')->nullable()->after('role');
            }

            if (!Schema::hasColumn('salary_rules', 'type')) {
                $table->enum('type', ['fixed', 'formula', 'percentage', 'condition'])
                    ->default('fixed');
            }

            if (!Schema::hasColumn('salary_rules', 'formula')) {
                $table->text('formula')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('salary_rules', function (Blueprint $table) {

            $table->foreignId('position_id')->nullable();
            $table->foreignId('component_id')->nullable();
            $table->decimal('value', 15, 2)->nullable();
        });
    }
};
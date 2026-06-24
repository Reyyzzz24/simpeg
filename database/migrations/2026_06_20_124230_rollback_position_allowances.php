<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('position_allowances', function (Blueprint $table) {
            if (! Schema::hasColumn('position_allowances', 'component_id')) {
                $table->foreignId('component_id')
                    ->constrained('salary_components');
            }
        });
    }

    public function down(): void
    {
        Schema::table('position_allowances', function (Blueprint $table) {
            if (Schema::hasColumn('position_allowances', 'component_id')) {
                $table->dropForeign(['component_id']);
                $table->dropColumn('component_id');
            }
        });
    }
};

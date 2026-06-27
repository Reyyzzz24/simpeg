<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (! Schema::hasColumn('attendances', 'jam_eskul')) {
                $table->decimal('jam_eskul', 4, 1)->nullable()->after('jam_produktif_praktik');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'jam_eskul')) {
                $table->dropColumn('jam_eskul');
            }
        });
    }
};

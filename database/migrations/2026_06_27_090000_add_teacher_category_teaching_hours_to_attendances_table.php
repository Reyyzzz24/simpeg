<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (! Schema::hasColumn('attendances', 'jam_normatif_teori')) {
                $table->decimal('jam_normatif_teori', 4, 1)->nullable()->after('jam_praktik');
            }

            if (! Schema::hasColumn('attendances', 'jam_produktif_teori')) {
                $table->decimal('jam_produktif_teori', 4, 1)->nullable()->after('jam_normatif_teori');
            }

            if (! Schema::hasColumn('attendances', 'jam_produktif_praktik')) {
                $table->decimal('jam_produktif_praktik', 4, 1)->nullable()->after('jam_produktif_teori');
            }
        });

        DB::table('attendances')
            ->whereNull('jam_normatif_teori')
            ->whereNull('jam_produktif_teori')
            ->whereNull('jam_produktif_praktik')
            ->update([
                'jam_normatif_teori' => DB::raw('COALESCE(jam_teori, 0)'),
                'jam_produktif_teori' => 0,
                'jam_produktif_praktik' => DB::raw('COALESCE(jam_praktik, 0)'),
            ]);
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'jam_produktif_praktik')) {
                $table->dropColumn('jam_produktif_praktik');
            }

            if (Schema::hasColumn('attendances', 'jam_produktif_teori')) {
                $table->dropColumn('jam_produktif_teori');
            }

            if (Schema::hasColumn('attendances', 'jam_normatif_teori')) {
                $table->dropColumn('jam_normatif_teori');
            }
        });
    }
};

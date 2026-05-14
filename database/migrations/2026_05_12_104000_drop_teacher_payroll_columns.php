<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('teachers')) {
            return;
        }

        Schema::table('teachers', function (Blueprint $table) {
            foreach ([
                'tarif_per_30_menit',
                'transport_harian',
                'tunjangan_jabatan',
                'tunjangan_praktik',
            ] as $column) {
                if (Schema::hasColumn('teachers', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('teachers')) {
            return;
        }

        Schema::table('teachers', function (Blueprint $table) {
            if (!Schema::hasColumn('teachers', 'tarif_per_30_menit')) {
                $table->decimal('tarif_per_30_menit', 15, 2)->default(0)->after('sub_role');
            }

            if (!Schema::hasColumn('teachers', 'transport_harian')) {
                $table->decimal('transport_harian', 15, 2)->default(0)->after('tarif_per_30_menit');
            }

            if (!Schema::hasColumn('teachers', 'tunjangan_jabatan')) {
                $table->decimal('tunjangan_jabatan', 15, 2)->default(0)->after('transport_harian');
            }

            if (!Schema::hasColumn('teachers', 'tunjangan_praktik')) {
                $table->decimal('tunjangan_praktik', 15, 2)->default(0)->after('tunjangan_jabatan');
            }
        });
    }
};

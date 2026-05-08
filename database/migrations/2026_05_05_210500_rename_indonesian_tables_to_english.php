<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('lembur') && Schema::hasColumn('lembur', 'pegawai_id')) {
            Schema::table('lembur', function (Blueprint $table) {
                $table->dropForeign(['pegawai_id']);
            });
        }

        if (Schema::hasTable('guru') && !Schema::hasTable('teachers')) {
            Schema::rename('guru', 'teachers');
        }

        if (Schema::hasTable('pegawai') && !Schema::hasTable('employees')) {
            Schema::rename('pegawai', 'employees');
        }

        if (Schema::hasTable('lembur') && !Schema::hasTable('overtimes')) {
            Schema::rename('lembur', 'overtimes');
        }

        if (Schema::hasTable('absensi') && !Schema::hasTable('attendances')) {
            Schema::rename('absensi', 'attendances');
        }

        if (Schema::hasTable('overtimes') && Schema::hasColumn('overtimes', 'pegawai_id')) {
            Schema::table('overtimes', function (Blueprint $table) {
                $table->foreign('pegawai_id')->references('id')->on('employees')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('overtimes') && Schema::hasColumn('overtimes', 'pegawai_id')) {
            Schema::table('overtimes', function (Blueprint $table) {
                $table->dropForeign(['pegawai_id']);
            });
        }

        if (Schema::hasTable('attendances') && !Schema::hasTable('absensi')) {
            Schema::rename('attendances', 'absensi');
        }

        if (Schema::hasTable('overtimes') && !Schema::hasTable('lembur')) {
            Schema::rename('overtimes', 'lembur');
        }

        if (Schema::hasTable('employees') && !Schema::hasTable('pegawai')) {
            Schema::rename('employees', 'pegawai');
        }

        if (Schema::hasTable('teachers') && !Schema::hasTable('guru')) {
            Schema::rename('teachers', 'guru');
        }

        if (Schema::hasTable('lembur') && Schema::hasColumn('lembur', 'pegawai_id')) {
            Schema::table('lembur', function (Blueprint $table) {
                $table->foreign('pegawai_id')->references('id')->on('pegawai')->onDelete('cascade');
            });
        }
    }
};

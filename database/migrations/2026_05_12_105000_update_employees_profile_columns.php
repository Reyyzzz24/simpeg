<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('employees')) {
            return;
        }

        Schema::table('employees', function (Blueprint $table) {
            if (!Schema::hasColumn('employees', 'tempat_tanggal_lahir')) {
                $table->string('tempat_tanggal_lahir')->nullable()->after('nama');
            }

            if (!Schema::hasColumn('employees', 'jenis_kelamin')) {
                $table->string('jenis_kelamin', 1)->nullable()->after('tempat_tanggal_lahir');
            }

            if (!Schema::hasColumn('employees', 'tingkat_pendidikan')) {
                $table->string('tingkat_pendidikan')->nullable()->after('jenis_kelamin');
            }

            if (!Schema::hasColumn('employees', 'tahun_lulus')) {
                $table->year('tahun_lulus')->nullable()->after('tingkat_pendidikan');
            }

            if (!Schema::hasColumn('employees', 'tahun_masuk_kerja')) {
                $table->year('tahun_masuk_kerja')->nullable()->after('tahun_lulus');
            }
        });

        Schema::table('employees', function (Blueprint $table) {
            foreach ([
                'gaji_pokok',
                'transport_harian',
                'jabatan',
                'tunjangan_jabatan',
            ] as $column) {
                if (Schema::hasColumn('employees', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('employees')) {
            return;
        }

        Schema::table('employees', function (Blueprint $table) {
            if (!Schema::hasColumn('employees', 'gaji_pokok')) {
                $table->decimal('gaji_pokok', 15, 2)->default(0)->after('status_kerja');
            }

            if (!Schema::hasColumn('employees', 'transport_harian')) {
                $table->decimal('transport_harian', 15, 2)->default(0)->after('gaji_pokok');
            }

            if (!Schema::hasColumn('employees', 'jabatan')) {
                $table->string('jabatan')->nullable()->after('transport_harian');
            }

            if (!Schema::hasColumn('employees', 'tunjangan_jabatan')) {
                $table->decimal('tunjangan_jabatan', 15, 2)->default(0)->after('jabatan');
            }

            foreach ([
                'tempat_tanggal_lahir',
                'jenis_kelamin',
                'tingkat_pendidikan',
                'tahun_lulus',
                'tahun_masuk_kerja',
            ] as $column) {
                if (Schema::hasColumn('employees', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};

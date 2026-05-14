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
            if (!Schema::hasColumn('teachers', 'tempat_tanggal_lahir')) {
                $table->string('tempat_tanggal_lahir')->nullable()->after('nama');
            }

            if (!Schema::hasColumn('teachers', 'jenis_kelamin')) {
                $table->string('jenis_kelamin', 1)->nullable()->after('tempat_tanggal_lahir');
            }

            if (!Schema::hasColumn('teachers', 'tugas_tambahan')) {
                $table->string('tugas_tambahan')->nullable()->after('position_id');
            }

            if (!Schema::hasColumn('teachers', 'mata_pelajaran')) {
                $table->string('mata_pelajaran')->nullable()->after('tugas_tambahan');
            }

            if (!Schema::hasColumn('teachers', 'pendidikan_terakhir')) {
                $table->string('pendidikan_terakhir')->nullable()->after('mata_pelajaran');
            }

            if (!Schema::hasColumn('teachers', 'tmt_sekolah')) {
                $table->date('tmt_sekolah')->nullable()->after('pendidikan_terakhir');
            }
        });

        if (Schema::hasColumn('teachers', 'jabatan')) {
            Schema::table('teachers', function (Blueprint $table) {
                $table->dropColumn('jabatan');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('teachers')) {
            return;
        }

        Schema::table('teachers', function (Blueprint $table) {
            if (!Schema::hasColumn('teachers', 'jabatan')) {
                $table->string('jabatan')->nullable()->after('transport_harian');
            }

            foreach ([
                'tempat_tanggal_lahir',
                'jenis_kelamin',
                'tugas_tambahan',
                'mata_pelajaran',
                'pendidikan_terakhir',
                'tmt_sekolah',
            ] as $column) {
                if (Schema::hasColumn('teachers', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};

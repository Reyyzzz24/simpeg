<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->unsignedInteger('durasi_hadir_menit')->nullable()->after('jenis_ajar');
            $table->integer('selisih_jam_ajar_menit')->nullable()->after('durasi_hadir_menit');
            $table->enum('status_validasi_ajar', ['belum_lengkap', 'sesuai', 'melebihi_durasi'])
                ->nullable()
                ->after('selisih_jam_ajar_menit');
        });
    }

    public function down(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->dropColumn([
                'durasi_hadir_menit',
                'selisih_jam_ajar_menit',
                'status_validasi_ajar',
            ]);
        });
    }
};

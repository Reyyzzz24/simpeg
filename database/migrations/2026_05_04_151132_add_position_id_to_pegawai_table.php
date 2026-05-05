<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pegawai', function (Blueprint $table) {
            // Tambahkan kolom position_id sebagai foreign key
            $table->foreignId('position_id')->nullable()->after('status_kerja')->constrained('positions')->onDelete('set null');

            // Opsional: Jika Anda ingin menghapus kolom jabatan yang lama (teks)
            // $table->dropColumn('jabatan'); 
        });
    }

    public function down(): void
    {
        Schema::table('pegawai', function (Blueprint $table) {
            $table->dropForeign(['position_id']);
            $table->dropColumn('position_id');
        });
    }
};

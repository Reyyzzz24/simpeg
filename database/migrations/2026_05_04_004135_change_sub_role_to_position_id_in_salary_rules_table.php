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
        Schema::table('salary_rules', function (Blueprint $blueprint) {
            // 1. Hapus kolom sub_role yang lama
            $blueprint->dropColumn('sub_role');

            // 2. Tambahkan kolom position_id sebagai Foreign Key
            // Mengacu pada tabel positions (ID 5 untuk Guru Mata Pelajaran Umum)
            $blueprint->foreignId('position_id')
                ->nullable()
                ->after('role')
                ->constrained('positions')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_rules', function (Blueprint $blueprint) {
            // Balikkan keadaan jika migration di-rollback
            $blueprint->dropForeign(['position_id']);
            $blueprint->dropColumn('position_id');
            $blueprint->string('sub_role')->nullable()->after('role');
        });
    }
};
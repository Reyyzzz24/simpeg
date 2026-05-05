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
        Schema::create('pegawai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nama');
            $table->string('nip')->unique();
            $table->enum('sub_role', ['tu', 'struktural', 'staf', 'karyawan']);
            $table->enum('status_kerja', ['tetap', 'ptt']);
            $table->decimal('gaji_pokok', 15, 2)->default(0);
            $table->decimal('transport_harian', 15, 2)->default(0);
            $table->string('jabatan');
            $table->decimal('tunjangan_jabatan', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};

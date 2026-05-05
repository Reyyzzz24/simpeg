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
        Schema::create('guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nama');
            $table->string('nuptk')->unique()->nullable();
            $table->enum('kategori', ['normatif', 'produktif']);
            $table->decimal('tarif_per_30_menit', 15, 2)->default(0);
            $table->decimal('transport_harian', 15, 2)->default(0);
            $table->string('jabatan');
            $table->decimal('tunjangan_jabatan', 15, 2)->default(0);
            $table->decimal('tunjangan_praktik', 15, 2)->default(0); // Khusus produktif
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gurus');
    }
};

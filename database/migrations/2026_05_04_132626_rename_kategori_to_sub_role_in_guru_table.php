<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi untuk mengubah nama kolom.
     */
    public function up(): void
    {
        Schema::table('guru', function (Blueprint $table) {
            // Mengubah nama kolom kategori menjadi sub_role
            $table->renameColumn('kategori', 'sub_role');
        });
    }

    /**
     * Membatalkan migrasi (Rollback).
     */
    public function down(): void
    {
        Schema::table('guru', function (Blueprint $table) {
            // Mengembalikan sub_role menjadi kategori
            $table->renameColumn('sub_role', 'kategori');
        });
    }
};
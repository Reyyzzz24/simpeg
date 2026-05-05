<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pegawai', function (Blueprint $table) {
            // ubah jadi nullable
            $table->string('nama')->nullable()->change();
            $table->string('nip')->nullable()->change();

            // kalau ada kolom lain bisa sekalian
            // $table->string('jabatan')->nullable()->change();
            // $table->string('no_hp')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pegawai', function (Blueprint $table) {
            $table->string('nama')->nullable(false)->change();
            $table->string('nip')->nullable(false)->change();

            // hapus unique kalau rollback
            $table->dropUnique(['nip']);
        });
    }
};
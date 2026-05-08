<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah enum role menjadi varchar agar role bisa bertambah via CRUD tabel `roles`.
        // Catatan: menggunakan raw statement untuk menghindari kebutuhan doctrine/dbal.
        DB::statement("ALTER TABLE users MODIFY role varchar(255)");
    }

    public function down(): void
    {
        // Kembalikan ke enum nilai lama.
        DB::statement("ALTER TABLE users MODIFY role enum('superadmin','admin','pegawai','guru','user') NOT NULL");
    }
};


<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->enum('status_disiplin', [
                'hadir',
                'terlambat',
                'alpha',
                'izin',
                'sakit'
            ])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->string('status_disiplin')->nullable()->change();
        });
    }
};

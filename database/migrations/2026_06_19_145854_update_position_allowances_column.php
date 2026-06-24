<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('position_allowances', function (Blueprint $table) {
            // Hapus foreign key terlebih dahulu jika ada (sesuaikan nama constraint-nya)
            $table->dropForeign(['component_id']); 
            $table->dropColumn('component_id');
        });
    }

    public function down(): void
    {
        Schema::table('position_allowances', function (Blueprint $table) {
            $table->foreignId('component_id')->constrained();
        });
    }
};
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
        Schema::table('salary_rules', function (Blueprint $table) {
            // Menambahkan kolom position_id yang berelasi ke tabel positions
            $table->foreignId('position_id')->nullable()->after('sub_role')->constrained('positions')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('salary_rules', function (Blueprint $table) {
            $table->dropForeign(['position_id']);
            $table->dropColumn('position_id');
        });
    }
};

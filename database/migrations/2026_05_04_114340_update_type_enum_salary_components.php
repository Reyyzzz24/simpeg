<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('salary_components', function (Blueprint $table) {
            $table->enum('type', ['fixed', 'percentage', 'formula'])
                  ->default('fixed')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('salary_components', function (Blueprint $table) {
            $table->enum('type', ['fixed', 'variable'])
                  ->default('fixed')
                  ->change();
        });
    }
};
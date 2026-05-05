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
        Schema::create('salary_rule_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salary_rule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('component_id')->constrained('salary_components');

            $table->enum('amount_type', ['fixed', 'percentage', 'formula'])
                ->default('fixed');

            $table->decimal('amount', 15, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_rule_components');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_settings', function (Blueprint $table) {
            $table->time('masuk_start')->default('06:00')->after('address');
            $table->time('masuk_end')->default('08:00')->after('masuk_start');
            $table->time('pulang_start')->default('16:00')->after('masuk_end');
            $table->time('pulang_end')->default('18:00')->after('pulang_start');
        });
    }

    public function down(): void
    {
        Schema::table('app_settings', function (Blueprint $table) {
            $table->dropColumn([
                'masuk_start',
                'masuk_end',
                'pulang_start',
                'pulang_end',
            ]);
        });
    }
};

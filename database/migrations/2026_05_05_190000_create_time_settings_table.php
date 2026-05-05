<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_settings', function (Blueprint $table) {
            $table->id();
            $table->time('masuk_start')->default('06:00');
            $table->time('masuk_end')->default('08:00');
            $table->time('pulang_start')->default('16:00');
            $table->time('pulang_end')->default('18:00');
            $table->timestamp('created_at')->nullable();
        });

        $appSetting = Schema::hasTable('app_settings')
            && Schema::hasColumn('app_settings', 'masuk_start')
                ? DB::table('app_settings')->first()
                : null;

        DB::table('time_settings')->insert([
            'masuk_start' => $appSetting->masuk_start ?? '06:00',
            'masuk_end' => $appSetting->masuk_end ?? '08:00',
            'pulang_start' => $appSetting->pulang_start ?? '16:00',
            'pulang_end' => $appSetting->pulang_end ?? '18:00',
            'created_at' => now(),
        ]);

        if (Schema::hasTable('app_settings') && Schema::hasColumn('app_settings', 'masuk_start')) {
            Schema::table('app_settings', function (Blueprint $table) {
                $table->dropColumn([
                    'masuk_start',
                    'masuk_end',
                    'pulang_start',
                    'pulang_end',
                ]);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('app_settings') && ! Schema::hasColumn('app_settings', 'masuk_start')) {
            Schema::table('app_settings', function (Blueprint $table) {
                $table->time('masuk_start')->default('06:00')->after('address');
                $table->time('masuk_end')->default('08:00')->after('masuk_start');
                $table->time('pulang_start')->default('16:00')->after('masuk_end');
                $table->time('pulang_end')->default('18:00')->after('pulang_start');
            });

            $timeSetting = DB::table('time_settings')->first();

            if ($timeSetting) {
                DB::table('app_settings')->update([
                    'masuk_start' => $timeSetting->masuk_start,
                    'masuk_end' => $timeSetting->masuk_end,
                    'pulang_start' => $timeSetting->pulang_start,
                    'pulang_end' => $timeSetting->pulang_end,
                ]);
            }
        }

        Schema::dropIfExists('time_settings');
    }
};

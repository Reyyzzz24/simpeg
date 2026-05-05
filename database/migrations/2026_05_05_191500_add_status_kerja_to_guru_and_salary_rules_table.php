<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pegawai') && ! Schema::hasColumn('pegawai', 'status_kerja')) {
            Schema::table('pegawai', function (Blueprint $table) {
                $table->enum('status_kerja', ['tetap', 'ptt'])
                    ->default('tetap')
                    ->after('sub_role');
            });
        }

        if (Schema::hasTable('guru') && ! Schema::hasColumn('guru', 'status_kerja')) {
            Schema::table('guru', function (Blueprint $table) {
                $table->enum('status_kerja', ['tetap', 'ptt'])
                    ->default('tetap')
                    ->after('sub_role');
            });
        }

        if (Schema::hasTable('salary_rules') && ! Schema::hasColumn('salary_rules', 'status_kerja')) {
            Schema::table('salary_rules', function (Blueprint $table) {
                $table->enum('status_kerja', ['tetap', 'ptt'])
                    ->default('tetap')
                    ->after('sub_role');
            });
        }

        DB::table('guru')
            ->whereNull('status_kerja')
            ->update(['status_kerja' => 'tetap']);

        DB::table('pegawai')
            ->whereNull('status_kerja')
            ->update(['status_kerja' => 'tetap']);

        DB::table('salary_rules')
            ->whereNull('status_kerja')
            ->update(['status_kerja' => 'tetap']);
    }

    public function down(): void
    {
        if (Schema::hasTable('pegawai') && Schema::hasColumn('pegawai', 'status_kerja')) {
            Schema::table('pegawai', function (Blueprint $table) {
                $table->dropColumn('status_kerja');
            });
        }

        if (Schema::hasTable('salary_rules') && Schema::hasColumn('salary_rules', 'status_kerja')) {
            Schema::table('salary_rules', function (Blueprint $table) {
                $table->dropColumn('status_kerja');
            });
        }

        if (Schema::hasTable('guru') && Schema::hasColumn('guru', 'status_kerja')) {
            Schema::table('guru', function (Blueprint $table) {
                $table->dropColumn('status_kerja');
            });
        }
    }
};

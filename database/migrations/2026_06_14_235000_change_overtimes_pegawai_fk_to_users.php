<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('overtimes')) {
            return;
        }

        Schema::table('overtimes', function (Blueprint $table) {
            // Drop existing foreign if present
            if (Schema::hasColumn('overtimes', 'pegawai_id')) {
                try {
                    $table->dropForeign(['pegawai_id']);
                } catch (\Throwable $e) {
                    // ignore if foreign doesn't exist
                }
            }
        });

        // Migrate existing employee IDs to user IDs when possible
        try {
            \Illuminate\Support\Facades\DB::statement(
                'UPDATE overtimes o JOIN employees e ON o.pegawai_id = e.id SET o.pegawai_id = e.user_id WHERE e.user_id IS NOT NULL'
            );
        } catch (\Throwable $e) {
            // ignore if update fails
        }

        Schema::table('overtimes', function (Blueprint $table) {
            // ensure column type
            if (Schema::hasColumn('overtimes', 'pegawai_id')) {
                $table->unsignedBigInteger('pegawai_id')->change();
                $table->foreign('pegawai_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('overtimes')) {
            return;
        }

        Schema::table('overtimes', function (Blueprint $table) {
            if (Schema::hasColumn('overtimes', 'pegawai_id')) {
                try {
                    $table->dropForeign(['pegawai_id']);
                } catch (\Throwable $e) {
                }

                $table->unsignedBigInteger('pegawai_id')->change();
                $table->foreign('pegawai_id')->references('id')->on('employees')->onDelete('cascade');
            }
        });
    }
};

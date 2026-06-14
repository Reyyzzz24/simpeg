<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (! Schema::hasColumn('attendances', 'jam_teori')) {
                $table->decimal('jam_teori', 4, 1)->nullable()->after('jenis_ajar');
            }

            if (! Schema::hasColumn('attendances', 'jam_praktik')) {
                $table->decimal('jam_praktik', 4, 1)->nullable()->after('jam_teori');
            }

            if (! Schema::hasColumn('attendances', 'ada_piket')) {
                $table->boolean('ada_piket')->default(false)->after('jam_praktik');
            }
        });

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement(
                "ALTER TABLE attendances MODIFY COLUMN jenis_ajar ENUM('teori', 'praktik', 'teori_praktik', 'none') NOT NULL DEFAULT 'none'"
            );
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('attendances')) {
            DB::table('attendances')
                ->where('jenis_ajar', 'teori_praktik')
                ->update(['jenis_ajar' => 'teori']);

            $driver = Schema::getConnection()->getDriverName();

            if ($driver === 'mysql') {
                DB::statement(
                    "ALTER TABLE attendances MODIFY COLUMN jenis_ajar ENUM('teori', 'praktik', 'none') NOT NULL DEFAULT 'none'"
                );
            }

            Schema::table('attendances', function (Blueprint $table) {
                if (Schema::hasColumn('attendances', 'ada_piket')) {
                    $table->dropColumn('ada_piket');
                }

                if (Schema::hasColumn('attendances', 'jam_praktik')) {
                    $table->dropColumn('jam_praktik');
                }

                if (Schema::hasColumn('attendances', 'jam_teori')) {
                    $table->dropColumn('jam_teori');
                }
            });
        }
    }
};

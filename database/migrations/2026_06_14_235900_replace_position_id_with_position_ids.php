<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ReplacePositionIdWithPositionIds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        if (Schema::hasTable('user_positions')) {
            Schema::table('user_positions', function (Blueprint $table) {
                if (Schema::hasColumn('user_positions', 'position_id')) {
                    $table->dropColumn('position_id');
                }

                if (!Schema::hasColumn('user_positions', 'position_ids')) {
                    $table->json('position_ids')->nullable()->after('user_id');
                }
            });
        }

        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                if (Schema::hasColumn('teachers', 'position_id')) {
                    $table->dropColumn('position_id');
                }

                if (!Schema::hasColumn('teachers', 'position_ids')) {
                    $table->json('position_ids')->nullable()->after('user_id');
                }
            });
        }

        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                if (Schema::hasColumn('employees', 'position_id')) {
                    $table->dropColumn('position_id');
                }

                if (!Schema::hasColumn('employees', 'position_ids')) {
                    $table->json('position_ids')->nullable()->after('user_id');
                }
            });
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        if (Schema::hasTable('user_positions')) {
            Schema::table('user_positions', function (Blueprint $table) {
                if (Schema::hasColumn('user_positions', 'position_ids')) {
                    $table->dropColumn('position_ids');
                }

                if (!Schema::hasColumn('user_positions', 'position_id')) {
                    $table->unsignedBigInteger('position_id')->nullable()->after('user_id');
                }
            });
        }

        if (Schema::hasTable('teachers')) {
            Schema::table('teachers', function (Blueprint $table) {
                if (Schema::hasColumn('teachers', 'position_ids')) {
                    $table->dropColumn('position_ids');
                }

                if (!Schema::hasColumn('teachers', 'position_id')) {
                    $table->unsignedBigInteger('position_id')->nullable()->after('user_id');
                }
            });
        }

        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                if (Schema::hasColumn('employees', 'position_ids')) {
                    $table->dropColumn('position_ids');
                }

                if (!Schema::hasColumn('employees', 'position_id')) {
                    $table->unsignedBigInteger('position_id')->nullable()->after('user_id');
                }
            });
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

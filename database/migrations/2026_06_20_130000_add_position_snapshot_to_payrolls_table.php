<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            if (! Schema::hasColumn('payrolls', 'jabatan_snapshot')) {
                $table->string('jabatan_snapshot')->nullable()->after('total_gaji');
            }

            if (! Schema::hasColumn('payrolls', 'position_ids_snapshot')) {
                $table->json('position_ids_snapshot')->nullable()->after('jabatan_snapshot');
            }
        });

        DB::table('payrolls')
            ->orderBy('id')
            ->get(['id', 'user_id'])
            ->each(function ($payroll) {
                $userPosition = DB::table('user_positions')
                    ->where('user_id', $payroll->user_id)
                    ->first();

                $positionIds = [];
                if ($userPosition && $userPosition->position_ids) {
                    $decodedIds = json_decode($userPosition->position_ids, true);
                    $positionIds = is_array($decodedIds) ? array_values($decodedIds) : [];
                }

                $positionNames = empty($positionIds)
                    ? []
                    : DB::table('positions')
                        ->whereIn('id', $positionIds)
                        ->pluck('name')
                        ->toArray();

                DB::table('payrolls')
                    ->where('id', $payroll->id)
                    ->update([
                        'jabatan_snapshot' => implode(', ', $positionNames),
                        'position_ids_snapshot' => json_encode($positionIds),
                    ]);
            });
    }

    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            if (Schema::hasColumn('payrolls', 'position_ids_snapshot')) {
                $table->dropColumn('position_ids_snapshot');
            }

            if (Schema::hasColumn('payrolls', 'jabatan_snapshot')) {
                $table->dropColumn('jabatan_snapshot');
            }
        });
    }
};

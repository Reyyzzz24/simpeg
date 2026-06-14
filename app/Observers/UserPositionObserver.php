<?php

namespace App\Observers;

use App\Models\UserPosition;
use Illuminate\Support\Facades\Schema;

class UserPositionObserver
{
    public function saved(UserPosition $userPosition)
    {
        $userId = $userPosition->user_id;
        $positionIds = $userPosition->position_ids ?? [];
        $first = !empty($positionIds) ? $positionIds[0] : null;

        $teacherData = ['position_ids' => $positionIds];
        $employeeData = ['position_ids' => $positionIds];

        if (Schema::hasColumn('teachers', 'position_id')) {
            $teacherData['position_id'] = $first;
        }

        if (Schema::hasColumn('employees', 'position_id')) {
            $employeeData['position_id'] = $first;
        }

        if ($userId) {
            \App\Models\Teacher::where('user_id', $userId)->update($teacherData);
            \App\Models\Employee::where('user_id', $userId)->update($employeeData);
        }
    }

    public function deleted(UserPosition $userPosition)
    {
        $userId = $userPosition->user_id;
        if (!$userId) return;

        $teacherData = ['position_ids' => []];
        $employeeData = ['position_ids' => []];

        if (Schema::hasColumn('teachers', 'position_id')) {
            $teacherData['position_id'] = null;
        }

        if (Schema::hasColumn('employees', 'position_id')) {
            $employeeData['position_id'] = null;
        }

        \App\Models\Teacher::where('user_id', $userId)->update($teacherData);
        \App\Models\Employee::where('user_id', $userId)->update($employeeData);
    }
}

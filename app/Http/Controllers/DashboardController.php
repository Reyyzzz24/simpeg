<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    private function today()
    {
        return Carbon::now()->setTimezone(config('app.timezone'))->toDateString();
    }

    private function presenceQuery($date = null)
    {
        return Attendance::with('user')
            ->when($date, fn($q) => $q->whereDate('tanggal', $date));
    }

    private function buildStats($presences, $totalUsers)
    {
        $totalPresent = $presences->whereNotNull('jam_masuk')->count();

        $totalLate = $presences->filter(function ($p) {
            return $p->jam_masuk && Carbon::parse($p->jam_masuk)->format('H:i:s') > '08:00:00';
        })->count();

        return [
            'total_users' => $totalUsers,
            'total_employees' => Employee::count(),
            'total_teachers' => Teacher::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_superadmins' => User::where('role', 'superadmin')->count(),
            'total_present' => $totalPresent,
            'total_late' => $totalLate,
            'total_absent' => max(0, $totalUsers - $totalPresent),
        ];
    }

    private function buildRecent($presences)
    {
        return $presences->sortByDesc('id')->take(10)->map(function ($p) {
            return [
                'id' => $p->id,
                'user' => $p->user?->name ?? 'N/A',
                'nip' => $p->user?->nip ?? '-',
                'jam_masuk' => $p->jam_masuk ? Carbon::parse($p->jam_masuk)->format('H:i') : null,
                'jam_pulang' => $p->jam_pulang ? Carbon::parse($p->jam_pulang)->format('H:i') : null,
            ];
        })->values();
    }

    private function buildAttendanceTrend(int $days = 7)
    {
        $today = Carbon::now()->setTimezone(config('app.timezone'))->startOfDay();
        $start = $today->copy()->subDays($days - 1);
        $totalUsers = max(1, User::count());

        return collect(range(0, $days - 1))->map(function (int $offset) use ($start, $totalUsers) {
            $date = $start->copy()->addDays($offset);

            $records = Attendance::whereDate('tanggal', $date->toDateString())->get();
            $present = $records->whereNotNull('jam_masuk')->count();
            $late = $records->filter(function ($p) {
                return $p->jam_masuk && Carbon::parse($p->jam_masuk)->format('H:i:s') > '08:00:00';
            })->count();

            return [
                'date' => $date->toDateString(),
                'label' => $date->translatedFormat('D'),
                'present' => $present,
                'late' => $late,
                'absent' => max(0, $totalUsers - $present),
                'present_rate' => (int) round(($present / $totalUsers) * 100),
            ];
        })->values();
    }

    private function buildQuickAccess(?User $authUser)
    {
        $latestPayroll = $authUser
            ? Payroll::where('user_id', $authUser->id)->latest('periode')->first()
            : null;

        $todayAttendance = $authUser
            ? Attendance::where('user_id', $authUser->id)
                ->whereDate('tanggal', $this->today())
                ->first()
            : null;

        return [
            'salary_slip' => [
                'available' => (bool) $latestPayroll,
                'period' => $latestPayroll?->periode,
            ],
            'work_report' => [
                'submitted_today' => (bool) $todayAttendance?->jam_pulang,
                'attendance_status' => $todayAttendance?->status_disiplin,
            ],
        ];
    }

    private function isManagementDashboard(?User $user): bool
    {
        return $user && in_array($user->role, ['superadmin', 'admin'], true);
    }

    private function buildPersonalSummary(User $user): array
    {
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('tanggal', $this->today())
            ->first();

        $monthStart = Carbon::now()->setTimezone(config('app.timezone'))->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->setTimezone(config('app.timezone'))->endOfMonth()->toDateString();

        $monthlyRecords = Attendance::where('user_id', $user->id)
            ->whereBetween('tanggal', [$monthStart, $monthEnd])
            ->get();

        $monthlyLate = $monthlyRecords->filter(function ($p) {
            return $p->jam_masuk && Carbon::parse($p->jam_masuk)->format('H:i:s') > '08:00:00';
        })->count();

        return [
            'today_status' => $todayAttendance?->status_disiplin ?? 'Belum absen',
            'jam_masuk' => $todayAttendance?->jam_masuk ? Carbon::parse($todayAttendance->jam_masuk)->format('H:i') : null,
            'jam_pulang' => $todayAttendance?->jam_pulang ? Carbon::parse($todayAttendance->jam_pulang)->format('H:i') : null,
            'monthly_present' => $monthlyRecords->whereNotNull('jam_masuk')->count(),
            'monthly_late' => $monthlyLate,
            'monthly_records' => $monthlyRecords->count(),
        ];
    }

    private function dashboardPayload(User $user): array
    {
        $isManagementDashboard = $this->isManagementDashboard($user);
        $quickAccess = $this->buildQuickAccess($user);

        if (! $isManagementDashboard) {
            return [
                'isManagementDashboard' => false,
                'stats' => null,
                'recent' => [],
                'trend' => [],
                'quickAccess' => $quickAccess,
                'personalSummary' => $this->buildPersonalSummary($user),
                'announcements' => Announcement::latest()->take(5)->get(),
            ];
        }

        $today = $this->today();
        $totalUsers = User::count();
        $presences = $this->presenceQuery($today)->get();

        return [
            'isManagementDashboard' => true,
            'stats' => $this->buildStats($presences, $totalUsers),
            'recent' => $this->buildRecent($presences),
            'trend' => $this->buildAttendanceTrend(),
            'quickAccess' => $quickAccess,
            'personalSummary' => $this->buildPersonalSummary($user),
            'announcements' => Announcement::latest()->take(5)->get(),
        ];
    }

    public function index()
    {
        return Inertia::render('dashboard', $this->dashboardPayload(auth()->user()));
    }

    public function data()
    {
        return response()->json($this->dashboardPayload(auth()->user()));
    }

    public function calendar(Request $request)
    {
        $userId = $request->input('user_id');

        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        $query = Attendance::whereBetween('tanggal', [$start, $end]);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $absensi = $query->get()->groupBy('tanggal');

        $calendar = [];

        for ($day = 1; $day <= $end->day; $day++) {

            $date = Carbon::create($start->year, $start->month, $day)->toDateString();

            $items = $absensi[$date] ?? collect([]);

            $record = $items->first(); // user-specific record

            // =========================
            // FIX STATUS MAPPING
            // =========================
            $status = null;

            if ($record) {
                $raw = strtolower($record->status_disiplin);

                $status = match ($raw) {
                    'hadir' => 'present',
                    'alpha' => 'alpha',
                    'izin'  => 'late',   // atau buat "permission" kalau mau
                    default => 'present',
                };
            } else {
                $status = 'alpha';
            }

            $calendar[] = [
                'date' => $date,
                'day' => $day,
                'status' => $status,
            ];
        }

        return response()->json($calendar);
    }
}

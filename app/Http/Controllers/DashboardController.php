<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\User;
use App\Models\Announcement;
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
        return Absensi::with('user')
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

    public function index()
    {
        $today = $this->today();

        $totalUsers = User::count();

        $presences = $this->presenceQuery($today)->get();

        $stats = $this->buildStats($presences, $totalUsers);
        $recent = $this->buildRecent($presences);

        $announcements = Announcement::latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent' => $recent,
            'announcements' => $announcements,
        ]);
    }

    public function data()
    {
        $today = $this->today();

        $totalUsers = User::count();

        $presences = $this->presenceQuery($today)->get();

        return response()->json([
            'stats' => $this->buildStats($presences, $totalUsers),
            'recent' => $this->buildRecent($presences),
        ]);
    }

    public function calendar(Request $request)
    {
        $userId = $request->input('user_id');

        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        $query = Absensi::whereBetween('tanggal', [$start, $end]);

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

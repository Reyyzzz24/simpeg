<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresentReportController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'all');
        $start = $request->input('start_date');
        $end = $request->input('end_date');

        $query = Attendance::with('user');

        if ($start && $end) {
            $query->whereBetween('tanggal', [$start, $end]);
        }

        if ($type !== 'all') {
            $query->whereHas('user', function ($q) use ($type) {
                $q->where('role', $type);
            });
        }

        $data = $query
            ->latest('tanggal')
            ->get()
            ->map(function ($item) {
                $jamMasuk = $item->jam_masuk ? Carbon::parse($item->jam_masuk) : null;
                $jamPulang = $item->jam_pulang ? Carbon::parse($item->jam_pulang) : null;

                if ($jamMasuk && $jamPulang) {
                    if ($jamPulang->lessThan($jamMasuk)) {
                        $jamPulang->addDay();
                    }

                    $jamKerja = $jamMasuk->diffInMinutes($jamPulang) / 60;
                } else {
                    $jamKerja = 0;
                }

                return [
                    'id' => $item->id,
                    'nama' => $item->user->name ?? '-',
                    'role' => $item->user->role ?? '-',
                    'tanggal' => $item->tanggal,
                    'jam_masuk' => $item->jam_masuk,
                    'jam_pulang' => $item->jam_pulang,
                    'status_disiplin' => $item->status_disiplin,
                    'jam_kerja' => round($jamKerja, 2),
                ];
            });

        return Inertia::render('report/presencereport/index', [
            'data' => $data,
            'filters' => [
                'type' => $type,
                'start_date' => $start,
                'end_date' => $end,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Overtime;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OvertimeReportController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');
        $status = $request->input('status', 'all');

        $query = Overtime::with([
            'user:id,name,role',
            'employee:id,user_id,nama,nip',
            'teacher:id,user_id,nama,nuptk',
        ]);

        if ($start && $end) {
            $query->whereBetween('tanggal', [$start, $end]);
        }

        if ($status === 'approved') {
            $query->where('is_approved', true);
        }

        if ($status === 'pending') {
            $query->where('is_approved', false);
        }

        $data = $query
            ->latest('tanggal')
            ->latest('id')
            ->get()
            ->map(function (Overtime $item) {
                $jamMulai = Carbon::parse($item->jam_mulai);
                $jamSelesai = Carbon::parse($item->jam_selesai);

                if ($jamSelesai->lessThan($jamMulai)) {
                    $jamSelesai->addDay();
                }

                $durasiJam = $jamMulai->diffInMinutes($jamSelesai) / 60;

                return [
                    'id' => $item->id,
                    'pegawai_nama' => ($item->user?->role === 'guru' ? $item->teacher?->nama : $item->employee?->nama)
                        ?? $item->user?->name
                        ?? '-',
                    'pegawai_nip' => $item->employee?->nip ?? $item->teacher?->nuptk ?? null,
                    'tanggal' => $item->tanggal?->format('Y-m-d'),
                    'jam_mulai' => substr((string) $item->jam_mulai, 0, 5),
                    'jam_selesai' => substr((string) $item->jam_selesai, 0, 5),
                    'durasi_jam' => round($durasiJam, 2),
                    'tugas' => $item->tugas,
                    'is_approved' => $item->is_approved,
                ];
            });

        return Inertia::render('report/overtimereport/index', [
            'data' => $data,
            'stats' => [
                'total' => $data->count(),
                'approved' => $data->where('is_approved', true)->count(),
                'pending' => $data->where('is_approved', false)->count(),
                'total_hours' => $data->sum('durasi_jam'),
            ],
            'filters' => [
                'start_date' => $start,
                'end_date' => $end,
                'status' => $status,
            ],
        ]);
    }
}

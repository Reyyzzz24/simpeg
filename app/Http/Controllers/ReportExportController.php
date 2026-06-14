<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Overtime;
use App\Models\Payroll;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReportExportController extends Controller
{
    public function overtimeCsv(Request $request)
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');
        $status = $request->input('status', 'all');

        $query = Overtime::with('employee:id,nama,nip');

        if ($start && $end) {
            $query->whereBetween('tanggal', [$start, $end]);
        }

        if ($status === 'approved') {
            $query->where('is_approved', true);
        }

        if ($status === 'pending') {
            $query->where('is_approved', false);
        }

        $data = $query->latest('tanggal')->latest('id')->get();

        $filename = 'overtime_report_'.now()->format('Ymd_His').'.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($data) {
            $out = fopen('php://output', 'w');
            fputs($out, "\xEF\xBB\xBF");
            fputcsv($out, ['No', 'Nama', 'NIP', 'Tanggal', 'Jam Mulai', 'Jam Selesai', 'Durasi Jam', 'Tugas', 'Disetujui']);

            $no = 1;
            foreach ($data as $item) {
                $jamMulai = $item->jam_mulai ? Carbon::parse($item->jam_mulai) : null;
                $jamSelesai = $item->jam_selesai ? Carbon::parse($item->jam_selesai) : null;

                if ($jamMulai && $jamSelesai) {
                    if ($jamSelesai->lessThan($jamMulai)) {
                        $jamSelesai->addDay();
                    }

                    $durasiJam = $jamMulai->diffInMinutes($jamSelesai) / 60;
                    $jamMulaiStr = substr((string) $item->jam_mulai, 0, 5);
                    $jamSelesaiStr = substr((string) $item->jam_selesai, 0, 5);
                } else {
                    $durasiJam = 0;
                    $jamMulaiStr = '';
                    $jamSelesaiStr = '';
                }

                fputcsv($out, [
                    $no,
                    $item->employee?->nama ?? '-',
                    $item->employee?->nip ?? '-',
                    $item->tanggal?->format('Y-m-d') ?? '',
                    $jamMulaiStr,
                    $jamSelesaiStr,
                    round($durasiJam, 2),
                    $item->tugas,
                    $item->is_approved ? 'Ya' : 'Tidak',
                ]);

                $no++;
            }

            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function overtimePrint(Request $request)
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');
        $status = $request->input('status', 'all');

        $query = Overtime::with('employee:id,nama,nip');

        if ($start && $end) {
            $query->whereBetween('tanggal', [$start, $end]);
        }

        if ($status === 'approved') {
            $query->where('is_approved', true);
        }

        if ($status === 'pending') {
            $query->where('is_approved', false);
        }

        $data = $query->latest('tanggal')->latest('id')->get()->map(function (Overtime $item) {
            $jamMulai = Carbon::parse($item->jam_mulai);
            $jamSelesai = Carbon::parse($item->jam_selesai);
            if ($jamSelesai->lessThan($jamMulai)) $jamSelesai->addDay();
            $durasiJam = round($jamMulai->diffInMinutes($jamSelesai) / 60, 2);

            return [
                'id' => $item->id,
                'pegawai_nama' => $item->employee?->nama ?? '-',
                'pegawai_nip' => $item->employee?->nip ?? '-',
                'tanggal' => $item->tanggal?->format('Y-m-d'),
                'jam_mulai' => substr((string) $item->jam_mulai, 0, 5),
                'jam_selesai' => substr((string) $item->jam_selesai, 0, 5),
                'durasi_jam' => $durasiJam,
                'tugas' => $item->tugas,
                'is_approved' => $item->is_approved,
            ];
        });

        return Inertia::render('report/prints/OvertimePrint', ['data' => $data]);
    }

    public function salaryCsv(Request $request)
    {
        $periode = $request->input('periode');

        $query = Payroll::with(['user', 'details.component', 'adjustments.component']);
        if ($periode) {
            $query->where('periode', $periode);
        }

        $payrolls = $query->latest('periode')->latest('id')->get();

        $filename = 'payroll_report_'.now()->format('Ymd_His').'.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($payrolls) {
            $out = fopen('php://output', 'w');
            fputs($out, "\xEF\xBB\xBF");
            fputcsv($out, ['No', 'Nama', 'Role', 'Jabatan', 'Periode', 'Details (Component:Amount)', 'Total Gaji']);

            $no = 1;
            foreach ($payrolls as $p) {
                $detailsStr = $p->details->map(function ($d) {
                    $name = $d->component?->name ?? '-';
                    $amount = number_format((float) $d->amount, 2, '.', '');

                    return "{$name}:{$amount}";
                })->implode('; ');

                $jabatan = '';
                try {
                    $jabatan = implode(', ', $p->user->positions()->pluck('name')->toArray());
                } catch (\Throwable $e) {
                    $jabatan = '';
                }

                fputcsv($out, [
                    $no,
                    $p->user->name ?? '-',
                    $p->user->role ?? '-',
                    $jabatan,
                    $p->periode,
                    $detailsStr,
                    number_format((float) $p->total_gaji, 2, '.', ''),
                ]);

                $no++;
            }

            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function salaryPrint(Request $request)
    {
        $periode = $request->input('periode');

        $query = Payroll::with(['user', 'details.component', 'adjustments.component']);
        if ($periode) {
            $query->where('periode', $periode);
        }

        $payrolls = $query->latest('periode')->latest('id')->get()->map(function ($p) {
            // payroll details contain the calculated components for this payroll
            $details = $p->details->map(function ($d) {
                return [
                    'component' => $d->component?->name ?? '-',
                    'amount' => (float) $d->amount,
                ];
            })->values();

            return [
                'id' => $p->id,
                'nama' => $p->user->name ?? '-',
                'role' => $p->user->role ?? '-',
                'jabatan' => implode(', ', $p->user->positions()->pluck('name')->toArray()),
                'periode' => $p->periode,
                'total_gaji' => (float) $p->total_gaji,
                'details' => $details,
            ];
        });

        return Inertia::render('report/prints/SalaryPrint', ['data' => $payrolls]);
    }

    public function presenceCsv(Request $request)
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

        $data = $query->latest('tanggal')->get();

        $filename = 'presence_report_'.now()->format('Ymd_His').'.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($data) {
            $out = fopen('php://output', 'w');
            fputs($out, "\xEF\xBB\xBF");
            fputcsv($out, ['No', 'Nama', 'Role', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status Disiplin', 'Jam Kerja', 'Total Jam Ajar', 'Jenis Ajar', 'Jam Teori', 'Jam Praktik', 'Ada Piket', 'Selisih Jam Ajar (menit)', 'Status Validasi Ajar']);

            $no = 1;
            foreach ($data as $item) {
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

                fputcsv($out, [
                    $no,
                    $item->user->name ?? '-',
                    $item->user->role ?? '-',
                    $item->tanggal,
                    $item->jam_masuk,
                    $item->jam_pulang,
                    $item->status_disiplin,
                    round($jamKerja, 2),
                    $item->total_jam_ajar ?? '',
                    $item->jenis_ajar ?? '',
                    $item->jam_teori ?? '',
                    $item->jam_praktik ?? '',
                    isset($item->ada_piket) ? ($item->ada_piket ? 'Ya' : 'Tidak') : '',
                    $item->selisih_jam_ajar_menit ?? '',
                    $item->status_validasi_ajar ?? '',
                ]);

                $no++;
            }

            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function presencePrint(Request $request)
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

        $data = $query->latest('tanggal')->get()->map(function ($item) {
            $jamMasuk = $item->jam_masuk ? Carbon::parse($item->jam_masuk) : null;
            $jamPulang = $item->jam_pulang ? Carbon::parse($item->jam_pulang) : null;

            if ($jamMasuk && $jamPulang) {
                if ($jamPulang->lessThan($jamMasuk)) {
                    $jamPulang->addDay();
                }

                $jamKerja = round($jamMasuk->diffInMinutes($jamPulang) / 60, 2);
            } else {
                $jamKerja = 0;
            }

            $row = [
                'id' => $item->id,
                'nama' => $item->user->name ?? '-',
                'role' => $item->user->role ?? '-',
                'tanggal' => $item->tanggal,
                'jam_masuk' => $item->jam_masuk,
                'jam_pulang' => $item->jam_pulang,
                'status_disiplin' => $item->status_disiplin,
                'jam_kerja' => $jamKerja,
            ];

            if (isset($item->user) && ($item->user->role === 'guru')) {
                $row['total_jam_ajar'] = $item->total_jam_ajar;
                $row['jenis_ajar'] = $item->jenis_ajar;
                $row['jam_teori'] = $item->jam_teori;
                $row['jam_praktik'] = $item->jam_praktik;
                $row['ada_piket'] = (bool) $item->ada_piket;
                $row['selisih_jam_ajar_menit'] = $item->selisih_jam_ajar_menit;
                $row['status_validasi_ajar'] = $item->status_validasi_ajar;
            }

            return $row;
        });

        return Inertia::render('report/prints/PresencePrint', ['data' => $data]);
    }
}

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
        $userId = $request->input('user_id');
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

        if ($userId) {
            $query->where('pegawai_id', $userId);
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
                    ($item->user?->role === 'guru' ? $item->teacher?->nama : $item->employee?->nama)
                        ?? $item->user?->name
                        ?? '-',
                    $item->employee?->nip ?? $item->teacher?->nuptk ?? '-',
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
        $userId = $request->input('user_id');

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

        if ($userId) {
            $query->where('pegawai_id', $userId);
        }

        $data = $query->latest('tanggal')->latest('id')->get()->map(function (Overtime $item) {
            $jamMulai = Carbon::parse($item->jam_mulai);
            $jamSelesai = Carbon::parse($item->jam_selesai);
            if ($jamSelesai->lessThan($jamMulai)) {
                $jamSelesai->addDay();
            }
            $durasiJam = round($jamMulai->diffInMinutes($jamSelesai) / 60, 2);

            return [
                'id' => $item->id,
                'user_id' => $item->pegawai_id,
                'pegawai_nama' => ($item->user?->role === 'guru' ? $item->teacher?->nama : $item->employee?->nama)
                    ?? $item->user?->name
                    ?? '-',
                'pegawai_nip' => $item->employee?->nip ?? $item->teacher?->nuptk ?? null,
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
        $role = $request->input('role', 'all');
        $userId = $request->input('user_id');

        $query = Payroll::with(['user', 'details.component', 'adjustments.component']);
        if ($periode) {
            $query->where('periode', $periode);
        }

        if (in_array($role, ['pegawai', 'guru'], true)) {
            $query->whereHas('user', function ($query) use ($role) {
                $query->where('role', $role);
            });
        }

        if ($userId) {
            $query->where('user_id', $userId);
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

                $jabatan = $p->jabatan_snapshot ?? '';
                if (! $jabatan) {
                    try {
                        $jabatan = implode(', ', $p->user->positions()->pluck('name')->toArray());
                    } catch (\Throwable $e) {
                        $jabatan = '';
                    }
                }

                fputcsv($out, [
                    $no,
                    $p->user->name ?? '-',
                    $this->formatReportLabel($p->user->role ?? '-'),
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
        $role = $request->input('role', 'all');
        $userId = $request->input('user_id');

        $query = Payroll::with(['user', 'details.component', 'adjustments.component']);
        if ($periode) {
            $query->where('periode', $periode);
        }

        if (in_array($role, ['pegawai', 'guru'], true)) {
            $query->whereHas('user', function ($query) use ($role) {
                $query->where('role', $role);
            });
        }

        if ($userId) {
            $query->where('user_id', $userId);
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
                'user_id' => $p->user_id,
                'nama' => $p->user->name ?? '-',
                'role' => $this->formatReportLabel($p->user->role ?? '-'),
                'jabatan' => $p->jabatan_snapshot
                    ?: implode(', ', $p->user->positions()->pluck('name')->toArray()),
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
        $userId = $request->input('user_id');

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
            fputcsv($out, ['No', 'Nama', 'Role', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status Disiplin', 'Jam Kerja', 'Total Jam Ajar', 'Jenis Ajar', 'Normatif Teori', 'Produktif Teori', 'Produktif Praktik', 'Total Produktif', 'Eskul', 'Ada Piket', 'Selisih Jam Ajar (menit)', 'Status Validasi Ajar']);

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
                    $this->formatReportLabel($item->user->role ?? '-'),
                    $item->tanggal,
                    $item->jam_masuk,
                    $item->jam_pulang,
                    $this->formatReportLabel($item->status_disiplin),
                    round($jamKerja, 2),
                    $item->total_jam_ajar ?? '',
                    $this->formatReportLabel($item->jenis_ajar ?? ''),
                    $item->jam_normatif_teori ?? '',
                    $item->jam_produktif_teori ?? '',
                    $item->jam_produktif_praktik ?? '',
                    (float) ($item->jam_produktif_teori ?? 0) + (float) ($item->jam_produktif_praktik ?? 0),
                    $item->jam_eskul ?? '',
                    isset($item->ada_piket) ? ($item->ada_piket ? 'Ya' : 'Tidak') : '',
                    $item->selisih_jam_ajar_menit ?? '',
                    $this->formatReportLabel($item->status_validasi_ajar ?? ''),
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
        $userId = $request->input('user_id');

        $query = Attendance::with('user');

        if ($start && $end) {
            $query->whereBetween('tanggal', [$start, $end]);
        }

        if ($type !== 'all') {
            $query->whereHas('user', function ($q) use ($type) {
                $q->where('role', $type);
            });
        }

        if ($userId) {
            $query->where('user_id', $userId);
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
                'user_id' => $item->user_id,
                'nama' => $item->user->name ?? '-',
                'role' => $this->formatReportLabel($item->user->role ?? '-'),
                'tanggal' => $item->tanggal,
                'jam_masuk' => $item->jam_masuk,
                'jam_pulang' => $item->jam_pulang,
                'status_disiplin' => $this->formatReportLabel($item->status_disiplin),
                'jam_kerja' => $jamKerja,
            ];

            if (isset($item->user) && ($item->user->role === 'guru')) {
                $row['total_jam_ajar'] = $item->total_jam_ajar;
                $row['jenis_ajar'] = $this->formatReportLabel($item->jenis_ajar);
                $row['jam_teori'] = $item->jam_teori;
                $row['jam_praktik'] = $item->jam_praktik;
                $row['jam_normatif_teori'] = $item->jam_normatif_teori;
                $row['jam_produktif_teori'] = $item->jam_produktif_teori;
                $row['jam_produktif_praktik'] = $item->jam_produktif_praktik;
                $row['total_jam_produktif'] = (float) ($item->jam_produktif_teori ?? 0)
                    + (float) ($item->jam_produktif_praktik ?? 0);
                $row['jam_eskul'] = $item->jam_eskul;
                $row['ada_piket'] = (bool) $item->ada_piket;
                $row['selisih_jam_ajar_menit'] = $item->selisih_jam_ajar_menit;
                $row['status_validasi_ajar'] = $this->formatReportLabel($item->status_validasi_ajar);
            }

            return $row;
        });

        return Inertia::render('report/prints/PresencePrint', ['data' => $data]);
    }

    private function formatReportLabel(mixed $value): string
    {
        if ($value === null || $value === '') {
            return '-';
        }

        return Str::of((string) $value)
            ->replace('_', ' ')
            ->lower()
            ->title()
            ->toString();
    }
}

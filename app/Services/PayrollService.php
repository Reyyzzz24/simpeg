<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Payroll;
use App\Models\SalaryRule;
use App\Models\PayrollAdjustment;
use App\Models\Attendance;
use App\Models\Overtime;
use App\Models\SalaryComponent;

class PayrollService
{
    public function generate(User $user, string $periode)
    {
        $payroll = Payroll::updateOrCreate(
            ['user_id' => $user->id, 'periode' => $periode],
            ['total_gaji' => 0, 'status' => 'draft']
        );

        $payroll->details()->delete();
        $total = 0;

        $subRole = null;
        $statusKerja = SalaryRule::STATUS_KERJA_OPTIONS[0];
        if ($user->role === 'guru' && $user->guru) {
            $subRole = $user->guru->sub_role;
            $statusKerja = $user->guru->status_kerja ?? SalaryRule::STATUS_KERJA_OPTIONS[0];
        } elseif ($user->role === 'pegawai' && $user->pegawai) {
            $subRole = $user->pegawai->sub_role;
            $statusKerja = $user->pegawai->status_kerja ?? SalaryRule::STATUS_KERJA_OPTIONS[0];
        } else {
            $subRole = $user->sub_role;
        }

        $baseRule = SalaryRule::with('salaryRuleComponents.component')
            ->where('role', $user->role)
            ->where('sub_role', $subRole)
            ->where('status_kerja', $statusKerja)
            ->where('is_active', 1)
            ->first();

        if ($baseRule) {
            foreach ($baseRule->salaryRuleComponents as $item) {
                $amount = (float) $item->amount;
                $note = "Rule: " . ($subRole ?? $user->role) . " - " . strtoupper($statusKerja);

                // LOGIKA FORMULA (BERDASARKAN ABSENSI)
                if ($item->amount_type === 'formula') {
                    $amount = $this->calculateAmount(
                        'formula',
                        (float) $item->amount,
                        $item->formula_type ?? 'hadir',
                        $item->formula_interval_minutes,
                        $user,
                        $periode,
                        $item->component
                    );
                    $note .= $this->buildFormulaNote(
                        $item->formula_type ?? 'hadir',
                        $item->formula_interval_minutes,
                        (float) $item->amount,
                        $user,
                        $periode
                    );
                }

                // LOGIKA PERCENTAGE (BERDASARKAN MASTER COMPONENT)
                elseif ($item->amount_type === 'percentage') {
                    $amount = $this->calculateAmount(
                        'percentage',
                        (float) $item->amount,
                        null,
                        null,
                        $user,
                        $periode,
                        $item->component
                    );
                    $baseAmount = (float) ($item->component->default_amount ?? 0);
                    $note .= " ({$item->amount}% dari base Rp" . number_format($baseAmount, 0, ',', '.') . ")";
                }

                if ($amount == 0) continue;

                if (!$item->component) continue;

                $total += $amount;
                $this->addDetail($payroll, $item->component, $amount);
            }
        }

        // LOGIKA TUNJANGAN JABATAN
        foreach ($user->positions()->with('allowances.component')->get() as $position) {
            foreach ($position->allowances as $allowance) {
                $amount = $allowance->amount;

                if (empty($amount) || $amount == 0) {
                    $amount = (float) ($allowance->component->default_amount ?? 0);
                }

                if ($amount == 0) continue;

                if (!$allowance->component) continue;

                $total += $amount;
                $this->addDetail($payroll, $allowance->component, $amount);
            }
        }

        // LOGIKA ADJUSTMENT (BONUS/POTONGAN MANUAL)
        $adjustments = PayrollAdjustment::with('component')
            ->where('user_id', $user->id)
            ->where('periode', $periode)
            ->get();

        foreach ($adjustments as $adj) {
            $amount = $this->calculateAmount(
                $adj->amount_type ?? 'fixed',
                (float) $adj->amount,
                $adj->formula_type ?? 'hadir',
                $adj->formula_interval_minutes,
                $user,
                $periode,
                $adj->component
            );

            if ($amount == 0) continue;
            if (!$adj->component) continue;

            $total += $amount;
            $this->addDetail(
                $payroll,
                $adj->component,
                $amount
            );
        }

        $payroll->update(['total_gaji' => (int) $total]);

        return $payroll;
    }

    protected function addDetail(Payroll $payroll, SalaryComponent $component, float $amount): void
    {
        if ($amount == 0) return;

        $payroll->details()->create([
            'payroll_id'   => $payroll->id,
            'component_id' => $component->id,
            'amount'       => (int) $amount,
        ]);
    }

    private function calculateAmount(
        string $amountType,
        float $rate,
        ?string $formulaType,
        ?int $formulaIntervalMinutes,
        User $user,
        string $periode,
        ?SalaryComponent $component = null
    ): float {
        if ($amountType === 'formula') {
            $year = date('Y', strtotime($periode));
            $month = date('m', strtotime($periode));

            if (($formulaType ?? 'hadir') === 'jam_kerja') {
                $intervalMinutes = max((int) ($formulaIntervalMinutes ?? 30), 1);
                $totalMinutes = $this->getWorkDurationMinutes($user, $year, $month);
                $units = $totalMinutes / $intervalMinutes;

                return (float) ($rate * $units);
            }

            if ($formulaType === 'lembur') {
                $jumlahLembur = $this->getOvertimeCount($user, $year, $month);

                return (float) ($rate * $jumlahLembur);
            }

            if ($formulaType === 'jam_mengajar_teori') {
                $totalJamTeori = $this->getTotalTeachingTheoryHours($user, $year, $month);

                return (float) ($rate * $totalJamTeori);
            }

            if ($formulaType === 'jam_mengajar_praktik') {
                $totalJamPraktik = $this->getTotalTeachingPracticeHours($user, $year, $month);

                return (float) ($rate * $totalJamPraktik);
            }

            if ($formulaType === 'piket') {
                $jumlahPiket = Attendance::where('user_id', $user->id)
                    ->whereYear('tanggal', $year)
                    ->whereMonth('tanggal', $month)
                    ->where('ada_piket', true)
                    ->count();

                return (float) ($rate * $jumlahPiket);
            }

            $jumlahHadir = Attendance::where('user_id', $user->id)
                ->whereYear('tanggal', $year)
                ->whereMonth('tanggal', $month)
                ->whereRaw('LOWER(status_disiplin) = ?', ['hadir'])
                ->count();

            return (float) ($rate * $jumlahHadir);
        }

        if ($amountType === 'percentage') {
            $baseAmount = (float) ($component->default_amount ?? 0);

            return $baseAmount * ($rate / 100);
        }

        return $rate;
    }

    private function buildFormulaNote(
        string $formulaType,
        ?int $formulaIntervalMinutes,
        float $rate,
        User $user,
        string $periode
    ): string {
        $year = date('Y', strtotime($periode));
        $month = date('m', strtotime($periode));

        if ($formulaType === 'jam_kerja') {
            $intervalMinutes = max((int) ($formulaIntervalMinutes ?? 30), 1);
            $totalMinutes = $this->getWorkDurationMinutes($user, $year, $month);

            return " ({$totalMinutes} menit / {$intervalMinutes} menit x Rp" . number_format($rate, 0, ',', '.') . ")";
        }

        if ($formulaType === 'lembur') {
            $jumlahLembur = $this->getOvertimeCount($user, $year, $month);

            return " ({$jumlahLembur} x lembur)";
        }

        if ($formulaType === 'jam_mengajar_teori') {
            $totalJamTeori = $this->getTotalTeachingTheoryHours($user, $year, $month);

            return " ({$totalJamTeori} jam teori x Rp" . number_format($rate, 0, ',', '.') . ")";
        }

        if ($formulaType === 'jam_mengajar_praktik') {
            $totalJamPraktik = $this->getTotalTeachingPracticeHours($user, $year, $month);

            return " ({$totalJamPraktik} jam praktik x Rp" . number_format($rate, 0, ',', '.') . ")";
        }

        if ($formulaType === 'piket') {
            $jumlahPiket = Attendance::where('user_id', $user->id)
                ->whereYear('tanggal', $year)
                ->whereMonth('tanggal', $month)
                ->where('ada_piket', true)
                ->count();

            return " ({$jumlahPiket} x piket)";
        }

        $jumlahHadir = Attendance::where('user_id', $user->id)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->whereRaw('LOWER(status_disiplin) = ?', ['hadir'])
            ->count();

        return " ({$jumlahHadir} x hadir)";
    }

    private function getTotalTeachingTheoryHours(User $user, string $year, string $month): float
    {
        return (float) Attendance::where('user_id', $user->id)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->sum('jam_teori');
    }

    private function getTotalTeachingPracticeHours(User $user, string $year, string $month): float
    {
        return (float) Attendance::where('user_id', $user->id)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->sum('jam_praktik');
    }

    private function getOvertimeCount(User $user, string $year, string $month): int
    {
        $pegawaiId = $user->pegawai?->id;

        if (! $pegawaiId) {
            return 0;
        }

        return Overtime::where('pegawai_id', $pegawaiId)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->where('is_approved', true)
            ->count();
    }

    private function getWorkDurationMinutes(User $user, string $year, string $month): int
    {
        return Attendance::where('user_id', $user->id)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->get()
            ->sum(function (Attendance $attendance) {
                if ($attendance->durasi_hadir_menit !== null) {
                    return (int) $attendance->durasi_hadir_menit;
                }

                if (!$attendance->jam_masuk || !$attendance->jam_pulang) {
                    return 0;
                }

                $start = Carbon::parse($attendance->tanggal . ' ' . $attendance->jam_masuk);
                $end = Carbon::parse($attendance->tanggal . ' ' . $attendance->jam_pulang);

                if ($end->lessThan($start)) {
                    $end->addDay();
                }

                return (int) $start->diffInMinutes($end);
            });
    }
}

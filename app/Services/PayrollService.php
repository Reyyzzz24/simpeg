<?php

namespace App\Services;

use App\Models\User;
use App\Models\Payroll;
use App\Models\PayrollDetail;
use App\Models\SalaryComponent;
use App\Models\SalaryRule;
use App\Models\PayrollAdjustment;
use App\Models\Absensi;

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
        if ($user->role === 'guru' && $user->guru) {
            $subRole = $user->guru->sub_role;
        } elseif ($user->role === 'pegawai' && $user->pegawai) {
            $subRole = $user->pegawai->sub_role;
        } else {
            $subRole = $user->sub_role;
        }

        $baseRule = SalaryRule::with('salaryRuleComponents.component')
            ->where('role', $user->role)
            ->where('sub_role', $subRole)
            ->where('is_active', 1)
            ->first();

        if ($baseRule) {
            foreach ($baseRule->salaryRuleComponents as $item) {
                $amount = (float) $item->amount;
                $note = "Rule: " . ($subRole ?? $user->role);

                // LOGIKA FORMULA (BERDASARKAN ABSENSI)
                if ($item->amount_type === 'formula') {
                    $year = date('Y', strtotime($periode));
                    $month = date('m', strtotime($periode));

                    $jumlahHadir = Absensi::where('user_id', $user->id)
                        ->whereYear('tanggal', $year)
                        ->whereMonth('tanggal', $month)
                        ->where('status_disiplin', 'hadir') // Menggunakan kolom status_disiplin sesuai DB
                        ->count();

                    $amount = (float) ($item->amount * $jumlahHadir);
                    $note .= " ({$jumlahHadir} x hadir)";
                }

                // LOGIKA PERCENTAGE (BERDASARKAN MASTER COMPONENT)
                elseif ($item->amount_type === 'percentage') {
                    // Mengambil default_amount dari tabel salary_components sebagai basis
                    $baseAmount = (float) ($item->component->default_amount ?? 0);
                    $amount = $baseAmount * ($item->amount / 100);
                    $note .= " ({$item->amount}% dari base Rp" . number_format($baseAmount, 0, ',', '.') . ")";
                }

                if ($amount == 0) continue;

                $total += $amount;
                $this->addDetail($payroll, $item->component->name, $amount, $note);
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

                $total += $amount;
                $this->addDetail($payroll, $allowance->component->name, $amount, "Jabatan: " . $position->name);
            }
        }

        // LOGIKA ADJUSTMENT (BONUS/POTONGAN MANUAL)
        $adjustments = PayrollAdjustment::with('component')
            ->where('user_id', $user->id)
            ->where('periode', $periode)
            ->get();

        foreach ($adjustments as $adj) {
            $amount = (float) $adj->amount;
            if ($amount == 0) continue;

            $total += $amount;
            $this->addDetail(
                $payroll,
                $adj->component->name ?? 'Adjustment',
                $amount,
                "Adjustment: " . ($adj->note ?? '-')
            );
        }

        $payroll->update(['total_gaji' => (int) $total]);

        return $payroll;
    }

    protected function addDetail($payroll, $name, $amount, $source = null)
    {
        if (!$name || $amount == 0) return;

        $component = SalaryComponent::firstOrCreate(['name' => $name]);

        PayrollDetail::create([
            'payroll_id'   => $payroll->id,
            'component_id' => $component->id,
            'amount'       => (int) $amount,
            'description'  => $source ? "$name ($source)" : $name,
        ]);
    }
}

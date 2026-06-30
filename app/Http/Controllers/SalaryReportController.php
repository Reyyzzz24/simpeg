<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaryReportController extends Controller
{
    public function index(Request $request)
    {
        $periode = $request->input('periode');
        $role = $request->input('role', 'all');

        $query = Payroll::with(['user', 'details.component', 'adjustments.component']);

        if ($periode) {
            $query->where('periode', $periode);
        }

        if (in_array($role, ['pegawai', 'guru'], true)) {
            $query->whereHas('user', function ($query) use ($role) {
                $query->where('role', $role);
            });
        }

        $payrolls = $query
            ->latest('periode')
            ->latest('id')
            ->get()
            ->map(function (Payroll $payroll) {
                $adjustments = $payroll->adjustments
                    ->where('periode', $payroll->periode)
                    ->values();

                return [
                    'id' => $payroll->id,
                    'user_id' => $payroll->user_id,
                    'nama' => $payroll->user->name ?? '-',
                    'role' => $payroll->user->role ?? '-',
                    'jabatan' => $payroll->jabatan_snapshot
                        ?: implode(', ', $payroll->user->positions()->pluck('name')->toArray()),
                    'periode' => $payroll->periode,
                    'total_gaji' => (float) $payroll->total_gaji,
                    'total_adjustment' => (float) $adjustments->sum('amount'),
                    'details' => $payroll->details->map(fn ($detail) => [
                        'komponen' => $detail->component->name ?? '-',
                        'amount' => (float) $detail->amount,
                    ]),
                ];
            });

        return Inertia::render('report/salaryreport/index', [
            'data' => $payrolls,
            'stats' => [
                'total_payroll' => $payrolls->count(),
                'total_gaji' => $payrolls->sum('total_gaji'),
                'total_adjustment' => $payrolls->sum('total_adjustment'),
            ],
            'filters' => [
                'periode' => $periode,
                'role' => $role,
            ],
        ]);
    }
}

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

        $query = Payroll::with(['user', 'details.component', 'adjustments.component']);

        if ($periode) {
            $query->where('periode', $periode);
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
                    'nama' => $payroll->user->name ?? '-',
                    'role' => $payroll->user->role ?? '-',
                    'jabatan' => implode(', ', $payroll->user->positions()->pluck('name')->toArray()),
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
            ],
        ]);
    }
}

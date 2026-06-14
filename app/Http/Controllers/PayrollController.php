<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PayrollService;
use App\Models\SalaryComponent;

class PayrollController extends Controller
{
    protected PayrollService $service;

    public function __construct(PayrollService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $periode = $request->input('periode');

        $query = Payroll::with(['user', 'adjustments.component']);

        if ($periode) {
            $query->where('periode', $periode);
        }

        $payrolls = $query->latest()->get();

        $data = $payrolls->map(function ($item) {
            $adjustments = $item->adjustments
                ->where('periode', $item->periode)
                ->values();

            return [
                'id' => $item->id,
                'user' => ['name' => $item->user->name ?? '-'],
                'user_id' => $item->user_id,
                'periode' => $item->periode,
                'total_gaji' => $item->total_gaji,

                'total_adjustment' => $adjustments->sum('amount'),

                'adjustments' => $adjustments->map(function ($adj) {
                    return [
                        'id' => $adj->id,
                        'user_id' => $adj->user_id,
                        'component_id' => $adj->component_id,
                        'amount_type' => $adj->amount_type ?? 'fixed',
                        'formula_type' => $adj->formula_type ?? 'hadir',
                        'formula_interval_minutes' => $adj->formula_interval_minutes,
                        'amount' => $adj->amount,
                        'note' => $adj->note,
                        'periode' => $adj->periode,
                        'component' => [
                            'name' => $adj->component->name ?? 'Adjustment',
                        ],
                    ];
                }),
            ];
        });

        return Inertia::render('payroll/index', [
            'payrolls' => $data,
            'filters' => ['periode' => $periode],
            'stats' => [
                'total' => $payrolls->count(),
                'total_gaji' => $payrolls->sum('total_gaji'),
            ],
            'users' => User::select('id', 'name')->get(),
            'components' => SalaryComponent::select('id', 'name')->get(),
        ]);
    }

    public function generate(User $user, Request $request)
    {
        $periode = $request->input('periode');

        $this->service->generate($user, $periode);

        return back()->with('success', "Payroll {$user->name} berhasil diperbarui.");
    }

    // Update fungsi generateAll di PayrollController.php
    public function generateAll(Request $request)
    {
        $request->validate(['periode' => 'required|string']);

        // Pastikan memuat 'guru' untuk mengambil sub_role[cite: 24]
        // Do not eager-load `positions` via `with` because positions are stored in JSON `position_ids`.
        User::with(['guru'])->chunk(100, function ($users) use ($request) {
            foreach ($users as $user) {
                $this->service->generate($user, $request->periode);
            }
        });

        return back()->with('success', 'Payroll semua user berhasil dibuat');
    }

    public function show(int $id)
    {
        $payroll = Payroll::with(['user', 'details.component'])->findOrFail($id);

        return response()->json([
            'id' => $payroll->id,
            'nama' => $payroll->user->name ?? '-',
            'periode' => $payroll->periode,
            'total_gaji' => $payroll->total_gaji,
            'details' => $payroll->details->map(function ($d) {
                return [
                    'komponen' => $d->component->name,
                    'amount' => $d->amount,
                ];
            }),
        ]);
    }

    public function destroy(int $id)
    {
        Payroll::findOrFail($id)->delete();
        return back()->with('success', 'Payroll dihapus');
    }
}

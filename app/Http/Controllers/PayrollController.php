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

        // 1. Tambahkan relasi 'adjustments.component' agar nama komponen terbaca
        $query = Payroll::with(['user', 'adjustments.component']);

        if ($periode) {
            $query->where('periode', $periode);
        }

        $data = $query->latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'user' => ['name' => $item->user->name ?? '-'],
                'user_id' => $item->user_id,
                'periode' => $item->periode,
                'total_gaji' => $item->total_gaji,

                // 2. Kirim total nominal adjustment
                'total_adjustment' => $item->adjustments->sum('amount'),

                // 3. Kirim array detail adjustment untuk ditampilkan sebagai Badge[cite: 9]
                'adjustments' => $item->adjustments->map(function ($adj) {
                    return [
                        'id' => $adj->id,
                        'user_id' => $adj->user_id, // WAJIB ADA
                        'component_id' => $adj->component_id, // WAJIB ADA
                        'amount' => $adj->amount,
                        'note' => $adj->note,
                        'periode' => $adj->periode, // WAJIB ADA
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
                'total' => Payroll::count(),
                'total_gaji' => Payroll::sum('total_gaji'),
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
        User::with(['guru', 'positions.allowances'])->chunk(100, function ($users) use ($request) {
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

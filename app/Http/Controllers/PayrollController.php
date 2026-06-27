<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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
        $role = $request->input('role');

        $query = Payroll::with(['user.pegawai', 'user.guru', 'adjustments.component'])
            ->whereHas('user', function ($query) {
                $query->whereHas('pegawai')
                    ->orWhereHas('guru');
            });

        if ($periode) {
            $query->where('periode', $periode);
        }

        if (in_array($role, ['guru', 'pegawai'], true)) {
            $query->whereHas('user', function ($query) use ($role) {
                $role === 'guru'
                    ? $query->whereHas('guru')
                    : $query->whereHas('pegawai');
            });
        }

        $payrolls = $query->latest()->get();

        $data = $payrolls->map(function ($item) {
            $adjustments = $item->adjustments
                ->where('periode', $item->periode)
                ->values();

            return [
                'id' => $item->id,
                'user' => [
                    'name' => $this->payrollUserName($item->user),
                ],
                'user_id' => $item->user_id,
                'user_type' => $item->user?->guru ? 'Guru' : 'Pegawai',
                'jabatan' => $item->jabatan_snapshot ?: $item->user?->positions()->pluck('name')->implode(', '),
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
            'filters' => [
                'periode' => $periode,
                'role' => in_array($role, ['guru', 'pegawai'], true) ? $role : null,
            ],
            'stats' => [
                'total' => $payrolls->count(),
                'total_gaji' => $payrolls->sum('total_gaji'),
            ],
            'users' => $this->payrollUsers(),
            'components' => SalaryComponent::select('id', 'name')->get(),
        ]);
    }

    public function generate(User $user, Request $request)
    {
        $periode = $request->input('periode');

        $this->ensurePayrollUser($user);

        $this->service->generate($user, $periode);

        return back()->with('success', "Payroll {$user->name} berhasil diperbarui.");
    }

    // Update fungsi generateAll di PayrollController.php
    public function generateAll(Request $request)
    {
        $request->validate(['periode' => 'required|string']);

        User::with(['guru', 'pegawai'])
            ->where(function ($query) {
                $query->whereHas('pegawai')
                    ->orWhereHas('guru');
            })
            ->chunk(100, function ($users) use ($request) {
                foreach ($users as $user) {
                    $this->service->generate($user, $request->periode);
                }
            });

        return back()->with('success', 'Payroll semua pegawai dan guru berhasil dibuat');
    }

    public function show(int $id)
    {
        $payroll = Payroll::with(['user', 'details.component'])->findOrFail($id);

        return response()->json([
            'id' => $payroll->id,
            'nama' => $payroll->user->name ?? '-',
            'jabatan' => $payroll->jabatan_snapshot ?: $payroll->user?->positions()->pluck('name')->implode(', '),
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

    private function payrollUsers()
    {
        return User::with(['pegawai:id,user_id,nama,nip', 'guru:id,user_id,nama,nuptk'])
            ->where(function ($query) {
                $query->whereHas('pegawai')
                    ->orWhereHas('guru');
            })
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $this->payrollUserName($user),
                'identifier' => $user->pegawai?->nip ?? $user->guru?->nuptk,
                'type' => $user->guru ? 'Guru' : 'Pegawai',
            ]);
    }

    private function payrollUserName(?User $user): string
    {
        if (! $user) {
            return '-';
        }

        return $user->pegawai?->nama
            ?? $user->guru?->nama
            ?? $user->name
            ?? '-';
    }

    private function ensurePayrollUser(User $user): void
    {
        if ($user->pegawai()->exists() || $user->guru()->exists()) {
            return;
        }

        throw ValidationException::withMessages([
            'user_id' => 'Payroll hanya bisa dibuat untuk pegawai atau guru.',
        ]);
    }
}

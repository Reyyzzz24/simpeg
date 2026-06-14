<?php

namespace App\Http\Controllers;

use App\Models\PayrollAdjustment;
use App\Models\SalaryComponent;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payroll;
use App\Services\PayrollService;

class PayrollAdjustmentController extends Controller
{
    public function __construct(private PayrollService $payrollService)
    {
    }

    // Di dalam PayrollController.php
    public function index()
    {
        return Inertia::render('Payroll/Index', [
            'payrolls' => Payroll::with('user')->latest()->get(),
            'stats' => [ /* data stats Anda */],

            'users' => User::select('id', 'name')->get(),
            'components' => SalaryComponent::select('id', 'name')->get(),
        ]);
    }

    public function show($id)
    {
        $baseAdjustment = PayrollAdjustment::findOrFail($id);

        $adjustments = PayrollAdjustment::with('component')
            ->where('user_id', $baseAdjustment->user_id)
            ->where('periode', $baseAdjustment->periode)
            ->get();

        return response()->json($adjustments);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'periode' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.component_id' => 'required|exists:salary_components,id',
            'items.*.amount_type' => 'required|in:fixed,percentage,formula',
            'items.*.formula_type' => 'nullable|in:hadir,jam_kerja,lembur,jam_mengajar_teori,jam_mengajar_praktik,piket',
            'items.*.formula_interval_minutes' => 'nullable|integer|min:1',
            'items.*.amount' => 'required|numeric',
            'items.*.note' => 'nullable|string',
        ]);

        PayrollAdjustment::where('user_id', $validated['user_id'])
            ->where('periode', $validated['periode'])
            ->delete();

        foreach ($validated['items'] as $item) {
            PayrollAdjustment::create([
                'user_id' => $validated['user_id'],
                'periode' => $validated['periode'],
                'component_id' => $item['component_id'],
                'amount_type' => $item['amount_type'],
                'formula_type' => $item['formula_type'] ?? 'hadir',
                'formula_interval_minutes' => $item['amount_type'] === 'formula'
                    ? ($item['formula_interval_minutes'] ?? 30)
                    : null,
                'amount' => $item['amount'],
                'note' => $item['note'] ?? null,
            ]);
        }

        $this->regeneratePayroll((int) $validated['user_id'], $validated['periode']);

        return back()->with('success', 'Data Adjustment berhasil diperbarui dan payroll dihitung ulang');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'periode' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.component_id' => 'required|exists:salary_components,id',
            'items.*.amount_type' => 'required|in:fixed,percentage,formula',
            'items.*.formula_type' => 'nullable|in:hadir,jam_kerja,lembur,jam_mengajar_teori,jam_mengajar_praktik,piket',
            'items.*.formula_interval_minutes' => 'nullable|integer|min:1',
            'items.*.amount' => 'required|numeric',
            'items.*.note' => 'nullable|string',
        ]);

        $adjustment = PayrollAdjustment::findOrFail($id);

        PayrollAdjustment::where('user_id', $adjustment->user_id)
            ->where('periode', $adjustment->periode)
            ->delete();

        foreach ($validated['items'] as $item) {
            PayrollAdjustment::create([
                'user_id' => $validated['user_id'],
                'periode' => $validated['periode'],
                'component_id' => $item['component_id'],
                'amount_type' => $item['amount_type'],
                'formula_type' => $item['formula_type'] ?? 'hadir',
                'formula_interval_minutes' => $item['amount_type'] === 'formula'
                    ? ($item['formula_interval_minutes'] ?? 30)
                    : null,
                'amount' => $item['amount'],
                'note' => $item['note'] ?? null,
            ]);
        }

        $this->regeneratePayroll((int) $validated['user_id'], $validated['periode']);

        return back()->with('success', 'Adjustment berhasil diperbarui dan payroll dihitung ulang');
    }

    public function destroy($id)
    {
        $adjustment = PayrollAdjustment::findOrFail($id);
        $userId = $adjustment->user_id;
        $periode = $adjustment->periode;

        $adjustment->delete();

        $this->regeneratePayroll((int) $userId, $periode);

        return back()->with('success', 'Adjustment berhasil dihapus dan payroll dihitung ulang');
    }

    private function regeneratePayroll(int $userId, string $periode): void
    {
        // Do not eager-load `positions` here because positions are stored as JSON; PayrollService will load them.
        $user = User::with(['guru', 'pegawai'])->find($userId);

        if ($user) {
            $this->payrollService->generate($user, $periode);
        }
    }
}

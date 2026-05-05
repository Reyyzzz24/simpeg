<?php

namespace App\Http\Controllers;

use App\Models\PayrollAdjustment;
use App\Models\SalaryComponent;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payroll;

class PayrollAdjustmentController extends Controller
{
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
                'amount' => $item['amount'],
                'note' => $item['note'],
            ]);
        }

        return back()->with('success', 'Data Adjustment berhasil diperbarui');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'note' => 'nullable|string',
            'component_id' => 'required|exists:salary_components,id',
            'periode' => 'required|string',
        ]);

        $adjustment = PayrollAdjustment::findOrFail($id);
        $adjustment->update($validated);

        return back()->with('success', 'Adjustment berhasil diperbarui');
    }

    public function destroy($id)
    {
        $adjustment = PayrollAdjustment::findOrFail($id);
        $adjustment->delete();

        return back()->with('success', 'Adjustment berhasil dihapus');
    }
}

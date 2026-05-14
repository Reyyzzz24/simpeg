<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SalaryRule;
use App\Models\SalaryComponent;
use App\Models\SalaryRuleComponent;
use App\Models\Position;
use Illuminate\Validation\Rule;

class SalaryRuleController extends Controller
{
    public function index()
    {
        return Inertia::render('salary-rule/index', [

            // RULE + COMPONENTS (FIXED RELATION)
            'data' => SalaryRule::with('salaryRuleComponents.component')->get(),

            // master components
            'components' => SalaryComponent::all(),

            // positions (optional reference UI)
            'salaryRules' => SalaryRule::with('salaryRuleComponents.component')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'sub_role' => 'nullable|string',
            'status_kerja' => ['required', Rule::in(SalaryRule::STATUS_KERJA_OPTIONS)],
            'is_active' => 'required|boolean',
            'components' => 'required|array',
            'components.*.id' => 'required|exists:salary_components,id',
            'components.*.amount_type' => 'required|in:fixed,percentage,formula',
            'components.*.formula_type' => 'nullable|in:hadir,jam_kerja',
            'components.*.formula_interval_minutes' => 'nullable|integer|min:1|max:1440',
            'components.*.amount' => 'required|numeric',
        ]);

        $rule = SalaryRule::create([
            'role' => $validated['role'],
            'sub_role' => $validated['sub_role'],
            'status_kerja' => $validated['status_kerja'],
            'is_active' => $validated['is_active'],
        ]);

        foreach ($validated['components'] as $component) {
            SalaryRuleComponent::create([
                'salary_rule_id' => $rule->id,
                'component_id' => $component['id'],
                'amount_type' => $component['amount_type'], // Tidak perlu default 'fixed' lagi karena sudah divalidasi
                'formula_type' => $component['amount_type'] === 'formula'
                    ? ($component['formula_type'] ?? 'hadir')
                    : null,
                'formula_interval_minutes' => $component['amount_type'] === 'formula'
                    ? (int) ($component['formula_interval_minutes'] ?? 30)
                    : null,
                'amount' => $component['amount'],
            ]);
        }

        return back()->with('success', 'Salary rule created');
    }

    public function update(Request $request, SalaryRule $salaryRule)
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'sub_role' => 'required|string',
            'status_kerja' => ['required', Rule::in(SalaryRule::STATUS_KERJA_OPTIONS)],
            'is_active' => 'required|boolean',
            'components' => 'required|array',
            'components.*.id' => 'required|exists:salary_components,id',
            'components.*.amount_type' => 'required|in:fixed,percentage,formula',
            'components.*.formula_type' => 'nullable|in:hadir,jam_kerja',
            'components.*.formula_interval_minutes' => 'nullable|integer|min:1|max:1440',
            'components.*.amount' => 'required|numeric',
        ]);

        $salaryRule->update([
            'role' => $validated['role'],
            'sub_role' => $validated['sub_role'],
            'status_kerja' => $validated['status_kerja'],
            'is_active' => $validated['is_active'],
        ]);

        $incomingIds = collect($validated['components'])
            ->pluck('id')
            ->toArray();


        SalaryRuleComponent::where('salary_rule_id', $salaryRule->id)
            ->whereNotIn('component_id', $incomingIds)
            ->delete();


        foreach ($validated['components'] as $componentData) {

            SalaryRuleComponent::updateOrCreate(
                [
                    'salary_rule_id' => $salaryRule->id,
                    'component_id' => $componentData['id'],
                ],
                [
                    'amount_type' => $componentData['amount_type'],
                    'formula_type' => $componentData['amount_type'] === 'formula'
                        ? ($componentData['formula_type'] ?? 'hadir')
                        : null,
                    'formula_interval_minutes' => $componentData['amount_type'] === 'formula'
                        ? (int) ($componentData['formula_interval_minutes'] ?? 30)
                        : null,
                    'amount' => $componentData['amount'],
                ]
            );
        }

        return back()->with('success', 'Salary rule updated');
    }

    public function destroy(SalaryRule $salaryRule)
    {
        // otomatis hapus child components
        $salaryRule->delete();

        return back()->with('success', 'Salary rule berhasil dihapus');
    }
}

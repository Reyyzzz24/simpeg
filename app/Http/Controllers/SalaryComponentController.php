<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SalaryComponent;
use Illuminate\Support\Str;

class SalaryComponentController extends Controller
{
    public function index()
    {
        return Inertia::render('salary-component/index', [
            'data' => SalaryComponent::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'nullable|string|in:fixed,percentage,formula',
            'default_amount' => 'nullable|numeric',
        ]);

        SalaryComponent::create([
            'code' => Str::slug($request->name, '_'),
            'name' => $request->name,
            'type' => $request->type ?? 'fixed',
            'default_amount' => $request->default_amount ?? 0,
        ]);

        return back();
}

    public function update(Request $request, SalaryComponent $salaryComponent)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'nullable|string|in:fixed,percentage,formula',
            'default_amount' => 'nullable|numeric',
        ]);

        $salaryComponent->update([
            'code' => Str::slug($request->name, '_'),
            'name' => $request->name,
            'type' => $request->type ?? 'fixed',
            'default_amount' => $request->default_amount ?? 0,
        ]);

        return back();
    }

    public function destroy(SalaryComponent $salaryComponent)
    {
        $salaryComponent->delete();

        return back();
    }
}

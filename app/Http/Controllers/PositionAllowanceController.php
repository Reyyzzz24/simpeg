<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PositionAllowance;
use App\Models\Position;
use App\Models\SalaryComponent;

class PositionAllowanceController extends Controller
{
    public function index()
    {
        return Inertia::render('position-allowance/index', [
            'data' => PositionAllowance::with(['position', 'component'])->get(),
            'positions' => Position::all(),
            'components' => SalaryComponent::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'position_id' => 'required',
            'component_id' => 'required',
            'amount' => 'required|numeric',
        ]);

        PositionAllowance::create([
            'position_id' => $request->position_id,
            'component_id' => $request->component_id,
            'amount' => $request->amount,
        ]);

        return back()->with('success', 'Tunjangan ditambahkan');
    }

    public function update(Request $request, PositionAllowance $positionAllowance)
    {
        $request->validate([
            'position_id' => 'required',
            'component_id' => 'required',
            'amount' => 'required|numeric',
        ]);

        $positionAllowance->update([
            'position_id' => $request->position_id,
            'component_id' => $request->component_id,
            'amount' => $request->amount,
        ]);

        return back()->with('success', 'Tunjangan diupdate');
    }

    public function destroy(PositionAllowance $positionAllowance)
    {
        $positionAllowance->delete();

        return back()->with('success', 'Tunjangan dihapus');
    }
}

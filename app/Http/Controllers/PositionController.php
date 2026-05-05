<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Position;

class PositionController extends Controller
{
    public function index()
    {
        return Inertia::render('position/index', [
            'positions' => Position::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        Position::create($request->all());

        return back()->with('success', 'Position dibuat');
    }

    public function update(Request $request, Position $position)
    {
        $position->update($request->all());

        return back()->with('success', 'Position diupdate');
    }

    public function destroy(Position $position)
    {
        $position->delete();

        return back()->with('success', 'Position dihapus');
    }
}

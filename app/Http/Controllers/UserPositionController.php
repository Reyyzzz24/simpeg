<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UserPosition;
use App\Models\User;
use App\Models\Position;

class UserPositionController extends Controller
{
    /**
     * LIST DATA
     */
    public function index()
    {
        $data = UserPosition::with(['user', 'position'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user' => [
                        'id' => $item->user->id ?? null,
                        'name' => $item->user->name ?? '-',
                    ],
                    'position' => [
                        'id' => $item->position->id ?? null,
                        'name' => $item->position->name ?? '-',
                    ],
                ];
            });

        return Inertia::render('user-position/index', [
            'data' => $data,
            'users' => User::select('id', 'name')->get(),
            'positions' => Position::select('id', 'name')->get(),
        ]);
    }

    /**
     * STORE
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position_id' => 'required|exists:positions,id',
        ]);

        UserPosition::create([
            'user_id' => $request->user_id,
            'position_id' => $request->position_id,
        ]);

        return back()->with('success', 'Jabatan berhasil ditambahkan');
    }

    public function update(Request $request, UserPosition $userPosition)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position_id' => 'required|exists:positions,id',
        ]);

        $userPosition->update([
            'user_id' => $request->user_id,
            'position_id' => $request->position_id,
        ]);

        return back()->with('success', 'Jabatan berhasil diupdate');
    }

    /**
     * DELETE
     */
    public function destroy(UserPosition $userPosition)
    {
        $userPosition->delete();

        return back()->with('success', 'Data berhasil dihapus');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
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
        $data = UserPosition::with(['user'])
            ->latest()
            ->get()
            ->map(function ($item) {
                $positions = \App\Models\Position::whereIn('id', $item->position_ids ?? [])->get();
                return [
                    'id' => $item->id,
                    'user' => [
                        'id' => $item->user->id ?? null,
                        'name' => $item->user->name ?? '-',
                    ],
                    'position_ids' => array_map('strval', $item->position_ids ?? []),
                    'positions' => $positions->map(function ($p) {
                        return ['id' => $p->id, 'name' => $p->name];
                    })->values(),
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
            'position_ids' => 'required|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        $userId = $request->user_id;
        $positionIds = $request->position_ids;

        // store as single row per user with position_ids JSON
        UserPosition::updateOrCreate(
            ['user_id' => $userId],
            ['position_ids' => $positionIds]
        );

        // observer will sync Teacher/Employee rows

        return back()->with('success', 'Jabatan berhasil ditambahkan');
    }
    public function update(Request $request, UserPosition $userPosition)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position_ids' => 'required|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        $userPosition->update([
            'user_id' => $request->user_id,
            'position_ids' => $request->position_ids,
        ]);

        // observer will sync Teacher/Employee rows

        return back()->with('success', 'Jabatan berhasil diupdate');
    }

    /**
     * DELETE
     */
    public function destroy(UserPosition $userPosition)
    {
        $userId = $userPosition->user_id;

        $userPosition->delete();

        // observer will clear Teacher/Employee rows on delete

        return back()->with('success', 'Data berhasil dihapus');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use App\Models\UserPosition;
use App\Models\User;
use App\Models\Position;
use Illuminate\Validation\ValidationException;

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
            'users' => $this->assignableUsers(),
            'positions' => Position::select('id', 'name')->get(),
        ]);
    }

    /**
     * STORE
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'position_ids' => 'required|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        $this->ensureAssignableUser((int) $validated['user_id']);

        // store as single row per user with position_ids JSON
        UserPosition::updateOrCreate(
            ['user_id' => $validated['user_id']],
            ['position_ids' => $validated['position_ids']]
        );

        // observer will sync Teacher/Employee rows

        return back()->with('success', 'Jabatan berhasil ditambahkan');
    }
    public function update(Request $request, UserPosition $userPosition)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'position_ids' => 'required|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        $this->ensureAssignableUser((int) $validated['user_id']);

        $userPosition->update([
            'user_id' => $validated['user_id'],
            'position_ids' => $validated['position_ids'],
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

    private function assignableUsers()
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
                'name' => $user->pegawai?->nama ?? $user->guru?->nama ?? $user->name,
                'identifier' => $user->pegawai?->nip ?? $user->guru?->nuptk,
                'type' => $user->guru ? 'Guru' : 'Pegawai',
            ]);
    }

    private function ensureAssignableUser(int $userId): void
    {
        $isAssignable = User::whereKey($userId)
            ->where(function ($query) {
                $query->whereHas('pegawai')
                    ->orWhereHas('guru');
            })
            ->exists();

        if ($isAssignable) {
            return;
        }

        throw ValidationException::withMessages([
            'user_id' => 'Jabatan hanya bisa diberikan untuk pegawai atau guru.',
        ]);
    }
}

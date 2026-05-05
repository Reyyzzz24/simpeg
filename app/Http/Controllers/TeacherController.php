<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Position;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Guru::with('user', 'position')
            ->orderBy('nama', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'nama' => $item->nama,
                    'nuptk' => $item->nuptk,
                    'sub_role' => $item->sub_role,
                    'position_id' => $item->position_id,
                    'jabatan' => $item->position->name ?? '-',

                    // IMPORTANT: jangan cast, biarkan null tetap null
                    'tarif_per_30_menit' => $item->tarif_per_30_menit,
                    'transport_harian' => $item->transport_harian,
                    'tunjangan_jabatan' => $item->tunjangan_jabatan,
                    'tunjangan_praktik' => $item->tunjangan_praktik,
                ];
            });

        return Inertia::render('teacher/index', [
            'teachers' => $teachers,
            'positions' => Position::all(),
            'stats' => [
                'total' => $teachers->count()
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nama' => 'required|string|max:255',
            'nuptk' => 'nullable|string|unique:guru,nuptk',
            'position_id' => 'nullable|exists:positions,id',
            'sub_role' => 'nullable|string',

            'tarif_per_30_menit' => 'nullable|numeric',
            'transport_harian' => 'nullable|numeric',
            'tunjangan_jabatan' => 'nullable|numeric',
            'tunjangan_praktik' => 'nullable|numeric',
        ]);

        Guru::create([
            'user_id' => $validated['user_id'],
            'nama' => $validated['nama'],
            'nuptk' => $validated['nuptk'] ?? null,
            'position_id' => $validated['position_id'] ?? null,
            'sub_role' => $validated['sub_role'] ?? null,

            'tarif_per_30_menit' => $validated['tarif_per_30_menit'] ?? null,
            'transport_harian' => $validated['transport_harian'] ?? null,
            'tunjangan_jabatan' => $validated['tunjangan_jabatan'] ?? null,
            'tunjangan_praktik' => $validated['tunjangan_praktik'] ?? null,
        ]);

        return back()->with('success', 'Data guru berhasil ditambahkan');
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nuptk' => 'nullable|string|unique:guru,nuptk,' . $guru->id,
            'sub_role' => 'nullable|string',
            'position_id' => 'nullable|exists:positions,id',

            'tarif_per_30_menit' => 'nullable|numeric',
            'transport_harian' => 'nullable|numeric',
            'tunjangan_jabatan' => 'nullable|numeric',
            'tunjangan_praktik' => 'nullable|numeric',
        ]);

        $guru->update([
            'nama' => $validated['nama'],
            'nuptk' => $validated['nuptk'] ?? null,
            'sub_role' => $validated['sub_role'] ?? null,
            'position_id' => $validated['position_id'] ?? null,

            'tarif_per_30_menit' => $validated['tarif_per_30_menit'] ?? null,
            'transport_harian' => $validated['transport_harian'] ?? null,
            'tunjangan_jabatan' => $validated['tunjangan_jabatan'] ?? null,
            'tunjangan_praktik' => $validated['tunjangan_praktik'] ?? null,
        ]);

        // sync user name
        if ($guru->user) {
            $guru->user->update([
                'name' => $validated['nama']
            ]);
        }

        return back()->with('success', 'Data guru berhasil diperbarui');
    }

    public function destroy(Guru $guru)
    {
        $guru->delete();

        return back()->with('success', 'Data guru berhasil dihapus');
    }
}
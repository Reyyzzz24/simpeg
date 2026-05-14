<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Position;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Teacher::with('user', 'position')
            ->orderBy('nama', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'nama' => $item->nama,
                    'tempat_tanggal_lahir' => $item->tempat_tanggal_lahir,
                    'jenis_kelamin' => $item->jenis_kelamin,
                    'nuptk' => $item->nuptk,
                    'sub_role' => $item->sub_role,
                    'status_kerja' => $item->status_kerja ?? 'tetap',
                    'position_id' => $item->position_id,
                    'jabatan' => $item->position->name ?? '-',
                    'tugas_tambahan' => $item->tugas_tambahan,
                    'mata_pelajaran' => $item->mata_pelajaran,
                    'pendidikan_terakhir' => $item->pendidikan_terakhir,
                    'tmt_sekolah' => $item->tmt_sekolah,
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
            'tempat_tanggal_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'nuptk' => 'nullable|string|unique:teachers,nuptk',
            'position_id' => 'nullable|exists:positions,id',
            'tugas_tambahan' => 'nullable|string|max:255',
            'mata_pelajaran' => 'nullable|string|max:255',
            'pendidikan_terakhir' => 'nullable|string|max:255',
            'tmt_sekolah' => 'nullable|date',
            'sub_role' => 'nullable|string',
            'status_kerja' => ['required', Rule::in(Teacher::STATUS_KERJA_OPTIONS)],
        ]);

        Teacher::create([
            'user_id' => $validated['user_id'],
            'nama' => $validated['nama'],
            'tempat_tanggal_lahir' => $validated['tempat_tanggal_lahir'] ?? null,
            'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
            'nuptk' => $validated['nuptk'] ?? null,
            'position_id' => $validated['position_id'] ?? null,
            'tugas_tambahan' => $validated['tugas_tambahan'] ?? null,
            'mata_pelajaran' => $validated['mata_pelajaran'] ?? null,
            'pendidikan_terakhir' => $validated['pendidikan_terakhir'] ?? null,
            'tmt_sekolah' => $validated['tmt_sekolah'] ?? null,
            'sub_role' => $validated['sub_role'] ?? null,
            'status_kerja' => $validated['status_kerja'],
        ]);

        return back()->with('success', 'Data guru berhasil ditambahkan');
    }

    public function update(Request $request, Teacher $guru)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tempat_tanggal_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'nuptk' => 'nullable|string|unique:teachers,nuptk,' . $guru->id,
            'sub_role' => 'nullable|string',
            'status_kerja' => ['required', Rule::in(Teacher::STATUS_KERJA_OPTIONS)],
            'position_id' => 'nullable|exists:positions,id',
            'tugas_tambahan' => 'nullable|string|max:255',
            'mata_pelajaran' => 'nullable|string|max:255',
            'pendidikan_terakhir' => 'nullable|string|max:255',
            'tmt_sekolah' => 'nullable|date',
        ]);

        $guru->update([
            'nama' => $validated['nama'],
            'tempat_tanggal_lahir' => $validated['tempat_tanggal_lahir'] ?? null,
            'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
            'nuptk' => $validated['nuptk'] ?? null,
            'sub_role' => $validated['sub_role'] ?? null,
            'status_kerja' => $validated['status_kerja'],
            'position_id' => $validated['position_id'] ?? null,
            'tugas_tambahan' => $validated['tugas_tambahan'] ?? null,
            'mata_pelajaran' => $validated['mata_pelajaran'] ?? null,
            'pendidikan_terakhir' => $validated['pendidikan_terakhir'] ?? null,
            'tmt_sekolah' => $validated['tmt_sekolah'] ?? null,
        ]);

        // sync user name
        if ($guru->user) {
            $guru->user->update([
                'name' => $validated['nama']
            ]);
        }

        return back()->with('success', 'Data guru berhasil diperbarui');
    }

    public function destroy(Teacher $guru)
    {
        if ($guru->user) {
            $guru->user->delete();
        } else {
            $guru->delete();
        }

        return back()->with('success', 'Data guru berhasil dihapus');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Position;
use App\Models\UserPosition;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Schema;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        // Tambahkan 'profile' ke dalam with()
        $teachers = Teacher::with(['user', 'position', 'profile'])
            ->orderBy('nama', 'asc')
            ->get()
            ->map(function ($item) {
                $positions = $item->getPositions();
                $p = $item->profile;

                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'nama' => $item->nama,
                    'tempat_tanggal_lahir' => $item->tempat_tanggal_lahir,
                    'jenis_kelamin' => $item->jenis_kelamin,
                    'nuptk' => $item->nuptk,
                    'sub_role' => $item->sub_role,
                    'status_kerja' => $item->status_kerja ?? 'tetap',
                    'position_ids' => $positions->pluck('id')->map(fn($v) => (string) $v)->toArray(),
                    'positions' => $positions->map(fn($p) => ['id' => $p->id, 'name' => $p->name]),
                    'jabatan' => $positions->first()->name ?? '-',
                    'tugas_tambahan' => $item->tugas_tambahan,
                    'mata_pelajaran' => $item->mata_pelajaran,
                    'pendidikan_terakhir' => $item->pendidikan_terakhir,
                    'tmt_sekolah' => $item->tmt_sekolah,
                    
                    // Mapping profile agar bisa diakses di frontend
                    'profile' => $p, 
                ];
            });

        return Inertia::render('teacher/index', [
            'teachers' => $teachers,
            'positions' => Position::all(),
            'stats' => ['total' => $teachers->count()],
        ]);
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
            'position_ids' => 'nullable|array',
            'tugas_tambahan' => 'nullable|string|max:255',
            'mata_pelajaran' => 'nullable|string|max:255',
            'pendidikan_terakhir' => 'nullable|string|max:255',
            'tmt_sekolah' => 'nullable|date',
            
            // Validasi profile
            'profile' => 'nullable|array',
        ]);

        // 1. Update Teacher Utama
        $updateData = array_intersect_key($validated, array_flip([
            'nama', 'tempat_tanggal_lahir', 'jenis_kelamin', 'nuptk', 'sub_role', 
            'status_kerja', 'tugas_tambahan', 'mata_pelajaran', 'pendidikan_terakhir', 'tmt_sekolah'
        ]));

        if (Schema::hasColumn('teachers', 'position_ids')) {
            $updateData['position_ids'] = $validated['position_ids'] ?? null;
        }

        $guru->update($updateData);

        // 2. Update/Create TeacherProfile
        if ($request->has('profile')) {
            $profileData = $request->profile;
            
            // Paksa field boolean agar tidak null
            $boolFields = ['lisensi_kepala_sekolah', 'diklat_kepengawasan', 'keahlian_braille', 'keahlian_bahasa_isyarat'];
            foreach ($boolFields as $field) {
                $profileData[$field] = (bool) ($profileData[$field] ?? false);
            }

            $guru->profile()->updateOrCreate(
                ['teacher_id' => $guru->id],
                $profileData
            );
        }

        // 3. Sync User & UserPosition
        if ($guru->user) {
            $guru->user->update(['name' => $validated['nama']]);
        }

        if ($guru->user_id) {
            UserPosition::updateOrCreate(
                ['user_id' => $guru->user_id],
                ['position_ids' => $validated['position_ids'] ?? []]
            );
        }

        return back()->with('success', 'Data guru berhasil diperbarui');
    }
}
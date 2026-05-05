<?php

namespace App\Http\Controllers;

use App\Models\Lembur;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LemburController extends Controller
{
    public function index()
    {
        $lembur = Lembur::query()
            ->with('pegawai:id,nama,nip')
            ->latest('tanggal')
            ->latest('id')
            ->get()
            ->map(fn (Lembur $item) => [
                'id' => $item->id,
                'pegawai_id' => $item->pegawai_id,
                'pegawai_nama' => $item->pegawai?->nama ?? '-',
                'pegawai_nip' => $item->pegawai?->nip,
                'tanggal' => $item->tanggal?->format('Y-m-d'),
                'jam_mulai' => substr((string) $item->jam_mulai, 0, 5),
                'jam_selesai' => substr((string) $item->jam_selesai, 0, 5),
                'tugas' => $item->tugas,
                'is_approved' => $item->is_approved,
            ]);

        return Inertia::render('overtime/index', [
            'lembur' => $lembur,
            'pegawai' => Pegawai::query()
                ->select('id', 'nama', 'nip')
                ->orderBy('nama')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        Lembur::create($this->validateData($request));

        return back()->with('success', 'Data lembur berhasil ditambahkan');
    }

    public function update(Request $request, Lembur $lembur)
    {
        $lembur->update($this->validateData($request));

        return back()->with('success', 'Data lembur berhasil diperbarui');
    }

    public function destroy(Lembur $lembur)
    {
        $lembur->delete();

        return back()->with('success', 'Data lembur berhasil dihapus');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'pegawai_id' => ['required', 'exists:pegawai,id'],
            'tanggal' => ['required', 'date'],
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
            'tugas' => ['required', 'string', 'max:1000'],
            'is_approved' => ['nullable', 'boolean'],
        ]);
    }
}

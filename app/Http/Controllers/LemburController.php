<?php

namespace App\Http\Controllers;

use App\Models\Overtime;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LemburController extends Controller
{
    public function index()
    {
        $lembur = Overtime::query()
            ->with('employee:id,nama,nip')
            ->latest('tanggal')
            ->latest('id')
            ->get()
            ->map(fn (Overtime $item) => [
                'id' => $item->id,
                'pegawai_id' => $item->pegawai_id,
                'pegawai_nama' => $item->employee?->nama ?? '-',
                'pegawai_nip' => $item->employee?->nip,
                'tanggal' => $item->tanggal?->format('Y-m-d'),
                'jam_mulai' => substr((string) $item->jam_mulai, 0, 5),
                'jam_selesai' => substr((string) $item->jam_selesai, 0, 5),
                'tugas' => $item->tugas,
                'is_approved' => $item->is_approved,
            ]);

        return Inertia::render('overtime/index', [
            'lembur' => $lembur,
            'pegawai' => Employee::query()
                ->select('id', 'nama', 'nip')
                ->orderBy('nama')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        Overtime::create($this->validateData($request));

        return back()->with('success', 'Data lembur berhasil ditambahkan');
    }

    public function update(Request $request, Overtime $lembur)
    {
        $lembur->update($this->validateData($request));

        return back()->with('success', 'Data lembur berhasil diperbarui');
    }

    public function destroy(Overtime $lembur)
    {
        $lembur->delete();

        return back()->with('success', 'Data lembur berhasil dihapus');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'pegawai_id' => ['required', 'exists:employees,id'],
            'tanggal' => ['required', 'date'],
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
            'tugas' => ['required', 'string', 'max:1000'],
            'is_approved' => ['nullable', 'boolean'],
        ]);
    }
}

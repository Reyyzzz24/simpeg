<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        // Ambil semua pegawai beserta relasi user dan position
        $employees = Employee::with(['user', 'position'])
            ->orderBy('nama', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'nip' => $item->nip,
                    'sub_role' => $item->sub_role,
                    'status_kerja' => $item->status_kerja,
                    'position_id' => $item->position_id, // Simpan ID
                    'jabatan' => $item->position->name ?? '-', // Ambil nama dari relasi
                    'gaji_pokok' => (float) $item->gaji_pokok,
                    'transport_harian' => (float) $item->transport_harian,
                ];
            });

        return Inertia::render('employee/index', [
            'employees' => $employees,
            'positions' => \App\Models\Position::all(), // Kirim data jabatan untuk dropdown
            'stats' => ['total' => $employees->count()],
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => 'nullable|string|unique:employees,nip,' . $employee->id,
            'sub_role' => 'required|string',
            'status_kerja' => ['required', Rule::in(Employee::STATUS_KERJA_OPTIONS)],
            'position_id' => 'nullable|exists:positions,id', // Validasi position_id
            'gaji_pokok' => 'nullable|numeric',
            'transport_harian' => 'nullable|numeric',
        ]);

        $employee->update([
            'nama' => $validated['nama'],
            'nip' => $validated['nip'],
            'sub_role' => $validated['sub_role'],
            'status_kerja' => $validated['status_kerja'],
            'position_id' => $validated['position_id'],
            'gaji_pokok' => $validated['gaji_pokok'] ?? 0,
            'transport_harian' => $validated['transport_harian'] ?? 0,
        ]);

        if ($employee->user) {
            $employee->user->update([
                'name' => $validated['nama'],
            ]);
        }

        return back()->with('success', 'Employee berhasil diperbarui');
    }

    public function destroy(Employee $employee)
    {
        if ($employee->user) {
            $employee->user->delete();
        }

        $employee->delete();

        return back()->with('success', 'Employee berhasil dihapus');
    }
}

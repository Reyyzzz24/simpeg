<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\Position;
use Illuminate\Support\Facades\Schema;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        // Ambil semua pegawai beserta relasi user dan position. Do not eager-load `positions` collection.
        $employees = Employee::with(['user', 'position'])
            ->orderBy('nama', 'asc')
            ->get()
            ->map(function ($item) {
                $positions = $item->getPositions();

                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'tempat_tanggal_lahir' => $item->tempat_tanggal_lahir,
                    'jenis_kelamin' => $item->jenis_kelamin,
                    'tingkat_pendidikan' => $item->tingkat_pendidikan,
                    'tahun_lulus' => $item->tahun_lulus,
                    'tahun_masuk_kerja' => $item->tahun_masuk_kerja,
                    'nip' => $item->nip,
                    'sub_role' => $item->sub_role,
                    'status_kerja' => $item->status_kerja,
                    'position_ids' => $positions->pluck('id')->map(function ($v) { return (string) $v; })->toArray(),
                    'positions' => $positions->map(function ($p) { return ['id' => $p->id, 'name' => $p->name]; }),
                    'jabatan' => $positions->first()->name ?? $item->position->name ?? '-',
                ];
            });

        return Inertia::render('employee/index', [
            'employees' => $employees,
            'positions' => Position::all(),
            'stats' => ['total' => $employees->count()],
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tempat_tanggal_lahir' => 'nullable|string|max:255',
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'tingkat_pendidikan' => 'nullable|string|max:255',
            'tahun_lulus' => 'nullable|integer|min:1900|max:2100',
            'tahun_masuk_kerja' => 'nullable|integer|min:1900|max:2100',
            'nip' => 'nullable|string|unique:employees,nip,' . $employee->id,
            'sub_role' => 'required|string',
            'status_kerja' => ['required', Rule::in(Employee::STATUS_KERJA_OPTIONS)],
            'position_ids' => 'nullable|array',
            'position_ids.*' => 'exists:positions,id',
        ]);

        $updateData = [
            'nama' => $validated['nama'],
            'tempat_tanggal_lahir' => $validated['tempat_tanggal_lahir'] ?? null,
            'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
            'tingkat_pendidikan' => $validated['tingkat_pendidikan'] ?? null,
            'tahun_lulus' => $validated['tahun_lulus'] ?? null,
            'tahun_masuk_kerja' => $validated['tahun_masuk_kerja'] ?? null,
            'nip' => $validated['nip'],
            'sub_role' => $validated['sub_role'],
            'status_kerja' => $validated['status_kerja'],
        ];

        if (Schema::hasColumn('employees', 'position_ids')) {
            $updateData['position_ids'] = $validated['position_ids'] ?? null;
        }

        $employee->update($updateData);

        if ($employee->user) {
            $employee->user->update([
                'name' => $validated['nama'],
            ]);
        }

        // persist to user_positions.position_ids JSON for the user
        if ($employee->user_id) {
            UserPosition::updateOrCreate(
                ['user_id' => $employee->user_id],
                ['position_ids' => $validated['position_ids'] ?? []]
            );
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

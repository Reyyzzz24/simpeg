<?php

namespace App\Http\Controllers;

use App\Models\Overtime;
use App\Models\Employee;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LemburController extends Controller
{
    public function index()
    {
        $lembur = Overtime::query()
            ->with([
                'user:id,name,role',
                'employee:id,user_id,nama,nip',
                'teacher:id,user_id,nama,nuptk',
            ])
            ->latest('tanggal')
            ->latest('id')
            ->get()
            ->map(function (Overtime $item) {
                $isTeacher = $item->user?->role === 'guru' || $item->teacher;
                $profile = $isTeacher ? $item->teacher : $item->employee;

                return [
                    'id' => $item->id,
                    'pegawai_id' => $item->pegawai_id,
                    'pegawai_nama' => $profile?->nama ?? $item->user?->name ?? '-',
                    'pegawai_nip' => $item->employee?->nip ?? $item->teacher?->nuptk ?? null,
                    'pegawai_tipe' => $isTeacher ? 'Guru' : 'Pegawai',
                    'tanggal' => $item->tanggal?->format('Y-m-d'),
                    'jam_mulai' => substr((string) $item->jam_mulai, 0, 5),
                    'jam_selesai' => substr((string) $item->jam_selesai, 0, 5),
                    'tugas' => $item->tugas,
                    'is_approved' => $item->is_approved,
                ];
            });

        return Inertia::render('overtime/index', [
            'lembur' => $lembur,
            'users' => $this->employeeAndTeacherOptions(),
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

    public function history(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'month' => ['required', 'date_format:Y-m'],
        ]);

        [$year, $month] = explode('-', $validated['month']);

        $history = Overtime::query()
            ->where('pegawai_id', $validated['user_id'])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->latest('tanggal')
            ->latest('id')
            ->get()
            ->map(fn (Overtime $item) => [
                'date' => $item->tanggal?->format('Y-m-d'),
                'jam_mulai' => substr((string) $item->jam_mulai, 0, 5),
                'jam_selesai' => substr((string) $item->jam_selesai, 0, 5),
                'tugas' => $item->tugas,
                'status' => $item->is_approved ? 'Disetujui' : 'Menunggu',
            ]);

        return response()->json($history);
    }

    private function validateData(Request $request): array
    {
        $validated = $request->validate([
            'pegawai_id' => ['required', 'exists:users,id'],
            'tanggal' => ['required', 'date'],
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
            'tugas' => ['required', 'string', 'max:1000'],
            'is_approved' => ['nullable', 'boolean'],
        ]);

        if (! $this->isEmployeeOrTeacherUser((int) $validated['pegawai_id'])) {
            throw ValidationException::withMessages([
                'pegawai_id' => 'User harus terdaftar sebagai pegawai atau guru.',
            ]);
        }

        return $validated;
    }

    private function employeeAndTeacherOptions()
    {
        $employees = Employee::query()
            ->with('user:id,name')
            ->whereNotNull('user_id')
            ->get()
            ->map(fn (Employee $employee) => [
                'id' => $employee->user_id,
                'nama' => $employee->nama ?: $employee->user?->name,
                'nip' => $employee->nip,
                'tipe' => 'Pegawai',
            ]);

        $teachers = Teacher::query()
            ->with('user:id,name')
            ->whereNotNull('user_id')
            ->get()
            ->map(fn (Teacher $teacher) => [
                'id' => $teacher->user_id,
                'nama' => $teacher->nama ?: $teacher->user?->name,
                'nip' => $teacher->nuptk,
                'tipe' => 'Guru',
            ]);

        return $employees
            ->merge($teachers)
            ->filter(fn ($item) => $item['id'] && $item['nama'])
            ->unique('id')
            ->sortBy('nama')
            ->values();
    }

    private function isEmployeeOrTeacherUser(int $userId): bool
    {
        return Employee::where('user_id', $userId)->exists()
            || Teacher::where('user_id', $userId)->exists();
    }
}

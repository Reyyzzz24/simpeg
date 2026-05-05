<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\RedirectResponse;

class PresenceController extends Controller
{
    public function index(Request $request)
    {
        $mode = $request->input('mode', 'today');
        $date = $request->input('date', Carbon::today()->toDateString());

        $query = Absensi::with('user');

        if ($mode === 'today') {
            $query->whereDate('tanggal', Carbon::today()->toDateString());
        }

        if ($mode === 'date') {
            $query->whereDate('tanggal', $date);
        }

        if ($mode === 'all') {
            // tidak ada filter
        }

        $presences = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'user_id' => $item->user->id ?? null,
                'employee' => [
                    'id' => $item->user->id ?? null,
                    'name' => $item->user->name ?? 'N/A',
                    'nip' => $item->user->nip ?? '-',
                ],
                'masuk_time' => $item->jam_masuk
                    ? Carbon::parse($item->jam_masuk)->format('H:i')
                    : null,
                'pulang_time' => $item->jam_pulang
                    ? Carbon::parse($item->jam_pulang)->format('H:i')
                    : null,
                'status' => $item->status_disiplin,
                'tanggal' => $item->tanggal,
            ];
        });

        $stats = [
            'total_present' => $presences->where('status', 'HADIR')->count(),
            'total_late' => $presences->filter(fn($p) => $p['masuk_time'] > '08:00')->count(),
            'total_missing' => User::count() - $presences->count(),
        ];

        $users = User::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('presence/index', [
            'presences' => $presences,
            'stats' => $stats,
            'users' => $users,
            'filters' => [
                'mode' => $mode,
                'date' => $date,
            ]
        ]);
    }

    public function self()
    {
        $user = Auth::user();
        $today = now()->setTimezone(config('app.timezone'))->toDateString();
        $presence = Absensi::where('user_id', $user->id)
            ->whereDate('tanggal', $today)
            ->first();

        return Inertia::render('presence/employee/index', [
            'todayPresence' => [
                'tanggal' => $today,
                'jam_masuk' => $presence?->jam_masuk ? Carbon::parse($presence->jam_masuk)->format('H:i') : null,
                'jam_pulang' => $presence?->jam_pulang ? Carbon::parse($presence->jam_pulang)->format('H:i') : null,
                'status' => $presence?->status_disiplin,
            ],
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Simpan absensi (Manual Input dari Admin/TU)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tanggal' => 'required|date',
            'status_disiplin' => 'nullable|string',
            'jam_masuk' => 'nullable',
            'jam_pulang' => 'nullable',
            'jenis_ajar' => 'required|in:teori,praktik,none',
        ]);

        Absensi::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'tanggal' => $validated['tanggal'],
            ],
            $validated
        );

        return redirect()->back()->with('success', 'Data presensi berhasil diperbarui.');
    }

    public function update(Request $request, Absensi $presence)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_masuk' => 'nullable',
            'jam_pulang' => 'nullable',
            'status_disiplin' => 'nullable|string',
            'jenis_ajar' => 'nullable|string',
        ]);

        $presence->update($validated);

        return back()->with('success', 'Data presensi berhasil diperbarui');
    }

    public function gate()
    {
        $masukToken = Str::random(32);
        $pulangToken = Str::random(32);

        Cache::put('presence_token_masuk', $masukToken, now()->addSeconds(35));
        Cache::put('presence_token_pulang', $pulangToken, now()->addSeconds(35));

        return Inertia::render('presence/gate-index', [
            'token' => ['value' => $masukToken], // default token (masuk)
            'masukToken' => ['value' => $masukToken],
            'pulangToken' => ['value' => $pulangToken],
            'type' => now()->setTimezone(config('app.timezone'))->hour < 12 ? 'masuk' : 'pulang',
            'timeStatus' => 'Sesi Absensi Aktif',
            'remainingSeconds' => 30, // Pastikan ini dikirim
            'timeWindow' => [
                'masuk_start' => '06:00',
                'masuk_end' => '08:00',
                'pulang_start' => '16:00',
                'pulang_end' => '18:00',
            ],
            'masukValidation' => ['valid' => true, 'is_late' => false], // Data dummy agar tidak error
            'pulangValidation' => ['valid' => true, 'is_late' => false], // Data dummy agar tidak error
        ]);
    }

    public function markPresence($token)
    {
        // 1. Validasi Token QR untuk tipe masuk/pulang
        $masukCached = Cache::get('presence_token_masuk');
        $pulangCached = Cache::get('presence_token_pulang');

        if ($masukCached !== $token && $pulangCached !== $token) {
            return Inertia::render('presence/scan', [
                'status' => 'expired',
                'message' => 'QR Code sudah tidak berlaku, silakan scan ulang.'
            ]);
        }

        ['status' => $status, 'message' => $message] = $this->markCurrentUserPresence(
            $token === $masukCached ? 'masuk' : 'pulang'
        );

        return Inertia::render('presence/scan', [
            'status' => $status,
            'message' => $message
        ]);
    }

    public function markFacePresence(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:masuk,pulang'],
            'face_image' => ['nullable', 'string'],
        ]);

        $result = $this->markCurrentUserPresence($validated['type']);

        return back()->with($result['status'] === 'success' ? 'success' : 'error', $result['message']);
    }

    private function markCurrentUserPresence(string $type): array
    {
        $user = Auth::user();
        $now = now()->setTimezone(config('app.timezone'));

        $presence = Absensi::firstOrCreate([
            'user_id' => $user->id,
            'tanggal' => $now->toDateString(),
        ]);

        if ($type === 'masuk') {
            if (!$presence->jam_masuk) {
                $presence->update([
                    'jam_masuk' => $now->toTimeString(),
                    'status_disiplin' => 'HADIR',
                ]);

                return [
                    'status' => 'success',
                    'message' => 'Berhasil Absen Masuk',
                ];
            }

            return [
                'status' => 'info',
                'message' => 'Anda sudah melakukan absen masuk.',
            ];
        }

        if (!$presence->jam_pulang) {
            $presence->update([
                'jam_pulang' => $now->toTimeString(),
            ]);

            return [
                'status' => 'success',
                'message' => 'Berhasil Absen Pulang',
            ];
        }

        return [
            'status' => 'info',
            'message' => 'Anda sudah melakukan absen pulang.',
        ];
    }

    public function getHistory(Request $request)
    {
        $userId = $request->query('user_id');
        $month = $request->query('month');

        if (!$userId) {
            return response()->json(['message' => 'User ID is required'], 400);
        }

        // Jika bulan kosong, default ke bulan sekarang
        $month = $month ?: date('Y-m');

        $history = Absensi::where('user_id', $userId)
            ->where('tanggal', 'like', $month . '%')
            ->orderBy('tanggal', 'asc')
            ->get();

        return response()->json($history->map(function ($item) {
            return [
                'date' => \Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y'),
                'masuk_time' => $item->jam_masuk ? substr($item->jam_masuk, 0, 5) : '--:--',
                'pulang_time' => $item->jam_pulang ? substr($item->jam_pulang, 0, 5) : '--:--',
                'status' => $item->status_disiplin ?? 'HADIR',
            ];
        }));
    }
}

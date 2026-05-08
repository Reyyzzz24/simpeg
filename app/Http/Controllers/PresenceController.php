<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\TimeSetting;
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

        $query = Attendance::with('user');

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
                'total_jam_ajar' => $item->total_jam_ajar,
                'jenis_ajar' => $item->jenis_ajar,
                'durasi_hadir_menit' => $item->durasi_hadir_menit,
                'selisih_jam_ajar_menit' => $item->selisih_jam_ajar_menit,
                'status_validasi_ajar' => $item->status_validasi_ajar,
            ];
        });

        $timeWindow = $this->presenceTimeWindow();

        $stats = [
            'total_present' => $presences->where('status', 'HADIR')->count(),
            'total_late' => $presences
                ->filter(fn($p) => $p['masuk_time'] && $p['masuk_time'] > $timeWindow['masuk_end'])
                ->count(),
            'total_missing' => User::count() - $presences->count(),
        ];

        $users = User::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('presence/index', [
            'presences' => $presences,
            'stats' => $stats,
            'users' => $users,
            'timeWindow' => $timeWindow,
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
        $presence = Attendance::where('user_id', $user->id)
            ->whereDate('tanggal', $today)
            ->first();

        return Inertia::render('presence/employee/index', [
            'todayPresence' => [
                'tanggal' => $today,
                'jam_masuk' => $presence?->jam_masuk ? Carbon::parse($presence->jam_masuk)->format('H:i') : null,
                'jam_pulang' => $presence?->jam_pulang ? Carbon::parse($presence->jam_pulang)->format('H:i') : null,
                'status' => $presence?->status_disiplin,
                'total_jam_ajar' => $presence?->total_jam_ajar,
                'jenis_ajar' => $presence?->jenis_ajar,
                'durasi_hadir_menit' => $presence?->durasi_hadir_menit,
                'selisih_jam_ajar_menit' => $presence?->selisih_jam_ajar_menit,
                'status_validasi_ajar' => $presence?->status_validasi_ajar,
            ],
            'user' => $this->formatSelfUser($user),
        ]);
    }

    public function selfHistory()
    {
        $user = Auth::user();
        $presences = Attendance::where('user_id', $user->id)
            ->orderByDesc('tanggal')
            ->limit(60)
            ->get()
            ->map(fn(Attendance $presence) => $this->formatSelfPresenceRecord($presence));

        return Inertia::render('presence/employee/index', [
            'historyMode' => true,
            'selfPresences' => $presences,
            'todayPresence' => $this->formatTodayPresence($user),
            'user' => $this->formatSelfUser($user),
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
            'total_jam_ajar' => 'nullable|integer|min:0|max:24',
        ]);

        $validated = array_merge(
            $validated,
            $this->calculateTeachingComparison(
                $validated['tanggal'],
                $validated['jam_masuk'] ?? null,
                $validated['jam_pulang'] ?? null,
                (int) ($validated['total_jam_ajar'] ?? 0)
            )
        );

        Attendance::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'tanggal' => $validated['tanggal'],
            ],
            $validated
        );

        return redirect()->back()->with('success', 'Data presensi berhasil diperbarui.');
    }

    public function update(Request $request, Attendance $presence)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_masuk' => 'nullable',
            'jam_pulang' => 'nullable',
            'status_disiplin' => 'nullable|string',
            'jenis_ajar' => 'nullable|string',
            'total_jam_ajar' => 'nullable|integer|min:0|max:24',
        ]);

        $validated = array_merge(
            $validated,
            $this->calculateTeachingComparison(
                $validated['tanggal'],
                $validated['jam_masuk'] ?? null,
                $validated['jam_pulang'] ?? null,
                (int) ($validated['total_jam_ajar'] ?? $presence->total_jam_ajar ?? 0)
            )
        );

        $presence->update($validated);

        return back()->with('success', 'Data presensi berhasil diperbarui');
    }

    public function gate()
    {
        $masukToken = Str::random(32);
        $pulangToken = Str::random(32);

        Cache::put('presence_token_masuk', $masukToken, now()->addSeconds(35));
        Cache::put('presence_token_pulang', $pulangToken, now()->addSeconds(35));
        $timeWindow = $this->presenceTimeWindow();

        return Inertia::render('presence/gate-index', [
            'token' => ['value' => $masukToken], // default token (masuk)
            'masukToken' => ['value' => $masukToken],
            'pulangToken' => ['value' => $pulangToken],
            'type' => now()->setTimezone(config('app.timezone'))->hour < 12 ? 'masuk' : 'pulang',
            'timeStatus' => 'Sesi Absensi Aktif',
            'remainingSeconds' => 30, // Pastikan ini dikirim
            'timeWindow' => $timeWindow,
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

        $result = $this->markCurrentUserPresence(
            $token === $masukCached ? 'masuk' : 'pulang'
        );

        if (isset($result['redirect_to'])) {
            return redirect($result['redirect_to']);
        }

        if ($result['status'] === 'success') {
            return redirect()->route('presence.self.history')
                ->with('success', $result['message']);
        }

        return Inertia::render('presence/scan', [
            'status' => $result['status'],
            'message' => $result['message']
        ]);
    }

    public function markFacePresence(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:masuk,pulang'],
            'face_image' => ['nullable', 'string'],
        ]);

        if (!$validated['face_image']) {
            return back()->with('error', 'Foto wajah belum terbaca. Pastikan kamera aktif lalu coba lagi.');
        }

        $user = Auth::user();
        if (!$user->face_hash) {
            return back()->with('error', 'Daftarkan wajah terlebih dahulu sebelum absen dengan Face Recognition.');
        }

        $hash = $this->makeFaceHash($validated['face_image']);
        if (!$hash) {
            return back()->with('error', 'Foto wajah tidak bisa diproses. Pastikan wajah terlihat jelas.');
        }

        if ($this->faceDistance($user->face_hash, $hash) > 112) {
            return back()->with('error', 'Wajah tidak cocok dengan data yang terdaftar.');
        }

        $result = $this->markCurrentUserPresence($validated['type']);

        if (isset($result['redirect_to'])) {
            return redirect($result['redirect_to']);
        }

        if ($result['status'] === 'success') {
            return redirect()->route('presence.self.history')
                ->with('success', $result['message']);
        }

        return back()->with($result['status'] === 'success' ? 'success' : 'error', $result['message']);
    }

    public function registerFace(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'face_image' => ['required', 'string'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $hash = $this->makeFaceHash($validated['face_image']);

        if (!$hash) {
            return back()->with('error', 'Foto wajah tidak bisa diproses. Pastikan wajah terlihat jelas dan cahaya cukup.');
        }

        $user->update([
            'face_hash' => $hash,
            'face_registered_at' => now()->setTimezone(config('app.timezone')),
        ]);

        return back()->with('success', 'Wajah berhasil didaftarkan. Sekarang Face Recognition bisa digunakan untuk absen.');
    }

    public function teacherCheckout()
    {
        $user = Auth::user();

        if ($user->role !== 'guru') {
            return redirect()->route('presence.self')
                ->with('error', 'Formulir absen pulang guru hanya tersedia untuk role guru.');
        }

        $now = now()->setTimezone(config('app.timezone'));
        $presence = Attendance::firstOrCreate([
            'user_id' => $user->id,
            'tanggal' => $now->toDateString(),
        ]);

        if (!$presence->jam_masuk) {
            return redirect()->route('presence.self')
                ->with('error', 'Silakan absen masuk terlebih dahulu sebelum absen pulang.');
        }

        $preview = $this->calculateTeachingComparison(
            $presence->tanggal,
            $presence->jam_masuk,
            $presence->jam_pulang ?: $now->toTimeString(),
            (int) ($presence->total_jam_ajar ?? 0)
        );

        return Inertia::render('presence/employee/index', [
            'teacherCheckoutMode' => true,
            'todayPresence' => [
                'tanggal' => $presence->tanggal,
                'jam_masuk' => Carbon::parse($presence->jam_masuk)->format('H:i'),
                'jam_pulang' => $presence->jam_pulang ? Carbon::parse($presence->jam_pulang)->format('H:i') : $now->format('H:i'),
                'status' => $presence->status_disiplin,
                'total_jam_ajar' => $presence->total_jam_ajar,
                'jenis_ajar' => $presence->jenis_ajar === 'none' ? null : $presence->jenis_ajar,
                'durasi_hadir_menit' => $presence->durasi_hadir_menit ?? $preview['durasi_hadir_menit'],
                'selisih_jam_ajar_menit' => $presence->selisih_jam_ajar_menit ?? $preview['selisih_jam_ajar_menit'],
                'status_validasi_ajar' => $presence->status_validasi_ajar ?? $preview['status_validasi_ajar'],
            ],
            'user' => $this->formatSelfUser($user),
        ]);
    }

    public function storeTeacherCheckout(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user->role !== 'guru') {
            return redirect()->route('presence.self')
                ->with('error', 'Formulir absen pulang guru hanya tersedia untuk role guru.');
        }

        $validated = $request->validate([
            'total_jam_ajar' => ['required', 'integer', 'min:0', 'max:24'],
            'jenis_ajar' => ['required', 'in:teori,praktik'],
        ]);

        $now = now()->setTimezone(config('app.timezone'));
        $presence = Attendance::where('user_id', $user->id)
            ->whereDate('tanggal', $now->toDateString())
            ->first();

        if (!$presence || !$presence->jam_masuk) {
            return redirect()->route('presence.self')
                ->with('error', 'Silakan absen masuk terlebih dahulu sebelum mengisi absen pulang guru.');
        }

        $jamPulang = $presence->jam_pulang ?: $now->toTimeString();
        $comparison = $this->calculateTeachingComparison(
            $presence->tanggal,
            $presence->jam_masuk,
            $jamPulang,
            (int) $validated['total_jam_ajar']
        );

        $presence->update(array_merge($validated, [
            'jam_pulang' => $jamPulang,
            'status_disiplin' => $presence->status_disiplin ?: 'HADIR',
        ], $comparison));

        $message = $comparison['status_validasi_ajar'] === 'melebihi_durasi'
            ? 'Absen pulang tersimpan. Total jam ajar melebihi durasi hadir dan perlu dicek.'
            : 'Absen pulang guru berhasil disimpan dan sesuai dengan durasi hadir.';

        return redirect()->route('presence.self')->with('success', $message);
    }

    private function markCurrentUserPresence(string $type): array
    {
        $user = Auth::user();
        $now = now()->setTimezone(config('app.timezone'));

        $presence = Attendance::firstOrCreate([
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
            if ($user->role === 'guru') {
                if (!$presence->jam_masuk) {
                    return [
                        'status' => 'invalid',
                        'message' => 'Silakan absen masuk terlebih dahulu sebelum absen pulang.',
                    ];
                }

                return [
                    'status' => 'teacher_checkout',
                    'message' => 'Lengkapi formulir absen pulang guru.',
                    'redirect_to' => route('presence.teacher-checkout'),
                ];
            }

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

    private function calculateTeachingComparison(
        string $tanggal,
        ?string $jamMasuk,
        ?string $jamPulang,
        int $totalJamAjar
    ): array {
        if (!$jamMasuk || !$jamPulang) {
            return [
                'durasi_hadir_menit' => null,
                'selisih_jam_ajar_menit' => null,
                'status_validasi_ajar' => 'belum_lengkap',
            ];
        }

        $start = Carbon::parse($tanggal . ' ' . $jamMasuk);
        $end = Carbon::parse($tanggal . ' ' . $jamPulang);

        if ($end->lessThan($start)) {
            $end->addDay();
        }

        $durationMinutes = (int) $start->diffInMinutes($end);
        $teachingMinutes = $totalJamAjar * 60;
        $difference = $durationMinutes - $teachingMinutes;

        return [
            'durasi_hadir_menit' => $durationMinutes,
            'selisih_jam_ajar_menit' => $difference,
            'status_validasi_ajar' => $difference < 0 ? 'melebihi_durasi' : 'sesuai',
        ];
    }

    private function presenceTimeWindow(): array
    {
        return TimeSetting::current()->toTimeWindow();
    }

    private function formatTodayPresence(User $user): array
    {
        $today = now()->setTimezone(config('app.timezone'))->toDateString();
        $presence = Attendance::where('user_id', $user->id)
            ->whereDate('tanggal', $today)
            ->first();

        return [
            'tanggal' => $today,
            'jam_masuk' => $presence?->jam_masuk ? Carbon::parse($presence->jam_masuk)->format('H:i') : null,
            'jam_pulang' => $presence?->jam_pulang ? Carbon::parse($presence->jam_pulang)->format('H:i') : null,
            'status' => $presence?->status_disiplin,
            'total_jam_ajar' => $presence?->total_jam_ajar,
            'jenis_ajar' => $presence?->jenis_ajar,
            'durasi_hadir_menit' => $presence?->durasi_hadir_menit,
            'selisih_jam_ajar_menit' => $presence?->selisih_jam_ajar_menit,
            'status_validasi_ajar' => $presence?->status_validasi_ajar,
        ];
    }

    private function formatSelfUser(User $user): array
    {
        return [
            'name' => $user->name,
            'role' => $user->role,
            'face_registered' => (bool) $user->face_hash,
            'face_registered_at' => $user->face_registered_at?->format('d F Y H:i'),
        ];
    }

    private function makeFaceHash(string $faceImage): ?string
    {
        if (!preg_match('/^data:image\/(?:jpeg|jpg|png|webp);base64,/', $faceImage)) {
            return null;
        }

        $raw = base64_decode(substr($faceImage, strpos($faceImage, ',') + 1), true);
        if (!$raw) {
            return null;
        }

        $image = @imagecreatefromstring($raw);
        if (!$image) {
            return null;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        if ($width < 120 || $height < 120) {
            imagedestroy($image);
            return null;
        }

        $side = (int) floor(min($width, $height) * 0.72);
        $srcX = (int) floor(($width - $side) / 2);
        $srcY = (int) floor(($height - $side) / 2);
        $sample = imagecreatetruecolor(16, 16);
        imagecopyresampled($sample, $image, 0, 0, $srcX, $srcY, 16, 16, $side, $side);

        $grays = [];
        for ($y = 0; $y < 16; $y++) {
            for ($x = 0; $x < 16; $x++) {
                $rgb = imagecolorat($sample, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;
                $grays[] = (int) round(($r * 0.299) + ($g * 0.587) + ($b * 0.114));
            }
        }

        imagedestroy($sample);
        imagedestroy($image);

        if ((max($grays) - min($grays)) < 18) {
            return null;
        }

        $average = array_sum($grays) / count($grays);

        return collect($grays)
            ->map(fn(int $gray) => $gray >= $average ? '1' : '0')
            ->implode('');
    }

    private function faceDistance(string $registeredHash, string $currentHash): int
    {
        $length = min(strlen($registeredHash), strlen($currentHash));
        $distance = abs(strlen($registeredHash) - strlen($currentHash));

        for ($i = 0; $i < $length; $i++) {
            if ($registeredHash[$i] !== $currentHash[$i]) {
                $distance++;
            }
        }

        return $distance;
    }

    private function formatSelfPresenceRecord(Attendance $presence): array
    {
        return [
            'id' => $presence->id,
            'tanggal' => Carbon::parse($presence->tanggal)->translatedFormat('d F Y'),
            'tanggal_raw' => $presence->tanggal,
            'jam_masuk' => $presence->jam_masuk ? Carbon::parse($presence->jam_masuk)->format('H:i') : null,
            'jam_pulang' => $presence->jam_pulang ? Carbon::parse($presence->jam_pulang)->format('H:i') : null,
            'status' => $presence->status_disiplin ?? 'BELUM LENGKAP',
            'total_jam_ajar' => $presence->total_jam_ajar,
            'jenis_ajar' => $presence->jenis_ajar,
            'durasi_hadir_menit' => $presence->durasi_hadir_menit,
            'selisih_jam_ajar_menit' => $presence->selisih_jam_ajar_menit,
            'status_validasi_ajar' => $presence->status_validasi_ajar,
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

        $history = Attendance::where('user_id', $userId)
            ->where('tanggal', 'like', $month . '%')
            ->orderBy('tanggal', 'asc')
            ->get();

        return response()->json($history->map(function ($item) {
            return [
                'date' => Carbon::parse($item->tanggal)->translatedFormat('d F Y'),
                'masuk_time' => $item->jam_masuk ? substr($item->jam_masuk, 0, 5) : '--:--',
                'pulang_time' => $item->jam_pulang ? substr($item->jam_pulang, 0, 5) : '--:--',
                'status' => $item->status_disiplin ?? 'HADIR',
            ];
        }));
    }
}

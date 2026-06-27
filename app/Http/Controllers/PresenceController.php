<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\LocationSetting;
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
                'jam_teori' => $item->jam_teori,
                'jam_praktik' => $item->jam_praktik,
                'jam_normatif_teori' => $item->jam_normatif_teori,
                'jam_produktif_teori' => $item->jam_produktif_teori,
                'jam_produktif_praktik' => $item->jam_produktif_praktik,
                'jam_eskul' => $item->jam_eskul,
                'ada_piket' => (bool) $item->ada_piket,
                'durasi_hadir_menit' => $item->durasi_hadir_menit,
                'selisih_jam_ajar_menit' => $item->selisih_jam_ajar_menit,
                'status_validasi_ajar' => $item->status_validasi_ajar,
            ];
        });

        $timeWindow = $this->presenceTimeWindow();

        $statusCounts = $presences
            ->map(fn($presence) => strtolower((string) ($presence['status'] ?? '')))
            ->countBy();

        $stats = [
            'total_attendance' => $presences->count(),
            'total_present' => (int) ($statusCounts->get('hadir') ?? 0),
            'total_late' => (int) ($statusCounts->get('terlambat') ?? 0),
            'total_alpha' => (int) ($statusCounts->get('alpha') ?? 0),
            'total_izin' => (int) ($statusCounts->get('izin') ?? 0),
            'total_sakit' => (int) ($statusCounts->get('sakit') ?? 0),
        ];

        $users = User::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('presence/index', [
            'presences' => $presences,
            'stats' => $stats,
            'users' => $users,
            'timeWindow' => $timeWindow,
            'locationSetting' => LocationSetting::current()->toArraySetting(),
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
                'jam_teori' => $presence?->jam_teori,
                'jam_praktik' => $presence?->jam_praktik,
                'jam_normatif_teori' => $presence?->jam_normatif_teori,
                'jam_produktif_teori' => $presence?->jam_produktif_teori,
                'jam_produktif_praktik' => $presence?->jam_produktif_praktik,
                'jam_eskul' => $presence?->jam_eskul,
                'ada_piket' => (bool) ($presence?->ada_piket ?? false),
                'durasi_hadir_menit' => $presence?->durasi_hadir_menit,
                'selisih_jam_ajar_menit' => $presence?->selisih_jam_ajar_menit,
                'status_validasi_ajar' => $presence?->status_validasi_ajar,
            ],
            'user' => $this->formatSelfUser($user),
            'locationSetting' => LocationSetting::current()->toArraySetting(),
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
            'locationSetting' => LocationSetting::current()->toArraySetting(),
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
            'jam_normatif_teori' => 'nullable|numeric|min:0|max:24',
            'jam_produktif_teori' => 'nullable|numeric|min:0|max:24',
            'jam_produktif_praktik' => 'nullable|numeric|min:0|max:24',
            'jam_eskul' => 'nullable|numeric|min:0|max:24',
        ]);

        $validated = array_merge($validated, $this->resolveTeachingHours($validated));

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
            'jam_normatif_teori' => 'nullable|numeric|min:0|max:24',
            'jam_produktif_teori' => 'nullable|numeric|min:0|max:24',
            'jam_produktif_praktik' => 'nullable|numeric|min:0|max:24',
            'jam_eskul' => 'nullable|numeric|min:0|max:24',
        ]);

        $validated = array_merge($validated, $this->resolveTeachingHours(array_merge([
            'jam_teori' => $presence->jam_teori,
            'jam_praktik' => $presence->jam_praktik,
            'jam_normatif_teori' => $presence->jam_normatif_teori,
            'jam_produktif_teori' => $presence->jam_produktif_teori,
            'jam_produktif_praktik' => $presence->jam_produktif_praktik,
            'jam_eskul' => $presence->jam_eskul,
            'total_jam_ajar' => $presence->total_jam_ajar,
        ], $validated)));

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

    public function markPresence(Request $request, ?string $token = null)
    {
        $token = $token ?: $request->input('token');

        if (!$token) {
            return Inertia::render('presence/scan', [
                'status' => 'invalid',
                'message' => 'Token QR tidak ditemukan.'
            ]);
        }

        // 1. Validasi Token QR untuk tipe masuk/pulang
        $masukCached = Cache::get('presence_token_masuk');
        $pulangCached = Cache::get('presence_token_pulang');

        if ($masukCached !== $token && $pulangCached !== $token) {
            return Inertia::render('presence/scan', [
                'status' => 'expired',
                'message' => 'QR Code sudah tidak berlaku, silakan scan ulang.'
            ]);
        }

        $result = $this->markUserPresence(
            Auth::user(),
            $token === $masukCached ? 'masuk' : 'pulang',
            $request,
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
        return back()->with(
            'error',
            'Absensi wajah hanya dapat dilakukan melalui halaman admin presensi (Face Gate). Daftar wajah tetap bisa dilakukan di menu Absensi Saya.'
        );
    }

    public function markAdminFacePresence(Request $request): RedirectResponse
    {
        /** @var User $admin */
        $admin = Auth::user();

        if (! in_array($admin->role, ['admin', 'superadmin'], true)) {
            abort(403, 'Hanya admin yang dapat melakukan absensi wajah.');
        }

        $locationSetting = LocationSetting::current();
        $locationRules = $locationSetting->enabled ? ['required'] : ['nullable'];

        $validated = $request->validate([
            'type' => ['required', 'in:masuk,pulang'],
            'face_embedding' => ['required', 'array', 'size:128'],
            'latitude' => [...$locationRules, 'numeric', 'between:-90,90'],
            'longitude' => [...$locationRules, 'numeric', 'between:-180,180'],
        ]);

        $matchedUser = $this->findUserByFaceEmbedding($validated['face_embedding']);

        if (! $matchedUser) {
            return back()->with('error', 'Wajah tidak dikenali. Pastikan wajah sudah terdaftar di akun masing-masing.');
        }

        $result = $this->markUserPresence($matchedUser, $validated['type'], $request);

        if (isset($result['redirect_to'])) {
            return redirect($result['redirect_to'])
                ->with('success', "Wajah terverifikasi: {$matchedUser->name}. Silakan lengkapi formulir absen pulang guru.");
        }

        if ($result['status'] === 'success') {
            return back()->with(
                'success',
                "Absen berhasil untuk {$matchedUser->name}. {$result['message']}"
            );
        }

        return back()->with(
            $result['status'] === 'info' ? 'success' : 'error',
            "{$matchedUser->name}: {$result['message']}"
        );
    }

    public function registerFace(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'face_embedding' => ['required', 'array', 'size:128'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        $duplicateUser = $this->findUserByFaceEmbedding($validated['face_embedding'], $user->id);

        if ($duplicateUser) {
            return redirect()->back()->with(
                'error',
                'Maaf, wajah ini sudah didaftarkan pada akun lain. Gunakan wajah sesuai pemilik akun masing-masing.'
            );
        }

        $user->update([
            'face_hash' => $validated['face_embedding'],
            'face_registered_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Data biometrik wajah berhasil diperbarui.');
    }

    public function teacherCheckout(Request $request)
    {
        $authUser = Auth::user();
        $user = $this->resolveTeacherCheckoutUser($request, $authUser);

        if ($user->role !== 'guru') {
            return redirect()->route($this->teacherCheckoutReturnRoute($authUser))
                ->with('error', 'Formulir absen pulang guru hanya tersedia untuk role guru.');
        }

        $now = now()->setTimezone(config('app.timezone'));
        $presence = Attendance::firstOrCreate([
            'user_id' => $user->id,
            'tanggal' => $now->toDateString(),
        ]);

        if (!$presence->jam_masuk) {
            return redirect()->route($this->teacherCheckoutReturnRoute($authUser))
                ->with('error', 'Silakan absen masuk terlebih dahulu sebelum absen pulang.');
        }

        $preview = $this->calculateTeachingComparison(
            $presence->tanggal,
            $presence->jam_masuk,
            $presence->jam_pulang ?: $now->toTimeString(),
            (float) ($presence->total_jam_ajar ?? 0)
        );

        $isAdminFlow = in_array($authUser->role, ['admin', 'superadmin'], true)
            && $authUser->id !== $user->id;

        return Inertia::render('presence/employee/index', [
            'teacherCheckoutMode' => true,
            'teacherCheckoutUserId' => $user->id,
            'teacherCheckoutReturnTo' => $isAdminFlow ? route('presence.index') : route('presence.self'),
            'todayPresence' => [
                'tanggal' => $presence->tanggal,
                'jam_masuk' => Carbon::parse($presence->jam_masuk)->format('H:i'),
                'jam_pulang' => $presence->jam_pulang ? Carbon::parse($presence->jam_pulang)->format('H:i') : $now->format('H:i'),
                'status' => $presence->status_disiplin,
                'total_jam_ajar' => $presence->total_jam_ajar,
                'jenis_ajar' => $presence->jenis_ajar === 'none' ? null : $presence->jenis_ajar,
                'jam_teori' => $presence->jam_teori,
                'jam_praktik' => $presence->jam_praktik,
                'jam_normatif_teori' => $presence->jam_normatif_teori,
                'jam_produktif_teori' => $presence->jam_produktif_teori,
                'jam_produktif_praktik' => $presence->jam_produktif_praktik,
                'jam_eskul' => $presence->jam_eskul,
                'ada_piket' => (bool) $presence->ada_piket,
                'durasi_hadir_menit' => $presence->durasi_hadir_menit ?? $preview['durasi_hadir_menit'],
                'selisih_jam_ajar_menit' => $presence->selisih_jam_ajar_menit ?? $preview['selisih_jam_ajar_menit'],
                'status_validasi_ajar' => $presence->status_validasi_ajar ?? $preview['status_validasi_ajar'],
            ],
            'user' => $this->formatSelfUser($user),
            'locationSetting' => LocationSetting::current()->toArraySetting(),
        ]);
    }

    public function storeTeacherCheckout(Request $request): RedirectResponse
    {
        $authUser = Auth::user();
        $user = $this->resolveTeacherCheckoutUser($request, $authUser);

        if ($user->role !== 'guru') {
            return redirect()->route($this->teacherCheckoutReturnRoute($authUser))
                ->with('error', 'Formulir absen pulang guru hanya tersedia untuk role guru.');
        }

        $validated = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'jam_normatif_teori' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'jam_produktif_teori' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'jam_produktif_praktik' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'jam_eskul' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'jam_teori' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'jam_praktik' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'ada_piket' => ['nullable', 'boolean'],
        ]);

        $teachingData = $this->resolveTeachingHours($validated);

        if ($teachingData['total_jam_ajar'] <= 0) {
            return redirect()->route('presence.teacher-checkout', ['user_id' => $user->id])
                ->withErrors([
                    'jam_normatif_teori' => 'Isi minimal satu jam mengajar.',
                ])
                ->withInput();
        }

        $totalJamAjarDecimal = (float) ($teachingData['jam_teori'] ?? 0)
            + (float) ($teachingData['jam_praktik'] ?? 0)
            + (float) ($teachingData['jam_eskul'] ?? 0);

        if ($totalJamAjarDecimal > 24) {
            return redirect()->route('presence.teacher-checkout', ['user_id' => $user->id])
                ->withErrors([
                    'jam_normatif_teori' => 'Total jam mengajar tidak boleh lebih dari 24 jam.',
                ])
                ->withInput();
        }

        $now = now()->setTimezone(config('app.timezone'));
        $presence = Attendance::where('user_id', $user->id)
            ->whereDate('tanggal', $now->toDateString())
            ->first();

        if (!$presence || !$presence->jam_masuk) {
            return redirect()->route($this->teacherCheckoutReturnRoute($authUser))
                ->with('error', 'Silakan absen masuk terlebih dahulu sebelum mengisi absen pulang guru.');
        }

        $jamPulang = $presence->jam_pulang ?: $now->toTimeString();
        $comparison = $this->calculateTeachingComparison(
            $presence->tanggal,
            $presence->jam_masuk,
            $jamPulang,
            $teachingData['total_jam_ajar']
        );

        $presence->update(array_merge($teachingData, [
            'jam_pulang' => $jamPulang,
            'ada_piket' => (bool) ($validated['ada_piket'] ?? false),
            'status_disiplin' => $presence->status_disiplin ?: 'HADIR',
        ], $comparison));

        $message = $comparison['status_validasi_ajar'] === 'melebihi_durasi'
            ? "Absen pulang {$user->name} tersimpan. Total jam ajar melebihi durasi hadir dan perlu dicek."
            : "Absen pulang guru {$user->name} berhasil disimpan dan sesuai dengan durasi hadir.";

        return redirect()->route($this->teacherCheckoutReturnRoute($authUser))
            ->with('success', $message);
    }

    private function markCurrentUserPresence(string $type, Request $request): array
    {
        return $this->markUserPresence(Auth::user(), $type, $request);
    }

    private function markUserPresence(User $user, string $type, Request $request): array
    {
        $locationError = $this->validatePresenceLocation($request);

        if ($locationError) {
            return $locationError;
        }

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
                'message' => 'Sudah melakukan absen masuk.',
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
                    'redirect_to' => route('presence.teacher-checkout', ['user_id' => $user->id]),
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
            'message' => 'Sudah melakukan absen pulang.',
        ];
    }

    private function resolveTeacherCheckoutUser(Request $request, User $authUser): User
    {
        $targetUserId = $request->input('user_id');

        if ($targetUserId && in_array($authUser->role, ['admin', 'superadmin'], true)) {
            return User::findOrFail((int) $targetUserId);
        }

        if ($targetUserId && (int) $targetUserId !== $authUser->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengisi absen guru ini.');
        }

        return $authUser;
    }

    private function teacherCheckoutReturnRoute(User $authUser): string
    {
        return in_array($authUser->role, ['admin', 'superadmin'], true)
            ? 'presence.index'
            : 'presence.self';
    }

    private function findUserByFaceEmbedding(array $embedding, ?int $exceptUserId = null): ?User
    {
        $bestUser = null;
        $bestDistance = PHP_FLOAT_MAX;

        $query = User::whereNotNull('face_hash');

        if ($exceptUserId) {
            $query->where('id', '!=', $exceptUserId);
        }

        foreach ($query->get() as $user) {
            $registeredDescriptor = is_array($user->face_hash)
                ? $user->face_hash
                : json_decode($user->face_hash, true);

            if (! is_array($registeredDescriptor)) {
                continue;
            }

            $distance = $this->calculateEuclideanDistance($registeredDescriptor, $embedding);

            if ($distance < $bestDistance) {
                $bestDistance = $distance;
                $bestUser = $user;
            }
        }

        if ($bestUser && $bestDistance <= 0.5) {
            return $bestUser;
        }

        return null;
    }

    private function calculateTeachingComparison(
        string $tanggal,
        ?string $jamMasuk,
        ?string $jamPulang,
        float $totalJamAjar
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
        $teachingMinutes = (int) round($totalJamAjar * 60);
        $difference = $durationMinutes - $teachingMinutes;

        return [
            'durasi_hadir_menit' => $durationMinutes,
            'selisih_jam_ajar_menit' => $difference,
            'status_validasi_ajar' => $difference < 0 ? 'melebihi_durasi' : 'sesuai',
        ];
    }

    private function resolveTeachingHours(array $input): array
    {
        $jamNormatifTeori = (float) ($input['jam_normatif_teori'] ?? 0);
        $jamProduktifTeori = (float) ($input['jam_produktif_teori'] ?? 0);
        $jamProduktifPraktik = (float) ($input['jam_produktif_praktik'] ?? 0);
        $jamEskul = (float) ($input['jam_eskul'] ?? 0);

        if (
            $jamNormatifTeori <= 0
            && $jamProduktifTeori <= 0
            && $jamProduktifPraktik <= 0
            && $jamEskul <= 0
        ) {
            $legacyJamTeori = (float) ($input['jam_teori'] ?? 0);
            $legacyJamPraktik = (float) ($input['jam_praktik'] ?? 0);
            $legacyTotal = (float) ($input['total_jam_ajar'] ?? 0);
            $legacyJenisAjar = $input['jenis_ajar'] ?? 'teori';

            if ($legacyJamTeori > 0 || $legacyJamPraktik > 0) {
                $jamNormatifTeori = $legacyJamTeori;
                $jamProduktifPraktik = $legacyJamPraktik;
            } elseif ($legacyJenisAjar === 'praktik') {
                $jamProduktifPraktik = $legacyTotal;
            } else {
                $jamNormatifTeori = $legacyTotal;
            }
        }

        $jamTeori = $jamNormatifTeori + $jamProduktifTeori;
        $jamPraktik = $jamProduktifPraktik;
        $totalJamAjar = $jamTeori + $jamPraktik + $jamEskul;

        if ($jamTeori > 0 && $jamPraktik > 0) {
            $jenisAjar = 'teori_praktik';
        } elseif ($jamTeori > 0) {
            $jenisAjar = 'teori';
        } elseif ($jamPraktik > 0) {
            $jenisAjar = 'praktik';
        } else {
            $jenisAjar = 'none';
        }

        return [
            'jam_teori' => $jamTeori > 0 ? $jamTeori : null,
            'jam_praktik' => $jamPraktik > 0 ? $jamPraktik : null,
            'jam_normatif_teori' => $jamNormatifTeori > 0 ? $jamNormatifTeori : null,
            'jam_produktif_teori' => $jamProduktifTeori > 0 ? $jamProduktifTeori : null,
            'jam_produktif_praktik' => $jamProduktifPraktik > 0 ? $jamProduktifPraktik : null,
            'jam_eskul' => $jamEskul > 0 ? $jamEskul : null,
            'total_jam_ajar' => (int) round($totalJamAjar),
            'jenis_ajar' => $jenisAjar,
        ];
    }

    private function presenceTimeWindow(): array
    {
        return TimeSetting::current()->toTimeWindow();
    }

    private function validatePresenceLocation(Request $request): ?array
    {
        $setting = LocationSetting::current();

        if (!$setting->enabled) {
            return null;
        }

        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');

        if ($latitude === null || $longitude === null) {
            return [
                'status' => 'invalid',
                'message' => 'Aktifkan izin lokasi terlebih dahulu sebelum melakukan absensi.',
            ];
        }

        if (
            !is_numeric($latitude) ||
            !is_numeric($longitude) ||
            (float) $latitude < -90 ||
            (float) $latitude > 90 ||
            (float) $longitude < -180 ||
            (float) $longitude > 180
        ) {
            return [
                'status' => 'invalid',
                'message' => 'Lokasi perangkat tidak valid. Silakan aktifkan ulang lokasi.',
            ];
        }

        if (!$setting->isConfigured()) {
            return [
                'status' => 'invalid',
                'message' => 'Lokasi absen belum diatur oleh admin.',
            ];
        }

        $distance = $this->calculateDistanceMeters(
            (float) $latitude,
            (float) $longitude,
            (float) $setting->latitude,
            (float) $setting->longitude,
        );

        if ($distance > $setting->radius_meters) {
            return [
                'status' => 'invalid',
                'message' => 'Maaf saat ini anda tidak di radius absen...',
            ];
        }

        return null;
    }

    private function calculateDistanceMeters(
        float $fromLatitude,
        float $fromLongitude,
        float $toLatitude,
        float $toLongitude,
    ): float {
        $earthRadiusMeters = 6371000;
        $latFrom = deg2rad($fromLatitude);
        $latTo = deg2rad($toLatitude);
        $latDelta = deg2rad($toLatitude - $fromLatitude);
        $lonDelta = deg2rad($toLongitude - $fromLongitude);

        $a = sin($latDelta / 2) ** 2
            + cos($latFrom) * cos($latTo) * sin($lonDelta / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadiusMeters * $c;
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
            'jam_teori' => $presence?->jam_teori,
            'jam_praktik' => $presence?->jam_praktik,
            'jam_normatif_teori' => $presence?->jam_normatif_teori,
            'jam_produktif_teori' => $presence?->jam_produktif_teori,
            'jam_produktif_praktik' => $presence?->jam_produktif_praktik,
            'jam_eskul' => $presence?->jam_eskul,
            'ada_piket' => (bool) ($presence?->ada_piket ?? false),
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
            'sub_role' => $user->guru?->sub_role ?? $user->pegawai?->sub_role ?? null,
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
            'jam_teori' => $presence->jam_teori,
            'jam_praktik' => $presence->jam_praktik,
            'jam_normatif_teori' => $presence->jam_normatif_teori,
            'jam_produktif_teori' => $presence->jam_produktif_teori,
            'jam_produktif_praktik' => $presence->jam_produktif_praktik,
            'jam_eskul' => $presence->jam_eskul,
            'ada_piket' => (bool) $presence->ada_piket,
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

    private function calculateEuclideanDistance(array $a, array $b): float
    {
        // Pastikan kedua array memiliki panjang yang sama
        if (count($a) !== count($b)) {
            return 1.0; // Anggap sangat jauh/berbeda jika ukuran array tidak cocok
        }

        $sum = 0.0;
        foreach ($a as $i => $val) {
            $sum += pow($val - $b[$i], 2);
        }

        return sqrt($sum);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\TimeSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TimeSettingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'masuk_start' => ['required', 'date_format:H:i'],
            'masuk_end' => ['required', 'date_format:H:i', 'after:masuk_start'],
            'pulang_start' => ['required', 'date_format:H:i'],
            'pulang_end' => ['required', 'date_format:H:i', 'after:pulang_start'],
        ], [
            'masuk_end.after' => 'Batas masuk harus setelah waktu mulai masuk.',
            'pulang_end.after' => 'Selesai pulang harus setelah waktu mulai pulang.',
        ]);

        TimeSetting::current()->update($validated);

        return back()->with('success', 'Pengaturan waktu presensi berhasil diperbarui.');
    }
}

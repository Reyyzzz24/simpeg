<?php

namespace App\Http\Controllers;

use App\Models\LocationSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocationSettingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'latitude' => ['nullable', 'required_if:enabled,true', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'required_if:enabled,true', 'numeric', 'between:-180,180'],
            'radius_meters' => ['required', 'integer', 'min:1', 'max:10000'],
        ], [
            'latitude.required_if' => 'Latitude lokasi absen wajib diisi saat validasi lokasi aktif.',
            'longitude.required_if' => 'Longitude lokasi absen wajib diisi saat validasi lokasi aktif.',
            'radius_meters.required' => 'Radius lokasi absen wajib diisi.',
        ]);

        LocationSetting::current()->update($validated);

        return back()->with('success', 'Pengaturan lokasi presensi berhasil diperbarui.');
    }
}

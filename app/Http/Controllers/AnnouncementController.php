<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        return Inertia::render('announcement/index', [
            'announcements' => Announcement::query()
                ->latest('published_at')
                ->latest()
                ->get()
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'category' => $announcement->category,
                    'published_at' => $announcement->published_at?->format('Y-m-d'),
                    'is_active' => $announcement->is_active,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        Announcement::create($this->validateData($request));

        return back()->with('success', 'Pengumuman berhasil ditambahkan');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $announcement->update($this->validateData($request));

        return back()->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return back()->with('success', 'Pengumuman berhasil dihapus');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:5000'],
            'category' => ['required', 'string', 'max:100'],
            'published_at' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}

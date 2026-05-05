import { usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, FileText, Settings, HelpCircle } from 'lucide-react';

export function useCurrentPageIcon() {
    const { url } = usePage();

    // Logika untuk menentukan ikon berdasarkan URL saat ini
    if (url.startsWith('/dashboard')) return LayoutDashboard;
    if (url.startsWith('/pegawai')) return Users;
    if (url.startsWith('/laporan')) return FileText;
    if (url.startsWith('/settings')) return Settings;

    return HelpCircle; // Ikon default
}
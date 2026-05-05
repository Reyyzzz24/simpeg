export type PresenceType = 'masuk' | 'pulang';

export type TodayPresence = {
    tanggal: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status: string | null;
    total_jam_ajar: number | null;
    jenis_ajar: string | null;
    durasi_hadir_menit: number | null;
    selisih_jam_ajar_menit: number | null;
    status_validasi_ajar: string | null;
};

export type SelfPresence = {
    id: number;
    tanggal: string;
    tanggal_raw: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status: string | null;
    total_jam_ajar: number | null;
    jenis_ajar: string | null;
    durasi_hadir_menit: number | null;
    selisih_jam_ajar_menit: number | null;
    status_validasi_ajar: string | null;
};

export type SelfPresenceUser = {
    name: string;
    role: string;
    face_registered: boolean;
    face_registered_at: string | null;
};

export const formatMinutes = (value: number | null) => {
    if (value === null) {
        return '-';
    }

    const absValue = Math.abs(value);
    const hours = Math.floor(absValue / 60);
    const minutes = absValue % 60;
    const prefix = value < 0 ? '-' : '';

    return `${prefix}${hours}j ${minutes}m`;
};

export type PresenceType = 'masuk' | 'pulang';

export type TodayPresence = {
    tanggal: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status: string | null;
    total_jam_ajar: number | null;
    jenis_ajar: string | null;
    jam_teori: number | null;
    jam_praktik: number | null;
    ada_piket: boolean;
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
    jam_teori: number | null;
    jam_praktik: number | null;
    ada_piket: boolean;
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

export const formatTeachingHours = (presence: {
    jam_teori?: number | null;
    jam_praktik?: number | null;
    total_jam_ajar?: number | null;
    jenis_ajar?: string | null;
}) => {
    const teori = Number(presence.jam_teori ?? 0);
    const praktik = Number(presence.jam_praktik ?? 0);

    if (teori > 0 || praktik > 0) {
        const parts: string[] = [];

        if (teori > 0) {
            parts.push(`Teori ${teori}j`);
        }

        if (praktik > 0) {
            parts.push(`Praktik ${praktik}j`);
        }

        const total = teori + praktik;

        return `${parts.join(' + ')} (${total}j total)`;
    }

    if (
        presence.total_jam_ajar &&
        presence.jenis_ajar &&
        presence.jenis_ajar !== 'none'
    ) {
        const label = presence.jenis_ajar.replace('_', ' & ');

        return `${presence.total_jam_ajar} jam ${label}`;
    }

    return '-';
};

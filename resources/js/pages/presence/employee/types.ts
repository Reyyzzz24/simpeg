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
    jam_normatif_teori: number | null;
    jam_produktif_teori: number | null;
    jam_produktif_praktik: number | null;
    jam_eskul: number | null;
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
    jam_normatif_teori: number | null;
    jam_produktif_teori: number | null;
    jam_produktif_praktik: number | null;
    jam_eskul: number | null;
    ada_piket: boolean;
    durasi_hadir_menit: number | null;
    selisih_jam_ajar_menit: number | null;
    status_validasi_ajar: string | null;
};

export type SelfPresenceUser = {
    name: string;
    role: string;
    sub_role?: string | null;
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
    jam_normatif_teori?: number | null;
    jam_produktif_teori?: number | null;
    jam_produktif_praktik?: number | null;
    jam_eskul?: number | null;
    total_jam_ajar?: number | null;
    jenis_ajar?: string | null;
}) => {
    const normatifTeori = Number(presence.jam_normatif_teori ?? 0);
    const produktifTeori = Number(presence.jam_produktif_teori ?? 0);
    const produktifPraktik = Number(presence.jam_produktif_praktik ?? 0);
    const eskul = Number(presence.jam_eskul ?? 0);
    const teori = Number(presence.jam_teori ?? 0);
    const praktik = Number(presence.jam_praktik ?? 0);

    if (
        normatifTeori > 0 ||
        produktifTeori > 0 ||
        produktifPraktik > 0 ||
        eskul > 0
    ) {
        const parts: string[] = [];

        if (normatifTeori > 0) {
            parts.push(`Normatif teori ${normatifTeori}j`);
        }

        if (produktifTeori > 0) {
            parts.push(`Produktif teori ${produktifTeori}j`);
        }

        if (produktifPraktik > 0) {
            parts.push(`Produktif praktik ${produktifPraktik}j`);
        }

        if (eskul > 0) {
            parts.push(`Eskul ${eskul}j`);
        }

        const total = normatifTeori + produktifTeori + produktifPraktik + eskul;

        return `${parts.join(' + ')} (${total}j total)`;
    }

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

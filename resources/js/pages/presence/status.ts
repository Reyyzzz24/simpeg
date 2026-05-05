// resources/js/pages/presence/status.ts

export interface PresenceConfig {
    masuk_end: string;   // Batas akhir jam masuk (08:00)
    pulang_start: string; // Batas awal jam pulang (16:00)
}

export const getEmployeeStatus = (masuk: string | null, pulang: string | null, config: PresenceConfig) => {
    if (!masuk) return { label: 'Tanpa Keterangan', color: 'text-red-500' };

    const parseTime = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const jamMasuk = parseTime(masuk);
    const batasMasuk = parseTime(config.masuk_end);
    
    if (jamMasuk > batasMasuk) {
        return { label: 'Terlambat', color: 'text-orange-500' };
    }

    if (pulang) {
        const jamPulang = parseTime(pulang);
        const batasPulang = parseTime(config.pulang_start);
        if (jamPulang < batasPulang) return { label: 'Pulang Awal', color: 'text-yellow-600' };
        return { label: 'Hadir Tepat Waktu', color: 'text-green-600' };
    }

    return { label: 'Sudah Absen Masuk', color: 'text-blue-500' };
};

export function getPresenceDisplayStatus(record: any, config: PresenceConfig) {
    return getEmployeeStatus(record?.masuk_time ?? null, record?.pulang_time ?? null, config);
}
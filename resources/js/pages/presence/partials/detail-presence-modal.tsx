import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
};

export default function DetailPresenceModal({
    isOpen,
    onClose,
    record,
}: Props) {
    if (!record) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="bg-[#f8fafc] p-6 sm:max-w-md">
                {' '}
                {/* Warna background dasar yang bersih */}
                <DialogHeader>
                    <DialogTitle className="text-[#1e293b]">
                        Detail Presensi
                    </DialogTitle>
                    <DialogDescription>Informasi presensi</DialogDescription>
                </DialogHeader>
                {/* Profil Section */}
                <div className="flex items-center gap-4 py-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e2e8f0] text-lg font-bold text-[#64748b]">
                        {record.employee?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg leading-none font-bold text-[#1e293b]">
                            {record.employee?.name ?? 'student'}
                        </h3>
                        <div className="inline-block rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-[11px] font-medium text-[#64748b] shadow-sm">
                            {record.employee?.class ?? 'N/A'}
                        </div>
                    </div>
                </div>
                {/* Info Card Section - Menggunakan Putih Solid agar bersih */}
                <div className="mt-4 space-y-6 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Status
                            </p>
                            <div className="flex">
                                {/* Warna orange yang lebih segar sesuai gambar */}
                                <span className="rounded border border-[#ffedd5] bg-[#fff7ed] px-2 py-0.5 text-xs font-bold text-[#ea580c]">
                                    {record.status ?? 'Sudah Masuk'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Tanggal
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.tanggal ?? 'Sabtu, 2 Mei 2026'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Masuk
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.masuk_time ?? '07.00'}{' '}
                                <span className="text-xs font-normal text-[#94a3b8]">
                                    (manual)
                                </span>
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Pulang
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.pulang_time ?? '-'}{' '}
                                <span className="text-xs font-normal text-[#94a3b8]">
                                    (-)
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Jam Ajar
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.jam_teori || record.jam_praktik ? (
                                    <>
                                        {record.jam_teori
                                            ? `Teori ${record.jam_teori}j`
                                            : null}
                                        {record.jam_teori && record.jam_praktik
                                            ? ' + '
                                            : null}
                                        {record.jam_praktik
                                            ? `Praktik ${record.jam_praktik}j`
                                            : null}
                                        {record.total_jam_ajar
                                            ? ` (${record.total_jam_ajar}j total)`
                                            : null}
                                    </>
                                ) : record.total_jam_ajar ? (
                                    `${record.total_jam_ajar} jam${
                                        record.jenis_ajar &&
                                        record.jenis_ajar !== 'none'
                                            ? ` (${record.jenis_ajar.replace('_', ' & ')})`
                                            : ''
                                    }`
                                ) : (
                                    '-'
                                )}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Piket
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.ada_piket ? 'Ya' : 'Tidak'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Validasi
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.status_validasi_ajar ?? '-'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
                                Selisih Durasi
                            </p>
                            <p className="text-sm font-bold text-[#334155]">
                                {typeof record.selisih_jam_ajar_menit ===
                                'number'
                                    ? `${Math.trunc(record.selisih_jam_ajar_menit / 60)} jam ${Math.abs(record.selisih_jam_ajar_menit % 60)} menit`
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose}>Tutup</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

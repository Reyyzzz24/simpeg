import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
};

export default function DetailPresenceModal({ isOpen, onClose, record }: Props) {
    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md bg-[#f8fafc] p-6"> {/* Warna background dasar yang bersih */}
                <DialogHeader>
                    <DialogTitle className="text-[#1e293b]">Detail Presensi</DialogTitle>
                    <DialogDescription>Informasi presensi</DialogDescription>
                </DialogHeader>

                {/* Profil Section */}
                <div className="flex items-center gap-4 py-2">
                    <div className="w-14 h-14 rounded-full bg-[#e2e8f0] flex items-center justify-center text-lg font-bold text-[#64748b]">
                        {record.employee?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-[#1e293b] text-lg leading-none">
                            {record.employee?.name ?? 'student'}
                        </h3>
                        <div className="inline-block px-3 py-1 rounded-full bg-white border border-[#e2e8f0] text-[11px] font-medium text-[#64748b] shadow-sm">
                            {record.employee?.class ?? 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Info Card Section - Menggunakan Putih Solid agar bersih */}
                <div className="mt-4 p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Status</p>
                            <div className="flex">
                                {/* Warna orange yang lebih segar sesuai gambar */}
                                <span className="px-2 py-0.5 bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5] rounded text-xs font-bold">
                                    {record.status ?? 'Sudah Masuk'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Tanggal</p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.tanggal ?? 'Sabtu, 2 Mei 2026'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Masuk</p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.masuk_time ?? '07.00'} <span className="text-[#94a3b8] font-normal text-xs">(manual)</span>
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Pulang</p>
                            <p className="text-sm font-bold text-[#334155]">
                                {record.pulang_time ?? '-'} <span className="text-[#94a3b8] font-normal text-xs">(-)</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

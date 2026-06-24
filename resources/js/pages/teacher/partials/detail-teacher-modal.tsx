import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DetailTeacherModal({ isOpen, onClose, record }: any) {
    if (!record) return null;

    // Helper untuk akses profil
    const p = record.profile || {};

    const infoSections = [
        {
            title: "Data Pribadi",
            items: [
                { label: "Nama", value: record.nama },
                { label: "NUPTK", value: record.nuptk },
                { label: "NIK", value: p.nik },
                { label: "No KK", value: p.no_kk },
                { label: "TTL", value: record.tempat_tanggal_lahir },
                { label: "Jenis Kelamin", value: record.jenis_kelamin },
                { label: "Agama", value: p.agama },
                { label: "Kewarganegaraan", value: p.kewarganegaraan },
                { label: "Ibu Kandung", value: p.nama_ibu_kandung },
                { label: "Status Perkawinan", value: p.status_perkawinan },
            ]
        },
        {
            title: "Data Keluarga",
            items: [
                { label: "Nama S/I", value: p.nama_suami_istri },
                { label: "NIP S/I", value: p.nip_suami_istri },
                { label: "Pekerjaan S/I", value: p.pekerjaan_suami_istri },
            ]
        },
        {
            title: "Kontak & Alamat",
            items: [
                { label: "Alamat Jalan", value: p.alamat_jalan },
                { label: "RT/RW", value: `${p.rt || '-'}/${p.rw || '-'}` },
                { label: "Dusun/Desa", value: `${p.nama_dusun || '-'} / ${p.desa_kelurahan || '-'}` },
                { label: "Kecamatan", value: p.kecamatan },
                { label: "Kode Pos", value: p.kode_pos },
                { label: "HP/Telepon", value: `${p.hp || '-'} / ${p.telepon || '-'}` },
                { label: "Email", value: p.email_pribadi },
                { label: "Koordinat", value: (p.lintang || p.bujur) ? `${p.lintang}, ${p.bujur}` : '-' },
            ]
        },
        {
            title: "Kepegawaian",
            items: [
                { label: "NIP", value: p.nip },
                { label: "Status Kerja", value: <Badge variant="outline" className="capitalize">{record.status_kerja}</Badge> },
                { label: "Sub Role", value: <Badge variant="secondary" className="capitalize">{record.sub_role}</Badge> },
                { label: "Jabatan", value: record.positions?.map((pos: any) => pos.name).join(', ') },
                { label: "Jenis PTK", value: p.jenis_ptk },
                { label: "Tugas Tambahan", value: record.tugas_tambahan },
                { label: "Pangkat/Gol", value: p.pangkat_golongan },
                { label: "SK CPNS", value: p.sk_cpns },
                { label: "Tgl CPNS", value: p.tanggal_cpns },
                { label: "SK Pengangkatan", value: p.sk_pengangkatan },
                { label: "TMT Pengangkatan", value: p.tmt_pengangkatan },
                { label: "Lembaga Pengangkatan", value: p.lembaga_pengangkatan },
                { label: "TMT PNS", value: p.tmt_pns },
                { label: "Sumber Gaji", value: p.sumber_gaji },
            ]
        },
        {
            title: "Sertifikasi & Administrasi",
            items: [
                { label: "Karpeg", value: p.karpeg },
                { label: "Karis/Karsu", value: p.karis_karsu },
                { label: "NUKS", value: p.nuks },
                { label: "Lisensi KS", value: p.lisensi_kepala_sekolah ? 'Ya' : 'Tidak' },
                { label: "Diklat Kepengawasan", value: p.diklat_kepengawasan ? 'Ya' : 'Tidak' },
                { label: "Keahlian Braille", value: p.keahlian_braille ? 'Ya' : 'Tidak' },
                { label: "Bhs. Isyarat", value: p.keahlian_bahasa_isyarat ? 'Ya' : 'Tidak' },
            ]
        },
        {
            title: "Keuangan",
            items: [
                { label: "NPWP", value: p.npwp },
                { label: "Nama Wajib Pajak", value: p.nama_wajib_pajak },
                { label: "Bank", value: p.bank },
                { label: "No. Rekening", value: p.nomor_rekening_bank },
                { label: "Rekening A/N", value: p.rekening_atas_nama },
            ]
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail Guru: {record.nama}</DialogTitle>
                    <DialogDescription>Informasi lengkap data guru</DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                        {infoSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="font-semibold text-sm border-b pb-1 mb-3 text-primary">{section.title}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {section.items.map((item, i) => (
                                        <div key={i}>
                                            <p className="text-[11px] uppercase text-muted-foreground">{item.label}</p>
                                            <div className="text-sm font-medium break-words">{item.value || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
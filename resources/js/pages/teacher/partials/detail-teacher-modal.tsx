import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

export default function DetailTeacherModal({ isOpen, onClose, record }: any) {
    if (!record) {
return null;
}

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Guru</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap data guru
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Nama</p>
                        <p className="font-medium">{record.nama}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Tempat Tanggal Lahir
                        </p>
                        <p className="font-medium">
                            {record.tempat_tanggal_lahir || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">L/P</p>
                        <p className="font-medium">
                            {record.jenis_kelamin || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">NUPTK</p>
                        <p className="font-medium">{record.nuptk || '-'}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Sub Role</p>
                        <Badge variant="outline">
                            {record.sub_role || 'Belum diatur'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Status Kerja</p>
                        <Badge variant="outline">
                            {record.status_kerja === 'ptt' ? 'PTT' : 'Tetap'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Jabatan</p>
                        <p className="font-medium">{record.jabatan || '-'}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Tugas Tambahan
                        </p>
                        <p className="font-medium">
                            {record.tugas_tambahan || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Mata Pelajaran
                        </p>
                        <p className="font-medium">
                            {record.mata_pelajaran || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Pendidikan Terakhir
                        </p>
                        <p className="font-medium">
                            {record.pendidikan_terakhir || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">TMT Sekolah</p>
                        <p className="font-medium">
                            {record.tmt_sekolah || '-'}
                        </p>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

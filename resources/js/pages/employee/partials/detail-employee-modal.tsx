import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function DetailEmployeeModal({ isOpen, onClose, record }: any) {
    if (!record) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Pegawai</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap data pegawai
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Nama Guru</p>
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
                        <p className="text-muted-foreground">
                            Tingkat Pendidikan
                        </p>
                        <p className="font-medium">
                            {record.tingkat_pendidikan || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Tahun Lulus</p>
                        <p className="font-medium">
                            {record.tahun_lulus || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Tahun Masuk Kerja
                        </p>
                        <p className="font-medium">
                            {record.tahun_masuk_kerja || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">NIP</p>
                        <p className="font-medium">{record.nip || '-'}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Sub Role</p>
                        <Badge variant="secondary">{record.sub_role}</Badge>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Status Kerja</p>
                        <Badge variant="outline">{record.status_kerja}</Badge>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

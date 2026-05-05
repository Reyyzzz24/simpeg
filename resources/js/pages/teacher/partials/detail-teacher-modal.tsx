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

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

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

                    <div className="col-span-2">
                        <p className="text-muted-foreground">Tarif /30 Menit</p>
                        <p className="font-medium">
                            {formatRupiah(record.tarif_per_30_menit)}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

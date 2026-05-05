import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function DetailEmployeeModal({ isOpen, onClose, record }: any) {

    if (!record) return null

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value || 0)
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

                    {/* Nama */}
                    <div>
                        <p className="text-muted-foreground">Nama</p>
                        <p className="font-medium">{record.nama}</p>
                    </div>

                    {/* NIP */}
                    <div>
                        <p className="text-muted-foreground">NIP</p>
                        <p className="font-medium">{record.nip || '-'}</p>
                    </div>

                    {/* Sub Role */}
                    <div>
                        <p className="text-muted-foreground">Sub Role</p>
                        <Badge variant="secondary">{record.sub_role}</Badge>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-muted-foreground">Status Kerja</p>
                        <Badge variant="outline">{record.status_kerja}</Badge>
                    </div>

                    {/* Jabatan */}
                    <div className="col-span-2">
                        <p className="text-muted-foreground">Jabatan</p>
                        <p className="font-medium">{record.jabatan || '-'}</p>
                    </div>

                    {/* Gaji */}
                    <div>
                        <p className="text-muted-foreground">Gaji Pokok</p>
                        <p className="font-medium">{formatRupiah(record.gaji_pokok)}</p>
                    </div>

                    {/* Transport */}
                    <div>
                        <p className="text-muted-foreground">Transport Harian</p>
                        <p className="font-medium">{formatRupiah(record.transport_harian)}</p>
                    </div>

                    {/* Tunjangan */}
                    <div className="col-span-2">
                        <p className="text-muted-foreground">Tunjangan Jabatan</p>
                        <p className="font-medium">{formatRupiah(record.tunjangan_jabatan)}</p>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
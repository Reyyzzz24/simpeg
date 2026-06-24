import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

type Props = {
    isOpen: boolean
    onClose: () => void
    record: any | null
}

export default function DetailPayrollModal({
    isOpen,
    onClose,
    record,
}: Props) {
    if (!record) return null

    const details = record.details ?? []

    const formatRupiah = (val: number) =>
        `Rp ${Number(val ?? 0).toLocaleString('id-ID')}`

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-2xl">

                {/* ✅ FIX: tambahkan description (biar tidak warning shadcn) */}
                <DialogHeader>
                    <DialogTitle>Slip Gaji</DialogTitle>
                    <DialogDescription>
                        Rincian lengkap penggajian karyawan
                    </DialogDescription>
                </DialogHeader>

                {/* HEADER */}
                <div className="space-y-1">
                    <p className="font-semibold text-lg">
                        {record.nama ?? '-'} {/* ✅ FIX */}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Periode: {record.periode ?? '-'}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Jabatan: {record.jabatan || '-'}
                    </p>

                    <Badge className="uppercase mt-2">
                        {record.status ?? 'draft'} {/* ✅ fallback */}
                    </Badge>
                </div>

                {/* DETAIL KOMPONEN */}
                <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-sm">Rincian Gaji</h3>

                    <div className="border rounded-lg divide-y">
                        {details.length === 0 && (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                                Tidak ada data komponen
                            </div>
                        )}

                        {details.map((item: any, i: number) => (
                            <div
                                key={i}
                                className="flex justify-between p-3 text-sm"
                            >
                                <span>
                                    {item.komponen ?? 'Komponen'} {/* ✅ FIX */}
                                </span>

                                <span className="font-medium">
                                    {formatRupiah(item.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TOTAL */}
                <div className="flex justify-between mt-6 border-t pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span>{formatRupiah(record.total_gaji)}</span>
                </div>
            </DialogContent>
        </Dialog>
    )
}

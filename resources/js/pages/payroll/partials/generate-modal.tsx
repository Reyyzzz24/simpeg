import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { router } from '@inertiajs/react'

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function GeneratePayrollModal({ isOpen, onClose }: Props) {
    const [periode, setPeriode] = useState('')
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false) // State untuk modal konfirmasi

    const handleGenerate = () => {
        setLoading(true)
        router.post(
            '/payroll/generate-all',
            { periode },
            {
                onFinish: () => {
                    setLoading(false)
                    setShowConfirm(false)
                    setPeriode('')
                    onClose()
                },
                onError: () => {
                    alert('Gagal generate payroll')
                    setLoading(false)
                    setShowConfirm(false)
                },
            }
        )
    }

    return (
        <>
            {/* Modal Input Utama */}
            <Dialog open={isOpen && !showConfirm} onOpenChange={(o) => !o && onClose()}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generate Payroll</DialogTitle>
                        <DialogDescription>
                            Sistem akan menghitung gaji semua pegawai dan guru berdasarkan absensi, tunjangan, dan aturan salary.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="text-sm font-medium">Periode</label>
                            <Input
                                type="month"
                                value={periode}
                                onChange={(e) => setPeriode(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button
                            onClick={() => setShowConfirm(true)}
                            disabled={loading || !periode}
                        >
                            Generate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Terpisah */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Apakah Anda yakin?</DialogTitle>
                        <DialogDescription>
                            Proses ini akan membuat data payroll untuk periode <strong>{periode}</strong>. 
                            Data dibuat hanya untuk pegawai dan guru.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                            Tidak, batalkan
                        </Button>
                        <Button variant="destructive" onClick={handleGenerate} disabled={loading}>
                            {loading ? 'Memproses...' : 'Ya, Lanjutkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

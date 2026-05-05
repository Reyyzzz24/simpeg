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

export default function GeneratePayrollModal({
    isOpen,
    onClose,
}: Props) {
    const [periode, setPeriode] = useState('')
    const [loading, setLoading] = useState(false)

    const handleGenerate = () => {
        if (!periode) {
            alert('Periode wajib diisi')
            return
        }

        setLoading(true)

        router.post(
            '/payroll/generate-all',
            { periode },
            {
                onFinish: () => {
                    setLoading(false)
                    setPeriode('')
                    onClose()
                },
                onError: () => {
                    alert('Gagal generate payroll')
                },
            }
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle>Generate Payroll</DialogTitle>
                    <DialogDescription>
                        Sistem akan menghitung gaji semua karyawan berdasarkan absensi, tunjangan, dan aturan salary.
                    </DialogDescription>
                </DialogHeader>

                {/* INPUT */}
                <div className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium">
                            Periode
                        </label>
                        <Input
                            type="month"
                            value={periode}
                            onChange={(e) => setPeriode(e.target.value)}
                        />
                    </div>
                </div>

                {/* ACTION */}
                <DialogFooter className="mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </Button>

                    <Button
                        onClick={handleGenerate}
                        disabled={loading || !periode}
                    >
                        {loading ? 'Memproses...' : 'Generate'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
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
import { Label } from '@/components/ui/label'

type Props = {
    open: boolean
    setOpen: (v: boolean) => void
    record?: any | null
}

export default function PositionFormModal({ open, setOpen, record }: Props) {
    const { data, setData, post, put, processing, reset, clearErrors } = useForm({
        name: '',
    })

    useEffect(() => {
        if (open && record) {
            setData('name', record.name)
        } else if (open) {
            reset()
            clearErrors()
        }
    }, [open, record])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (record) {
            put(`/positions/${record.id}`, {
                onSuccess: () => setOpen(false),
            })
        } else {
            post('/positions', {
                onSuccess: () => {
                    reset()
                    setOpen(false)
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>{record ? 'Edit' : 'Tambah'} Jabatan</DialogTitle>
                        <DialogDescription>
                            Pastikan nama jabatan sesuai dengan struktur organisasi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-2">
                        <Label htmlFor="name">Nama Jabatan</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Staff IT"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
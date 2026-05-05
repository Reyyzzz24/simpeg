import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type Props = {
    positions: any[]
    components: any[]
    open: boolean
    setOpen: (v: boolean) => void
    record?: any | null
}

export default function AllowanceFormModal({ positions, components, open, setOpen, record }: Props) {
    const { data, setData, post, put, processing, reset, clearErrors } = useForm({
        position_id: '',
        component_id: '',
        amount: '',
    })

    useEffect(() => {
        if (open && record) {
            setData({
                position_id: String(record.position_id),
                component_id: String(record.component_id),
                amount: String(record.amount),
            })
        } else if (open) {
            reset()
            clearErrors()
        }
    }, [open, record])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (record) {
            put(`/position-allowances/${record.id}`, {
                onSuccess: () => setOpen(false)
            })
        } else {
            post('/position-allowances', {
                onSuccess: () => {
                    reset()
                    setOpen(false)
                }
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-md">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>{record ? 'Edit' : 'Tambah'} Tunjangan</DialogTitle>
                        <DialogDescription>Kelola nominal tunjangan berdasarkan jabatan.</DialogDescription>
                    </DialogHeader>

                    <Select value={data.position_id} onValueChange={(v) => setData('position_id', v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih Jabatan" /></SelectTrigger>
                        <SelectContent>
                            {positions.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Select value={data.component_id} onValueChange={(v) => setData('component_id', v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih Komponen" /></SelectTrigger>
                        <SelectContent>
                            {components.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Input 
                        type="number" 
                        placeholder="Nominal" 
                        value={data.amount} 
                        onChange={(e) => setData('amount', e.target.value)} 
                        required 
                    />

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
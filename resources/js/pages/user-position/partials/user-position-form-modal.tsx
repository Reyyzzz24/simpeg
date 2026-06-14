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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type Props = {
    open: boolean
    setOpen: (v: boolean) => void
    users: any[]
    positions: any[]
    record?: any | null
}

export default function UserPositionFormModal({ open, setOpen, users, positions, record }: Props) {
    const { data, setData, post, put, processing, reset, clearErrors } = useForm({
        user_id: '',
        // for create: allow multiple positions
        position_ids: [] as string[],
        // for edit: single position id
        position_id: '',
    })

    useEffect(() => {
        if (open && record) {
            setData({
                user_id: String(record.user_id ?? record.user?.id ?? ''),
                position_id: String(record.position_id ?? record.position?.id ?? ''),
                position_ids: record.position_ids?.map((id: any) => String(id)) || (record.positions ? record.positions.map((p: any) => String(p.id)) : []),
            })
        } else if (open) {
            reset()
            clearErrors()
        }
    }, [open, record])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (record) {
            put(`/user-positions/${record.id}`, {
                onSuccess: () => setOpen(false),
            })
        } else {
            // create multiple user positions if multiple selected
            post('/user-positions', {
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
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{record ? 'Edit' : 'Assign'} Jabatan</DialogTitle>
                        <DialogDescription>
                            Tentukan jabatan user untuk keperluan struktur organisasi dan payroll.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(v) => setData('user_id', v)}
                                disabled={!!record} // Biasanya user tidak diubah saat edit posisi
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih User" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Jabatan (boleh pilih lebih dari satu)</Label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto py-1">
                                {positions.map((p) => {
                                    const val = String(p.id)
                                    const checked = (data.position_ids || []).includes(val)
                                    return (
                                        <label key={p.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(c) => {
                                                    const next = Array.isArray(data.position_ids)
                                                        ? [...data.position_ids]
                                                        : []
                                                    if (c) {
                                                        if (!next.includes(val)) next.push(val)
                                                    } else {
                                                        const idx = next.indexOf(val)
                                                        if (idx > -1) next.splice(idx, 1)
                                                    }
                                                    setData('position_ids', next)
                                                }}
                                            />
                                            <span>{p.name}</span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
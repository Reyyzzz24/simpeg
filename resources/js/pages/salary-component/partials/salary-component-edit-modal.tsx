import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import InputError from '@/components/input-error'

import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'

export default function SalaryComponentEditModal({
    isOpen,
    onClose,
    record,
}: any) {

    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        default_amount: 0,
    })

    useEffect(() => {
        if (!record) return

        setData({
            name: record.name ?? '',
            default_amount: record.default_amount ?? 0,
        })
    }, [record])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!record) return

        put(`/salary-components/${record.id}`, {
            onSuccess: () => {
                reset()
                onClose()
            },
        })
    }

    if (!record) return null

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>Edit Salary Component</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">

                    {/* NAME */}
                    <div>
                        <Label>Nama Komponen</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* DEFAULT AMOUNT */}
                    <div>
                        <Label>Default Amount</Label>
                        <Input
                            type="number"
                            value={data.default_amount}
                            onChange={(e) =>
                                setData('default_amount', Number(e.target.value))
                            }
                        />
                        <InputError message={errors.default_amount} />
                    </div>

                    {/* ACTION */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
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

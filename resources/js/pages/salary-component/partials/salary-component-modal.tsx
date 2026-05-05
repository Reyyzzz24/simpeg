import { useState } from 'react'
import { router } from '@inertiajs/react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

type Props = {
    open: boolean
    setOpen: (v: boolean) => void
}

export default function SalaryComponentModal({ open, setOpen }: Props) {

    const [form, setForm] = useState({
        name: '',
        type: 'fixed',
        default_amount: 0,
    })

    const submit = () => {
        router.post('/salary-components', form, {
            onSuccess: () => {
                setForm({
                    name: '',
                    type: 'fixed',
                    default_amount: 0,
                })
                setOpen(false)
            },
        })
    }

    const isValid = form.name.length > 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    Tambah Komponen
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Salary Component</DialogTitle>
                    <DialogDescription>
                        Komponen dasar untuk perhitungan payroll
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">

                    {/* NAME */}
                    <Input
                        placeholder="Nama komponen"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    {/* TYPE */}
                    <Select
                        value={form.type}
                        onValueChange={(value) =>
                            setForm({ ...form, type: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="formula">Formula</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* DEFAULT AMOUNT */}
                    <Input
                        type="number"
                        placeholder="Default amount"
                        value={form.default_amount}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                default_amount: Number(e.target.value),
                            })
                        }
                    />

                    <Button
                        className="w-full"
                        disabled={!isValid}
                        onClick={submit}
                    >
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
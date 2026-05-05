import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import InputError from '@/components/input-error'
import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function EditEmployeeModal({ isOpen, onClose, record, positions }: any) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama: '',
        nip: '',
        sub_role: '',
        status_kerja: '',
        gaji_pokok: '',
        transport_harian: '',
        tunjangan_jabatan: '',
        position_id: '',
    })

    useEffect(() => {
        if (record) {
            setData({
                nama: record.nama || '',
                nip: record.nip || '',
                sub_role: record.sub_role || '',
                status_kerja: record.status_kerja || '',
                gaji_pokok: record.gaji_pokok || '',
                transport_harian: record.transport_harian || '',
                tunjangan_jabatan: record.tunjangan_jabatan || '',
                position_id: record.position_id ? String(record.position_id) : '',
            })
        }
    }, [record])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!record) return

        put(`/employee/${record.id}`, {
            onSuccess: () => {
                reset()
                onClose()
            }
        })
    }

    if (!record) return null

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Pegawai</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">

                    {/* Nama */}
                    <div>
                        <Label>Nama</Label>
                        <Input value={data.nama} onChange={e => setData('nama', e.target.value)} />
                        <InputError message={errors.nama} />
                    </div>

                    {/* NIP */}
                    <div>
                        <Label>NIP</Label>
                        <Input value={data.nip} onChange={e => setData('nip', e.target.value)} />
                        <InputError message={errors.nip} />
                    </div>

                    {/* Sub Role */}
                    <div>
                        <Label>Sub Role</Label>
                        <Select value={data.sub_role} onValueChange={(v) => setData('sub_role', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih sub role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tu">TU</SelectItem>
                                <SelectItem value="struktural">Struktural</SelectItem>
                                <SelectItem value="staf">Staf</SelectItem>
                                <SelectItem value="karyawan">Karyawan</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sub_role} />
                    </div>

                    {/* Status Kerja */}
                    <div>
                        <Label>Status Kerja</Label>
                        <Select value={data.status_kerja} onValueChange={(v) => setData('status_kerja', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status kerja" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tetap">Tetap</SelectItem>
                                <SelectItem value="ptt">PTT</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status_kerja} />
                    </div>

                    {/* Jabatan */}
                    <div>
                        <Label>Jabatan</Label>
                        <Select
                            value={data.position_id}
                            onValueChange={(v) => setData('position_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jabatan" />
                            </SelectTrigger>
                            <SelectContent>
                                {positions?.map((p: any) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.position_id} />
                    </div>

                    {/* Gaji Pokok */}
                    <div>
                        <Label>Gaji Pokok</Label>
                        <Input type="number" value={data.gaji_pokok} onChange={e => setData('gaji_pokok', e.target.value)} />
                        <InputError message={errors.gaji_pokok} />
                    </div>

                    {/* Transport */}
                    <div>
                        <Label>Transport Harian</Label>
                        <Input type="number" value={data.transport_harian} onChange={e => setData('transport_harian', e.target.value)} />
                        <InputError message={errors.transport_harian} />
                    </div>

                    {/* Tunjangan */}
                    <div>
                        <Label>Tunjangan Jabatan</Label>
                        <Input type="number" value={data.tunjangan_jabatan} onChange={e => setData('tunjangan_jabatan', e.target.value)} />
                        <InputError message={errors.tunjangan_jabatan} />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="secondary" type="button" onClick={onClose}>
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
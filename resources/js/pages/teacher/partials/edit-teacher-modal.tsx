import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function EditTeacherModal({
    isOpen,
    onClose,
    record,
    positions,
}: any) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama: '',
        nuptk: '',
        sub_role: '',
        status_kerja: 'tetap',
        jabatan: '',
        position_id: '',
        tarif_per_30_menit: 0,
        transport_harian: 0,
        tunjangan_jabatan: 0,
        tunjangan_praktik: 0,
    });

    useEffect(() => {
        if (!record) {
return;
}

        setData({
            nama: record.nama || '',
            nuptk: record.nuptk || '',
            sub_role: record.sub_role || '',
            status_kerja: record.status_kerja || 'tetap',
            position_id: record.position_id ? String(record.position_id) : '',
            tarif_per_30_menit: record.tarif_per_30_menit || 0,
            transport_harian: record.transport_harian || 0,
            tunjangan_jabatan: record.tunjangan_jabatan || 0,
            tunjangan_praktik: record.tunjangan_praktik || 0,
        });
    }, [record]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!record) {
return;
}

        put(`/teacher/${record.id}`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!record) {
return null;
}

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Guru</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Nama</Label>
                        <Input
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                        />
                        <InputError message={errors.nama} />
                    </div>

                    <div>
                        <Label>NUPTK</Label>
                        <Input
                            value={data.nuptk}
                            onChange={(e) => setData('nuptk', e.target.value)}
                        />
                        <InputError message={errors.nuptk} />
                    </div>

                    <div>
                        <Label>Sub Role (Kategori Gaji)</Label>
                        <Select
                            value={data.sub_role}
                            onValueChange={(v) => setData('sub_role', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Sub Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Value harus sama persis dengan tabel salary_rules[cite: 14, 16] */}
                                <SelectItem value="normatif">
                                    Guru Normatif
                                </SelectItem>
                                <SelectItem value="produktif">
                                    Guru Produktif
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sub_role} />
                    </div>

                    <div>
                        <Label>Status Kerja</Label>
                        <Select
                            value={data.status_kerja}
                            onValueChange={(v) => setData('status_kerja', v)}
                        >
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

                    <div>
                        <Label>Jabatan</Label>

                        <Select
                            value={data.position_id}
                            onValueChange={(v) => setData('position_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jabatan" />
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
                    <div>
                        <Label>Tarif /30 Menit</Label>
                        <Input
                            type="number"
                            value={data.tarif_per_30_menit}
                            onChange={(e) =>
                                setData(
                                    'tarif_per_30_menit',
                                    Number(e.target.value),
                                )
                            }
                        />
                        <InputError message={errors.tarif_per_30_menit} />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            type="button"
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
    );
}

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

type PegawaiOption = {
    id: number;
    nama: string;
    nip?: string | null;
};

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    record?: any | null;
    pegawai: PegawaiOption[];
};

export default function LemburEditModal({
    open,
    setOpen,
    record,
    pegawai,
}: Props) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        pegawai_id: '',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: '',
        tugas: '',
        is_approved: false,
    });

    useEffect(() => {
        if (!open || !record) {
            return;
        }

        setData({
            pegawai_id: String(record.pegawai_id ?? ''),
            tanggal: record.tanggal ?? '',
            jam_mulai: record.jam_mulai ?? '',
            jam_selesai: record.jam_selesai ?? '',
            tugas: record.tugas ?? '',
            is_approved: Boolean(record.is_approved),
        });
        clearErrors();
    }, [open, record]);

    const close = () => {
        setOpen(false);
        clearErrors();
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!record) {
            return;
        }

        put(`/overtime/${record.id}`, {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : close())}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Edit Lembur</DialogTitle>
                        <DialogDescription>
                            Perbarui data lembur pegawai.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Pegawai</Label>
                            <Select
                                value={data.pegawai_id}
                                onValueChange={(value) =>
                                    setData('pegawai_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih pegawai" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pegawai.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.nama}
                                            {item.nip ? ` - ${item.nip}` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.pegawai_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(event) =>
                                    setData('tanggal', event.target.value)
                                }
                            />
                            <InputError message={errors.tanggal} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="jam_mulai">Jam mulai</Label>
                                <Input
                                    id="jam_mulai"
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(event) =>
                                        setData('jam_mulai', event.target.value)
                                    }
                                />
                                <InputError message={errors.jam_mulai} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="jam_selesai">Jam selesai</Label>
                                <Input
                                    id="jam_selesai"
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(event) =>
                                        setData(
                                            'jam_selesai',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.jam_selesai} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tugas">Tugas</Label>
                            <Textarea
                                id="tugas"
                                value={data.tugas}
                                onChange={(event) =>
                                    setData('tugas', event.target.value)
                                }
                            />
                            <InputError message={errors.tugas} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_approved"
                                checked={data.is_approved}
                                onCheckedChange={(checked) =>
                                    setData('is_approved', checked === true)
                                }
                            />
                            <Label htmlFor="is_approved">Disetujui</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={close}>
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

import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
};

export default function EditPresenceModal({ isOpen, onClose, record }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        user_id: '',
        tanggal: '',
        jam_masuk: '',
        jam_pulang: '',
        total_jam_ajar: '',
        jenis_ajar: 'none',
        status_disiplin: '',
    });

    useEffect(() => {
        if (!record) {
            return;
        }

        setData({
            user_id: record.employee?.id ?? record.user_id ?? '',
            tanggal: record.tanggal ?? '',
            jam_masuk: record.masuk_time ?? '',
            jam_pulang: record.pulang_time ?? '',
            total_jam_ajar: record.total_jam_ajar?.toString() ?? '',
            jenis_ajar: record.jenis_ajar ?? 'none',
            status_disiplin: record.status ?? record.status_disiplin ?? '',
        });
    }, [record, setData]);

    if (!isOpen || !record) {
        return null;
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!record?.id) {
            return;
        }

        put(route('presence.update', record.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!record?.id) {
        return;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Presensi</DialogTitle>
                    <DialogDescription>
                        Perbarui data presensi untuk pegawai.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Pegawai</Label>
                        <Input value={record.employee?.name ?? ''} readOnly />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) =>
                                    setData('tanggal', e.target.value)
                                }
                            />
                            <InputError message={errors.tanggal} />
                        </div>
                        <div>
                            <Label>Jam Masuk</Label>
                            <Input
                                type="time"
                                value={data.jam_masuk}
                                onChange={(e) =>
                                    setData('jam_masuk', e.target.value)
                                }
                            />
                            <InputError message={errors.jam_masuk} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Jam Pulang</Label>
                            <Input
                                type="time"
                                value={data.jam_pulang}
                                onChange={(e) =>
                                    setData('jam_pulang', e.target.value)
                                }
                            />
                            <InputError message={errors.jam_pulang} />
                        </div>
                        <div>
                            <Label>Status Disiplin</Label>
                            <Select
                                value={data.status_disiplin}
                                onValueChange={(val) =>
                                    setData('status_disiplin', val)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih status disiplin" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="hadir">Hadir</SelectItem>
                                    <SelectItem value="terlambat">
                                        Terlambat
                                    </SelectItem>
                                    <SelectItem value="alpha">Alpha</SelectItem>
                                    <SelectItem value="izin">Izin</SelectItem>
                                    <SelectItem value="sakit">Sakit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Total Jam Ajar</Label>
                            <Input
                                type="number"
                                min="0"
                                max="24"
                                value={data.total_jam_ajar}
                                onChange={(e) =>
                                    setData('total_jam_ajar', e.target.value)
                                }
                            />
                            <InputError message={errors.total_jam_ajar} />
                        </div>
                        <div>
                            <Label>Jenis Ajar</Label>
                            <select
                                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                value={data.jenis_ajar}
                                onChange={(e) =>
                                    setData('jenis_ajar', e.target.value)
                                }
                            >
                                <option value="none">None</option>
                                <option value="teori">Teori</option>
                                <option value="praktik">Praktik</option>
                            </select>
                            <InputError message={errors.jenis_ajar} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
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

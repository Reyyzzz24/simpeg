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
import { Checkbox } from '@/components/ui/checkbox';

export default function EditTeacherModal({
    isOpen,
    onClose,
    record,
    positions,
}: any) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama: '',
        tempat_tanggal_lahir: '',
        jenis_kelamin: '',
        nuptk: '',
        sub_role: '',
        status_kerja: 'tetap',
        position_ids: [] as string[],
        tugas_tambahan: '',
        mata_pelajaran: '',
        pendidikan_terakhir: '',
        tmt_sekolah: '',
    });

    useEffect(() => {
        if (!record) {
            return;
        }

        setData({
            nama: record.nama || '',
            tempat_tanggal_lahir: record.tempat_tanggal_lahir || '',
            jenis_kelamin: record.jenis_kelamin || '',
            nuptk: record.nuptk || '',
            sub_role: record.sub_role || '',
            status_kerja: record.status_kerja || 'tetap',
            position_ids: record.position_ids?.map((id: any) => String(id)) || (record.positions ? record.positions.map((p: any) => String(p.id)) : []),
            tugas_tambahan: record.tugas_tambahan || '',
            mata_pelajaran: record.mata_pelajaran || '',
            pendidikan_terakhir: record.pendidikan_terakhir || '',
            tmt_sekolah: record.tmt_sekolah || '',
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
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Guru</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto pr-2 -mr-2">
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
                            <Label>Tempat Tanggal Lahir</Label>
                            <Input
                                value={data.tempat_tanggal_lahir}
                                onChange={(e) =>
                                    setData('tempat_tanggal_lahir', e.target.value)
                                }
                                placeholder="Bandung, 12 Mei 1990"
                            />
                            <InputError message={errors.tempat_tanggal_lahir} />
                        </div>

                        <div>
                            <Label>L/P</Label>
                            <Select
                                value={data.jenis_kelamin}
                                onValueChange={(v) => setData('jenis_kelamin', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih L/P" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="P">P</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis_kelamin} />
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
                            <Label>Jabatan (boleh pilih lebih dari satu)</Label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto py-1">
                                {positions?.map((p: any) => {
                                    const val = String(p.id)
                                    const checked = (data.position_ids || []).includes(val)
                                    return (
                                        <label key={p.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(c) => {
                                                    const next = Array.isArray(data.position_ids) ? [...data.position_ids] : []
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

                            <InputError message={errors.position_ids} />
                        </div>

                        <div>
                            <Label>Tugas Tambahan</Label>
                            <Input
                                value={data.tugas_tambahan}
                                onChange={(e) =>
                                    setData('tugas_tambahan', e.target.value)
                                }
                            />
                            <InputError message={errors.tugas_tambahan} />
                        </div>

                        <div>
                            <Label>Mata Pelajaran</Label>
                            <Input
                                value={data.mata_pelajaran}
                                onChange={(e) =>
                                    setData('mata_pelajaran', e.target.value)
                                }
                            />
                            <InputError message={errors.mata_pelajaran} />
                        </div>

                        <div>
                            <Label>Pendidikan Terakhir</Label>
                            <Input
                                value={data.pendidikan_terakhir}
                                onChange={(e) =>
                                    setData('pendidikan_terakhir', e.target.value)
                                }
                            />
                            <InputError message={errors.pendidikan_terakhir} />
                        </div>

                        <div>
                            <Label>TMT Sekolah</Label>
                            <Input
                                type="date"
                                value={data.tmt_sekolah}
                                onChange={(e) =>
                                    setData('tmt_sekolah', e.target.value)
                                }
                            />
                            <InputError message={errors.tmt_sekolah} />
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
                </div>
            </DialogContent>
        </Dialog>
    );
}

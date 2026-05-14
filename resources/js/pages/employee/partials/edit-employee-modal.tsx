import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
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

export default function EditEmployeeModal({ isOpen, onClose, record }: any) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama: '',
        tempat_tanggal_lahir: '',
        jenis_kelamin: '',
        tingkat_pendidikan: '',
        tahun_lulus: '',
        tahun_masuk_kerja: '',
        nip: '',
        sub_role: '',
        status_kerja: '',
    });

    useEffect(() => {
        if (record) {
            setData({
                nama: record.nama || '',
                tempat_tanggal_lahir: record.tempat_tanggal_lahir || '',
                jenis_kelamin: record.jenis_kelamin || '',
                tingkat_pendidikan: record.tingkat_pendidikan || '',
                tahun_lulus: record.tahun_lulus || '',
                tahun_masuk_kerja: record.tahun_masuk_kerja || '',
                nip: record.nip || '',
                sub_role: record.sub_role || '',
                status_kerja: record.status_kerja || '',
            });
        }
    }, [record]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!record) {
            return;
        }

        put(`/employee/${record.id}`, {
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
                    <DialogTitle>Edit Pegawai</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Nama Guru</Label>
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
                        <Label>Tingkat Pendidikan</Label>
                        <Input
                            value={data.tingkat_pendidikan}
                            onChange={(e) =>
                                setData('tingkat_pendidikan', e.target.value)
                            }
                        />
                        <InputError message={errors.tingkat_pendidikan} />
                    </div>

                    <div>
                        <Label>Tahun Lulus</Label>
                        <Input
                            type="number"
                            value={data.tahun_lulus}
                            onChange={(e) =>
                                setData('tahun_lulus', e.target.value)
                            }
                        />
                        <InputError message={errors.tahun_lulus} />
                    </div>

                    <div>
                        <Label>Tahun Masuk Kerja</Label>
                        <Input
                            type="number"
                            value={data.tahun_masuk_kerja}
                            onChange={(e) =>
                                setData('tahun_masuk_kerja', e.target.value)
                            }
                        />
                        <InputError message={errors.tahun_masuk_kerja} />
                    </div>

                    <div>
                        <Label>NIP</Label>
                        <Input
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                        />
                        <InputError message={errors.nip} />
                    </div>

                    <div>
                        <Label>Sub Role</Label>
                        <Select
                            value={data.sub_role}
                            onValueChange={(v) => setData('sub_role', v)}
                        >
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
    );
}

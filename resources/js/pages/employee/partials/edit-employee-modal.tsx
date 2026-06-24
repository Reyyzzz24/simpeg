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
import { Checkbox } from '@/components/ui/checkbox';

export default function EditEmployeeModal({ isOpen, onClose, record, positions }: any) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama: '',
        tempat_tanggal_lahir: '',
        jenis_kelamin: '',
        tingkat_pendidikan: '',
        tahun_lulus: '',
        tahun_masuk_kerja: '',
        position_ids: [] as string[],
        nip: '',
        sub_role: '',
        status_kerja: '',
        profile: {
            nuptk: '',
            agama: '',
            alamat_jalan: '',
            rt: '',
            rw: '',
            nama_dusun: '',
            desa_kelurahan: '',
            kecamatan: '',
            kode_pos: '',
            telepon: '',
            hp: '',
            email_pribadi: '',
            nama_ibu_kandung: '',
            status_perkawinan: '',
            nama_suami_istri: '',
            nip_suami_istri: '',
            pekerjaan_suami_istri: '',
            kewarganegaraan: '',
            nik: '',
            no_kk: '',
            jenis_ptk: '',
            tugas_tambahan: '',
            sk_cpns: '',
            tanggal_cpns: '',
            sk_pengangkatan: '',
            tmt_pengangkatan: '',
            lembaga_pengangkatan: '',
            pangkat_golongan: '',
            sumber_gaji: '',
            tmt_pns: '',
            karpeg: '',
            karis_karsu: '',
            nuks: '',
            lisensi_kepala_sekolah: 0 as string | number,
            diklat_kepengawasan: 0 as string | number,
            keahlian_braille: 0 as string | number,
            keahlian_bahasa_isyarat: 0 as string | number,
            npwp: '',
            nama_wajib_pajak: '',
            bank: '',
            nomor_rekening_bank: '',
            rekening_atas_nama: '',
            lintang: '',
            bujur: '',
        },
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
                position_ids: record.position_ids?.map((id: any) => String(id)) || (record.positions ? record.positions.map((p: any) => String(p.id)) : []),
                nip: record.nip || '',
                sub_role: record.sub_role || '',
                status_kerja: record.status_kerja || '',
                profile: record.profile || {
                    nuptk: '',
                    agama: '',
                    alamat_jalan: '',
                    hp: '',
                    nik: '',
                    no_kk: '',
                    jenis_ptk: '',
                    tugas_tambahan: '',
                    sk_cpns: '',
                    tanggal_cpns: '',
                    sk_pengangkatan: '',
                    tmt_pengangkatan: '',
                    lembaga_pengangkatan: '',
                    pangkat_golongan: '',
                    sumber_gaji: '',
                    tmt_pns: '',
                    karpeg: '',
                    karis_karsu: '',
                    nuks: '',
                    lisensi_kepala_sekolah: '',
                    diklat_kepengawasan: '',
                    keahlian_braille: '',
                    keahlian_bahasa_isyarat: '',
                    npwp: '',
                    nama_wajib_pajak: '',
                    bank: '',
                    nomor_rekening_bank: '',
                    rekening_atas_nama: '',
                    lintang: '',
                    bujur: '',
                },
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
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Pegawai</DialogTitle>
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
                            <Label>NUPTK</Label>
                            <Input
                                value={data.profile.nuptk}
                                onChange={(e) =>
                                    setData('profile.nuptk', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nuptk']} />
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
                            <Label>NIP</Label>
                            <Input
                                value={data.nip}
                                onChange={(e) => setData('nip', e.target.value)}
                            />
                            <InputError message={errors.nip} />
                        </div>
                        <div>
                            <Label>Status Kepegawaian</Label>
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
                            <Label>Jenis PTK</Label>
                            <Input
                                value={data.profile.jenis_ptk}
                                onChange={(e) =>
                                    setData('profile.jenis_ptk', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.jenis_ptk']} />
                        </div>
                        <div>
                            <Label>Agama</Label>
                            <Input
                                value={data.profile.agama}
                                onChange={(e) =>
                                    setData('profile.agama', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.agama']} />
                        </div>
                        <div>
                            <Label>Alamat</Label>
                            <Input
                                value={data.profile.alamat_jalan}
                                onChange={(e) =>
                                    setData('profile.alamat_jalan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.alamat_jalan']} />
                        </div>
                        <div>
                            <Label>RT</Label>
                            <Input
                                value={data.profile.rt}
                                onChange={(e) =>
                                    setData('profile.rt', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.rt']} />
                        </div>
                        <div>
                            <Label>RW</Label>
                            <Input
                                value={data.profile.rw}
                                onChange={(e) =>
                                    setData('profile.rw', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.rw']} />
                        </div>
                        <div>
                            <Label>Dusun</Label>
                            <Input
                                value={data.profile.nama_dusun}
                                onChange={(e) =>
                                    setData('profile.nama_dusun', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nama_dusun']} />
                        </div>
                        <div>
                            <Label>Desa/Kelurahan</Label>
                            <Input
                                value={data.profile.desa_kelurahan}
                                onChange={(e) =>
                                    setData('profile.desa_kelurahan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.desa_kelurahan']} />
                        </div>
                        <div>
                            <Label>Kecamatan</Label>
                            <Input
                                value={data.profile.kecamatan}
                                onChange={(e) =>
                                    setData('profile.kecamatan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.kecamatan']} />
                        </div>
                        <div>
                            <Label>Kode Pos</Label>
                            <Input
                                value={data.profile.kode_pos}
                                onChange={(e) =>
                                    setData('profile.kode_pos', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.kode_pos']} />
                        </div>
                        <div>
                            <Label>Telepon</Label>
                            <Input
                                value={data.profile.telepon}
                                onChange={(e) =>
                                    setData('profile.telepon', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.telepon']} />
                        </div>
                        <div>
                            <Label>HP</Label>
                            <Input
                                value={data.profile.hp}
                                onChange={(e) =>
                                    setData('profile.hp', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.hp']} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                value={data.profile.email_pribadi}
                                onChange={(e) =>
                                    setData('profile.email_pribadi', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.email_pribadi']} />
                        </div>
                        <div>
                            <Label>Nama Ibu Kandung</Label>
                            <Input
                                value={data.profile.nama_ibu_kandung}
                                onChange={(e) =>
                                    setData('profile.nama_ibu_kandung', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nama_ibu_kandung']} />
                        </div>
                        <div>
                            <Label>Status Perkawinan</Label>
                            <Input
                                value={data.profile.status_perkawinan}
                                onChange={(e) =>
                                    setData('profile.status_perkawinan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.status_perkawinan']} />
                        </div>
                        <div>
                            <Label>Nama Suami/Istri</Label>
                            <Input
                                value={data.profile.nama_suami_istri}
                                onChange={(e) =>
                                    setData('profile.nama_suami_istri', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nama_suami_istri']} />
                        </div>
                        <div>
                            <Label>NIP Suami/Istri</Label>
                            <Input
                                value={data.profile.nip_suami_istri}
                                onChange={(e) =>
                                    setData('profile.nip_suami_istri', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nip_suami_istri']} />
                        </div>
                        <div>
                            <Label>Pekerjaan Suami/Istri</Label>
                            <Input
                                value={data.profile.pekerjaan_suami_istri}
                                onChange={(e) =>
                                    setData('profile.pekerjaan_suami_istri', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.pekerjaan_suami_istri']} />
                        </div>
                        <div>
                            <Label>Kewarganegaraan</Label>
                            <Input
                                value={data.profile.kewarganegaraan}
                                onChange={(e) =>
                                    setData('profile.kewarganegaraan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.kewarganegaraan']} />
                        </div>
                        <div>
                            <Label>NIK</Label>
                            <Input
                                value={data.profile.nik}
                                onChange={(e) =>
                                    setData('profile.nik', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nik']} />
                        </div>
                        <div>
                            <Label>No KK</Label>
                            <Input
                                value={data.profile.no_kk}
                                onChange={(e) =>
                                    setData('profile.no_kk', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.no_kk']} />
                        </div>
                        <div>
                            <Label>Tugas Tambahan</Label>
                            <Input
                                value={data.profile.tugas_tambahan}
                                onChange={(e) =>
                                    setData('profile.tugas_tambahan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.tugas_tambahan']} />
                        </div>
                        <div>
                            <Label>SK CPNS</Label>
                            <Input
                                value={data.profile.sk_cpns}
                                onChange={(e) =>
                                    setData('profile.sk_cpns', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.sk_cpns']} />
                        </div>
                        <div>
                            <Label>Tanggal CPNS</Label>
                            <Input
                                type="date"
                                value={data.profile.tanggal_cpns}
                                onChange={(e) =>
                                    setData('profile.tanggal_cpns', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.tanggal_cpns']} />
                        </div>
                        <div>
                            <Label>SK Pengangkatan</Label>
                            <Input
                                value={data.profile.sk_pengangkatan}
                                onChange={(e) =>
                                    setData('profile.sk_pengangkatan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.sk_pengangkatan']} />
                        </div>
                        <div>
                            <Label>TMT Pengangkatan</Label>
                            <Input
                                type="date"
                                value={data.profile.tmt_pengangkatan}
                                onChange={(e) =>
                                    setData('profile.tmt_pengangkatan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.tmt_pengangkatan']} />
                        </div>
                        <div>
                            <Label>Lembaga Pengangkatan</Label>
                            <Input
                                value={data.profile.lembaga_pengangkatan}
                                onChange={(e) =>
                                    setData('profile.lembaga_pengangkatan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.lembaga_pengangkatan']} />
                        </div>
                        <div>
                            <Label>Pangkat Golongan</Label>
                            <Input
                                value={data.profile.pangkat_golongan}
                                onChange={(e) =>
                                    setData('profile.pangkat_golongan', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.pangkat_golongan']} />
                        </div>
                        <div>
                            <Label>Sumber Gaji</Label>
                            <Input
                                value={data.profile.sumber_gaji}
                                onChange={(e) =>
                                    setData('profile.sumber_gaji', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.sumber_gaji']} />
                        </div>
                        <div>
                            <Label>TMT PNS</Label>
                            <Input
                                type='date'
                                value={data.profile.tmt_pns}
                                onChange={(e) =>
                                    setData('profile.tmt_pns', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.tmt_pns']} />
                        </div>
                        <div>
                            <Label>Karpeg</Label>
                            <Input
                                value={data.profile.karpeg}
                                onChange={(e) =>
                                    setData('profile.karpeg', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.karpeg']} />
                        </div>
                        <div>
                            <Label>Karis Karsu</Label>
                            <Input
                                value={data.profile.karis_karsu}
                                onChange={(e) =>
                                    setData('profile.karis_karsu', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.karis_karsu']} />
                        </div>
                        <div>
                            <Label>NUKS</Label>
                            <Input
                                value={data.profile.nuks}
                                onChange={(e) =>
                                    setData('profile.nuks', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nuks']} />
                        </div>
                        <div>
                            <Label>Lisensi Kepala Sekolah</Label>
                            <Select
                                value={String(data.profile.lisensi_kepala_sekolah ?? '0')}
                                onValueChange={(val) => setData('profile', { ...data.profile, lisensi_kepala_sekolah: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Ya</SelectItem>
                                    <SelectItem value="0">Tidak</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['profile.lisensi_kepala_sekolah']} />
                        </div>

                        <div>
                            <Label>Diklat Kepengawasan</Label>
                            <Select
                                value={String(data.profile.diklat_kepengawasan ?? '0')}
                                onValueChange={(val) => setData('profile', { ...data.profile, diklat_kepengawasan: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Ya</SelectItem>
                                    <SelectItem value="0">Tidak</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['profile.diklat_kepengawasan']} />
                        </div>

                        <div>
                            <Label>Keahlian Braille</Label>
                            <Select
                                value={String(data.profile.keahlian_braille ?? '0')}
                                onValueChange={(val) => setData('profile', { ...data.profile, keahlian_braille: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Ya</SelectItem>
                                    <SelectItem value="0">Tidak</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['profile.keahlian_braille']} />
                        </div>

                        <div>
                            <Label>Keahlian Bahasa Isyarat</Label>
                            <Select
                                value={String(data.profile.keahlian_bahasa_isyarat ?? '0')}
                                onValueChange={(val) => setData('profile', { ...data.profile, keahlian_bahasa_isyarat: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Ya</SelectItem>
                                    <SelectItem value="0">Tidak</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['profile.keahlian_bahasa_isyarat']} />
                        </div>
                        <div>
                            <Label>NPWP</Label>
                            <Input
                                value={data.profile.npwp}
                                onChange={(e) =>
                                    setData('profile.npwp', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.npwp']} />
                        </div>
                        <div>
                            <Label>Nama Wajib Pajak</Label>
                            <Input
                                value={data.profile.nama_wajib_pajak}
                                onChange={(e) =>
                                    setData('profile.nama_wajib_pajak', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nama_wajib_pajak']} />
                        </div>
                        <div>
                            <Label>Bank</Label>
                            <Input
                                value={data.profile.bank}
                                onChange={(e) =>
                                    setData('profile.bank', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.bank']} />
                        </div>
                        <div>
                            <Label>No Rekening Bank</Label>
                            <Input
                                value={data.profile.nomor_rekening_bank}
                                onChange={(e) =>
                                    setData('profile.nomor_rekening_bank', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.nomor_rekening_bank']} />
                        </div>
                        <div>
                            <Label>Rekening Atas Nama</Label>
                            <Input
                                value={data.profile.rekening_atas_nama}
                                onChange={(e) =>
                                    setData('profile.rekening_atas_nama', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.rekening_atas_nama']} />
                        </div>
                        <div>
                            <Label>Lintang</Label>
                            <Input
                                value={data.profile.lintang}
                                onChange={(e) =>
                                    setData('profile.lintang', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.lintang']} />
                        </div>
                        <div>
                            <Label>Bujur</Label>
                            <Input
                                value={data.profile.bujur}
                                onChange={(e) =>
                                    setData('profile.bujur', e.target.value)
                                }
                            />
                            <InputError message={errors['profile.bujur']} />
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
                </div>
            </DialogContent>
        </Dialog>
    );
}

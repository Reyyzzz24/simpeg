import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<any>[] = [
    { accessorKey: 'nama', header: 'Nama' },
    { accessorKey: 'nip', header: 'NIP', cell: ({ row }) => row.original.profile?.nip || '-' },
    { accessorKey: 'nuptk', header: 'NUPTK', cell: ({ row }) => row.original.nuptk || '-' },
    { accessorKey: 'nik', header: 'NIK', cell: ({ row }) => row.original.profile?.nik || '-' },
    { accessorKey: 'no_kk', header: 'No KK', cell: ({ row }) => row.original.profile?.no_kk || '-' },
    { accessorKey: 'jenis_kelamin', header: 'L/P', cell: ({ row }) => row.original.jenis_kelamin || '-' },
    { accessorKey: 'tempat_tanggal_lahir', header: 'TTL', cell: ({ row }) => row.original.tempat_tanggal_lahir || '-' },

    // Kelompok Profil (Data Pribadi & Alamat)
    { accessorKey: 'agama', header: 'Agama', cell: ({ row }) => row.original.profile?.agama || '-' },
    { accessorKey: 'alamat_jalan', header: 'Alamat', cell: ({ row }) => row.original.profile?.alamat_jalan || '-' },
    { accessorKey: 'rt', header: 'RT', cell: ({ row }) => row.original.profile?.rt || '-' },
    { accessorKey: 'rw', header: 'RW', cell: ({ row }) => row.original.profile?.rw || '-' },
    { accessorKey: 'nama_dusun', header: 'Dusun', cell: ({ row }) => row.original.profile?.nama_dusun || '-' },
    { accessorKey: 'desa_kelurahan', header: 'Desa/Kel', cell: ({ row }) => row.original.profile?.desa_kelurahan || '-' },
    { accessorKey: 'kecamatan', header: 'Kecamatan', cell: ({ row }) => row.original.profile?.kecamatan || '-' },
    { accessorKey: 'kode_pos', header: 'Kode Pos', cell: ({ row }) => row.original.profile?.kode_pos || '-' },
    { accessorKey: 'telepon', header: 'Telepon', cell: ({ row }) => row.original.profile?.telepon || '-' },
    { accessorKey: 'hp', header: 'HP', cell: ({ row }) => row.original.profile?.hp || '-' },
    { accessorKey: 'email_pribadi', header: 'Email', cell: ({ row }) => row.original.profile?.email_pribadi || '-' },
    { accessorKey: 'nama_ibu_kandung', header: 'Ibu Kandung', cell: ({ row }) => row.original.profile?.nama_ibu_kandung || '-' },
    { accessorKey: 'kewarganegaraan', header: 'Warga Negara', cell: ({ row }) => row.original.profile?.kewarganegaraan || '-' },

    // Status & Pekerjaan
    {
        accessorKey: 'status_kerja', header: 'Status Kerja',
        cell: ({ row }) => <span className="capitalize">{row.original.status_kerja || '-'}</span>
    },
    {
        accessorKey: 'sub_role', header: 'Sub Role',
        cell: ({ row }) => <span className="capitalize">{row.original.sub_role || '-'}</span>
    },
    {
        id: 'position', header: 'Jabatan',
        accessorFn: (row) => (row.positions || []).map((p: any) => p.name).join(', '),
        cell: ({ row }) => (row.original.positions || []).map((p: any) => p.name).join(', ') || '-',
    },
    { accessorKey: 'jenis_ptk', header: 'Jenis PTK', cell: ({ row }) => row.original.profile?.jenis_ptk || '-' },
    { accessorKey: 'tugas_tambahan', header: 'Tugas Tambahan', cell: ({ row }) => row.original.tugas_tambahan || '-' },
    { accessorKey: 'pangkat_golongan', header: 'Pangkat/Gol', cell: ({ row }) => row.original.profile?.pangkat_golongan || '-' },

    // Data Keluarga & Kepegawaian
    { accessorKey: 'status_perkawinan', header: 'Status Kawin', cell: ({ row }) => row.original.profile?.status_perkawinan || '-' },
    { accessorKey: 'nama_suami_istri', header: 'Nama S/I', cell: ({ row }) => row.original.profile?.nama_suami_istri || '-' },
    { accessorKey: 'nip_suami_istri', header: 'NIP S/I', cell: ({ row }) => row.original.profile?.nip_suami_istri || '-' },
    { accessorKey: 'pekerjaan_suami_istri', header: 'Pekerjaan S/I', cell: ({ row }) => row.original.profile?.pekerjaan_suami_istri || '-' },
    { accessorKey: 'sk_cpns', header: 'SK CPNS', cell: ({ row }) => row.original.profile?.sk_cpns || '-' },
    { accessorKey: 'tanggal_cpns', header: 'Tgl CPNS', cell: ({ row }) => row.original.profile?.tanggal_cpns || '-' },
    { accessorKey: 'sk_pengangkatan', header: 'SK Angkat', cell: ({ row }) => row.original.profile?.sk_pengangkatan || '-' },
    { accessorKey: 'tmt_pengangkatan', header: 'TMT Angkat', cell: ({ row }) => row.original.profile?.tmt_pengangkatan || '-' },
    { accessorKey: 'lembaga_pengangkatan', header: 'Lembaga Angkat', cell: ({ row }) => row.original.profile?.lembaga_pengangkatan || '-' },
    { accessorKey: 'sumber_gaji', header: 'Sumber Gaji', cell: ({ row }) => row.original.profile?.sumber_gaji || '-' },
    { accessorKey: 'tmt_pns', header: 'TMT PNS', cell: ({ row }) => row.original.profile?.tmt_pns || '-' },

    // Administrasi & Sertifikasi
    { accessorKey: 'karpeg', header: 'Karpeg', cell: ({ row }) => row.original.profile?.karpeg || '-' },
    { accessorKey: 'karis_karsu', header: 'Karis/Karsu', cell: ({ row }) => row.original.profile?.karis_karsu || '-' },
    { accessorKey: 'nuks', header: 'NUKS', cell: ({ row }) => row.original.profile?.nuks || '-' },
    { accessorKey: 'lisensi_kepala_sekolah', header: 'Lisensi KS', cell: ({ row }) => row.original.profile?.lisensi_kepala_sekolah ? 'Ya' : 'Tidak' },
    { accessorKey: 'diklat_kepengawasan', header: 'Diklat Kepengawasan', cell: ({ row }) => row.original.profile?.diklat_kepengawasan ? 'Ya' : 'Tidak' },
    { accessorKey: 'keahlian_braille', header: 'Keahlian Braille', cell: ({ row }) => row.original.profile?.keahlian_braille ? 'Ya' : 'Tidak' },
    { accessorKey: 'keahlian_bahasa_isyarat', header: 'Bahasa Isyarat', cell: ({ row }) => row.original.profile?.keahlian_bahasa_isyarat ? 'Ya' : 'Tidak' },

    // Keuangan & Lokasi
    { accessorKey: 'npwp', header: 'NPWP', cell: ({ row }) => row.original.profile?.npwp || '-' },
    { accessorKey: 'nama_wajib_pajak', header: 'Nama Wajib Pajak', cell: ({ row }) => row.original.profile?.nama_wajib_pajak || '-' },
    { accessorKey: 'bank', header: 'Bank', cell: ({ row }) => row.original.profile?.bank || '-' },
    { accessorKey: 'nomor_rekening_bank', header: 'No Rek', cell: ({ row }) => row.original.profile?.nomor_rekening_bank || '-' },
    { accessorKey: 'rekening_atas_nama', header: 'Rek A/N', cell: ({ row }) => row.original.profile?.rekening_atas_nama || '-' },
    { accessorKey: 'koordinat', header: 'Koordinat', cell: ({ row }) => `${row.original.profile?.lintang || '-'}, ${row.original.profile?.bujur || '-'}` },
];

export function getColumns(opts?: {
    onEdit?: (r: any) => void;
    onView?: (r: any) => void;
    onDelete?: (r: any) => void;
}) {
    const actionCol: ColumnDef<any> = {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => opts?.onView?.(row.original)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detail
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => opts?.onEdit?.(row.original)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => opts?.onDelete?.(row.original)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    };

    return [...columns, actionCol];
}

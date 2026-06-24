// resources/js/pages/teacher/columns.tsx

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<any>[] = [
    { accessorKey: 'nama', header: 'Nama' },
    { accessorKey: 'tempat_tanggal_lahir', header: 'TTL', cell: ({ row }) => row.original.tempat_tanggal_lahir || '-' },
    { accessorKey: 'jenis_kelamin', header: 'L/P', cell: ({ row }) => row.original.jenis_kelamin || '-' },
    { accessorKey: 'nuptk', header: 'NUPTK', cell: ({ row }) => row.original.nuptk || '-' },
    { accessorKey: 'nip', header: 'NIP', cell: ({ row }) => row.original.profile?.nip || '-' },
    { accessorKey: 'nik', header: 'NIK', cell: ({ row }) => row.original.profile?.nik || '-' },
    { accessorKey: 'no_kk', header: 'No KK', cell: ({ row }) => row.original.profile?.no_kk || '-' },
    { accessorKey: 'sub_role', header: 'Sub Role', cell: ({ row }) => <span className="capitalize">{row.original.sub_role || '-'}</span> },
    { accessorKey: 'status_kerja', header: 'Status Kerja', cell: ({ row }) => <span className="capitalize">{row.original.status_kerja || '-'}</span> },
    {
        id: 'position',
        header: 'Jabatan',
        accessorFn: (row) => (row.positions || []).map((p: any) => p.name).join(', '),
        cell: ({ row }) => (row.original.positions || []).map((p: any) => p.name).join(', ') || '-',
    },
    { accessorKey: 'tugas_tambahan', header: 'Tugas Tambahan', cell: ({ row }) => row.original.tugas_tambahan || '-' },
    { accessorKey: 'mata_pelajaran', header: 'Mapel', cell: ({ row }) => row.original.mata_pelajaran || '-' },
    { accessorKey: 'pendidikan_terakhir', header: 'Pendidikan', cell: ({ row }) => row.original.pendidikan_terakhir || '-' },
    { accessorKey: 'tmt_sekolah', header: 'TMT Sekolah', cell: ({ row }) => row.original.tmt_sekolah || '-' },

    // Informasi Kontak & Alamat
    { accessorKey: 'agama', header: 'Agama', cell: ({ row }) => row.original.profile?.agama || '-' },
    { accessorKey: 'alamat', header: 'Alamat', cell: ({ row }) => `${row.original.profile?.alamat_jalan || ''} RT ${row.original.profile?.rt || '-'}/RW ${row.original.profile?.rw || '-'}` },
    { accessorKey: 'desa_kelurahan', header: 'Desa/Kel', cell: ({ row }) => row.original.profile?.desa_kelurahan || '-' },
    { accessorKey: 'kecamatan', header: 'Kecamatan', cell: ({ row }) => row.original.profile?.kecamatan || '-' },
    { accessorKey: 'hp', header: 'HP', cell: ({ row }) => row.original.profile?.hp || '-' },
    { accessorKey: 'email_pribadi', header: 'Email', cell: ({ row }) => row.original.profile?.email_pribadi || '-' },

    // Data Keluarga
    { accessorKey: 'nama_ibu_kandung', header: 'Ibu Kandung', cell: ({ row }) => row.original.profile?.nama_ibu_kandung || '-' },
    { accessorKey: 'status_perkawinan', header: 'Status Kawin', cell: ({ row }) => row.original.profile?.status_perkawinan || '-' },
    { accessorKey: 'nama_suami_istri', header: 'Suami/Istri', cell: ({ row }) => row.original.profile?.nama_suami_istri || '-' },

    // Kepegawaian & Sertifikasi
    { accessorKey: 'pangkat_golongan', header: 'Pangkat/Gol', cell: ({ row }) => row.original.profile?.pangkat_golongan || '-' },
    { accessorKey: 'jenis_ptk', header: 'Jenis PTK', cell: ({ row }) => row.original.profile?.jenis_ptk || '-' },
    { accessorKey: 'sk_pengangkatan', header: 'SK Pengangkatan', cell: ({ row }) => row.original.profile?.sk_pengangkatan || '-' },
    { accessorKey: 'tmt_pns', header: 'TMT PNS', cell: ({ row }) => row.original.profile?.tmt_pns || '-' },
    { accessorKey: 'lisensi_kepala_sekolah', header: 'Lisensi KS', cell: ({ row }) => row.original.profile?.lisensi_kepala_sekolah ? 'Ya' : 'Tidak' },
    { accessorKey: 'diklat_kepengawasan', header: 'Diklat Kepengawasan', cell: ({ row }) => row.original.profile?.diklat_kepengawasan ? 'Ya' : 'Tidak' },
    { accessorKey: 'keahlian_bahasa_isyarat', header: 'Bahasa Isyarat', cell: ({ row }) => row.original.profile?.keahlian_bahasa_isyarat ? 'Ya' : 'Tidak' },
    { accessorKey: 'nuks', header: 'NUKS', cell: ({ row }) => row.original.profile?.nuks || '-' },

    // Keuangan & Lainnya
    { accessorKey: 'npwp', header: 'NPWP', cell: ({ row }) => row.original.profile?.npwp || '-' },
    { accessorKey: 'bank', header: 'Bank', cell: ({ row }) => row.original.profile?.bank || '-' },
    { accessorKey: 'rekening', header: 'No. Rekening', cell: ({ row }) => row.original.profile?.nomor_rekening_bank || '-' },
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

                    <DropdownMenuItem
                        onClick={() => opts?.onView?.(row.original)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Detail
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => opts?.onEdit?.(row.original)}
                    >
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

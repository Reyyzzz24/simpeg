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
    {
        accessorKey: 'nama',
        header: 'Nama Guru',
    },
    {
        accessorKey: 'tempat_tanggal_lahir',
        header: 'Tempat Tanggal Lahir',
        cell: ({ row }) => row.original.tempat_tanggal_lahir || '-',
    },
    {
        accessorKey: 'jenis_kelamin',
        header: 'L/P',
        cell: ({ row }) => row.original.jenis_kelamin || '-',
    },
    {
        accessorKey: 'tingkat_pendidikan',
        header: 'Tingkat Pendidikan',
        cell: ({ row }) => row.original.tingkat_pendidikan || '-',
    },
    {
        accessorKey: 'tahun_lulus',
        header: 'Tahun Lulus',
        cell: ({ row }) => row.original.tahun_lulus || '-',
    },
    {
        accessorKey: 'tahun_masuk_kerja',
        header: 'Tahun Masuk Kerja',
        cell: ({ row }) => row.original.tahun_masuk_kerja || '-',
    },
    {
        accessorKey: 'nip',
        header: 'NIP',
        cell: ({ row }) => row.original.nip || '-',
    },
    {
        accessorKey: 'sub_role',
        header: 'Sub Role',
        cell: ({ row }) => row.original.sub_role || '-',
    },
    {
        accessorKey: 'status_kerja',
        header: 'Status Kerja',
        cell: ({ row }) => row.original.status_kerja || '-',
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
        cell: ({ row }) => row.original.jabatan || '-',
    },
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

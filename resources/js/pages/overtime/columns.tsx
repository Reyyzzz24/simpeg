import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export const getColumns = (opts: {
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
}): ColumnDef<any>[] => [
        {
            accessorKey: 'pegawai_nama',
            header: 'Nama Pegawai',
        },
        {
            accessorKey: 'tanggal',
            header: 'Tanggal',
            cell: ({ row }) => {
                const value = row.original.tanggal;

                return value
                    ? new Intl.DateTimeFormat('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    }).format(new Date(value))
                    : '-';
            },
        },
        {
            accessorKey: 'jam_mulai',
            header: 'Jam Mulai',
        },
        {
            accessorKey: 'jam_selesai',
            header: 'Jam Selesai',
        },
        {
            accessorKey: 'tugas',
            header: 'Tugas',
            cell: ({ row }) => (
                <div className="max-w-sm truncate" title={row.original.tugas}>
                    {row.original.tugas}
                </div>
            ),
        },
        {
            accessorKey: 'is_approved',
            header: 'Status',
            cell: ({ row }) =>
                row.original.is_approved ? (
                    <Badge className="bg-green-100 text-green-700">
                        Disetujui
                    </Badge>
                ) : (
                    <Badge variant="secondary">Menunggu</Badge>
                ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const record = row.original;

                return (
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

                            <DropdownMenuItem onClick={() => opts.onEdit(record)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => opts.onDelete(record)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

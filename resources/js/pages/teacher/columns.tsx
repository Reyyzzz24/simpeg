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
    {
        accessorKey: 'nama',
        header: 'Nama',
    },
    {
        accessorKey: 'nuptk',
        header: 'NUPTK',
    },
    {
        accessorKey: 'sub_role',
        header: 'Sub Role',
        cell: ({ row }) => {
            const value = row.original.sub_role;

            return <span className="capitalize">{value}</span>;
        },
    },
    {
        accessorKey: 'status_kerja',
        header: 'Status Kerja',
        cell: ({ row }) => (
            <span className="capitalize">
                {row.original.status_kerja === 'ptt' ? 'PTT' : 'Tetap'}
            </span>
        ),
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
    },
    {
        accessorKey: 'tarif_per_30_menit',
        header: 'Tarif /30 menit',
        cell: ({ row }) => {
            const val = row.original.tarif_per_30_menit;

            return val ? new Intl.NumberFormat('id-ID').format(val) : '0';
        },
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

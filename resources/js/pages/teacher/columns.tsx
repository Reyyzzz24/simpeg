// resources/js/pages/teacher/columns.tsx

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => opts?.onView?.(row.original)}
                    >
                        Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => opts?.onEdit?.(row.original)}
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => opts?.onDelete?.(row.original)}
                        className="text-destructive"
                    >
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    };

    return [...columns, actionCol];
}

// resources/js/pages/presence/columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { getEmployeeStatus } from './status';
import * as React from 'react';
import {
    MoreHorizontal,
    Edit,
    Eye,
    History
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'employee.name',
        header: 'Nama Pegawai',
    },
    {
        accessorKey: 'masuk_time',
        header: 'Jam Masuk',
        cell: ({ row }) => row.original.masuk_time || '--:--',
    },
    {
        accessorKey: 'pulang_time',
        header: 'Jam Pulang',
        cell: ({ row }) => row.original.pulang_time || '--:--',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status ?? '-';

            const colorMap: Record<string, string> = {
                hadir: 'bg-green-100 text-green-700',
                terlambat: 'bg-orange-100 text-orange-700',
                alpha: 'bg-red-100 text-red-700',
                izin: 'bg-blue-100 text-blue-700',
            };

            return (
                <Badge className={`capitalize ${colorMap[status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {status}
                </Badge>
            );
        }
    }
];

export function getColumns(opts?: {
    onEdit?: (r: any) => void;
    onDetail?: (r: any) => void;
    onHistory?: (r: any) => void;
    onView?: (r: any) => void;
    timeStatus?: any
}) {
    const actionCol: ColumnDef<any> = {
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

                        <DropdownMenuItem onClick={() => opts?.onDetail?.(record) ?? opts?.onView?.(record)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => opts?.onEdit?.(record)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => opts?.onHistory?.(record)}>
                            <History className="mr-2 h-4 w-4" />
                            Riwayat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };

    return [...columns, actionCol];
}
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const getColumns = (opts?: {
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
}): ColumnDef<any>[] => [
    {
        id: 'position_name',
        accessorFn: (row) => row.position?.name ?? '',
        header: 'Jabatan',
        cell: ({ row }) => row.original.position?.name ?? '-',
    },
    {
        id: 'component_name',
        accessorFn: (row) => row.component?.name ?? '',
        header: 'Nama Tunjangan',
        cell: ({ row }) => row.original.component?.name ?? '-',
    },
    {
        accessorKey: 'amount',
        header: 'Nominal',
        cell: ({ row }) =>
            `Rp ${Number(row.original.amount ?? 0).toLocaleString('id-ID')}`,
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
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            onClick={() => opts?.onEdit?.(record)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => opts?.onDelete?.(record)}
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

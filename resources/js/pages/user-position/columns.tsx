import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const getColumns = (opts: {
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
}): ColumnDef<any>[] => [
    {
        id: 'user',
        accessorFn: (row) => row.user?.name ?? '',
        header: 'User',
        cell: ({ row }) => row.original.user?.name ?? '-',
    },
    {
        id: 'position',
        accessorFn: (row) => (row.positions || []).map((p: any) => p.name).join(', '),
        header: 'Jabatan',
        cell: ({ row }) => (row.original.positions || []).map((p: any) => p.name).join(', ') || '-',
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

                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => opts.onEdit(record)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

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

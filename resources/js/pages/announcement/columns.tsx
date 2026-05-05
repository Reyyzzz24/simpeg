import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export const getColumns = (opts: {
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
}): ColumnDef<any>[] => [
    {
        accessorKey: 'title',
        header: 'Judul',
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.title}</div>
                <div className="max-w-md truncate text-sm text-muted-foreground">
                    {row.original.content}
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Kategori',
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.category}
            </Badge>
        ),
    },
    {
        accessorKey: 'published_at',
        header: 'Tanggal Terbit',
        cell: ({ row }) => row.original.published_at ?? '-',
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) =>
            row.original.is_active ? (
                <Badge className="bg-green-100 text-green-700">Aktif</Badge>
            ) : (
                <Badge variant="secondary">Nonaktif</Badge>
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
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => opts.onEdit(record)}>
                            <Pencil className="mr-2 h-4 w-4" />
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

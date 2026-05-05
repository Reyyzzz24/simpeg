import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreHorizontal } from 'lucide-react'

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'name',
        header: 'Nama Komponen',
        cell: ({ row }) => (
            <span className="font-medium">
                {row.original.name}
            </span>
        ),
    },

    {
        accessorKey: 'type',
        header: 'Tipe',
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.type ?? 'fixed'}
            </Badge>
        ),
    },

    {
        accessorKey: 'default_amount',
        header: 'Default',
        cell: ({ row }) => (
            <span className="text-sm">
                {Number(row.original.default_amount ?? 0).toLocaleString('id-ID')}
            </span>
        ),
    },
]

export function getColumns(opts?: {
    onEdit?: (r: any) => void
    onDelete?: (r: any) => void
    onView?: (r: any) => void
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

                    <DropdownMenuItem onClick={() => opts?.onEdit?.(row.original)}>
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => opts?.onDelete?.(row.original)}
                        className="text-red-600"
                    >
                        Hapus
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        ),
    }

    return [...columns, actionCol]
}
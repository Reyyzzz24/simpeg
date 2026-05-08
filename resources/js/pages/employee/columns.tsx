import { ColumnDef } from '@tanstack/react-table'
import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Helper untuk format mata uang Rupiah
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0)
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama'
    },
    {
        accessorKey: 'nip',
        header: 'NIP',
        cell: ({ row }) => row.original.nip || '-'
    },
    {
        accessorKey: 'sub_role',
        header: 'Sub Role',
        cell: ({ row }) => (
            <Badge variant="secondary" className="uppercase">
                {row.original.sub_role}
            </Badge>
        )
    },
    {
        accessorKey: 'status_kerja',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.status_kerja}
            </Badge>
        )
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
        // Mengambil nama jabatan dari hasil map di Controller[cite: 8]
        cell: ({ row }) => row.original.jabatan || '-'
    },
    {
        accessorKey: 'gaji_pokok',
        header: 'Gaji Pokok',
        cell: ({ row }) => formatCurrency(row.original.gaji_pokok),
    },
    {
        accessorKey: 'transport_harian',
        header: 'Transport',
        cell: ({ row }) => formatCurrency(row.original.transport_harian),
    },
    {
        accessorKey: 'tunjangan_jabatan',
        header: 'Tunj. Jabatan',
        cell: ({ row }) => formatCurrency(row.original.tunjangan_jabatan),
    },
]

export function getColumns(opts?: {
    onEdit?: (r: any) => void
    onView?: (r: any) => void
    onDelete?: (r: any) => void
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
    }

    return [...columns, actionCol]
}
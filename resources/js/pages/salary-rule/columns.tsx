import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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

export const getColumns = (opts: any): ColumnDef<any>[] => [
    /**
     * ROLE
     */
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
            <span className="font-medium text-slate-700 capitalize">
                {row.original.role}
            </span>
        ),
    },

    /**
     * SUB ROLE
     */
    {
        accessorKey: 'sub_role',
        header: 'Sub Role',
        cell: ({ row }) => (
            <span className="text-slate-600">{row.original.sub_role}</span>
        ),
    },
    {
        accessorKey: 'status_kerja',
        header: 'Status Kerja',
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.status_kerja === 'ptt' ? 'PTT' : 'Tetap'}
            </Badge>
        ),
    },

    /**
     * LIST NAMA KOMPONEN (ONLY NAME)
     */
    {
        id: 'components_name',
        header: 'Komponen',
        cell: ({ row }) => {
            const items = row.original.salary_rule_components ?? [];

            return (
                <div className="flex flex-wrap gap-1">
                    {items.map((c: any) => (
                        <Badge key={c.id} variant="outline">
                            {c.component?.name}
                        </Badge>
                    ))}
                </div>
            );
        },
    },

    /**
     * TYPE KOMPONEN
     */
    {
        id: 'components_type',
        header: 'Tipe',
        cell: ({ row }) => {
            const items = row.original.salary_rule_components ?? [];

            return (
                <div className="flex flex-wrap gap-1">
                    {items.map((c: any) => (
                        <Badge key={c.id} variant="secondary">
                            {c.amount_type === 'formula'
                                ? c.formula_type === 'jam_kerja'
                                    ? `Formula Jam Kerja / ${c.formula_interval_minutes ?? 30} menit`
                                    : 'Formula Hadir'
                                : c.amount_type}
                        </Badge>
                    ))}
                </div>
            );
        },
    },

    /**
     * AMOUNT KOMPONEN
     */
    {
        id: 'components_amount',
        header: 'Nominal',
        cell: ({ row }) => {
            const items = row.original.salary_rule_components ?? [];

            // Helper untuk format Rupiah agar tidak mengulang kode
            const formatRupiah = (value: any) =>
                new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(Number(value));

            return (
                <div className="flex flex-wrap gap-1">
                    {items.map((c: any) => {
                        let display = '';

                        if (c.amount_type === 'percentage') {
                            display = `${Number(c.amount)}%`;
                        } else if (
                            c.amount_type === 'fixed' ||
                            c.amount_type === 'formula'
                        ) {
                            // Sekarang fixed dan formula menggunakan format yang sama
                            display = formatRupiah(c.amount);
                        } else {
                            display = String(c.amount);
                        }

                        return (
                            <Badge
                                key={c.id}
                                className="bg-slate-800 text-white"
                            >
                                {display}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
    },

    /**
     * STATUS
     */
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.original.is_active;

            return (
                <Badge
                    variant={isActive ? 'default' : 'destructive'}
                    className={
                        isActive ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                    }
                >
                    {isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
            );
        },
    },

    /**
     * ACTIONS
     */
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => opts?.onEdit?.(data)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => {
                                if (
                                    confirm('Yakin ingin menghapus aturan ini?')
                                ) {
                                    opts?.onDelete?.(data);
                                }
                            }}
                            className="text-red-600"
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

import type { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Trash2, Settings2, Edit } from 'lucide-react';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const baseColumns: ColumnDef<any>[] = [
    {
        id: 'user_name',
        accessorFn: (row) => row.user?.name ?? '',
        header: 'Nama',
        cell: ({ row }) => row.original.user?.name ?? '-',
    },
    {
        accessorKey: 'user_type',
        header: 'Jenis',
        cell: ({ row }) => row.original.user_type ?? '-',
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
        cell: ({ row }) => row.original.jabatan || '-',
    },
    {
        accessorKey: 'periode',
        header: 'Periode',
    },
    {
        header: 'Adjustment',
        cell: ({ row }) => {
            const adjustments = row.original.adjustments ?? [];
            const totalAdj = Number(row.original.total_adjustment ?? 0);

            if (!adjustments.length) {
                return (
                    <span className="text-xs text-muted-foreground">
                        Tidak ada
                    </span>
                );
            }

            return (
                <div className="flex flex-col gap-1">
                    <span
                        className={`font-bold ${totalAdj < 0 ? 'text-red-600' : 'text-green-600'}`}
                    >
                        {totalAdj > 0 ? '+' : ''} Rp{' '}
                        {totalAdj.toLocaleString('id-ID')}
                    </span>

                    <div className="flex flex-wrap gap-1">
                        {adjustments.map((adj: any) => (
                            <TooltipProvider key={adj.id}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer px-1 py-0 text-[10px]"
                                        >
                                            {adj.component?.name ?? 'Adj'}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{adj.note ?? '-'}</p>
                                        <p className="font-bold">
                                            Rp{' '}
                                            {Number(adj.amount).toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'total_gaji',
        header: 'Total Gaji',
        cell: ({ row }) => (
            <span>
                Rp{' '}
                {Number(row.original.total_gaji ?? 0).toLocaleString('id-ID')}
            </span>
        ),
    },
];

export function getPayrollColumns(opts?: {
    onDetail?: (r: any) => void;
    onEditAdjustment?: (adjustments: any[]) => void;
    onDeleteAdjustment?: (adjustments: any[]) => void;
    onRegenerate?: (record: any) => void;
}) {
    return [
        ...baseColumns,
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }: { row: Row<any> }) => {
                const record = row.original;
                const adjustments = record.adjustments ?? [];

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => opts?.onDetail?.(record)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Detail
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => opts?.onRegenerate?.(record)}
                            >
                                <Settings2 className="mr-2 h-4 w-4" />
                                Re-generate Gaji
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {adjustments.length > 0 ? (
                                <>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            opts?.onEditAdjustment?.(
                                                adjustments,
                                            )
                                        }
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Adjustment
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            opts?.onDeleteAdjustment?.(
                                                adjustments,
                                            )
                                        }
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus Adjustment
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem
                                    disabled
                                    className="text-muted-foreground"
                                >
                                    Tidak ada adjustment
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}

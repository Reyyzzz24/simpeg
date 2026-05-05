import type { ColumnDef } from '@tanstack/react-table';

export const getSalaryReportColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: 'nama',
        header: 'Nama',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'periode',
        header: 'Periode',
    },
    {
        accessorKey: 'total_adjustment',
        header: 'Adjustment',
        cell: ({ row }) => {
            const value = Number(row.original.total_adjustment ?? 0);

            return (
                <span className={value < 0 ? 'text-red-600' : 'text-green-600'}>
                    {value > 0 ? '+' : ''}Rp {value.toLocaleString('id-ID')}
                </span>
            );
        },
    },
    {
        accessorKey: 'total_gaji',
        header: 'Total Gaji',
        cell: ({ row }) =>
            `Rp ${Number(row.original.total_gaji ?? 0).toLocaleString('id-ID')}`,
    },
];

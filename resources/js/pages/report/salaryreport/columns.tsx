import type { ColumnDef } from '@tanstack/react-table';
import { formatReportLabel } from '../lib/format-label';

export const getSalaryReportColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: 'nama',
        header: 'Nama',
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => formatReportLabel(row.original.role),
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
        cell: ({ row }) => row.original.jabatan ?? '-',
    },
    {
        accessorKey: 'periode',
        header: 'Periode',
    },
    {
        accessorKey: 'details',
        header: 'Detail Payroll',
        cell: ({ row }) => {
            const details = row.original.details ?? [];

            return (
                <div className="flex flex-col">
                    {details.map((d: any, i: number) => (
                        // Tambahkan border-b dan padding vertikal untuk garis pemisah
                        <div
                            key={i}
                            className="border-b py-1 text-sm last:border-0"
                        >
                            {d.komponen}
                        </div>
                    ))}
                </div>
            );
        },
    },
    {
        id: 'nominal',
        header: () => <div className="text-center">Nominal</div>,
        cell: ({ row }) => {
            const details = row.original.details ?? [];
            return (
                <div className="flex w-full flex-col items-center">
                    {details.map((d: any, i: number) => (
                        <div
                            key={i}
                            className="w-full border-b py-1 text-center text-sm last:border-0"
                        >
                            Rp {Number(d.amount ?? 0).toLocaleString('id-ID')}
                        </div>
                    ))}
                </div>
            );
        },
        meta: {
            className: 'text-center',
        },
    },
    {
        accessorKey: 'total_gaji',
        header: 'Total Gaji',
        cell: ({ row }) =>
            `Rp ${Number(row.original.total_gaji ?? 0).toLocaleString('id-ID')}`,
    },
];

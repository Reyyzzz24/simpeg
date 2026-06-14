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
                        <div key={i} className="text-sm py-1 border-b last:border-0">
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
                <div className="flex flex-col items-center w-full">
                    {details.map((d: any, i: number) => (
                        <div key={i} className="text-sm py-1 border-b w-full text-center last:border-0">
                            Rp {Number(d.amount ?? 0).toLocaleString('id-ID')}
                        </div>
                    ))}
                </div>
            );
        },
        meta: {
            className: "text-center"
        }
    },
    {
        accessorKey: 'total_gaji',
        header: 'Total Gaji',
        cell: ({ row }) =>
            `Rp ${Number(row.original.total_gaji ?? 0).toLocaleString('id-ID')}`,
    },
];

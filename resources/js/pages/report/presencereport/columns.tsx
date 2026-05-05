import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';

export const getReportColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: 'nama',
        header: 'Nama',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'tanggal',
        header: 'Tanggal',
    },
    {
        accessorKey: 'jam_masuk',
        header: 'Masuk',
    },
    {
        accessorKey: 'jam_pulang',
        header: 'Pulang',
    },
    {
        accessorKey: 'jam_kerja',
        header: 'Jam Kerja',
        cell: ({ row }) =>
            `${Number(row.original.jam_kerja ?? 0).toFixed(2)} jam`,
    },
    {
        accessorKey: 'status_disiplin',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status_disiplin ?? '-';
            const colorMap: Record<string, string> = {
                hadir: 'bg-green-100 text-green-700',
                terlambat: 'bg-orange-100 text-orange-700',
                alpha: 'bg-red-100 text-red-700',
                izin: 'bg-blue-100 text-blue-700',
                sakit: 'bg-purple-100 text-purple-700',
            };

            return (
                <Badge
                    className={`capitalize ${colorMap[status] ?? 'bg-gray-100 text-gray-700'}`}
                >
                    {status}
                </Badge>
            );
        },
    },
];

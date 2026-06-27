import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatReportLabel } from '../lib/format-label';

export const getReportColumns = (type: string = 'all'): ColumnDef<any>[] => {
    const columns: ColumnDef<any>[] = [
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
                const statusKey = String(status).toLowerCase();
                const colorMap: Record<string, string> = {
                    hadir: 'bg-green-100 text-green-700',
                    terlambat: 'bg-orange-100 text-orange-700',
                    alpha: 'bg-red-100 text-red-700',
                    izin: 'bg-blue-100 text-blue-700',
                    sakit: 'bg-purple-100 text-purple-700',
                };

                return (
                    <Badge
                        className={
                            colorMap[statusKey] ?? 'bg-gray-100 text-gray-700'
                        }
                    >
                        {formatReportLabel(status)}
                    </Badge>
                );
            },
        },
    ];

    // Add teacher-specific columns when filtering by `guru`
    if (type === 'guru') {
        columns.push(
            {
                accessorKey: 'total_jam_ajar',
                header: 'Total Jam Ajar',
                cell: ({ row }) =>
                    `${Number(row.original.total_jam_ajar ?? 0).toFixed(2)} jam`,
            },
            {
                accessorKey: 'jenis_ajar',
                header: 'Jenis Ajar',
                cell: ({ row }) => formatReportLabel(row.original.jenis_ajar),
            },
            {
                accessorKey: 'jam_normatif_teori',
                header: 'Normatif Teori',
                cell: ({ row }) =>
                    `${Number(row.original.jam_normatif_teori ?? 0).toFixed(2)} jam`,
            },
            {
                accessorKey: 'jam_produktif_teori',
                header: 'Produktif Teori',
                cell: ({ row }) =>
                    `${Number(row.original.jam_produktif_teori ?? 0).toFixed(2)} jam`,
            },
            {
                accessorKey: 'jam_produktif_praktik',
                header: 'Produktif Praktik',
                cell: ({ row }) =>
                    `${Number(row.original.jam_produktif_praktik ?? 0).toFixed(2)} jam`,
            },
            {
                accessorKey: 'total_jam_produktif',
                header: 'Total Produktif',
                cell: ({ row }) =>
                    `${Number(row.original.total_jam_produktif ?? 0).toFixed(2)} jam`,
            },
            {
                accessorKey: 'jam_eskul',
                header: 'Eskul',
                cell: ({ row }) =>
                    `${Number(row.original.jam_eskul ?? 0).toFixed(2)} jam`,
            },
            {
                accessorKey: 'ada_piket',
                header: 'Ada Piket',
                cell: ({ row }) => (row.original.ada_piket ? 'Ya' : 'Tidak'),
            },
            {
                accessorKey: 'selisih_jam_ajar_menit',
                header: 'Selisih Jam Ajar (menit)',
                cell: ({ row }) =>
                    `${Number(row.original.selisih_jam_ajar_menit ?? 0)} menit`,
            },
            {
                accessorKey: 'status_validasi_ajar',
                header: 'Status Validasi Ajar',
                cell: ({ row }) => {
                    const status = row.original.status_validasi_ajar ?? '-';
                    const statusKey = String(status).toLowerCase();
                    const colorMap: Record<string, string> = {
                        valid: 'bg-green-100 text-green-700',
                        pending: 'bg-yellow-100 text-yellow-700',
                        rejected: 'bg-red-100 text-red-700',
                    };

                    return (
                        <Badge
                            className={
                                colorMap[statusKey] ??
                                'bg-gray-100 text-gray-700'
                            }
                        >
                            {formatReportLabel(status)}
                        </Badge>
                    );
                },
            },
        );
    }

    return columns;
};

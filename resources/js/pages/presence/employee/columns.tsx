import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { SelfPresence } from './types';
import { formatTeachingHours } from './types';

const statusBadge = (status: string | null) => {
    const normalized = (status ?? 'BELUM LENGKAP').toLowerCase();
    const colorMap: Record<string, string> = {
        hadir: 'bg-green-100 text-green-700',
        terlambat: 'bg-orange-100 text-orange-700',
        alpha: 'bg-red-100 text-red-700',
        izin: 'bg-blue-100 text-blue-700',
        sakit: 'bg-sky-100 text-sky-700',
    };

    return (
        <Badge
            className={`capitalize ${
                colorMap[normalized] ?? 'bg-gray-100 text-gray-700'
            }`}
        >
            {status ?? 'Belum Lengkap'}
        </Badge>
    );
};

const teachingBadge = (status: string | null) => {
    if (!status) {
        return '-';
    }

    const colorMap: Record<string, string> = {
        sesuai: 'bg-green-100 text-green-700',
        melebihi_durasi: 'bg-red-100 text-red-700',
        belum_lengkap: 'bg-orange-100 text-orange-700',
    };
    const labelMap: Record<string, string> = {
        sesuai: 'Sesuai',
        melebihi_durasi: 'Melebihi Durasi',
        belum_lengkap: 'Belum Lengkap',
    };

    return (
        <Badge className={colorMap[status] ?? 'bg-gray-100 text-gray-700'}>
            {labelMap[status] ?? status}
        </Badge>
    );
};

export const selfPresenceColumns: ColumnDef<SelfPresence>[] = [
    {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.tanggal}</span>
        ),
    },
    {
        accessorKey: 'jam_masuk',
        header: 'Masuk',
        cell: ({ row }) => row.original.jam_masuk ?? '--:--',
    },
    {
        accessorKey: 'jam_pulang',
        header: 'Pulang',
        cell: ({ row }) => row.original.jam_pulang ?? '--:--',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => statusBadge(row.original.status),
    },
    {
        accessorKey: 'total_jam_ajar',
        header: 'Jam Ajar',
        cell: ({ row }) => formatTeachingHours(row.original),
    },
    {
        accessorKey: 'ada_piket',
        header: 'Piket',
        cell: ({ row }) => (row.original.ada_piket ? 'Ya' : '-'),
    },
    {
        accessorKey: 'status_validasi_ajar',
        header: 'Validasi',
        cell: ({ row }) => teachingBadge(row.original.status_validasi_ajar),
    },
];

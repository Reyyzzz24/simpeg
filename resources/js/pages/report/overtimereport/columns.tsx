import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';

export const getOvertimeReportColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: 'pegawai_nama',
        header: 'Nama Pegawai',
    },
    {
        accessorKey: 'pegawai_nip',
        header: 'NIP',
        cell: ({ row }) => row.original.pegawai_nip ?? '-',
    },
    {
        accessorKey: 'tanggal',
        header: 'Tanggal',
    },
    {
        accessorKey: 'jam_mulai',
        header: 'Mulai',
    },
    {
        accessorKey: 'jam_selesai',
        header: 'Selesai',
    },
    {
        accessorKey: 'durasi_jam',
        header: 'Durasi',
        cell: ({ row }) =>
            `${Number(row.original.durasi_jam ?? 0).toFixed(2)} jam`,
    },
    {
        accessorKey: 'tugas',
        header: 'Tugas',
        cell: ({ row }) => (
            <div className="max-w-sm truncate" title={row.original.tugas}>
                {row.original.tugas}
            </div>
        ),
    },
    {
        accessorKey: 'is_approved',
        header: 'Status',
        cell: ({ row }) =>
            row.original.is_approved ? (
                <Badge className="bg-green-100 text-green-700">
                    Disetujui
                </Badge>
            ) : (
                <Badge variant="secondary">Menunggu</Badge>
            ),
    },
];

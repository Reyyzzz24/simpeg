import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, UserRound } from 'lucide-react';
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

export const getOvertimeReportColumns = (opts?: {
    onUserReport?: (record: any) => void;
}): ColumnDef<any>[] => [
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
                <Badge className="bg-green-100 text-green-700">Disetujui</Badge>
            ) : (
                <Badge variant="secondary">Menunggu</Badge>
            ),
    },
    ...(opts?.onUserReport
        ? [
              {
                  id: 'actions',
                  header: 'Aksi',
                  cell: ({ row }: any) => (
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
                                  onClick={() =>
                                      opts.onUserReport?.(row.original)
                                  }
                              >
                                  <UserRound className="mr-2 h-4 w-4" />
                                  Laporan Per User
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  ),
              },
          ]
        : []),
];

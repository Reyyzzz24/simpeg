import type { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { CalendarDays, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OvertimeHistory = {
    date: string;
    jam_mulai: string;
    jam_selesai: string;
    tugas: string;
    status: string;
};

const columns: ColumnDef<OvertimeHistory>[] = [
    {
        accessorKey: 'date',
        header: 'Tanggal',
    },
    {
        accessorKey: 'jam_mulai',
        header: 'Mulai',
        cell: ({ row }) => (
            <span className="font-mono">{row.original.jam_mulai}</span>
        ),
    },
    {
        accessorKey: 'jam_selesai',
        header: 'Selesai',
        cell: ({ row }) => (
            <span className="font-mono">{row.original.jam_selesai}</span>
        ),
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
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const approved = row.original.status === 'Disetujui';

            return (
                <Badge
                    className={
                        approved ? 'bg-green-100 text-green-700' : undefined
                    }
                    variant={approved ? 'default' : 'secondary'}
                >
                    {row.original.status}
                </Badge>
            );
        },
    },
];

type Props = {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
};

export default function HistoryOvertimeModal({
    isOpen,
    onClose,
    record,
}: Props) {
    const [month, setMonth] = useState(() => {
        const date = new Date();

        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState<OvertimeHistory[]>([]);

    const stats = useMemo(() => {
        const approved = historyData.filter(
            (item) => item.status === 'Disetujui',
        ).length;

        return {
            total: historyData.length,
            approved,
            pending: historyData.length - approved,
        };
    }, [historyData]);

    const fetchHistory = useCallback(async () => {
        if (!record?.pegawai_id) {
            setHistoryData([]);

            return;
        }

        setLoading(true);

        try {
            const response = await axios.get('/overtime/history-data', {
                params: {
                    user_id: record.pegawai_id,
                    month,
                },
            });
            setHistoryData(response.data);
        } catch (error) {
            console.error('Gagal mengambil riwayat lembur:', error);
            setHistoryData([]);
        } finally {
            setLoading(false);
        }
    }, [month, record]);

    useEffect(() => {
        if (!isOpen || !record) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            void fetchHistory();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchHistory, isOpen, record]);

    if (!record) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CalendarDays className="h-6 w-6 text-cyan-600" />
                        Riwayat Lembur Bulanan
                    </DialogTitle>
                    <DialogDescription>
                        Frekuensi lembur milik{' '}
                        <strong>{record.pegawai_nama ?? 'Pegawai/Guru'}</strong>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <Label className="mb-1 block text-xs text-muted-foreground uppercase">
                            Nama
                        </Label>
                        <p className="text-lg font-semibold">
                            {record.pegawai_nama ?? '-'}
                        </p>
                    </div>
                    <div className="w-full sm:w-48">
                        <Label className="mb-1 block text-xs text-muted-foreground uppercase">
                            Periode Bulan
                        </Label>
                        <Input
                            type="month"
                            className="h-9"
                            value={month}
                            onChange={(event) => setMonth(event.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Total Frekuensi"
                        value={stats.total}
                        color="bg-slate-50 border-slate-200"
                    />
                    <StatCard
                        title="Disetujui"
                        value={stats.approved}
                        color="bg-green-50 border-green-200"
                    />
                    <StatCard
                        title="Menunggu"
                        value={stats.pending}
                        color="bg-yellow-50 border-yellow-200"
                    />
                </div>

                <div className="relative mt-4 min-h-[350px]">
                    {loading ? (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-md bg-white/80">
                            <Loader2 className="h-10 w-10 animate-spin text-cyan-600" />
                            <p className="mt-2 text-sm font-medium">
                                Memuat data lembur...
                            </p>
                        </div>
                    ) : historyData.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={historyData}
                            searchKey="date"
                            searchPlaceholder="Cari tanggal..."
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-20">
                            <p className="text-muted-foreground">
                                Tidak ditemukan data lembur untuk periode{' '}
                                {month}.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button onClick={onClose}>Tutup</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: number;
    color: string;
}) {
    return (
        <Card className={`${color} border shadow-sm`}>
            <CardContent className="flex flex-col items-center p-4 md:items-start">
                <p className="text-center text-xs font-semibold uppercase opacity-70 md:text-left">
                    {title}
                </p>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

import type { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { Loader2, CalendarDays } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 1. Definisi Tipe Data untuk Baris Tabel
export type PresenceHistory = {
    date: string;
    masuk_time: string;
    pulang_time: string;
    status: string;
};

// 2. Definisi Konfigurasi Kolom DataTable
export const columns: ColumnDef<PresenceHistory>[] = [
    {
        accessorKey: 'date',
        header: 'Tanggal',
    },
    {
        accessorKey: 'masuk_time',
        header: 'Masuk',
        cell: ({ row }) => (
            <span className="font-mono">{row.getValue('masuk_time')}</span>
        ),
    },
    {
        accessorKey: 'pulang_time',
        header: 'Pulang',
        cell: ({ row }) => (
            <span className="font-mono">{row.getValue('pulang_time')}</span>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = (row.getValue('status') as string) || '';
            const isHadir = status.toUpperCase() === 'HADIR';

            return (
                <Badge
                    variant={isHadir ? 'default' : 'destructive'}
                    className={isHadir ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                    {status}
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

export default function HistoryPresenceModal({
    isOpen,
    onClose,
    record,
}: Props) {
    const [month, setMonth] = useState(() => {
        const d = new Date();

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState<PresenceHistory[]>([]);
    const stats = useMemo(() => {
        const counts = {
            total: historyData.length,
            hadir: 0,
            izin: 0,
            sakit: 0,
            alpha: 0,
            belum: 0,
        };
        historyData.forEach((item) => {
            const s = item.status?.toUpperCase();

            if (s === 'HADIR') {
                counts.hadir++;
            } else if (s === 'IZIN') {
                counts.izin++;
            } else if (s === 'SAKIT') {
                counts.sakit++;
            } else if (s === 'ALPHA') {
                counts.alpha++;
            } else {
                counts.belum++;
            }
        });

        return counts;
    }, [historyData]);

    const fetchHistory = useCallback(async () => {
        if (!record) {
            return;
        }

        // Mencoba mengambil user_id dari berbagai kemungkinan struktur record
        const userId =
            record.user_id ||
            record.employee?.user_id ||
            record.employee?.id ||
            record.id;

        if (!userId) {
            console.error('User ID tidak ditemukan pada record:', record);
            setHistoryData([]);

            return;
        }

        setLoading(true);

        try {
            const response = await axios.get('/presence/history-data', {
                params: {
                    user_id: userId,
                    month: month,
                },
            });
            setHistoryData(response.data);
        } catch (error) {
            console.error('Gagal mengambil riwayat:', error);
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
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CalendarDays className="h-6 w-6 text-teal-600" />
                        Riwayat Kehadiran Bulanan
                    </DialogTitle>
                    <DialogDescription>
                        Data absensi milik{' '}
                        <strong>{record.employee?.name || 'Pegawai'}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <Label className="mb-1 block text-xs text-muted-foreground uppercase">
                            Nama Pegawai
                        </Label>
                        <p className="text-lg font-semibold">
                            {record.employee?.name ?? '-'}
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
                            onChange={(e) => setMonth(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <StatCard
                        title="Total"
                        value={stats.total}
                        color="bg-slate-50 border-slate-200"
                    />
                    <StatCard
                        title="Hadir"
                        value={stats.hadir}
                        color="bg-green-50 border-green-200"
                    />
                    <StatCard
                        title="Izin"
                        value={stats.izin}
                        color="bg-blue-50 border-blue-200"
                    />
                    <StatCard
                        title="Sakit"
                        value={stats.sakit}
                        color="bg-orange-50 border-orange-200"
                    />
                    <StatCard
                        title="Alpha"
                        value={stats.alpha}
                        color="bg-red-50 border-red-200"
                    />
                    <StatCard
                        title="Belum"
                        value={stats.belum}
                        color="bg-slate-100 border-slate-200"
                    />
                </div>

                <div className="relative mt-4 min-h-[350px]">
                    {loading ? (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-md bg-white/80">
                            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                            <p className="mt-2 text-sm font-medium">
                                Memuat data absensi...
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
                                Tidak ditemukan data absensi untuk periode{' '}
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

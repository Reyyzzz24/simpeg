import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Clock, Filter, Timer, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import UserReportModal from '../partials/user-report-modal';
import { getOvertimeReportColumns } from './columns';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Lembur', href: '/report/overtime' },
];

export default function OvertimeReportIndex({ data, stats, filters }: any) {
    const [start, setStart] = useState(filters?.start_date ?? '');
    const [end, setEnd] = useState(filters?.end_date ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'all');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const selectedUserRows = useMemo(() => {
        if (!selectedUser) {
            return [];
        }

        return (data ?? []).filter(
            (item: any) =>
                String(item.user_id) === String(selectedUser.user_id),
        );
    }, [data, selectedUser]);

    const selectedUserStats = useMemo(() => {
        const approved = selectedUserRows.filter(
            (item: any) => item.is_approved,
        ).length;
        const pending = selectedUserRows.length - approved;
        const totalHours = selectedUserRows.reduce(
            (sum: number, item: any) => sum + Number(item.durasi_jam ?? 0),
            0,
        );

        return {
            total: selectedUserRows.length,
            approved,
            pending,
            totalHours,
        };
    }, [selectedUserRows]);

    const handleFilter = () => {
        router.get('/report/overtime', {
            start_date: start,
            end_date: end,
            status,
        });
        setFilterOpen(false);
    };

    return (
        <>
            <Head title="Laporan Lembur" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Laporan Lembur"
                    subtitle="Sistem Informasi Kepegawaian"
                    description="Rekap lembur pegawai berdasarkan periode dan status persetujuan."
                    gradient="bg-linear-to-r from-cyan-600 to-blue-500"
                    icon={<Timer className="size-20 text-white" />}
                />

                <div className="grid gap-6 md:grid-cols-4">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                <Timer />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Lembur
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.total ?? 0}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <CheckCircle2 />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Disetujui
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.approved ?? 0}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
                                <Clock />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Menunggu
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.pending ?? 0}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                                <Clock />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Jam
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {Number(stats?.total_hours ?? 0).toFixed(2)}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">
                        Detail Laporan Lembur
                    </h2>

                    <DataTable
                        data={data ?? []}
                        columns={getOvertimeReportColumns({
                            onUserReport: setSelectedUser,
                        })}
                        searchKey="pegawai_nama"
                        searchPlaceholder="Cari nama pegawai..."
                        actions={
                            <div className="flex flex-wrap items-center gap-2">
                                <Popover
                                    open={filterOpen}
                                    onOpenChange={setFilterOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            <Filter className="mr-2 size-4" />
                                            Filter
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Tanggal Mulai
                                            </label>
                                            <Input
                                                type="date"
                                                value={start}
                                                onChange={(event) =>
                                                    setStart(event.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Tanggal Akhir
                                            </label>
                                            <Input
                                                type="date"
                                                value={end}
                                                onChange={(event) =>
                                                    setEnd(event.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Status
                                            </label>
                                            <Select
                                                value={status}
                                                onValueChange={setStatus}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Semua
                                                    </SelectItem>
                                                    <SelectItem value="approved">
                                                        Disetujui
                                                    </SelectItem>
                                                    <SelectItem value="pending">
                                                        Menunggu
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleFilter}
                                        >
                                            Terapkan Filter
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            start_date: start,
                                            end_date: end,
                                            status,
                                        });

                                        window.location.href = `/report/overtime/export?${params.toString()}`;
                                    }}
                                >
                                    <Download className="mr-2 size-4" />
                                    Export CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            start_date: start,
                                            end_date: end,
                                            status,
                                        });

                                        window.open(
                                            `/report/overtime/print?${params.toString()}`,
                                            '_blank',
                                        );
                                    }}
                                >
                                    <Download className="mr-2 size-4" />
                                    Print / PDF
                                </Button>
                            </div>
                        }
                    />
                </div>

                <UserReportModal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    title="Laporan Lembur Per User"
                    description="Data lembur per user sesuai filter laporan yang sedang aktif."
                    userName={selectedUser?.pegawai_nama ?? '-'}
                    periodLabel={
                        start || end
                            ? `${start || 'Awal'} - ${end || 'Akhir'}`
                            : 'Semua Periode'
                    }
                    data={selectedUserRows}
                    columns={getOvertimeReportColumns()}
                    stats={[
                        {
                            title: 'Total',
                            value: selectedUserStats.total,
                            color: 'bg-slate-50 border-slate-200',
                        },
                        {
                            title: 'Disetujui',
                            value: selectedUserStats.approved,
                            color: 'bg-green-50 border-green-200',
                        },
                        {
                            title: 'Menunggu',
                            value: selectedUserStats.pending,
                            color: 'bg-yellow-50 border-yellow-200',
                        },
                        {
                            title: 'Total Jam',
                            value: selectedUserStats.totalHours.toFixed(2),
                            color: 'bg-purple-50 border-purple-200',
                        },
                    ]}
                    searchKey="tanggal"
                    searchPlaceholder="Cari tanggal..."
                    emptyText="Tidak ditemukan data lembur untuk user ini."
                    printUrl={`/report/overtime/print?${new URLSearchParams({
                        start_date: start,
                        end_date: end,
                        status,
                        user_id: selectedUser?.user_id
                            ? String(selectedUser.user_id)
                            : '',
                    }).toString()}`}
                />
            </div>
        </>
    );
}

OvertimeReportIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

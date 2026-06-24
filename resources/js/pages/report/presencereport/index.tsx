import { Head, router } from '@inertiajs/react';
import { Clock, Download, Users } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import ReportFilter from '../partials/report-filter';
import { getReportColumns } from './columns';
import { Button } from '@/components/ui/button';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Kehadiran', href: '/report/presence' },
];

export default function PresenceReportIndex({ data, filters }: any) {
    const statusCount = data?.reduce((acc: any, item: any) => {
        const status = item.status_disiplin ?? 'unknown';
        acc[status] = (acc[status] ?? 0) + 1;

        return acc;
    }, {});

    const [type, setType] = useState(filters?.type ?? 'all');
    const [start, setStart] = useState(filters?.start_date ?? '');
    const [end, setEnd] = useState(filters?.end_date ?? '');

    const handleFilter = (filters?: any) => {
        const t = filters?.type ?? type;
        const s = filters?.start ?? start;
        const e = filters?.end ?? end;

        setType(t);
        setStart(s);
        setEnd(e);

        router.get('/report/presence', {
            type: t,
            start_date: s,
            end_date: e,
        });
    };

    return (
        <>
            <Head title="Laporan Kehadiran" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Laporan Kehadiran"
                    subtitle="Sistem Informasi Kepegawaian"
                    description="Rekap absensi guru dan pegawai berdasarkan periode dan jenis user."
                    gradient="bg-linear-to-r from-emerald-600 to-teal-500"
                    icon={<Users className="size-20 text-white" />}
                    shadowColor="shadow-emerald-200/50"
                />

                <div className="grid gap-6 md:grid-cols-5">
                    {[
                        ['Hadir', 'hadir', 'bg-green-100 text-green-600'],
                        [
                            'Terlambat',
                            'terlambat',
                            'bg-yellow-100 text-yellow-600',
                        ],
                        ['Alpha', 'alpha', 'bg-red-100 text-red-600'],
                        ['Izin', 'izin', 'bg-blue-100 text-blue-600'],
                        ['Sakit', 'sakit', 'bg-purple-100 text-purple-600'],
                    ].map(([label, key, color]) => (
                        <DashboardCard key={key}>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className={`rounded-lg p-3 ${color}`}>
                                    {key === 'terlambat' ? (
                                        <Clock />
                                    ) : (
                                        <Users />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {label}
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {statusCount?.[key] ?? 0}
                                    </h3>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    ))}
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">
                        Detail Laporan Kehadiran
                    </h2>

                    <DataTable
                        data={data ?? []}
                        columns={getReportColumns(type)}
                        searchKey="nama"
                        searchPlaceholder="Cari nama..."
                        actions={
                            <div className="flex items-center gap-2">
                                <ReportFilter
                                    type={type}
                                    start={start}
                                    end={end}
                                    onApply={handleFilter}
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            type,
                                            start_date: start,
                                            end_date: end,
                                        });
                                        window.location.href = `/report/presence/export?${params.toString()}`;
                                    }}
                                >
                                    <Download className="mr-2 size-4" />
                                    Export CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams({ type, start_date: start, end_date: end });
                                        window.open(`/report/presence/print?${params.toString()}`, '_blank');
                                    }}
                                >
                                    <Download className="mr-2 size-4" />
                                    Print / PDF
                                </Button>
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    );
}

PresenceReportIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

import { Head, router } from '@inertiajs/react';
import { DollarSign, Download, FileText, Filter, Users } from 'lucide-react';
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
import { getSalaryReportColumns } from './columns';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Penggajian', href: '/report/salary' },
];

export default function SalaryReportIndex({ data, stats, filters }: any) {
    const [periode, setPeriode] = useState(filters?.periode ?? '');
    const [role, setRole] = useState(filters?.role ?? 'all');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const handleFilter = () => {
        router.get('/report/salary', { periode, role });
        setFilterOpen(false);
    };

    const getReportParams = () =>
        new URLSearchParams({
            periode,
            role,
        });

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
        return selectedUserRows.reduce(
            (acc: any, item: any) => ({
                totalPayroll: acc.totalPayroll + 1,
                totalGaji: acc.totalGaji + Number(item.total_gaji ?? 0),
                totalAdjustment:
                    acc.totalAdjustment + Number(item.total_adjustment ?? 0),
            }),
            { totalPayroll: 0, totalGaji: 0, totalAdjustment: 0 },
        );
    }, [selectedUserRows]);

    return (
        <>
            <Head title="Laporan Penggajian" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Laporan Penggajian"
                    subtitle="Sistem Informasi Kepegawaian"
                    description="Rekap payroll berdasarkan periode penggajian."
                    gradient="bg-linear-to-r from-indigo-600 to-purple-500"
                    icon={<DollarSign className="size-20 text-white" />}
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                <Users />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Payroll
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.total_payroll ?? 0}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <DollarSign />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Gaji
                                </p>
                                <h3 className="text-2xl font-bold">
                                    Rp{' '}
                                    {Number(
                                        stats?.total_gaji ?? 0,
                                    ).toLocaleString('id-ID')}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                                <FileText />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Adjustment
                                </p>
                                <h3 className="text-2xl font-bold">
                                    Rp{' '}
                                    {Number(
                                        stats?.total_adjustment ?? 0,
                                    ).toLocaleString('id-ID')}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">
                        Detail Laporan Penggajian
                    </h2>

                    <DataTable
                        data={data ?? []}
                        columns={getSalaryReportColumns({
                            onUserReport: setSelectedUser,
                        })}
                        searchKey="nama"
                        searchPlaceholder="Cari nama..."
                        actions={
                            <div className="flex items-center gap-2">
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
                                                Periode
                                            </label>
                                            <Input
                                                type="month"
                                                value={periode}
                                                onChange={(event) =>
                                                    setPeriode(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Role
                                            </label>
                                            <Select
                                                value={role}
                                                onValueChange={setRole}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Semua
                                                    </SelectItem>
                                                    <SelectItem value="pegawai">
                                                        Pegawai
                                                    </SelectItem>
                                                    <SelectItem value="guru">
                                                        Guru
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
                                        const params = getReportParams();
                                        window.location.href = `/report/salary/export?${params.toString()}`;
                                    }}
                                >
                                    <Download className="mr-2 size-4" />
                                    Export CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = getReportParams();
                                        window.open(
                                            `/report/salary/print?${params.toString()}`,
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
                    title="Laporan Penggajian Per User"
                    description="Data penggajian per user sesuai filter laporan yang sedang aktif."
                    userName={selectedUser?.nama ?? '-'}
                    periodLabel={periode || 'Semua Periode'}
                    data={selectedUserRows}
                    columns={getSalaryReportColumns()}
                    stats={[
                        {
                            title: 'Payroll',
                            value: selectedUserStats.totalPayroll,
                            color: 'bg-slate-50 border-slate-200',
                        },
                        {
                            title: 'Total Gaji',
                            value: `Rp ${Number(selectedUserStats.totalGaji ?? 0).toLocaleString('id-ID')}`,
                            color: 'bg-green-50 border-green-200',
                        },
                        {
                            title: 'Adjustment',
                            value: `Rp ${Number(selectedUserStats.totalAdjustment ?? 0).toLocaleString('id-ID')}`,
                            color: 'bg-purple-50 border-purple-200',
                        },
                    ]}
                    searchKey="periode"
                    searchPlaceholder="Cari periode..."
                    emptyText="Tidak ditemukan data penggajian untuk user ini."
                    printUrl={`/report/salary/print?${new URLSearchParams({
                        periode,
                        role,
                        user_id: selectedUser?.user_id
                            ? String(selectedUser.user_id)
                            : '',
                    }).toString()}`}
                />
            </div>
        </>
    );
}

SalaryReportIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

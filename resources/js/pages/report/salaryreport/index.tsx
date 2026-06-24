import { Head, router } from '@inertiajs/react';
import { DollarSign, Download, FileText, Filter, Users } from 'lucide-react';
import { useState } from 'react';
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
import { getSalaryReportColumns } from './columns';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Penggajian', href: '/report/salary' },
];

export default function SalaryReportIndex({ data, stats, filters }: any) {
    const [periode, setPeriode] = useState(filters?.periode ?? '');
    const [role, setRole] = useState(filters?.role ?? 'all');
    const [filterOpen, setFilterOpen] = useState(false);

    const handleFilter = () => {
        router.get('/report/salary', { periode, role });
        setFilterOpen(false);
    };

    const getReportParams = () =>
        new URLSearchParams({
            periode,
            role,
        });

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
                        columns={getSalaryReportColumns()}
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
                                                    setPeriode(event.target.value)
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
                                        window.open(`/report/salary/print?${params.toString()}`, '_blank');
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

SalaryReportIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

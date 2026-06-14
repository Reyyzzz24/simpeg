// resources/js/pages/employee/index.tsx

import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { getColumns } from './columns';
import DeleteEmployeeModal from './partials/delete-employee-modal';
import DetailEmployeeModal from './partials/detail-employee-modal';
import EditEmployeeModal from './partials/edit-employee-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pegawai', href: '/employee' },
];

export default function EmployeeIndex({ employees, stats, positions }: any) {
    const [edit, setEdit] = useState(null);
    const [detail, setDetail] = useState(null);
    const [del, setDel] = useState(null);

    return (
        <>
            <Head title="Daftar Pegawai" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Manajemen Pegawai"
                    subtitle="Sistem Informasi Kepegawaian SMKKPDM"
                    description="Kelola biodata pegawai dan informasi administratif dalam sistem."
                    gradient="bg-linear-to-r from-blue-600 to-indigo-500"
                    icon={<Users className="size-20 text-white" />}
                    shadowColor="shadow-blue-200/50"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <Users />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Pegawai
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Data Pegawai</h2>
                    <DataTable
                        columns={getColumns({
                            onEdit: setEdit,
                            onView: setDetail,
                            onDelete: setDel,
                        })}
                        data={employees}
                        searchKey="nama"
                        searchPlaceholder="Cari nama pegawai..."
                    />
                    <EditEmployeeModal
                        isOpen={!!edit}
                        onClose={() => setEdit(null)}
                        record={edit}
                        positions={positions}
                    />
                    <DetailEmployeeModal
                        isOpen={!!detail}
                        onClose={() => setDetail(null)}
                        record={detail}
                    />
                    <DeleteEmployeeModal
                        isOpen={!!del}
                        onClose={() => setDel(null)}
                        record={del}
                    />
                </div>
            </div>
        </>
    );
}

EmployeeIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

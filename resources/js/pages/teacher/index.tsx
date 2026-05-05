// resources/js/pages/teacher/index.tsx

import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { getColumns } from './columns';
import DeleteConfirmDialog from './partials/delete-teacher-modal';
import DetailTeacherModal from './partials/detail-teacher-modal';
import EditTeacherModal from './partials/edit-teacher-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Guru', href: '/teacher' },
];

export default function TeacherIndex({ teachers, positions, stats }: any) {
    const [edit, setEdit] = useState(null);
    const [detail, setDetail] = useState(null);
    const [del, setDel] = useState(null);

    return (
        <>
            <Head title="Daftar Guru" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Manajemen Guru"
                    subtitle="Sistem Informasi Kepegawaian SMKKPDM"
                    description="Kelola data guru, jadwal mengajar, dan aktivitas kehadiran harian."
                    gradient="bg-linear-to-r from-orange-500 to-orange-400"
                    icon={<Users className="size-20 text-white" />}
                    shadowColor="shadow-orange-200/50"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <Users />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Guru
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Data Guru</h2>
                    <DataTable
                        columns={getColumns({
                            onEdit: setEdit,
                            onView: setDetail,
                            onDelete: setDel,
                        })}
                        data={teachers}
                        searchKey="nama"
                        searchPlaceholder="Cari nama guru..."
                    />
                    <EditTeacherModal
                        isOpen={!!edit}
                        onClose={() => setEdit(null)}
                        record={edit}
                        positions={positions}
                    />

                    <DetailTeacherModal
                        isOpen={!!detail}
                        onClose={() => setDetail(null)}
                        record={detail}
                    />

                    <DeleteConfirmDialog
                        isOpen={!!del}
                        onClose={() => setDel(null)}
                        record={del}
                    />
                </div>
            </div>
        </>
    );
}

TeacherIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

import { Head, useForm } from '@inertiajs/react';
import { KeySquare, Plus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import DeleteConfirmDialog from '@/components/delete-confirm-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { getColumns } from './columns';
import CreatePermissionForm from './partials/create-permission-form';
import EditPermissionModal from './partials/edit-permission-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Permissions', href: '/permissions' },
];

export default function PermissionsIndex({ permissions, stats }: any) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any | null>(null);
    const [deleteRecord, setDeleteRecord] = useState<any | null>(null);
    const { delete: destroy, processing } = useForm();

    const confirmDelete = () => {
        if (!deleteRecord) return;

        destroy(`/permissions/${deleteRecord.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteRecord(null),
        });
    };

    return (
        <>
            <Head title="Permissions" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Manajemen Permission"
                    subtitle="Hak akses detail"
                    description="Kelola daftar permission (format: module.action)."
                    gradient="bg-linear-to-r from-emerald-600 to-emerald-500"
                    icon={<ShieldCheck className="size-20 text-white" />}
                    shadowColor="shadow-emerald-200/50"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <KeySquare />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Permissions
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Data Permissions</h2>

                    <DataTable
                        columns={getColumns({
                            onEdit: (r: any) => setEditRecord(r),
                            onDelete: (r: any) => setDeleteRecord(r),
                        })}
                        data={permissions}
                        searchKey="name"
                        searchPlaceholder="Cari permission..."
                        actions={
                            <Dialog
                                open={createOpen}
                                onOpenChange={setCreateOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="success">
                                        <Plus className="size-4" />
                                        Tambah Permission
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Tambah Permission</DialogTitle>
                                        <DialogDescription>
                                            Buat permission baru (contoh: users.view).
                                        </DialogDescription>
                                    </DialogHeader>

                                    <CreatePermissionForm
                                        onClose={() => setCreateOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        }
                    />

                    <EditPermissionModal
                        isOpen={!!editRecord}
                        onClose={() => setEditRecord(null)}
                        record={editRecord}
                    />

                    <DeleteConfirmDialog
                        isOpen={!!deleteRecord}
                        loading={processing}
                        onClose={() => setDeleteRecord(null)}
                        onConfirm={confirmDelete}
                        title="Hapus Permission"
                        description={`Apakah Anda yakin ingin menghapus permission ${deleteRecord?.name}?`}
                    />
                </div>
            </div>
        </>
    );
}

PermissionsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

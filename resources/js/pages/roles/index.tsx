import { Head } from '@inertiajs/react';
import { Key, Plus, Shield } from 'lucide-react';
import { useState } from 'react';

import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
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
import CreateRoleForm from './partials/create-role-form';
import EditRoleModal from './partials/edit-role-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

export default function RolesIndex({ roles, stats, permissions }: any) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any | null>(null);

    return (
        <>
            <Head title="Roles" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Manajemen Role"
                    subtitle="Hak akses sistem"
                    description="Kelola daftar role yang bisa dipilih oleh user."
                    gradient="bg-linear-to-r from-emerald-600 to-emerald-500"
                    icon={<Shield className="size-20 text-white" />}
                    shadowColor="shadow-emerald-200/50"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <Key />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Roles
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Data Roles</h2>

                    <DataTable
                        columns={getColumns({
                            onEdit: (r: any) => setEditRecord(r),
                            onDelete: (r: any) => {
                                if (!confirm('Hapus role ini?')) return;

                                fetch(`/roles/${r.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'X-CSRF-TOKEN':
                                            (
                                                document.querySelector(
                                                    'meta[name="csrf-token"]',
                                                ) as HTMLMetaElement
                                            )?.content || '',
                                    },
                                })
                                    .then(() => location.reload())
                                    .catch(() => alert('Gagal menghapus'));
                            },
                        })}
                        data={roles}
                        searchKey="name"
                        searchPlaceholder="Cari role..."
                        actions={
                            <Dialog
                                open={createOpen}
                                onOpenChange={setCreateOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="success">
                                        <Plus className="size-4" />
                                        Tambah Role
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Tambah Role</DialogTitle>
                                        <DialogDescription>
                                            Buat role baru untuk sistem.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <CreateRoleForm
                                        onClose={() => setCreateOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        }
                    />

                    <EditRoleModal
                        isOpen={!!editRecord}
                        onClose={() => setEditRecord(null)}
                        record={editRecord}
                        permissions={permissions}
                    />
                </div>
            </div>
        </>
    );
}

RolesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);


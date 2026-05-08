import { Head } from '@inertiajs/react';
import { Key, Plus, Shield, UserCheck } from 'lucide-react';
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
import CreateUserPermissionForm from './partials/create-user-permission-form';
import EditUserPermissionModal from './partials/edit-user-permission-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Permissions', href: '/user-permissions' },
];

export default function UserPermissionsIndex({ userPermissions, stats, users, permissions }: any) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any | null>(null);

    return (
        <>
            <Head title="User Permissions" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Manajemen User Permissions"
                    subtitle="Hak akses pengguna"
                    description="Kelola permission langsung untuk setiap pengguna."
                    gradient="bg-linear-to-r from-blue-600 to-blue-500"
                    icon={<UserCheck className="size-20 text-white" />}
                    shadowColor="shadow-blue-200/50"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <Key />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total User Permissions
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Data User Permissions</h2>

                    <DataTable
                        columns={getColumns({
                            onEdit: (r: any) => setEditRecord(r),
                            onDelete: (r: any) => {
                                if (!confirm('Hapus user permission ini?')) return;

                                fetch(`/user-permissions/${r.id}`, {
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
                        data={userPermissions}
                        searchKey="user_name"
                        searchPlaceholder="Cari user permission..."
                        actions={
                            <Dialog
                                open={createOpen}
                                onOpenChange={setCreateOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="success">
                                        <Plus className="size-4" />
                                        Tambah User Permission
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Tambah User Permission</DialogTitle>
                                        <DialogDescription>
                                            Berikan permission langsung ke pengguna.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <CreateUserPermissionForm
                                        onClose={() => setCreateOpen(false)}
                                        users={users}
                                        permissions={permissions}
                                    />
                                </DialogContent>
                            </Dialog>
                        }
                    />

                    <EditUserPermissionModal
                        isOpen={!!editRecord}
                        onClose={() => setEditRecord(null)}
                        record={editRecord}
                        users={users}
                        permissions={permissions}
                    />
                </div>
            </div>
        </>
    );
}

UserPermissionsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

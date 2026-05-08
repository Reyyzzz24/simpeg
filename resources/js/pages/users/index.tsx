// resources/js/pages/users/index.tsx

import { Head } from '@inertiajs/react';
import { Users, Plus, UserCog } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { getColumns } from './columns';
import CreateUserForm from './partials/create-user-form';
import EditUserModal from './partials/edit-user-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

export default function UsersIndex({ users, stats, roles }: any) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any | null>(null);

    return (
        <>
            <Head title="Users" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Manajemen Pengguna"
                    subtitle="Sistem Informasi Kepegawaian SMKKPDM"
                    description="Kelola data pengguna, hak akses, dan informasi akun dalam sistem."
                    gradient="bg-linear-to-r from-emerald-600 to-emerald-500"
                    icon={<UserCog className="size-20 text-white" />} // Ganti emoji dengan komponen Icon
                    shadowColor="shadow-emerald-200/50"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <Users />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Users
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Data Users</h2>

                    <DataTable
                        columns={getColumns({
                            onEdit: (r: any) => setEditRecord(r),
                            onDelete: (r: any) => {
                                if (!confirm('Hapus user ini?')) return;

                                fetch(`/users/${r.id}`, {
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
                        data={users}
                        searchKey="name"
                        searchPlaceholder="Cari nama pengguna..."
                        actions={
                            <Dialog
                                open={createOpen}
                                onOpenChange={setCreateOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="success">
                                        <Plus className="size-4" />
                                        Tambah User
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Tambah User</DialogTitle>
                                        <DialogDescription>
                                            Buat user baru
                                        </DialogDescription>
                                    </DialogHeader>

                                    <CreateUserForm
                                        onClose={() => setCreateOpen(false)}
                                        roles={roles}
                                    />
                                </DialogContent>
                            </Dialog>
                        }
                    />

                    <EditUserModal
                        isOpen={!!editRecord}
                        onClose={() => setEditRecord(null)}
                        record={editRecord}
                        roles={roles}
                    />
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

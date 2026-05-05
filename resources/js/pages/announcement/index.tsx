import DeleteConfirmDialog from '@/components/delete-confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Megaphone, Plus } from 'lucide-react';
import { useState } from 'react';
import { getColumns } from './columns';
import AnnouncementFormModal from './partials/announcement-form-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pengumuman', href: '/announcement' },
];

export default function AnnouncementIndex({ announcements }: any) {
    const [openForm, setOpenForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [deleteRecord, setDeleteRecord] = useState<any | null>(null);
    const { delete: destroy, processing } = useForm();

    const handleAdd = () => {
        setSelectedRecord(null);
        setOpenForm(true);
    };

    const confirmDelete = () => {
        if (!deleteRecord) {
            return;
        }

        destroy(`/announcement/${deleteRecord.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteRecord(null),
        });
    };

    return (
        <>
            <Head title="Pengumuman" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    title="Pengumuman"
                    subtitle="Informasi"
                    description="Kelola pengumuman yang akan dibagikan kepada pengguna."
                    gradient="bg-linear-to-r from-cyan-600 to-cyan-500"
                    icon={<Megaphone className="size-20 text-white" />}
                    shadowColor="shadow-blue-200/50"
                />

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">
                        Data Pengumuman
                    </h2>

                    <DataTable
                        data={announcements ?? []}
                        columns={getColumns({
                            onEdit: (record) => {
                                setSelectedRecord(record);
                                setOpenForm(true);
                            },
                            onDelete: setDeleteRecord,
                        })}
                        searchKey="title"
                        searchPlaceholder="Cari judul pengumuman..."
                        actions={
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 size-4" />
                                Tambah Pengumuman
                            </Button>
                        }
                    />
                </div>

                <AnnouncementFormModal
                    open={openForm}
                    setOpen={setOpenForm}
                    record={selectedRecord}
                />

                <DeleteConfirmDialog
                    isOpen={!!deleteRecord}
                    loading={processing}
                    onClose={() => setDeleteRecord(null)}
                    onConfirm={confirmDelete}
                    title="Hapus Pengumuman"
                    description={`Apakah Anda yakin ingin menghapus pengumuman ${deleteRecord?.title ?? 'ini'}?`}
                />
            </div>
        </>
    );
}

AnnouncementIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

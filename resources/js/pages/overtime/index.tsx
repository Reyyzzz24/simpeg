import DeleteConfirmDialog from '@/components/delete-confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { getColumns } from './columns';
import LemburCreateModal from './partials/lembur-create-modal';
import LemburEditModal from './partials/lembur-edit-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lembur', href: '/overtime' },
];

export default function OvertimeIndex({ lembur, pegawai }: any) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any | null>(null);
    const [deleteRecord, setDeleteRecord] = useState<any | null>(null);
    const { delete: destroy, processing } = useForm();

    const confirmDelete = () => {
        if (!deleteRecord) {
            return;
        }

        destroy(`/overtime/${deleteRecord.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteRecord(null),
        });
    };

    return (
        <>
            <Head title="Lembur" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    title="Manajemen Lembur"
                    subtitle="Master Data"
                    description="Kelola data lembur pegawai, waktu pelaksanaan, tugas, dan status persetujuan."
                />

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">
                        Data Lembur
                    </h2>

                    <DataTable
                        data={lembur ?? []}
                        columns={getColumns({
                            onEdit: setEditRecord,
                            onDelete: setDeleteRecord,
                        })}
                        searchKey="pegawai_nama"
                        searchPlaceholder="Cari nama pegawai..."
                        actions={
                            <Button onClick={() => setCreateOpen(true)}>
                                <Plus className="mr-2 size-4" />
                                Tambah Lembur
                            </Button>
                        }
                    />
                </div>

                <LemburCreateModal
                    open={createOpen}
                    setOpen={setCreateOpen}
                    pegawai={pegawai ?? []}
                />

                <LemburEditModal
                    open={!!editRecord}
                    setOpen={(value) => {
                        if (!value) {
                            setEditRecord(null);
                        }
                    }}
                    record={editRecord}
                    pegawai={pegawai ?? []}
                />

                <DeleteConfirmDialog
                    isOpen={!!deleteRecord}
                    loading={processing}
                    onClose={() => setDeleteRecord(null)}
                    onConfirm={confirmDelete}
                    title="Hapus Lembur"
                    description={`Apakah Anda yakin ingin menghapus data lembur ${deleteRecord?.pegawai_nama ?? 'ini'}?`}
                />
            </div>
        </>
    );
}

OvertimeIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

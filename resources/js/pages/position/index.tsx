import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getColumns } from './columns'
import PositionFormModal from './partials/position-form-modal'
import DeleteConfirmDialog from '@/components/delete-confirm-dialog'

export default function PositionIndex({ positions }: any) {
    const [openForm, setOpenForm] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<any>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const { delete: destroy, processing } = useForm()

    const handleAdd = () => {
        setSelectedRecord(null)
        setOpenForm(true)
    }

    const handleEdit = (row: any) => {
        setSelectedRecord(row)
        setOpenForm(true)
    }

    const handleDeleteRequest = (row: any) => {
        setSelectedRecord(row)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (selectedRecord) {
            destroy(`/positions/${selectedRecord.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false)
                    setSelectedRecord(null)
                },
            })
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <PageHeader
                title="Manajemen Jabatan"
                subtitle="Master Data"
                description="Kelola data jabatan pegawai"
            />

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Data Jabatan</h2>
                <DataTable
                    data={positions ?? []}
                    columns={getColumns({ 
                        onEdit: handleEdit, 
                        onDelete: handleDeleteRequest 
                    })}
                    actions={
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 size-4" />
                            Tambah Jabatan
                        </Button>
                    }
                />
            </div>

            {/* Modal Form (Create/Edit) */}
            <PositionFormModal
                open={openForm}
                setOpen={setOpenForm}
                record={selectedRecord}
            />

            {/* Modal Konfirmasi Hapus */}
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                loading={processing}
                onClose={() => {
                    setIsDeleteDialogOpen(false)
                    setSelectedRecord(null)
                }}
                onConfirm={confirmDelete}
                title="Hapus Jabatan"
                description={`Apakah Anda yakin ingin menghapus jabatan ${selectedRecord?.name}? Data yang terikat mungkin akan terdampak.`}
            />
        </div>
    )
}

PositionIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Jabatan', href: '/positions' }]}>
        {page}
    </AppLayout>
)
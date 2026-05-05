import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getColumns } from './columns'
import AllowanceFormModal from './partials/allowance-form-modal'
import DeleteConfirmDialog from '@/components/delete-confirm-dialog'

export default function PositionAllowanceIndex({ data, positions, components }: any) {
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
            destroy(`/position-allowances/${selectedRecord.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false)
                    setSelectedRecord(null)
                }
            })
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <PageHeader title="Tunjangan Jabatan" subtitle="Master Payroll" />

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Data Tunjangan Jabatan</h2>
                <DataTable
                    data={data ?? []}
                    columns={getColumns({ 
                        onEdit: handleEdit, 
                        onDelete: handleDeleteRequest 
                    })}
                    actions={
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 size-4" /> Tambah Tunjangan
                        </Button>
                    }
                />
            </div>

            <AllowanceFormModal
                open={openForm}
                setOpen={setOpenForm}
                record={selectedRecord}
                positions={positions}
                components={components}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                loading={processing}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    )
}

PositionAllowanceIndex.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
)
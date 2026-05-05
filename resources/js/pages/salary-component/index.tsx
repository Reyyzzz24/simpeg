import { useState } from 'react'
import { useForm } from '@inertiajs/react' // Menggunakan useForm untuk handle processing state

import AppLayout from '@/layouts/app-layout'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/ui/data-table'
import { getColumns } from './columns'
import SalaryComponentEditModal from './partials/salary-component-edit-modal'
import SalaryComponentModal from './partials/salary-component-modal'
import DeleteConfirmDialog from '@/components/delete-confirm-dialog' // Import dialog konfirmasi

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Salary Component', href: '/salary-components' },
]

export default function SalaryComponentIndex({ data }: any) {
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    
    // State untuk kontrol DeleteConfirmDialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    
    // Menggunakan useForm agar bisa mendapatkan status 'processing' untuk loading di tombol dialog[cite: 10]
    const { delete: destroy, processing } = useForm()

    const handleEdit = (row: any) => {
        setSelected(row)
        setOpenEdit(true)
    }

    // Fungsi untuk memicu dialog, bukan langsung menghapus[cite: 16]
    const remove = (row: any) => {
        setSelected(row)
        setIsDeleteDialogOpen(true)
    }

    // Fungsi eksekusi penghapusan setelah dikonfirmasi di dalam dialog[cite: 10]
    const confirmDelete = () => {
        if (selected) {
            destroy(`/salary-components/${selected.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false)
                    setSelected(null)
                },
            })
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <PageHeader
                title="Salary Component"
                subtitle="Payroll Master"
                description="Komponen dasar penggajian"
            />

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                    Data Komponen Gaji
                </h2>

                <DataTable
                    data={data ?? []}
                    columns={getColumns({
                        onDelete: remove,
                        onEdit: handleEdit
                    })}
                    actions={
                        <SalaryComponentModal
                            open={open}
                            setOpen={setOpen}
                        />
                    }
                />

                {/* Modal Edit */}
                <SalaryComponentEditModal
                    isOpen={openEdit}
                    onClose={() => {
                        setOpenEdit(false)
                        setSelected(null)
                    }}
                    record={selected}
                />

                {/* Modal Konfirmasi Hapus[cite: 10] */}
                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    loading={processing}
                    onClose={() => {
                        setIsDeleteDialogOpen(false)
                        setSelected(null)
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Komponen Gaji"
                    description={`Apakah Anda yakin ingin menghapus komponen "${selected?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                />
            </div>
        </div>
    )
}

SalaryComponentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
)
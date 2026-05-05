import { Head, router, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { PageHeader } from '@/components/page-header'
import { DashboardCard } from '@/components/dashboard-card'
import { CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, Plus, Settings2, FileText } from 'lucide-react'
import { useState } from 'react'

import DeleteConfirmDialog from '@/components/delete-confirm-dialog'
import AdjustmentModal from './partials/adjustment-modal'
import DetailPayrollModal from './partials/detail-payroll-modal'
import GeneratePayrollModal from './partials/generate-modal'
import { getPayrollColumns } from './columns'

export default function PayrollIndex({ payrolls, stats, users, components }: any) {

    const [detail, setDetail] = useState<any>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const [openGenerate, setOpenGenerate] = useState(false)

    const [openAdjustment, setOpenAdjustment] = useState(false)
    const [selectedAdjustment, setSelectedAdjustment] = useState<any[]>([])

    const { delete: destroy, processing } = useForm()

    const openDeleteDialog = (id: number) => {
        setDeleteId(id)
        setIsDeleteDialogOpen(true)
    }

    const handleDetail = async (row: any) => {
        setLoadingDetail(true)
        try {
            const res = await fetch(`/payroll/${row.id}`)
            const data = await res.json()
            setDetail(data)
        } finally {
            setLoadingDetail(false)
        }
    }

    const handleAddAdjustment = () => {
        setSelectedAdjustment([]); // Mengosongkan record agar isEdit = false
        setOpenAdjustment(true);
    };

    const handleEditAdjustment = (adjustments: any[]) => {
        setSelectedAdjustment(adjustments); // Mengisi record agar isEdit = true
        setOpenAdjustment(true);
    };

    const handleDeleteAdjustment = (adjustments: any[]) => {
        // Kita set ID atau data yang mau dihapus ke state
        // Jika ingin hapus massal, simpan array-nya ke state
        setSelectedAdjustment(adjustments);
        setIsDeleteDialogOpen(true);
    };

    // Sesuaikan fungsi konfirmasi agar bisa menangani dua jenis penghapusan
    const confirmDelete = () => {
        // 1. Jika yang dihapus adalah Adjustment (massal)
        if (selectedAdjustment.length > 0) {
            selectedAdjustment.forEach((adj) => {
                router.delete(`/payroll-adjustments/${adj.id}`, {
                    preserveScroll: true,
                    onSuccess: () => setIsDeleteDialogOpen(false)
                });
            });
            setSelectedAdjustment([]);
            return;
        }

        // 2. Jika yang dihapus adalah Payroll tunggal (logic lama Anda)
        if (deleteId) {
            destroy(`/payroll/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Penggajian" />

            <div className="flex flex-col gap-8 p-4 md:p-8">

                <PageHeader
                    title="Manajemen Penggajian"
                    subtitle="Sistem Informasi Kepegawaian"
                    description="Kelola gaji pegawai dan guru berdasarkan aturan sistem."
                    gradient="bg-linear-to-r from-indigo-600 to-purple-500"
                    icon={<DollarSign className="size-20 text-white" />}
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Users />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Payroll</p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.total ?? 0}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <DollarSign />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Gaji</p>
                                <h3 className="text-2xl font-bold">
                                    Rp {Number(stats?.total_gaji ?? 0).toLocaleString('id-ID')}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <FileText />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Rata-rata Gaji</p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.total
                                        ? `Rp ${(stats.total_gaji / stats.total).toLocaleString('id-ID')}`
                                        : 'Rp 0'}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Data Penggajian</h2>

                    <DataTable
                        data={payrolls ?? []}
                        columns={getPayrollColumns({
                            onDetail: handleDetail,
                            onEditAdjustment: handleEditAdjustment,
                            onDeleteAdjustment: handleDeleteAdjustment,
                        })}
                        actions={
                            <div className="flex gap-2">
                                <Button onClick={handleAddAdjustment} variant="outline">
                                    <Settings2 className="mr-2 size-4" />
                                    Tambah Adjustment
                                </Button>

                                <Button onClick={() => setOpenGenerate(true)} variant="cyan">
                                    <Plus className="mr-2 size-4" />
                                    Generate Gaji
                                </Button>
                            </div>
                        }
                    />

                    {loadingDetail && (
                        <p className="text-sm text-muted-foreground mt-2 animate-pulse">
                            Mengambil detail...
                        </p>
                    )}
                </div>

                <AdjustmentModal
                    isOpen={openAdjustment}
                    record={selectedAdjustment}
                    onClose={() => {
                        setOpenAdjustment(false)
                        setSelectedAdjustment([])
                    }}
                    users={users ?? []}
                    components={components ?? []}
                />

                <DetailPayrollModal
                    isOpen={!!detail}
                    onClose={() => setDetail(null)}
                    record={detail}
                />

                <GeneratePayrollModal
                    isOpen={openGenerate}
                    onClose={() => setOpenGenerate(false)}
                />

                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    loading={processing}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                    title="Hapus Data Payroll"
                    description="Menghapus data payroll akan menghilangkan catatan gaji periode ini secara permanen."
                />
            </div>
        </>
    )
}

PayrollIndex.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
)
import { Head, router, useForm } from '@inertiajs/react';
import { Users, DollarSign, Plus, Settings2, FileText } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import { DashboardCard } from '@/components/dashboard-card';
import DeleteConfirmDialog from '@/components/delete-confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { getPayrollColumns } from './columns';
import AdjustmentModal from './partials/adjustment-modal';
import DetailPayrollModal from './partials/detail-payroll-modal';
import GeneratePayrollModal from './partials/generate-modal';

export default function PayrollIndex({
    payrolls,
    stats,
    users,
    components,
    filters,
}: any) {
    const [detail, setDetail] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [openGenerate, setOpenGenerate] = useState(false);
    const [regenerateRecord, setRegenerateRecord] = useState<any>(null);
    const [isRegenDialogOpen, setIsRegenDialogOpen] = useState(false);

    const [openAdjustment, setOpenAdjustment] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState<any[]>([]);
    const [periode, setPeriode] = useState(filters?.periode ?? '');

    const { delete: destroy, processing } = useForm();

    const handleFilter = () => {
        router.get(
            '/payroll',
            { periode },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const resetFilter = () => {
        setPeriode('');
        router.get(
            '/payroll',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleRegenerate = (record: any) => {
        setRegenerateRecord(record);
        setIsRegenDialogOpen(true);
    };

    const handleDetail = async (row: any) => {
        setLoadingDetail(true);

        try {
            const res = await fetch(`/payroll/${row.id}`);
            const data = await res.json();
            setDetail(data);
        } finally {
            setLoadingDetail(false);
        }
    };

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
                    onSuccess: () => setIsDeleteDialogOpen(false),
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

    const confirmRegenerate = () => {
        if (!regenerateRecord) {
            return;
        }

        const userId = regenerateRecord.user_id || regenerateRecord.user?.id;

        router.post(
            `/payroll/generate/${userId}`,
            {
                periode: regenerateRecord.periode,
            },
            {
                onFinish: () => {
                    setIsRegenDialogOpen(false);
                    setRegenerateRecord(null);
                },
            },
        );
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
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                <Users />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Payroll
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stats?.total ?? 0}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                <DollarSign />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Gaji
                                </p>
                                <h3 className="text-2xl font-bold">
                                    Rp{' '}
                                    {Number(
                                        stats?.total_gaji ?? 0,
                                    ).toLocaleString('id-ID')}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                                <FileText />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Rata-rata Gaji
                                </p>
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
                    <h2 className="mb-4 text-lg font-semibold">
                        Data Penggajian
                    </h2>

                    <DataTable
                        data={payrolls ?? []}
                        columns={getPayrollColumns({
                            onDetail: handleDetail,
                            onEditAdjustment: handleEditAdjustment,
                            onDeleteAdjustment: handleDeleteAdjustment,
                            onRegenerate: handleRegenerate,
                        })}
                        searchKey="user_name"
                        searchPlaceholder="Cari nama pegawai..."
                        actions={
                            <div className="flex flex-wrap items-center gap-2">
                                <Input
                                    type="month"
                                    value={periode}
                                    onChange={(event) =>
                                        setPeriode(event.target.value)
                                    }
                                    className="w-44"
                                />
                                <Button variant="outline" onClick={handleFilter}>
                                    Filter
                                </Button>
                                {filters?.periode && (
                                    <Button variant="ghost" onClick={resetFilter}>
                                        Reset
                                    </Button>
                                )}
                                <Button
                                    onClick={handleAddAdjustment}
                                    variant="outline"
                                >
                                    <Settings2 className="mr-2 size-4" />
                                    Tambah Adjustment
                                </Button>

                                <Button onClick={() => setOpenGenerate(true)}>
                                    <Plus className="mr-2 size-4" />
                                    Generate Gaji
                                </Button>
                            </div>
                        }
                    />

                    {loadingDetail && (
                        <p className="mt-2 animate-pulse text-sm text-muted-foreground">
                            Mengambil detail...
                        </p>
                    )}
                </div>

                <AdjustmentModal
                    isOpen={openAdjustment}
                    record={selectedAdjustment}
                    onClose={() => {
                        setOpenAdjustment(false);
                        setSelectedAdjustment([]);
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
                <ConfirmDialog
                    isOpen={isRegenDialogOpen}
                    loading={processing}
                    onClose={() => {
                        setIsRegenDialogOpen(false);
                        setRegenerateRecord(null);
                    }}
                    onConfirm={confirmRegenerate}
                    title="Re-generate Gaji"
                    description={`Sistem akan menghitung ulang gaji ${regenerateRecord?.user?.name} untuk periode ${regenerateRecord?.periode}. Lanjutkan?`}
                    confirmText="Ya, Hitung Ulang"
                    variant="default"
                />
            </div>
        </>
    );
}

PayrollIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

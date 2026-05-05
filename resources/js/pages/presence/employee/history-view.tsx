import { Head, router } from '@inertiajs/react';
import { History } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { selfPresenceColumns } from './columns';
import FlashMessage from './flash-message';
import type { SelfPresence, SelfPresenceUser } from './types';

type Props = {
    user: SelfPresenceUser;
    selfPresences: SelfPresence[];
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function HistoryView({ user, selfPresences, flash }: Props) {
    return (
        <>
            <Head title="Riwayat Absensi Saya" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Riwayat Absensi Saya"
                    subtitle={`${user.name} - ${user.role}`}
                    description="Lihat catatan absensi masuk, pulang, status kehadiran, dan validasi jam ajar."
                    gradient="bg-linear-to-r from-cyan-600 to-blue-500"
                    icon={<History className="size-20 text-white" />}
                >
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                        onClick={() => router.visit('/presence/self')}
                    >
                        Kembali Absen
                    </Button>
                </PageHeader>

                <FlashMessage success={flash?.success} error={flash?.error} />

                <DashboardCard className="p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">
                            60 Riwayat Terakhir
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Data diambil dari catatan absensi akun sendiri.
                        </p>
                    </div>

                    <DataTable
                        columns={selfPresenceColumns}
                        data={selfPresences}
                        searchKey="tanggal"
                        searchPlaceholder="Cari tanggal..."
                    />
                </DashboardCard>
            </div>
        </>
    );
}

import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from './columns';
import { DashboardCard } from '@/components/dashboard-card';
import { CardContent } from '@/components/ui/card';
import {
    Users,
    Clock,
    AlertTriangle,
    QrCode,
    ExternalLink,
    RefreshCw,
    Download,
    Plus,
    Filter
} from 'lucide-react';
import { route } from 'ziggy-js';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { PresenceManualForm } from './partials/presence-manual-form';
import EditPresenceModal from './partials/edit-presence-modal';
import DetailPresenceModal from './partials/detail-presence-modal';
import HistoryPresenceModal from './partials/history-presence-modal';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Absensi Pegawai', href: '/presence' },
];

export default function PresenceIndex({ presences, stats, filters }: any) {
    const [editRecord, setEditRecord] = useState<any | null>(null);
    const [detailRecord, setDetailRecord] = useState<any | null>(null);
    const [historyRecord, setHistoryRecord] = useState<any | null>(null);

    // 🔥 ambil mode dari backend (bukan hardcode)
    const currentMode = filters?.mode ?? 'today';

    return (
        <>
            <Head title="Absensi Pegawai" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title='Daftar kehadiran'
                    subtitle="Sistem Informasi Kepegawaian SMKKPDM"
                    description="Monitoring presensi harian seluruh staf dan guru."
                    gradient="bg-linear-to-r from-cyan-600 to-cyan-500"
                    icon="📋"
                    shadowColor="shadow-blue-200/50"
                >
                    <div className="flex items-center gap-2">
                        <a href={route('presence.gate')} target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                className="bg-white text-teal-600 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-teal-50 hover:text-teal-700"
                            >
                                <QrCode className="mr-2 size-5" />
                                Gate Display
                                <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                            </Button>
                        </a>

                        <Dialog>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader className="text-center">
                                    <DialogTitle>Tambah Absen Manual</DialogTitle>
                                    <DialogDescription>
                                        Isi data absensi sesuai kebutuhan (user_id, tanggal, jam, dll).
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            size="lg"
                            className="group/btn cursor-pointer border-white/30 bg-white/20 text-white hover:bg-white/30"
                            onClick={() =>
                                router.visit(route('presence.index'), {
                                    preserveScroll: true,
                                    preserveState: false,
                                })
                            }
                        >
                            <RefreshCw className="mr-2 size-5 transition-transform duration-200 group-hover/btn:rotate-90" />
                            Refresh
                        </Button>
                    </div>
                </PageHeader>

                {/* STATISTIK */}
                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Users /></div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Hadir</p>
                                <h3 className="text-2xl font-bold">{stats.total_present}</h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><AlertTriangle /></div>
                            <div>
                                <p className="text-sm text-muted-foreground">Terlambat</p>
                                <h3 className="text-2xl font-bold">{stats.total_late}</h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Clock /></div>
                            <div>
                                <p className="text-sm text-muted-foreground">Belum Absen</p>
                                <h3 className="text-2xl font-bold">{stats.total_missing}</h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                {/* TABLE */}
                <DashboardCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Data Absensi</h2>

                    <DataTable
                        columns={getColumns({
                            onEdit: setEditRecord,
                            onDetail: setDetailRecord,
                            onHistory: setHistoryRecord,
                        })}
                        data={presences} // 🔥 langsung dari backend
                        actions={
                            <div className="flex gap-2">

                                {/* CREATE */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 size-4" />
                                            Tambah
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Absen</DialogTitle>
                                            <DialogDescription>
                                                Input absensi manual.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <PresenceManualForm />
                                    </DialogContent>
                                </Dialog>

                                {/* FILTER */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Filter className="mr-2 size-4" />
                                            Filter
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            className={currentMode === 'all' ? 'bg-muted' : ''}
                                            onClick={() =>
                                                router.get(route('presence.index'), {
                                                    mode: 'all',
                                                }, { preserveState: true })
                                            }
                                        >
                                            Semua Absensi
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className={currentMode === 'today' ? 'bg-muted' : ''}
                                            onClick={() =>
                                                router.get(route('presence.index'), {
                                                    mode: 'today',
                                                }, { preserveState: true })
                                            }
                                        >
                                            Hari Ini
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* EXPORT */}
                                <Button
                                    variant="outline"
                                    onClick={() => router.get(route('presence.export'))}
                                >
                                    <Download className="mr-2 size-4" />
                                    Export
                                </Button>
                            </div>
                        }
                    />
                </DashboardCard>

                {/* MODALS */}
                <EditPresenceModal isOpen={!!editRecord} onClose={() => setEditRecord(null)} record={editRecord} />
                <DetailPresenceModal isOpen={!!detailRecord} onClose={() => setDetailRecord(null)} record={detailRecord} />
                <HistoryPresenceModal isOpen={!!historyRecord} onClose={() => setHistoryRecord(null)} record={historyRecord} />
            </div>
        </>
    );
}

PresenceIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
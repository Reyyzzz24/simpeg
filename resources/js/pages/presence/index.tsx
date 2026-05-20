import { Head, router } from '@inertiajs/react';
import {
    Clock,
    AlertTriangle,
    QrCode,
    ExternalLink,
    RefreshCw,
    Download,
    Plus,
    Filter,
    CheckCircle2,
    XCircle,
    FileText,
    HeartPulse,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
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
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { getColumns } from './columns';
import DetailPresenceModal from './partials/detail-presence-modal';
import EditPresenceModal from './partials/edit-presence-modal';
import HistoryPresenceModal from './partials/history-presence-modal';
import { PresenceManualForm } from './partials/presence-manual-form';
import SetTimeModal from './partials/set-time-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Absensi Pegawai', href: '/presence' },
];

export default function PresenceIndex({
    presences,
    stats,
    filters,
    timeWindow,
}: any) {
    const [editRecord, setEditRecord] = useState<any | null>(null);
    const [detailRecord, setDetailRecord] = useState<any | null>(null);
    const [historyRecord, setHistoryRecord] = useState<any | null>(null);
    const [isSetTimeOpen, setIsSetTimeOpen] = useState(false);

    // 🔥 ambil mode dari backend (bukan hardcode)
    const currentMode = filters?.mode ?? 'today';

    return (
        <>
            <Head title="Absensi Pegawai" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Daftar kehadiran"
                    subtitle="Sistem Informasi Kepegawaian SMKKPDM"
                    description="Monitoring presensi harian seluruh staf dan guru."
                    gradient="bg-linear-to-r from-cyan-600 to-cyan-500"
                    icon="📋"
                    shadowColor="shadow-blue-200/50"
                >
                    <div className="flex items-center gap-2">
                        <a
                            href={route('presence.gate')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
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
                                    <DialogTitle>
                                        Tambah Absen Manual
                                    </DialogTitle>
                                    <DialogDescription>
                                        Isi data absensi sesuai kebutuhan
                                        (user_id, tanggal, jam, dll).
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

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Status Waktu (Kiri) */}
                    <DashboardCard className="lg:col-span-4">
                        <CardContent className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="font-bold text-gray-700">
                                    Status Waktu
                                </h3>
                                <Button
                                    variant="neutral"
                                    size="sm"
                                    className="rounded-full bg-black px-4 text-white hover:bg-gray-800"
                                    onClick={() => setIsSetTimeOpen(true)}
                                >
                                    <Clock className="mr-2 size-3" />
                                    Atur Waktu
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="font-medium text-gray-600">
                                        Masuk
                                    </span>
                                    <span className="font-mono text-gray-500">
                                        {timeWindow?.masuk_start ?? '06:00'} -{' '}
                                        {timeWindow?.masuk_end ?? '08:00'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-600">
                                        Pulang
                                    </span>
                                    <span className="font-mono text-gray-500">
                                        {timeWindow?.pulang_start ?? '16:00'} -{' '}
                                        {timeWindow?.pulang_end ?? '18:00'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    {/* Statistik Kehadiran (Kanan) */}
                    <DashboardCard className="lg:col-span-8">
                        <CardContent className="grid grid-cols-2 divide-x divide-y divide-gray-100 p-0 md:grid-cols-5 md:divide-y-0">
                            <div className="flex flex-col gap-1 bg-green-50/30 p-6">
                                <p className="text-sm font-medium text-green-600">
                                    Hadir
                                </p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-green-600">
                                        {stats.total_present ?? 0}
                                    </h3>
                                    <CheckCircle2 className="size-5 text-green-600" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 p-6">
                                <p className="text-sm font-medium text-gray-500">
                                    Terlambat
                                </p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        {stats.total_late ?? 0}
                                    </h3>
                                    <AlertTriangle className="size-5 text-orange-400" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 p-6">
                                <p className="text-sm font-medium text-red-500">
                                    Alpha
                                </p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-red-600">
                                        {stats.total_alpha ?? 0}
                                    </h3>
                                    <XCircle className="size-5 text-red-600" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 p-6">
                                <p className="text-sm font-medium text-blue-600">
                                    Izin
                                </p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-blue-600">
                                        {stats.total_izin ?? 0}
                                    </h3>
                                    <FileText className="size-5 text-blue-500" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 p-6">
                                <p className="text-sm font-medium text-purple-600">
                                    Sakit
                                </p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-purple-600">
                                        {stats.total_sakit ?? 0}
                                    </h3>
                                    <HeartPulse className="size-5 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                {/* TABLE */}
                <DashboardCard className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Data Absensi</h2>

                    <DataTable
                        columns={getColumns({
                            onEdit: setEditRecord,
                            onDetail: setDetailRecord,
                            onHistory: setHistoryRecord,
                        })}
                        data={presences} // 🔥 langsung dari backend
                        searchKey="employee_name"
                        searchPlaceholder="Cari nama pegawai..."
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
                                            <DialogTitle>
                                                Tambah Absen
                                            </DialogTitle>
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
                                            className={
                                                currentMode === 'all'
                                                    ? 'bg-muted'
                                                    : ''
                                            }
                                            onClick={() =>
                                                router.get(
                                                    route('presence.index'),
                                                    {
                                                        mode: 'all',
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        >
                                            Semua Absensi
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className={
                                                currentMode === 'today'
                                                    ? 'bg-muted'
                                                    : ''
                                            }
                                            onClick={() =>
                                                router.get(
                                                    route('presence.index'),
                                                    {
                                                        mode: 'today',
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        >
                                            Hari Ini
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* EXPORT */}
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.get(route('presence.export'))
                                    }
                                >
                                    <Download className="mr-2 size-4" />
                                    Export
                                </Button>
                            </div>
                        }
                    />
                </DashboardCard>

                {/* MODALS */}
                <EditPresenceModal
                    isOpen={!!editRecord}
                    onClose={() => setEditRecord(null)}
                    record={editRecord}
                />
                <DetailPresenceModal
                    isOpen={!!detailRecord}
                    onClose={() => setDetailRecord(null)}
                    record={detailRecord}
                />
                <HistoryPresenceModal
                    isOpen={!!historyRecord}
                    onClose={() => setHistoryRecord(null)}
                    record={historyRecord}
                />
                <SetTimeModal
                    isOpen={isSetTimeOpen}
                    onClose={() => setIsSetTimeOpen(false)}
                    timeWindow={
                        timeWindow ?? {
                            masuk_start: '06:00',
                            masuk_end: '08:00',
                            pulang_start: '16:00',
                            pulang_end: '18:00',
                        }
                    }
                />
            </div>
        </>
    );
}

PresenceIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

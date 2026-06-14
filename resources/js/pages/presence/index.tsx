import { Head, router, usePage } from '@inertiajs/react';
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
    MapPin,
    ClipboardList,
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
import SetLocationModal from './partials/set-location-modal';
import SetTimeModal from './partials/set-time-modal';
import AdminFaceGatePanel from './partials/admin-face-gate-panel';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Absensi Pegawai', href: '/presence' },
];

export default function PresenceIndex({
    presences,
    stats,
    filters,
    timeWindow,
    locationSetting,
}: any) {
    const [editRecord, setEditRecord] = useState<any | null>(null);
    const [detailRecord, setDetailRecord] = useState<any | null>(null);
    const [historyRecord, setHistoryRecord] = useState<any | null>(null);
    const [isSetTimeOpen, setIsSetTimeOpen] = useState(false);
    const [isSetLocationOpen, setIsSetLocationOpen] = useState(false);
    const { flash } = usePage<any>().props;

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

                        <AdminFaceGatePanel
                            locationEnabled={
                                locationSetting?.enabled !== false
                            }
                        />

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

                {(flash?.success || flash?.error) && (
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm ${
                            flash?.error
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        }`}
                    >
                        {flash?.error ?? flash?.success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        {/* Status Waktu (Kiri) */}
                        <DashboardCard>
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
                                            {timeWindow?.masuk_start ?? '06:00'}{' '}
                                            - {timeWindow?.masuk_end ?? '08:00'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-600">
                                            Pulang
                                        </span>
                                        <span className="font-mono text-gray-500">
                                            {timeWindow?.pulang_start ??
                                                '16:00'}{' '}
                                            -{' '}
                                            {timeWindow?.pulang_end ?? '18:00'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">
                                        Lokasi Presensi
                                    </h3>
                                    <Button
                                        variant="neutral"
                                        size="sm"
                                        className="rounded-full bg-black px-4 text-white hover:bg-gray-800"
                                        onClick={() =>
                                            setIsSetLocationOpen(true)
                                        }
                                    >
                                        <MapPin className="mr-2 size-3" />
                                        Atur Lokasi
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="font-medium text-gray-600">
                                            Status
                                        </span>
                                        <span className="font-medium text-gray-500">
                                            {locationSetting?.enabled === false
                                                ? 'Nonaktif'
                                                : 'Aktif'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="font-medium text-gray-600">
                                            Radius
                                        </span>
                                        <span className="font-mono text-gray-500">
                                            {locationSetting?.radius_meters ??
                                                100}{' '}
                                            meter
                                        </span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="font-medium text-gray-600">
                                            Koordinat
                                        </span>
                                        <span className="max-w-44 text-right font-mono text-xs text-gray-500">
                                            {locationSetting?.configured
                                                ? `${locationSetting.latitude}, ${locationSetting.longitude}`
                                                : 'Belum diatur'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    </div>

                    {/* Statistik Kehadiran (Kanan) */}
                    <DashboardCard className="overflow-hidden lg:col-span-8">
                        <CardContent className="grid grid-cols-2 p-0 md:grid-cols-3">
                            {[
                                {
                                    label: 'Semua Absen',
                                    val: stats.total_attendance,
                                    color: 'text-slate-900',
                                    bg: 'bg-slate-50/50',
                                    icon: (
                                        <ClipboardList className="size-5 text-slate-500" />
                                    ),
                                },
                                {
                                    label: 'Hadir',
                                    val: stats.total_present,
                                    color: 'text-green-600',
                                    bg: 'bg-green-50/30',
                                    icon: (
                                        <CheckCircle2 className="size-5 text-green-600" />
                                    ),
                                },
                                {
                                    label: 'Terlambat',
                                    val: stats.total_late,
                                    color: 'text-gray-900',
                                    bg: '',
                                    icon: (
                                        <AlertTriangle className="size-5 text-orange-400" />
                                    ),
                                },
                                {
                                    label: 'Alpha',
                                    val: stats.total_alpha,
                                    color: 'text-red-600',
                                    bg: '',
                                    icon: (
                                        <XCircle className="size-5 text-red-600" />
                                    ),
                                },
                                {
                                    label: 'Izin',
                                    val: stats.total_izin,
                                    color: 'text-blue-600',
                                    bg: '',
                                    icon: (
                                        <FileText className="size-5 text-blue-500" />
                                    ),
                                },
                                {
                                    label: 'Sakit',
                                    val: stats.total_sakit,
                                    color: 'text-purple-600',
                                    bg: '',
                                    icon: (
                                        <HeartPulse className="size-5 text-purple-500" />
                                    ),
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex min-h-36 flex-col items-center justify-center gap-1 border-r border-b p-6 text-center transition-colors hover:bg-gray-50/50 md:nth-[3n]:border-r-0 md:nth-[n+4]:border-b-0 ${item.bg}`}
                                >
                                    <p className="text-sm font-medium text-gray-500">
                                        {item.label}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <h3
                                            className={`text-2xl font-bold md:text-3xl ${item.color}`}
                                        >
                                            {item.val ?? 0}
                                        </h3>
                                        {item.icon}
                                    </div>
                                </div>
                            ))}
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
                                {/* <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.get(route('presence.export'))
                                    }
                                >
                                    <Download className="mr-2 size-4" />
                                    Export
                                </Button> */}
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
                <SetLocationModal
                    isOpen={isSetLocationOpen}
                    onClose={() => setIsSetLocationOpen(false)}
                    locationSetting={
                        locationSetting ?? {
                            latitude: null,
                            longitude: null,
                            radius_meters: 100,
                            enabled: true,
                            configured: false,
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

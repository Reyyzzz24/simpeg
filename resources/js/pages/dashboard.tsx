import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarCheck,
    Clock,
    FileText,
    GraduationCap,
    Megaphone,
    ShieldCheck,
    UserCheck,
    Users,
    Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AnnouncementCard } from '@/components/announcements/announcement-card';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardContent } from '@/components/ui/card';
import { useFirstName } from '@/hooks/use-first-name';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

const defaultQuickAccess = {
    salary_slip: { available: false, period: null },
    work_report: { submitted_today: false, attendance_status: null },
};

const defaultPersonalSummary = {
    today_status: 'Belum absen',
    jam_masuk: null,
    jam_pulang: null,
    monthly_present: 0,
    monthly_late: 0,
    monthly_records: 0,
};

const roleDisplay: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Administrator',
    guru: 'Guru',
    pegawai: 'Pegawai',
    user: 'Pengguna',
};

const Dashboard = () => {
    const page = usePage<SharedData>();
    const {
        auth,
        stats: initialStats = null,
        recent: initialRecent = [],
        trend: initialTrend = [],
        quickAccess: initialQuickAccess = defaultQuickAccess,
        announcements: initialAnnouncements = [],
        personalSummary: initialPersonalSummary = defaultPersonalSummary,
        isManagementDashboard: initialIsManagementDashboard = false,
    } = page.props as any;

    const firstName = useFirstName(auth.user.name);
    const userRole = roleDisplay[auth.user.role] ?? 'Pengguna';
    const permissions = auth.permissions ?? [];
    const isManagementDashboard =
        initialIsManagementDashboard ||
        ['superadmin', 'admin'].includes(auth.user.role);

    const [stats, setStats] = useState<any>(
        initialStats ?? {
            total_users: 0,
            total_employees: 0,
            total_teachers: 0,
            total_admins: 0,
            total_superadmins: 0,
            total_present: 0,
            total_late: 0,
            total_absent: 0,
        },
    );
    const [recent, setRecent] = useState<any[]>(initialRecent ?? []);
    const [trend, setTrend] = useState<any[]>(initialTrend ?? []);
    const [quickAccess, setQuickAccess] = useState<any>(
        initialQuickAccess ?? defaultQuickAccess,
    );
    const [personalSummary, setPersonalSummary] = useState<any>(
        initialPersonalSummary ?? defaultPersonalSummary,
    );
    const [announcements] = useState<any[]>(initialAnnouncements ?? []);
    const [calendar, setCalendar] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const res = await fetch('/dashboard/data', {
                    headers: { Accept: 'application/json' },
                });

                if (!res.ok) {
                    return;
                }

                const json = await res.json();

                if (!mounted) {
                    return;
                }

                setStats((current: any) => json.stats ?? current);
                setRecent(json.recent ?? []);
                setTrend(json.trend ?? []);
                setQuickAccess(json.quickAccess ?? defaultQuickAccess);
                setPersonalSummary(
                    json.personalSummary ?? defaultPersonalSummary,
                );
            } catch (e) {
                console.error(e);
            }
        };

        fetchData();
        const id = setInterval(fetchData, 10000);

        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, []);

    useEffect(() => {
        const fetchCalendar = async () => {
            const res = await fetch(
                `/dashboard/calendar?mode=month&user_id=${auth.user.id}`,
            );
            const json = await res.json();
            setCalendar(json);
        };

        fetchCalendar();
        const id = setInterval(fetchCalendar, 60000);

        return () => clearInterval(id);
    }, [auth.user.id]);

    const statusMap = useMemo(() => {
        return (calendar ?? []).reduce(
            (acc: Record<string, string>, item: any) => {
                if (item?.date && item?.status) {
                    acc[item.date] = item.status;
                }

                return acc;
            },
            {},
        );
    }, [calendar]);

    const modifiers = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
            present: (date: Date) =>
                statusMap[format(date, 'yyyy-MM-dd')] === 'present',
            late: (date: Date) =>
                statusMap[format(date, 'yyyy-MM-dd')] === 'late',
            alpha: (date: Date) =>
                statusMap[format(date, 'yyyy-MM-dd')] === 'alpha' &&
                date <= today,
        };
    }, [statusMap]);

    const modifiersClassNames = {
        present: 'text-green-500 font-bold',
        late: 'text-amber-500 font-bold',
        alpha: 'text-red-500 font-bold',
    };

    const avgPresenceRate = useMemo(() => {
        if (!trend?.length) {
            return 0;
        }

        return Math.round(
            trend.reduce(
                (acc: number, item: any) => acc + (item.present_rate ?? 0),
                0,
            ) / trend.length,
        );
    }, [trend]);

    const can = (permission: string) =>
        isManagementDashboard || permissions.includes(permission);
    const headerDescription = isManagementDashboard
        ? 'Pantau kehadiran, aktivitas pegawai, dan pengumuman internal sekolah.'
        : 'Pantau status presensi pribadi dan informasi internal sekolah.';

    const calendarSection = (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">Presensi Anda</h3>
            <DashboardCard>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        className="mx-auto w-full"
                    />

                    <div className="border-t bg-gray-50/50 p-4">
                        <div className="flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span>Hadir</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                <span>Terlambat</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                <span>Absen</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </DashboardCard>
        </div>
    );

    const announcementsSection = (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <SectionHeader title="Pengumuman Internal" />
                {can('announcements.view') && (
                    <Link href="/announcement">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-600 hover:text-blue-700"
                        >
                            Lihat Semua
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {announcements.length > 0 ? (
                    announcements.map((item: any) => (
                        <DashboardCard
                            key={item.id}
                            className="group border-l-4 border-l-blue-500 transition-all duration-300 hover:border-blue-200 hover:shadow-md"
                        >
                            <AnnouncementCard
                                announcement={item}
                                className="border-0 bg-transparent shadow-none"
                            />
                        </DashboardCard>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 opacity-50">
                        <p className="text-sm">Belum ada pengumuman baru</p>
                    </div>
                )}
            </div>
        </div>
    );

    const personalQuickAccess = (
        <div className="space-y-4">
            <SectionHeader title="Akses Cepat" />
            <div className="flex flex-col gap-3">
                {can('presence.self') && (
                    <Link href="/presence/self">
                        <DashboardCard className="cursor-pointer transition-colors hover:bg-gray-50">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                    <CalendarCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Absensi Saya
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Buka halaman presensi pribadi
                                    </p>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    </Link>
                )}

                {can('payroll.view') && (
                    <Link href="/payroll">
                        <DashboardCard className="cursor-pointer transition-colors hover:bg-gray-50">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                    <Wallet className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Slip Gaji
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {quickAccess.salary_slip?.available
                                            ? `Periode ${quickAccess.salary_slip.period} tersedia`
                                            : 'Belum ada slip gaji terbaru'}
                                    </p>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    </Link>
                )}

                {can('announcements.view') && (
                    <Link href="/announcement">
                        <DashboardCard className="cursor-pointer transition-colors hover:bg-gray-50">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                                    <Megaphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Pengumuman
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Lihat informasi terbaru sekolah
                                    </p>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    </Link>
                )}

                <DashboardCard>
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Status Kehadiran Hari Ini
                            </p>
                            <p className="text-xs text-gray-500">
                                {quickAccess.work_report?.attendance_status ??
                                    'Belum ada data kehadiran'}
                            </p>
                        </div>
                    </CardContent>
                </DashboardCard>
            </div>
        </div>
    );

    const managementDashboard = (
        <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-[2] flex-col gap-8">
                <div className="space-y-4">
                    <SectionHeader title="Ringkasan Data" />
                    <div className="grid gap-6 md:grid-cols-4">
                        <DashboardCard animation="fade-up" delay={0.2}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                        <Users className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Pegawai
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {stats.total_employees ?? 0}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard animation="fade-up" delay={0.4}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
                                        <GraduationCap className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Guru
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {stats.total_teachers ?? 0}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard animation="fade-up" delay={0.6}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Admin
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {stats.total_admins ?? 0}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard animation="fade-up" delay={0.8}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-rose-100 p-3 text-rose-600">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Super Admin
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {stats.total_superadmins ?? 0}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <SectionHeader title="Tren Kehadiran 7 Hari" />
                        <span className="text-xs text-gray-500">
                            Rata-rata hadir {avgPresenceRate}%
                        </span>
                    </div>
                    <DashboardCard>
                        <CardContent className="space-y-4 p-6">
                            {trend.length > 0 ? (
                                trend.map((item: any) => (
                                    <div key={item.date} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium">
                                                {item.label}
                                            </span>
                                            <span className="text-gray-500">
                                                {item.present}/
                                                {stats.total_users} hadir
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100">
                                            <div
                                                className="h-2 rounded-full bg-blue-500 transition-all"
                                                style={{
                                                    width: `${Math.max(4, item.present_rate ?? 0)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Belum ada data tren kehadiran.
                                </p>
                            )}
                        </CardContent>
                    </DashboardCard>
                </div>

                {announcementsSection}

                <div className="space-y-4">
                    <SectionHeader title="Presensi Terbaru" />
                    <DashboardCard>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {recent.length > 0 ? (
                                    recent.slice(0, 5).map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {item.user}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.nip}
                                                </p>
                                            </div>
                                            <div className="text-right text-xs">
                                                <p>
                                                    Masuk:{' '}
                                                    {item.jam_masuk ?? '-'}
                                                </p>
                                                <p className="text-gray-500">
                                                    Pulang:{' '}
                                                    {item.jam_pulang ?? '-'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Belum ada aktivitas presensi hari ini.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-8 lg:max-w-sm">
                {calendarSection}
                {personalQuickAccess}
            </div>
        </div>
    );

    const personalDashboard = (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Kolom Kiri: Ringkasan & Pengumuman */}
            <div className="flex flex-[2] flex-col gap-8">
                <div className="space-y-4">
                    <SectionHeader title="Ringkasan Pribadi" />
                    <div className="grid gap-6 md:grid-cols-4">
                        <DashboardCard>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                        <Clock className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Status Hari Ini
                                        </p>
                                        <h4 className="text-lg font-bold">
                                            {personalSummary.today_status}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                        <UserCheck className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Jam Masuk
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {personalSummary.jam_masuk ?? '-'}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                                        <CalendarCheck className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Jam Pulang
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {personalSummary.jam_pulang ?? '-'}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Hadir Bulan Ini
                                        </p>
                                        <h4 className="text-2xl font-bold">
                                            {personalSummary.monthly_present}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </DashboardCard>
                    </div>
                </div>

                {announcementsSection}
            </div>

            <div className="flex flex-1 flex-col gap-8 lg:max-w-sm">
                {calendarSection}

                <div className="space-y-4">
                    <SectionHeader title="Informasi Presensi" />
                    <DashboardCard>
                        <CardContent className="space-y-4 p-6 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    Catatan bulan ini
                                </span>
                                <span className="font-semibold">
                                    {personalSummary.monthly_records}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    Terlambat bulan ini
                                </span>
                                <span className="font-semibold">
                                    {personalSummary.monthly_late}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    Status hari ini
                                </span>
                                <span className="font-semibold">
                                    {personalSummary.today_status}
                                </span>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                {personalQuickAccess}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Dashboard Kepegawaian" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title={`Halo, ${firstName}!`}
                    subtitle={`${userRole} — Sistem Informasi Kepegawaian SMKKPDM`}
                    description={headerDescription}
                    gradient={
                        isManagementDashboard
                            ? 'bg-linear-to-r from-blue-600 to-indigo-500'
                            : 'bg-linear-to-r from-emerald-600 to-blue-500'
                    }
                    icon={
                        isManagementDashboard ? (
                            <ShieldCheck className="size-20" />
                        ) : (
                            <UserCheck className="size-20" />
                        )
                    }
                    shadowColor={
                        isManagementDashboard
                            ? 'shadow-blue-200/50'
                            : 'shadow-emerald-200/50'
                    }
                />

                {isManagementDashboard
                    ? managementDashboard
                    : personalDashboard}
            </div>
        </>
    );
};

export default Dashboard;

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

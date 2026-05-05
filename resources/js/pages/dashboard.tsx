import { AnnouncementCard } from '@/components/announcements/announcement-card';
import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useFirstName } from '@/hooks/use-first-name';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Clock, FileText, Wallet } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

const Dashboard = () => {
    const page = usePage<SharedData>();
    const {
        auth,
        stats: initialStats = null,
        recent: initialRecent = [],
        announcements: initialAnnouncements = [],
    } = page.props as any;

    const firstName = useFirstName(auth.user.name);

    // =========================
    // STATE
    // =========================
    const [stats, setStats] = useState<any>(
        initialStats ?? {
            total_users: 0,
            total_present: 0,
            total_late: 0,
            total_absent: 0,
        }
    );

    const [announcements] = useState<any[]>(initialAnnouncements ?? []);
    const [calendar, setCalendar] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // =========================
    // FETCH DASHBOARD DATA
    // =========================
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const res = await fetch('/dashboard/data', {
                    headers: { Accept: 'application/json' },
                });

                if (!res.ok) return;

                const json = await res.json();
                if (!mounted) return;

                setStats(json.stats);
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

    // =========================
    // FETCH CALENDAR
    // =========================
    useEffect(() => {
        const fetchCalendar = async () => {
            const res = await fetch(
                `/dashboard/calendar?mode=month&user_id=${auth.user.id}`
            );

            const json = await res.json();
            setCalendar(json);
        };

        fetchCalendar();
        const id = setInterval(fetchCalendar, 60000);

        return () => clearInterval(id);
    }, []);

    // =========================
    // MAP STATUS
    // =========================
    const statusMap = useMemo(() => {
        return (calendar ?? []).reduce((acc: Record<string, string>, item: any) => {
            if (item?.date && item?.status) {
                acc[item.date] = item.status;
            }
            return acc;
        }, {});
    }, [calendar]);


    const modifiers = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset waktu ke jam 00:00 agar perbandingan akurat

        return {
            present: (date: Date) => {
                const key = format(date, 'yyyy-MM-dd');
                return statusMap[key] === 'present';
            },
            late: (date: Date) => {
                const key = format(date, 'yyyy-MM-dd');
                return statusMap[key] === 'late';
            },
            alpha: (date: Date) => {
                const key = format(date, 'yyyy-MM-dd');
                // Hanya tandai alpha jika tanggal tersebut adalah hari ini atau masa lalu
                return statusMap[key] === 'alpha' && date <= today;
            },
        };
    }, [statusMap]);

    const modifiersClassNames = {
        present: 'text-green-500 font-bold',
        late: 'text-amber-500 font-bold',
        alpha: 'text-red-500 font-bold',
    };
    return (
        <>
            <Head title="Dashboard Kepegawaian" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title={`Halo, ${firstName}!`}
                    subtitle="Sistem Informasi Kepegawaian SMKKPDM"
                    description="Kelola absensi, lembur, dan penggajian dengan lebih mudah hari ini."
                    gradient="bg-linear-to-r from-blue-600 to-indigo-500"
                    icon="🎓"
                    shadowColor="shadow-blue-200/50"
                />

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* LEFT SIDE (Stats & Announcements) */}
                    <div className="flex flex-[2] flex-col gap-8">
                        {/* Ringkasan Data Section */}
                        <div className="space-y-4">
                            <SectionHeader title="Ringkasan Data" />
                            <div className="grid gap-6 md:grid-cols-3">
                                <DashboardCard animation="fade-up" delay={0.2}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                                <Users className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Total Pegawai</p>
                                                <h4 className="text-2xl font-bold">{stats.total_users}</h4>
                                            </div>
                                        </div>
                                    </CardContent>
                                </DashboardCard>

                                <DashboardCard animation="fade-up" delay={0.4}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-lg bg-green-100 p-3 text-green-600">
                                                <Clock className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Hadir Hari Ini</p>
                                                <h4 className="text-2xl font-bold">{stats.total_present}</h4>
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
                                                <p className="text-sm font-medium text-gray-500">Terlambat</p>
                                                <h4 className="text-2xl font-bold">{stats.total_late}</h4>
                                            </div>
                                        </div>
                                    </CardContent>
                                </DashboardCard>
                            </div>
                        </div>

                        {/* Announcements Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <SectionHeader title="Pengumuman Internal" />
                                <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                                    Lihat Semua
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                {announcements.length > 0 ? (
                                    announcements.map((item: any) => (
                                        <DashboardCard
                                            key={item.id}
                                            className="group transition-all duration-300 hover:shadow-md hover:border-blue-200 border-l-4 border-l-blue-500"
                                        >
                                            <AnnouncementCard
                                                announcement={item}
                                                className="border-0 shadow-none bg-transparent"
                                            />
                                        </DashboardCard>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl opacity-50">
                                        <p className="text-sm">Belum ada pengumuman baru</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE (Calendar & Quick Access) */}
                    <div className="flex flex-1 flex-col gap-8 lg:max-w-sm">

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

                        <div className="space-y-4">
                            <SectionHeader title="Akses Cepat" />
                            <div className="flex flex-col gap-3">
                                <DashboardCard className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <Wallet className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Slip Gaji</p>
                                            <p className="text-xs text-gray-500">Periode Maret tersedia</p>
                                        </div>
                                    </CardContent>
                                </DashboardCard>

                                <DashboardCard className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Laporan Kerja</p>
                                            <p className="text-xs text-gray-500">Lengkapi log harian</p>
                                        </div>
                                    </CardContent>
                                </DashboardCard>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};;

export default Dashboard;

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
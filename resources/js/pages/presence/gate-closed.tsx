import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Moon,
    RefreshCcw,
    Sun,
    Sunrise,
    Sunset,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface GateDailyPresenceClosedProps {
    message: string;
    timeStatus: string;
    timeWindow: {
        masuk_start: string;
        masuk_end: string;
        pulang_start: string;
        pulang_end: string;
    };
    nextActive: {
        type?: 'masuk' | 'pulang';
        time?: string;
        message?: string;
    } | null;
}

export default function GateDailyPresenceClosed({
    message,
    timeStatus,
    timeWindow,
    nextActive,
}: GateDailyPresenceClosedProps) {
    const [timeUntilNext, setTimeUntilNext] = useState<string>('--:--:--');
    const [nextType, setNextType] = useState<string>('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateCountdown = () => {
            if (!nextActive?.time) {
                setTimeUntilNext('--:--:--');
                return;
            }

            const now = new Date();
            const nextTime = new Date(nextActive.time);

            // If next time is tomorrow
            if (nextTime <= now) {
                nextTime.setDate(nextTime.getDate() + 1);
            }

            const diff = nextTime.getTime() - now.getTime();

            if (diff <= 0) {
                // Time to refresh the page
                router.reload();
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeUntilNext(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            );
            setNextType(nextActive.type || '');
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextActive]);

    const handleRefresh = () => {
        router.reload();
    };

    const getNextTypeLabel = () => {
        return nextType === 'masuk'
            ? 'Presensi Masuk'
            : nextType === 'pulang'
              ? 'Presensi Pulang'
              : 'Presensi Berikutnya';
    };

    const getNextTypeIcon = () => {
        if (nextType === 'masuk') {
            return <Sunrise className="h-8 w-8 text-orange-400" />;
        }
        if (nextType === 'pulang') {
            return <Sunset className="h-8 w-8 text-purple-400" />;
        }
        return <Clock className="h-8 w-8 text-blue-400" />;
    };

    const getStatusIcon = () => {
        if (timeStatus.includes('Tidak Ada Presensi')) {
            return <Moon className="h-20 w-20 text-indigo-400" />;
        }
        if (timeStatus.includes('Bukan Hari Sekolah')) {
            return <Calendar className="h-20 w-20 text-gray-400" />;
        }
        return <Clock className="h-20 w-20 text-blue-400" />;
    };

    const getGradientColor = () => {
        if (timeStatus.includes('Tidak Ada Presensi')) {
            return 'from-indigo-600 to-purple-600';
        }
        if (timeStatus.includes('Bukan Hari Sekolah')) {
            return 'from-gray-600 to-slate-600';
        }
        return 'from-blue-600 to-cyan-600';
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 p-4 text-white">
            <Head title="Presensi Ditutup - Gate" />

            {/* Animated Background Gradient */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-linear-to-br ${getGradientColor()} opacity-10 blur-3xl`}
                />
                <div
                    className={`absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-linear-to-tr ${getGradientColor()} opacity-10 blur-3xl`}
                />
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
                {/* Current Time */}
                <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 font-mono text-lg backdrop-blur-sm">
                    <Clock className="size-5" />
                    {currentTime.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </div>

                {/* Current Date */}
                <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-lg backdrop-blur-sm">
                    <Calendar className="size-5" />
                    {currentTime.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>

                {/* Refresh Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 hover:text-white"
                    onClick={handleRefresh}
                    title="Refresh"
                >
                    <RefreshCcw className="size-5" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex max-w-3xl flex-col items-center gap-10 text-center">
                {/* Icon */}
                <div
                    className={`rounded-full bg-linear-to-br p-8 ${getGradientColor()}/20`}
                >
                    {getStatusIcon()}
                </div>

                {/* Title & Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold md:text-6xl">
                        Presensi Tidak Tersedia
                    </h1>
                    <p className="text-xl text-zinc-400">{message}</p>
                </div>

                {/* Next Active Timer */}
                {nextActive && (
                    <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 backdrop-blur-sm">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            {getNextTypeIcon()}
                            <h2 className="text-2xl font-bold">
                                {getNextTypeLabel()}
                            </h2>
                        </div>

                        <p className="mb-4 text-zinc-400">
                            {nextActive.message}
                        </p>

                        <div
                            className={`rounded-2xl bg-linear-to-r ${
                                nextType === 'masuk'
                                    ? 'from-orange-500/20 to-yellow-500/20'
                                    : 'from-purple-500/20 to-pink-500/20'
                            } p-6`}
                        >
                            <p className="mb-2 text-sm text-zinc-400">
                                Dimulai dalam
                            </p>
                            <div className="font-mono text-5xl font-bold text-white">
                                {timeUntilNext}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            Halaman akan diperbarui otomatis
                        </div>
                    </div>
                )}

                {/* Schedule Information */}
                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold">
                        <Sun className="size-5 text-yellow-400" />
                        Jadwal Presensi
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl bg-blue-500/10 p-4">
                            <div className="flex items-center gap-3">
                                <Sunrise className="h-6 w-6 text-orange-400" />
                                <div className="text-left">
                                    <p className="font-medium">
                                        Presensi Masuk
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        Senin - Sabtu
                                    </p>
                                </div>
                            </div>
                            <div className="font-mono text-lg font-bold text-blue-400">
                                {timeWindow.masuk_start} -{' '}
                                {timeWindow.masuk_end}
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-purple-500/10 p-4">
                            <div className="flex items-center gap-3">
                                <Sunset className="h-6 w-6 text-purple-400" />
                                <div className="text-left">
                                    <p className="font-medium">
                                        Presensi Pulang
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        Senin - Sabtu
                                    </p>
                                </div>
                            </div>
                            <div className="font-mono text-lg font-bold text-purple-400">
                                {timeWindow.pulang_start} -{' '}
                                {timeWindow.pulang_end}
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-zinc-500">
                        QR Code akan muncul otomatis saat waktu presensi dimulai
                    </p>
                </div>

                {/* How to use reminder */}
                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
                    <p className="text-sm text-zinc-400">
                        💡 <strong className="text-zinc-300">Tips:</strong> Buka
                        kamera HP dan arahkan ke QR Code saat waktu presensi
                        aktif
                    </p>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-center gap-4 bg-zinc-900/80 p-4 backdrop-blur-sm">
                <div className="text-sm text-zinc-400">
                    Status: {timeStatus}
                </div>
            </div>
        </div>
    );
}

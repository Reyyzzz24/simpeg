import { Button } from '@/components/ui/button';
import { DailyPresenceQrToken } from '@/types';
import { Head, router } from '@inertiajs/react';
import { 
  Minimize2, 
  Maximize2, 
  Sunrise, 
  Sunset, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  X 
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

interface TimeValidation {
    valid: boolean;
    reason: string;
    message: string;
    current_time: string;
    is_late?: boolean;
    is_early?: boolean;
    deadline?: string;
    start_time?: string;
}

interface GateDailyPresenceProps {
    token: DailyPresenceQrToken; // Token saat ini
    masukToken: DailyPresenceQrToken;
    pulangToken: DailyPresenceQrToken;
    type: 'masuk' | 'pulang';
    timeStatus: string;
    timeWindow: {
        masuk_start: string;
        masuk_end: string;
        pulang_start: string;
        pulang_end: string;
    };
    remainingSeconds: number;
    masukValidation: TimeValidation;
    pulangValidation: TimeValidation;
}

export default function GateDailyPresence({
    token,
    masukToken,
    pulangToken,
    type,
    timeStatus,
    timeWindow,
    remainingSeconds,
    masukValidation,
    pulangValidation,
}: GateDailyPresenceProps) {
    const [selectedType, setSelectedType] = useState<'masuk' | 'pulang'>(type);
    const [timeLeft, setTimeLeft] = useState(remainingSeconds);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
    const [currentTime, setCurrentTime] = useState(new Date());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Mengambil data validasi sesuai tab yang dipilih
    const currentValidation = selectedType === 'pulang' ? pulangValidation : masukValidation;

    // Sinkronisasi status jaringan
    useEffect(() => {
        const handleStatus = () => setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);
        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    // Digital Clock 1 detik
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Fungsi refresh token otomatis
    const refreshToken = useCallback(async () => {
        if (networkStatus === 'offline' || isLoading) return;

        setIsLoading(true);
        try {
            // Memanggil endpoint Laravel untuk regenerasi token di server
            router.reload({
                only: ['token', 'masukToken', 'pulangToken', 'remainingSeconds', 'masukValidation', 'pulangValidation'],
                onFinish: () => setIsLoading(false)
            });
        } catch (error) {
            console.error('Gagal memperbarui token:', error);
            setIsLoading(false);
        }
    }, [networkStatus, isLoading]);

    // Timer Countdown
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current as any);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    refreshToken();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current as any); };
    }, [refreshToken]);

    // Reset timer saat props berubah dari server
    useEffect(() => {
        if (token?.value) {
            setTimeLeft(remainingSeconds);
        }
    }, [remainingSeconds, token?.value]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Helper Visual
    const getTypeLabel = (t: 'masuk' | 'pulang') => t === 'masuk' ? 'Presensi Masuk' : 'Presensi Pulang';
    const getTypeGradient = (t: 'masuk' | 'pulang') => t === 'masuk'
        ? 'from-blue-600 to-cyan-500'
        : 'from-emerald-600 to-teal-500';

    // Link yang di-embed ke QR Code
    // Format: domain.com/presence/scan/{token}
    const currentTokenValue = selectedType === 'masuk' ? masukToken?.value : pulangToken?.value;
    const scanUrl = `${window.location.origin}/presence/scan/${currentTokenValue || ''}`;

    // Compatibility wrapper: some bundlers expose the default export as an object
    const QR: any = (QRCode as any)?.default ?? QRCode;

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 p-4 text-white">
            <Head title={`${getTypeLabel(selectedType)} - QR Gate SIMPEG`} />

            {/* Background Decor */}
            <div className="pointer-events-none absolute inset-0">
                <div className={`absolute -top-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-linear-to-br ${getTypeGradient(selectedType)} opacity-10 blur-[120px] transition-all duration-700`} />
                <div className={`absolute -bottom-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-linear-to-tr ${getTypeGradient(selectedType)} opacity-10 blur-[120px] transition-all duration-700`} />
            </div>

            {/* Top Navigation & Info */}
            <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md bg-white/5 border border-white/10`}>
                        <div className={`h-2 w-2 rounded-full ${networkStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                        {networkStatus === 'online' ? 'Sistem Online' : 'Sistem Offline'}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-5 py-2 font-mono text-xl backdrop-blur-md">
                        <Clock className="size-5 text-zinc-400" />
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="rounded-full bg-white/5 hover:bg-white/10">
                        {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                    </Button>
                </div>
            </div>

            {/* Selector Tab */}
            <div className="absolute top-24 left-1/2 z-10 -translate-x-1/2">
                <div className="flex gap-2 rounded-2xl bg-white/5 p-1.5 backdrop-blur-xl border border-white/10">
                    {(['masuk', 'pulang'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className={`flex items-center gap-2 rounded-xl px-8 py-3 text-lg font-bold transition-all ${selectedType === t
                                ? `bg-linear-to-r ${getTypeGradient(t)} text-white shadow-xl scale-105`
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {t === 'masuk' ? <Sunrise className="size-5" /> : <Sunset className="size-5" />}
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Section */}
            <div className="relative z-10 mt-20 flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-around">

                {/* Information Panel */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className={`mb-4 inline-flex items-center gap-3 rounded-2xl px-5 py-2 text-sm font-bold uppercase tracking-widest ${getTypeGradient(selectedType)} shadow-lg shadow-current/20`}>
                        {selectedType === 'masuk' ? 'Shift Pagi' : 'Shift Sore/Pulang'}
                    </div>

                    <h1 className="text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl">
                        SILAKAN <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-white/40">ABSENSI.</span>
                    </h1>

                    {/* Status Alert */}
                    <div className="mt-8 space-y-4 w-full max-w-md">
                        {currentValidation.is_late && (
                            <div className="flex items-center gap-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 p-5 text-orange-400">
                                <AlertTriangle className="size-8" />
                                <div>
                                    <p className="font-bold">STATUS: TERLAMBAT</p>
                                    <p className="text-sm opacity-80">Batas toleransi masuk: {timeWindow.masuk_end}</p>
                                </div>
                            </div>
                        )}

                        {!currentValidation.is_late && selectedType === 'masuk' && (
                            <div className="flex items-center gap-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 text-blue-400">
                                <Clock className="size-8" />
                                <div>
                                    <p className="font-bold">STATUS: TEPAT WAKTU</p>
                                    <p className="text-sm opacity-80">Semangat bekerja untuk hari ini!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <p className="text-xs text-zinc-500 uppercase font-bold">Buka Aplikasi</p>
                            <p className="text-sm">Scan via Kamera atau SIMPEG Mobile</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <p className="text-xs text-zinc-500 uppercase font-bold">Verifikasi</p>
                            <p className="text-sm">Pastikan muncul notifikasi "Berhasil"</p>
                        </div>
                    </div>
                </div>

                {/* QR Code Panel */}
                <div className="flex flex-col items-center">
                    <div className="group relative">
                        {/* QR Glow Effect */}
                        <div className={`absolute -inset-4 rounded-[40px] bg-linear-to-r ${getTypeGradient(selectedType)} opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40`} />

                        <div
                            className="relative cursor-pointer rounded-[32px] bg-white p-8 shadow-2xl transition-transform hover:scale-[1.02] active:scale-95 md:p-12"
                            onClick={() => setShowQrModal(true)}
                        >
                            <QR
                                size={280}
                                value={scanUrl}
                                level="H"
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            />

                            <div className="mt-4 text-center">
                                <a
                                    href={scanUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-zinc-300 underline"
                                >
                                    Tes absen lewat link
                                </a>
                            </div>

                            {/* Overlay Loading */}
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-[32px] bg-white/90 backdrop-blur-sm">
                                    <RotateCcw className="size-12 animate-spin text-zinc-800" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timer Circle */}
                    <div className="mt-10 flex flex-col items-center gap-2">
                        <div className={`flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-8 py-4 font-mono text-4xl font-black ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                            <span className="text-zinc-500 text-lg">RESET:</span>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <p className="text-sm text-zinc-500 italic">QR diperbarui otomatis demi keamanan data</p>
                    </div>
                </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/5 border-t border-white/10 px-8 py-4 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-2 text-sm font-medium text-zinc-400">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        Masuk: {timeWindow.masuk_start} - {timeWindow.masuk_end}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Pulang: {timeWindow.pulang_start} - {timeWindow.pulang_end}
                    </div>
                    <div className="hidden md:block text-zinc-600">|</div>
                    <div className="flex items-center gap-2">
                        IP Address: {new URL(scanUrl).hostname}
                    </div>
                </div>
            </div>

            {/* Fullscreen QR Modal */}
            {showQrModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 p-4 backdrop-blur-2xl animate-in fade-in duration-300"
                    onClick={() => setShowQrModal(false)}
                >
                    <button className="absolute top-10 right-10 text-white/50 hover:text-white">
                        <X className="size-12" />
                    </button>
                    <div className="w-full max-w-[80vh] rounded-[40px] bg-white p-12 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <QR
                            size={1024}
                            value={scanUrl}
                            level="H"
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                        />

                        <div className="mt-6 text-center">
                            <a
                                href={scanUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                            >
                                Tes absen (buka link)
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
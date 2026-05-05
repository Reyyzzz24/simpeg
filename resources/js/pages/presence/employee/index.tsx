import { DashboardCard } from '@/components/dashboard-card';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Camera,
    CheckCircle2,
    Clock,
    Monitor,
    QrCode,
    RefreshCw,
    ScanFace,
    Smartphone,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type PresenceType = 'masuk' | 'pulang';
type PresenceMode = 'qr' | 'face';

type Props = {
    todayPresence: {
        tanggal: string;
        jam_masuk: string | null;
        jam_pulang: string | null;
        status: string | null;
    };
    user: {
        name: string;
        role: string;
    };
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Absensi Saya', href: '/presence/self' },
];

export default function EmployeePresenceIndex({ todayPresence, user }: Props) {
    const { flash } = usePage<any>().props;
    const [mode, setMode] = useState<PresenceMode | null>(null);
    const [type, setType] = useState<PresenceType>(
        todayPresence.jam_masuk && !todayPresence.jam_pulang
            ? 'pulang'
            : 'masuk',
    );
    const [cameraError, setCameraError] = useState('');
    const [detectedQr, setDetectedQr] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanTimerRef = useRef<number | null>(null);

    const modeLabel =
        mode === 'qr'
            ? 'Scan QR'
            : mode === 'face'
              ? 'Face Recognition'
              : 'Pilih Metode Absensi';
    const isQrMode = mode === 'qr';

    const statusText = useMemo(() => {
        if (!todayPresence.jam_masuk) {
            return 'Belum absen masuk';
        }

        if (!todayPresence.jam_pulang) {
            return 'Sudah absen masuk';
        }

        return 'Absensi hari ini lengkap';
    }, [todayPresence]);

    const stopCamera = () => {
        if (scanTimerRef.current) {
            window.clearInterval(scanTimerRef.current);
            scanTimerRef.current = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsCameraReady(false);
    };

    const scanQrFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const BarcodeDetector = (window as any).BarcodeDetector;

        if (!video || !canvas || !BarcodeDetector || video.readyState < 2) {
            return;
        }

        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);

        const codes = await detector.detect(canvas);
        const rawValue = codes?.[0]?.rawValue;

        if (!rawValue) {
            return;
        }

        setDetectedQr(rawValue);

        const token = rawValue.match(/\/presence\/scan\/([^/?#]+)/)?.[1];
        if (token) {
            stopCamera();
            router.visit(`/presence/scan/${token}`);
        }
    };

    const startCamera = async () => {
        if (!mode) {
            return;
        }

        stopCamera();
        setCameraError('');
        setDetectedQr('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: isQrMode ? 'environment' : 'user',
                },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setIsCameraReady(true);
            }

            if (isQrMode) {
                if (!('BarcodeDetector' in window)) {
                    setCameraError(
                        'Browser ini belum mendukung pembaca QR otomatis. Buka link QR langsung atau gunakan browser terbaru.',
                    );
                    return;
                }

                scanTimerRef.current = window.setInterval(() => {
                    scanQrFrame().catch(() => undefined);
                }, 700);
            }
        } catch {
            setCameraError(
                'Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan.',
            );
        }
    };

    useEffect(() => {
        if (!mode) {
            stopCamera();
            return;
        }

        startCamera();

        return stopCamera;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const submitFacePresence = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        let faceImage = '';

        if (video && canvas && video.readyState >= 2) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0);
            faceImage = canvas.toDataURL('image/jpeg', 0.75);
        }

        setIsSubmitting(true);
        router.post(
            '/presence/self/face',
            {
                type,
                face_image: faceImage,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <>
            <Head title="Absensi Saya" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Absensi Saya"
                    subtitle={`${user.name} - ${user.role}`}
                    description="Lakukan absensi dengan scan QR atau verifikasi wajah melalui kamera perangkat."
                    gradient="bg-linear-to-r from-sky-600 to-emerald-500"
                    icon={<Camera className="size-20 text-white" />}
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                <Clock />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Jam Masuk
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {todayPresence.jam_masuk ?? '--:--'}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
                                <CheckCircle2 />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Jam Pulang
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {todayPresence.jam_pulang ?? '--:--'}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-violet-100 p-3 text-violet-600">
                                {isQrMode ? <Smartphone /> : <Monitor />}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <h3 className="text-xl font-bold">
                                    {statusText}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                {(flash?.success || flash?.error) && (
                    <div
                        className={`rounded-lg border p-4 text-sm ${
                            flash.success
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                        }`}
                    >
                        {flash.success ?? flash.error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {modeLabel}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {mode === 'qr'
                                        ? 'Arahkan kamera ke QR gate presensi.'
                                        : mode === 'face'
                                          ? 'Pastikan wajah terlihat jelas sebelum menekan tombol absen.'
                                          : 'Pilih Scan QR atau Face Recognition untuk membuka kamera.'}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant={mode === 'qr' ? 'default' : 'outline'}
                                    onClick={() => setMode('qr')}
                                >
                                    <QrCode className="mr-2 size-4" />
                                    QR
                                </Button>
                                <Button
                                    variant={
                                        mode === 'face' ? 'default' : 'outline'
                                    }
                                    onClick={() => setMode('face')}
                                >
                                    <ScanFace className="mr-2 size-4" />
                                    Wajah
                                </Button>
                            </div>
                        </div>

                        <div className="relative bg-black">
                            <video
                                ref={videoRef}
                                className="aspect-video w-full object-cover"
                                playsInline
                                muted
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                {mode ? (
                                    <div
                                        className={`${
                                            isQrMode
                                                ? 'size-64 rounded-3xl'
                                                : 'h-72 w-56 rounded-full'
                                        } border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]`}
                                    />
                                ) : (
                                    <div className="rounded-xl bg-black/70 px-6 py-4 text-center text-white">
                                        <Camera className="mx-auto mb-2 size-8" />
                                        Pilih metode absensi terlebih dahulu
                                    </div>
                                )}
                            </div>

                            {mode && !isCameraReady && !cameraError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                                    Membuka kamera...
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                            <div className="text-sm text-muted-foreground">
                                {cameraError ||
                                    (detectedQr
                                        ? 'QR terdeteksi, memproses...'
                                        : mode === 'qr'
                                          ? 'Kamera akan membaca QR secara otomatis.'
                                          : mode === 'face'
                                            ? 'Mode wajah siap digunakan.'
                                            : 'Belum ada metode yang dipilih.')}
                            </div>

                            <Button
                                variant="outline"
                                onClick={startCamera}
                                disabled={!mode}
                            >
                                <RefreshCw className="mr-2 size-4" />
                                Buka Ulang Kamera
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Aksi Absensi</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pilih jenis absensi yang ingin dicatat.
                        </p>

                        <div className="mt-6 grid gap-3">
                            <Button
                                variant={type === 'masuk' ? 'default' : 'outline'}
                                className="justify-start"
                                onClick={() => setType('masuk')}
                            >
                                Absen Masuk
                            </Button>
                            <Button
                                variant={type === 'pulang' ? 'default' : 'outline'}
                                className="justify-start"
                                onClick={() => setType('pulang')}
                            >
                                Absen Pulang
                            </Button>
                        </div>

                        <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
                            <p className="font-medium">Pilih metode</p>
                            <p className="mt-1 text-muted-foreground">
                                Scan QR dan Face Recognition tersedia di HP,
                                tablet, maupun desktop selama perangkat memiliki
                                kamera.
                            </p>
                        </div>

                        <Button
                            className="mt-6 w-full"
                            size="lg"
                            disabled={mode !== 'face' || isSubmitting}
                            onClick={submitFacePresence}
                        >
                            <ScanFace className="mr-2 size-5" />
                            {isSubmitting ? 'Memproses...' : 'Absen Dengan Wajah'}
                        </Button>

                        {mode === 'qr' && (
                            <p className="mt-3 text-center text-xs text-muted-foreground">
                                Untuk scan QR, cukup arahkan kamera ke QR gate
                                yang tampil di layar admin.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

EmployeePresenceIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

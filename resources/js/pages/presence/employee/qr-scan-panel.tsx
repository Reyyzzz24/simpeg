import { router } from '@inertiajs/react';
import { ArrowLeft, Camera, QrCode, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

export default function QrScanPanel() {
    const [isActive, setIsActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [detectedQr, setDetectedQr] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanTimerRef = useRef<number | null>(null);
    const isProcessingQrRef = useRef(false);

    const stopCamera = () => {
        if (scanTimerRef.current) {
            window.clearInterval(scanTimerRef.current);
            scanTimerRef.current = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsCameraReady(false);
    };

    const visitScanWithLocation = (token: string) => {
        if (!navigator.geolocation) {
            setCameraError('Browser belum mendukung fitur lokasi.');
            isProcessingQrRef.current = false;

            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                stopCamera();
                setIsActive(false);
                router.visit(
                    `/presence/scan/${token}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
                );
            },
            () => {
                setCameraError(
                    'Aktifkan izin lokasi terlebih dahulu sebelum melakukan absensi.',
                );
                isProcessingQrRef.current = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    const scanQrFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const BarcodeDetector = (window as any).BarcodeDetector;

        if (
            isProcessingQrRef.current ||
            !video ||
            !canvas ||
            !BarcodeDetector ||
            video.readyState < 2
        ) {
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
            isProcessingQrRef.current = true;

            if (scanTimerRef.current) {
                window.clearInterval(scanTimerRef.current);
                scanTimerRef.current = null;
            }

            visitScanWithLocation(token);
        }
    };

    const startCamera = async () => {
        stopCamera();
        setCameraError('');
        setDetectedQr('');
        isProcessingQrRef.current = false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setIsCameraReady(true);
            }

            if (!('BarcodeDetector' in window)) {
                setCameraError(
                    'Browser ini belum mendukung pembaca QR otomatis. Buka link QR langsung atau gunakan browser terbaru.',
                );

                return;
            }

            scanTimerRef.current = window.setInterval(() => {
                scanQrFrame().catch(() => undefined);
            }, 700);
        } catch {
            setCameraError(
                'Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan.',
            );
        }
    };

    useEffect(() => {
        return stopCamera;
    }, []);

    const handleBack = () => {
        stopCamera();
        setIsActive(false);
        setCameraError('');
        setDetectedQr('');
        isProcessingQrRef.current = false;
    };

    useEffect(() => {
        if (!isActive) {
            return;
        }

        const timeout = window.setTimeout(() => void startCamera(), 0);

        return () => window.clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    return (
        <>
            {!isActive ? (
                <DashboardCard animation="fade-up" delay={0.3}>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center gap-6">
                            {/* Header Area */}
                            <div className="flex w-full items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
                                        <QrCode className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Presensi QR
                                        </p>
                                        <h4 className="text-sm leading-tight font-semibold text-slate-900">
                                            Scan Gate QR
                                        </h4>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsActive(true)}
                                    className="shrink-0 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                                >
                                    <QrCode className="mr-2 size-3" />
                                    Buka Scan
                                </Button>
                            </div>

                            {/* Visual Center Logo (QR Icon) */}
                            <div className="relative flex flex-col items-center justify-center py-4">
                                <div className="relative">
                                    {/* Efek Ring Luar Hijau */}
                                    <div className="absolute -inset-4 animate-pulse rounded-full bg-emerald-50" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-inner">
                                        <QrCode className="size-12" />
                                    </div>
                                </div>
                            </div>

                            {/* Information Footer */}
                            <div className="w-full rounded-lg bg-slate-50 p-3 text-center">
                                <p className="text-xs text-slate-500">
                                    Arahkan kamera ke QR gate presensi untuk
                                    mencatat kehadiran secara otomatis.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </DashboardCard>
            ) : (
                <div className="fixed inset-0 z-[100] flex flex-col bg-black md:items-center md:justify-center md:bg-black/80 md:p-6 md:backdrop-blur-sm">
                    <div className="flex h-dvh w-full flex-col bg-black md:h-[min(760px,calc(100vh-3rem))] md:min-h-0 md:max-w-5xl md:overflow-hidden md:rounded-2xl md:border md:border-white/10 md:shadow-2xl">

                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 p-4">
                            <Button
                                variant="outline"
                                className="border-white/20"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="mr-2 size-4" />
                                Back
                            </Button>

                            <Button
                                variant="outline"
                                className="border-white/20"
                                onClick={startCamera}
                            >
                                <RefreshCw className="mr-2 size-4" />
                                Restart Kamera
                            </Button>
                        </div>

                        {/* Video Area - flex-1 memastikan mengambil ruang tersisa */}
                        <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-black">
                            <video
                                ref={videoRef}
                                className="h-full w-full object-cover"
                                playsInline
                                muted
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="size-64 rounded-3xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] md:size-72" />
                            </div>

                            {!isCameraReady && !cameraError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                                    <div className="text-center">
                                        <Camera className="mx-auto mb-2 size-10" />
                                        Membuka kamera...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 border-t border-white/10 bg-black p-4 text-center">
                            <p className="text-sm text-white/80">
                                {cameraError ||
                                    (detectedQr
                                        ? 'QR terdeteksi, memproses...'
                                        : isCameraReady
                                            ? 'Arahkan kamera ke QR Gate presensi.'
                                            : 'Menunggu kamera siap...')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

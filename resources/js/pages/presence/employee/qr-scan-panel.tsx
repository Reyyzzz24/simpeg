import { router } from '@inertiajs/react';
import { Camera, QrCode, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function QrScanPanel() {
    const [isActive, setIsActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [detectedQr, setDetectedQr] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanTimerRef = useRef<number | null>(null);

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
        stopCamera();
        setIsActive(true);
        setCameraError('');
        setDetectedQr('');

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

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                <div>
                    <h2 className="text-lg font-semibold">Scan QR</h2>
                    <p className="text-sm text-muted-foreground">
                        Arahkan kamera ke QR gate presensi.
                    </p>
                </div>
                <Button variant="outline" onClick={startCamera}>
                    <QrCode className="mr-2 size-4" />
                    Scan QR
                </Button>
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
                    {isActive ? (
                        <div className="size-64 rounded-3xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    ) : (
                        <div className="rounded-xl bg-black/70 px-6 py-4 text-center text-white">
                            <Camera className="mx-auto mb-2 size-8" />
                            Buka kamera QR terlebih dahulu
                        </div>
                    )}
                </div>

                {isActive && !isCameraReady && !cameraError && (
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
                            : isActive
                              ? 'Kamera akan membaca QR secara otomatis.'
                              : 'Belum memulai scan QR.')}
                </div>
                <Button variant="outline" onClick={startCamera}>
                    <RefreshCw className="mr-2 size-4" />
                    Buka Ulang Kamera
                </Button>
            </div>
        </div>
    );
}

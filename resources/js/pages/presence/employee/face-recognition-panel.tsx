import { router } from '@inertiajs/react';
import { ArrowLeft, Camera, RefreshCw, ScanFace, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DashboardCard } from '@/components/dashboard-card';

type PresenceType = 'masuk' | 'pulang';

type Props = {
    type: PresenceType;
    faceRegistered: boolean;
    faceRegisteredAt?: string | null;
    isTeacherCheckout: boolean;
};

export default function FaceRecognitionPanel({
    type,
    faceRegistered,
    faceRegisteredAt,
    isTeacherCheckout,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsCameraReady(false);
    };

    const startCamera = async () => {
        stopCamera();
        setCameraError('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setIsCameraReady(true);
            }
        } catch {
            setCameraError(
                'Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan.',
            );
        }
    };

    useEffect(() => {
        return stopCamera;
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen) return;
        void startCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleBack = () => {
        stopCamera();
        setIsSubmitting(false);
        setCameraError('');
        setIsOpen(false);
    };

    const captureFace = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.readyState < 2) {
            return '';
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);

        return canvas.toDataURL('image/jpeg', 0.82);
    };

    const postFace = (url: string, payload: Record<string, string>) => {
        setIsSubmitting(true);
        router.post(url, payload, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const registerFace = () => {
        const faceImage = captureFace();

        if (!faceImage) {
            setCameraError('Wajah belum terbaca. Buka kamera lalu coba lagi.');

            return;
        }

        postFace('/presence/self/face/register', {
            face_image: faceImage,
        });
    };

    const submitPresence = () => {
        const faceImage = captureFace();

        if (!faceImage) {
            setCameraError('Wajah belum terbaca. Buka kamera lalu coba lagi.');

            return;
        }

        postFace('/presence/self/face', {
            type,
            face_image: faceImage,
        });
    };

    if (!isOpen) {
        return (
            <DashboardCard animation="fade-up" delay={0.2}>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex w-full items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                                    <ScanFace className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Face Recognition</p>
                                    <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                                        {faceRegistered
                                            ? "Wajah Terdaftar"
                                            : "Belum Terdaftar"}
                                    </h4>
                                </div>
                            </div>

                            <Button size="sm" variant="outline" onClick={handleOpen} className="shrink-0">
                                <RefreshCw className="mr-2 size-3" />
                                Buka Kamera
                            </Button>
                        </div>

                        <div className="relative flex flex-col items-center justify-center py-4">
                            <div className="relative">
                                <div className="absolute -inset-4 animate-pulse rounded-full bg-blue-50" />
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner">
                                    <ScanFace className="size-12" />
                                </div>
                            </div>
                        </div>

                        <div className="w-full rounded-lg bg-slate-50 p-3 text-center">
                            <p className="text-xs text-slate-500">
                                {faceRegistered
                                    ? `Terverifikasi pada ${faceRegisteredAt || '-'}`
                                    : "Silakan daftarkan wajah untuk keperluan absensi."}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </DashboardCard>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
                <Button variant="outline" className="border-white/20" onClick={handleBack}>
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-white/20"
                        onClick={startCamera}
                        disabled={isSubmitting}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Restart Kamera
                    </Button>
                </div>
            </div>

            <div className="relative flex-1 bg-black">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    muted
                />
                <canvas ref={canvasRef} className="hidden" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-72 w-56 rounded-full border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                </div>

                {!isCameraReady && !cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                        <div className="text-center">
                            <Camera className="mx-auto mb-2 size-8" />
                            Membuka kamera...
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4 border-t border-white/10 p-4">
                <p className="text-sm text-white/80">
                    {cameraError ||
                        (isTeacherCheckout
                            ? 'Untuk guru, absen pulang lewat wajah tetap akan diarahkan ke formulir jam mengajar.'
                            : 'Pastikan wajah berada di dalam bingkai dan cahaya cukup.')}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                        variant={faceRegistered ? 'outline' : 'default'}
                        disabled={!isCameraReady || isSubmitting}
                        onClick={registerFace}
                    >
                        <ShieldCheck className="mr-2 size-4" />
                        {faceRegistered ? 'Daftar Ulang Wajah' : 'Daftar Wajah'}
                    </Button>
                    <Button
                        disabled={!isCameraReady || !faceRegistered || isSubmitting}
                        onClick={submitPresence}
                    >
                        <ScanFace className="mr-2 size-4" />
                        {isSubmitting ? 'Memproses...' : 'Absen Dengan Wajah'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

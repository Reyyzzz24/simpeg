import { router } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    RefreshCw,
    ScanFace,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardCard } from '@/components/dashboard-card';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

type Props = {
    faceRegistered: boolean;
    faceRegisteredAt?: string | null;
};

export default function FaceRecognitionPanel({
    faceRegistered,
    faceRegisteredAt,
}: Props) {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
            } catch {
                setCameraError('Gagal memuat model biometrik.');
            }
        };
        void loadModels();
    }, []);

    const captureFaceDescriptor = async () => {
        if (!videoRef.current || !modelsLoaded) {
            return null;
        }

        const detection = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            setVerificationError('');
            setCameraError('Wajah tidak terdeteksi atau tidak jelas.');

            return null;
        }

        setCameraError('');

        return Array.from(detection.descriptor);
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsCameraReady(false);
    };

    const startCamera = async () => {
        stopCamera();
        setCameraError('');
        setVerificationError('');

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
        if (!isOpen) {
            return;
        }

        const timeout = window.setTimeout(() => void startCamera(), 0);

        return () => window.clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleBack = () => {
        stopCamera();
        setIsSubmitting(false);
        setCameraError('');
        setVerificationError('');
        setIsOpen(false);
    };

    const registerFace = async () => {
        setIsSubmitting(true);
        setVerificationError('');
        const descriptor = await captureFaceDescriptor();

        if (!descriptor) {
            setIsSubmitting(false);

            return;
        }

        router.post(
            '/presence/self/face/register',
            {
                face_embedding: descriptor,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
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
                                    <p className="text-sm font-medium text-gray-500">
                                        Pendaftaran Wajah
                                    </p>
                                    <h4 className="text-sm leading-tight font-semibold text-slate-900">
                                        {faceRegistered
                                            ? 'Wajah Terdaftar'
                                            : 'Belum Terdaftar'}
                                    </h4>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleOpen}
                                className="shrink-0"
                            >
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

                        <div className="w-full space-y-2 rounded-lg bg-slate-50 p-3 text-center">
                            <p className="text-xs text-slate-500">
                                {faceRegistered
                                    ? `Terverifikasi pada ${faceRegisteredAt || '-'}`
                                    : 'Daftarkan wajah agar bisa absen melalui Face Gate admin.'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                Absensi wajah dilakukan admin di halaman
                                Presensi. Di sini hanya untuk mendaftarkan
                                wajah.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </DashboardCard>
        );
    }

    return (
        // Menggunakan md: untuk membatasi efek modal hanya di layar desktop
        <div className="fixed inset-0 z-[100] flex flex-col bg-black md:items-center md:justify-center md:bg-black/80 md:p-6 md:backdrop-blur-sm">
            {/* Container Utama: h-dvh di mobile agar full, height terbatas di desktop */}
            <div className="flex h-dvh w-full flex-col bg-black md:h-[min(760px,calc(100vh-3rem))] md:max-w-5xl md:overflow-hidden md:rounded-2xl md:border md:border-white/10 md:shadow-2xl">

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 p-4">
                    <Button variant="outline" className="border-white/20" onClick={handleBack}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back
                    </Button>
                    <Button variant="outline" className="border-white/20" onClick={startCamera} disabled={isSubmitting}>
                        <RefreshCw className="mr-2 size-4" />
                        Restart
                    </Button>
                </div>

                {/* Area Video: flex-1 agar mengisi ruang tengah */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        playsInline
                        muted
                    />
                    {/* Bingkai Wajah */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-72 w-56 rounded-full border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
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
                <div className="shrink-0 space-y-4 border-t border-white/10 bg-black p-4">
                    {verificationError ? (
                        <div className="flex items-start gap-3 rounded-lg border border-red-400/40 bg-red-500/15 p-3 text-sm text-red-50">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                            <span>{verificationError}</span>
                        </div>
                    ) : (
                        <p className="text-sm text-white/80">
                            {cameraError || 'Pastikan wajah berada di dalam bingkai dan cahaya cukup.'}
                        </p>
                    )}

                    <Button
                        className="w-full"
                        disabled={!isCameraReady || isSubmitting || !modelsLoaded}
                        onClick={registerFace}
                    >
                        <ShieldCheck className="mr-2 size-4" />
                        {isSubmitting ? 'Menyimpan...' : faceRegistered ? 'Daftar Ulang Wajah' : 'Daftar Wajah'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

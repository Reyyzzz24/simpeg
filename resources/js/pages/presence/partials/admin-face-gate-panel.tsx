import { router, usePage } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    RefreshCw,
    ScanFace,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';

type PresenceType = 'masuk' | 'pulang';

type Props = {
    locationEnabled: boolean;
};

export default function AdminFaceGatePanel({ locationEnabled }: Props) {
    const { flash } = usePage<any>().props;
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<PresenceType>('masuk');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSuccess, setLastSuccess] = useState<string | null>(null);

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

    useEffect(() => {
        if (flash?.success) {
            setLastSuccess(flash.success);
        }
    }, [flash?.success]);

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

    const getLocationErrorMessage = (error: unknown) => {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const code = Number((error as { code: number }).code);

            if (code === 1) {
                return 'Aktifkan izin lokasi terlebih dahulu sebelum melakukan absensi.';
            }

            if (code === 2) {
                return 'Lokasi perangkat belum tersedia. Pastikan GPS/lokasi perangkat menyala.';
            }

            if (code === 3) {
                return 'Pengambilan lokasi terlalu lama. Coba lagi setelah sinyal lokasi stabil.';
            }
        }

        return 'Lokasi perangkat tidak bisa diambil. Pastikan izin lokasi dan GPS sudah menyala.';
    };

    const getCurrentLocation = () => {
        return new Promise<GeolocationPosition>((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Browser belum mendukung fitur lokasi.'));

                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 60000,
            });
        });
    };

    const submitPresence = async () => {
        setIsSubmitting(true);
        setVerificationError('');
        setLastSuccess(null);

        let position: GeolocationPosition | null = null;

        if (locationEnabled) {
            try {
                position = await getCurrentLocation();
            } catch (error) {
                setVerificationError(getLocationErrorMessage(error));
                setIsSubmitting(false);

                return;
            }
        }

        const descriptor = await captureFaceDescriptor();

        if (!descriptor) {
            setIsSubmitting(false);

            return;
        }

        router.post(
            route('presence.face'),
            {
                type,
                face_embedding: descriptor,
                latitude: position?.coords.latitude,
                longitude: position?.coords.longitude,
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageFlash = (page.props as any)?.flash;

                    if (pageFlash?.error) {
                        setVerificationError(pageFlash.error);
                    }

                    if (pageFlash?.success) {
                        setLastSuccess(pageFlash.success);
                        handleBack();
                    }
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setVerificationError(
                        typeof firstError === 'string'
                            ? firstError
                            : 'Gagal memproses absensi wajah.',
                    );
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    if (!isOpen) {
        return (
            <div className="flex flex-col gap-2">
                <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                    onClick={() => setIsOpen(true)}
                >
                    <ScanFace className="mr-2 size-5" />
                    Face Gate
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="flex w-full max-w-4xl h-[85vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 p-4">
                    <Button variant="outline" className="border-white/20" onClick={handleBack}>
                        <ArrowLeft className="mr-2 size-4" />
                        Tutup
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={type === 'masuk' ? 'default' : 'outline'}
                            className="border-white/20"
                            onClick={() => setType('masuk')}
                            disabled={isSubmitting}
                        >
                            Masuk
                        </Button>
                        <Button
                            variant={type === 'pulang' ? 'default' : 'outline'}
                            className="border-white/20"
                            onClick={() => setType('pulang')}
                            disabled={isSubmitting}
                        >
                            Pulang
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white/20"
                            onClick={startCamera}
                            disabled={isSubmitting}
                        >
                            <RefreshCw className="mr-2 size-4" />
                            Restart
                        </Button>
                    </div>
                </div>

                {/* Area Konten Utama (Scrollable) */}
                <div className="flex-1 overflow-y-auto bg-black p-0">
                    <div className="relative flex min-h-[400px] flex-1 items-center justify-center">
                        <video
                            ref={videoRef}
                            className="h-full w-full object-contain"
                            playsInline
                            muted
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="h-80 w-64 rounded-full border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
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
                </div>

                {/* Footer Modal */}
                <div className="shrink-0 space-y-4 border-t border-white/10 bg-black p-6">
                    {verificationError ? (
                        <div className="flex items-start gap-3 rounded-lg border border-red-400/40 bg-red-500/15 p-3 text-sm text-red-50">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                            <span>{verificationError}</span>
                        </div>
                    ) : (
                        <p className="text-sm text-white/80 text-center">
                            {cameraError || 'Scan wajah pegawai/guru. Absensi tercatat ke akun yang cocok.'}
                        </p>
                    )}

                    <Button
                        className="w-full h-12 text-base"
                        disabled={!isCameraReady || isSubmitting || !modelsLoaded}
                        onClick={submitPresence}
                    >
                        <ScanFace className="mr-2 size-5" />
                        {isSubmitting
                            ? 'Memproses...'
                            : `Absen ${type === 'masuk' ? 'Masuk' : 'Pulang'}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
import { router } from '@inertiajs/react';
import { Camera, RefreshCw, ScanFace, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

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

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                <div>
                    <h2 className="text-lg font-semibold">Face Recognition</h2>
                    <p className="text-sm text-muted-foreground">
                        {faceRegistered
                            ? `Wajah sudah terdaftar${faceRegisteredAt ? ` pada ${faceRegisteredAt}` : ''}.`
                            : 'Daftarkan wajah terlebih dahulu sebelum absen.'}
                    </p>
                </div>
                <Button variant="outline" onClick={startCamera}>
                    <RefreshCw className="mr-2 size-4" />
                    Buka Kamera
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
                    <div className="h-72 w-56 rounded-full border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                </div>

                {!isCameraReady && !cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                        <div className="text-center">
                            <Camera className="mx-auto mb-2 size-8" />
                            Buka kamera untuk mulai
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4 p-4">
                <p className="text-sm text-muted-foreground">
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
                        disabled={
                            !isCameraReady || !faceRegistered || isSubmitting
                        }
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

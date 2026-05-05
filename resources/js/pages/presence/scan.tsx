import { Head } from '@inertiajs/react';
import { CheckCircle2, Clock, LogIn, UserX, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { SmartLink } from '@/components/ui/smart-link';

interface ScanResultProps {
    status:
        | 'success'
        | 'expired'
        | 'invalid'
        | 'info'
        | 'login_required'
        | 'unauthorized' // Mengganti not_member ke istilah kepegawaian
        | 'already_marked';
    message: string;
    token?: string;
    type?: 'masuk' | 'pulang';
    location?: string;
    timestamp?: string;
}

export default function Scan({
    status,
    message,
    token,
    type,
    location,
    timestamp,
}: ScanResultProps) {
    const isSuccess =
        status === 'success' ||
        status === 'already_marked' ||
        status === 'info';
    const isLoginRequired = status === 'login_required';
    const isExpired = status === 'expired';
    const isUnauthorized = status === 'unauthorized';

    const getIcon = () => {
        if (isSuccess) {
            return (
                <div className="rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-16 w-16" />
                </div>
            );
        }

        if (isLoginRequired) {
            return (
                <div className="rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <LogIn className="h-16 w-16" />
                </div>
            );
        }

        if (isExpired) {
            return (
                <div className="rounded-full bg-orange-100 p-4 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <Clock className="h-16 w-16" />
                </div>
            );
        }

        if (isUnauthorized) {
            return (
                <div className="rounded-full bg-yellow-100 p-4 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <UserX className="h-16 w-16" />
                </div>
            );
        }

        return (
            <div className="rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <XCircle className="h-16 w-16" />
            </div>
        );
    };

    const getTitle = () => {
        switch (status) {
            case 'success':
                return 'Presensi Berhasil!';
            case 'already_marked':
                return 'Sudah Melakukan Presensi';
            case 'login_required':
                return 'Sesi Berakhir';
            case 'expired':
                return 'QR Code Kadaluarsa';
            case 'unauthorized':
                return 'Akses Ditolak';
            default:
                return 'Gagal Memproses QR';
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-900">
            <Head title="Status Presensi Pegawai" />

            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="flex flex-col items-center gap-4 py-8">
                    {getIcon()}
                </CardHeader>
                <CardContent className="text-center">
                    <h2 className="mb-2 text-2xl font-bold">{getTitle()}</h2>
                    <p className="text-muted-foreground">{message}</p>

                    {(type || location || timestamp) && (
                        <div className="mt-6 rounded-lg bg-muted p-4 text-left text-sm">
                            <div className="grid grid-cols-[110px_1fr] gap-2">
                                {type && (
                                    <>
                                        <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Tipe:
                                        </span>
                                        <span className="font-semibold capitalize">
                                            {type}
                                        </span>
                                    </>
                                )}
                                {location && (
                                    <>
                                        <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Lokasi:
                                        </span>
                                        <span className="font-semibold">
                                            {location}
                                        </span>
                                    </>
                                )}
                                {timestamp && (
                                    <>
                                        <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                            Waktu:
                                        </span>
                                        <span className="font-semibold">
                                            {timestamp}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {isSuccess ? (
                        <Button className="w-full" size="lg" asChild>
                            <SmartLink href="/presence/self/history">
                                Lihat Riwayat Kerja
                            </SmartLink>
                        </Button>
                    ) : isLoginRequired && token ? (
                        <Button className="w-full" size="lg" asChild>
                            <SmartLink
                                href={`/login?redirect=${encodeURIComponent(`/presence/mark/${token}`)}`}
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Login Ulang
                            </SmartLink>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full"
                            size="lg"
                            asChild
                        >
                            <SmartLink href="/dashboard">
                                Kembali ke Dashboard
                            </SmartLink>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

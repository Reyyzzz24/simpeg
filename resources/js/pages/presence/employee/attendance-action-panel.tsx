import { router } from '@inertiajs/react';
import { BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PresenceType, TodayPresence } from './types';

type Props = {
    type: PresenceType;
    setType: (type: PresenceType) => void;
    isTeacher: boolean;
    todayPresence: TodayPresence;
};

export default function AttendanceActionPanel({
    type,
    setType,
    isTeacher,
    todayPresence,
}: Props) {
    return (
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
                    {isTeacher && type === 'pulang'
                        ? 'Setelah scan QR, guru diarahkan ke formulir jam mengajar. Absensi wajah dilakukan admin di halaman Presensi.'
                        : 'Scan QR tersedia selama perangkat memiliki kamera. Daftarkan wajah untuk absensi via Face Gate admin.'}
                </p>
            </div>

            {isTeacher &&
                todayPresence.jam_masuk &&
                !todayPresence.jam_pulang && (
                    <Button
                        variant="secondary"
                        className="mt-4 w-full"
                        size="lg"
                        onClick={() =>
                            router.visit('/presence/teacher-checkout')
                        }
                    >
                        <BookOpenCheck className="mr-2 size-5" />
                        Form Pulang Guru
                    </Button>
                )}
        </div>
    );
}

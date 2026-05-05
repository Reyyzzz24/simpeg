import { Head, router, useForm } from '@inertiajs/react';
import { BookOpenCheck, Clock, Save, Timer } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard-card';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { SelfPresenceUser, TodayPresence } from './types';
import { formatMinutes } from './types';

type Props = {
    user: SelfPresenceUser;
    todayPresence: TodayPresence;
};

export default function TeacherCheckoutView({ user, todayPresence }: Props) {
    const form = useForm({
        total_jam_ajar: todayPresence.total_jam_ajar?.toString() ?? '',
        jenis_ajar:
            todayPresence.jenis_ajar && todayPresence.jenis_ajar !== 'none'
                ? todayPresence.jenis_ajar
                : '',
    });

    const previewTeachingMinutes = Number(form.data.total_jam_ajar || 0) * 60;
    const previewDifference =
        todayPresence.durasi_hadir_menit === null
            ? null
            : todayPresence.durasi_hadir_menit - previewTeachingMinutes;
    const previewStatus =
        previewDifference === null
            ? 'Belum bisa dibandingkan'
            : previewDifference < 0
              ? 'Melebihi durasi hadir'
              : 'Sesuai durasi hadir';

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/presence/self/teacher-checkout');
    };

    return (
        <>
            <Head title="Absen Pulang Guru" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Absen Pulang Guru"
                    subtitle={`${user.name} - ${user.role}`}
                    description="Lengkapi rekap jam mengajar setelah scan QR atau Face Recognition pulang."
                    gradient="bg-linear-to-r from-emerald-600 to-cyan-500"
                    icon={<BookOpenCheck className="size-20 text-white" />}
                />

                <div className="grid gap-6 md:grid-cols-3">
                    <DashboardCard>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-sky-100 p-3 text-sky-600">
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
                                <Timer />
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
                            <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
                                <BookOpenCheck />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Selisih
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {formatMinutes(previewDifference)}
                                </h3>
                            </div>
                        </CardContent>
                    </DashboardCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <form
                        onSubmit={submit}
                        className="rounded-xl border bg-card p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold">
                            Formulir Jam Mengajar
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Data ini akan dibandingkan dengan rentang jam masuk
                            dan pulang hari ini.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="total_jam_ajar">
                                    Total jam mengajar
                                </Label>
                                <Input
                                    id="total_jam_ajar"
                                    type="number"
                                    min="0"
                                    max="24"
                                    value={form.data.total_jam_ajar}
                                    onChange={(event) =>
                                        form.setData(
                                            'total_jam_ajar',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Contoh: 6"
                                />
                                <InputError
                                    message={form.errors.total_jam_ajar}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis jam yang diajar</Label>
                                <Select
                                    value={form.data.jenis_ajar}
                                    onValueChange={(value) =>
                                        form.setData('jenis_ajar', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih teori atau praktik" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teori">
                                            Teori
                                        </SelectItem>
                                        <SelectItem value="praktik">
                                            Praktik
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.jenis_ajar} />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button type="submit" disabled={form.processing}>
                                <Save className="mr-2 size-4" />
                                {form.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Absen Pulang'}
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => router.visit('/presence/self')}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">
                            Perbandingan Sistem
                        </h2>
                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex justify-between gap-4 border-b pb-3">
                                <span className="text-muted-foreground">
                                    Durasi hadir
                                </span>
                                <span className="font-semibold">
                                    {formatMinutes(
                                        todayPresence.durasi_hadir_menit,
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4 border-b pb-3">
                                <span className="text-muted-foreground">
                                    Total jam ajar
                                </span>
                                <span className="font-semibold">
                                    {formatMinutes(previewTeachingMinutes)}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Status
                                </span>
                                <span
                                    className={
                                        previewDifference !== null &&
                                        previewDifference < 0
                                            ? 'font-semibold text-red-600'
                                            : 'font-semibold text-emerald-600'
                                    }
                                >
                                    {previewStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

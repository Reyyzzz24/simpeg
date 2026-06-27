import { Head, router, useForm } from '@inertiajs/react';
import { BookOpenCheck, Clock, Save, ShieldCheck, Timer } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard-card';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SelfPresenceUser, TodayPresence } from './types';
import { formatMinutes } from './types';

type Props = {
    user: SelfPresenceUser;
    todayPresence: TodayPresence;
    targetUserId?: number;
    returnTo?: string;
};

export default function TeacherCheckoutView({
    user,
    todayPresence,
    targetUserId,
    returnTo = '/presence/self',
}: Props) {
    const isProduktifTeacher = user.sub_role === 'produktif';

    const form = useForm({
        user_id: targetUserId ?? null,
        jam_normatif_teori:
            todayPresence.jam_normatif_teori?.toString() ??
            (!isProduktifTeacher
                ? todayPresence.jam_teori?.toString()
                : undefined) ??
            '',
        jam_produktif_teori:
            todayPresence.jam_produktif_teori?.toString() ??
            (isProduktifTeacher
                ? todayPresence.jam_teori?.toString()
                : undefined) ??
            '',
        jam_produktif_praktik:
            todayPresence.jam_produktif_praktik?.toString() ??
            todayPresence.jam_praktik?.toString() ??
            '',
        ada_piket: todayPresence.ada_piket ?? false,
    });

    const totalJamAjar =
        Number(form.data.jam_normatif_teori || 0) +
        Number(form.data.jam_produktif_teori || 0) +
        Number(form.data.jam_produktif_praktik || 0);
    const previewTeachingMinutes = totalJamAjar * 60;
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
        form.post('/presence/teacher-checkout');
    };

    return (
        <>
            <Head title="Absen Pulang Guru" />

            <div className="flex flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="Absen Pulang Guru"
                    subtitle={`${user.name} - ${user.role}${user.sub_role ? ` ${user.sub_role}` : ''}`}
                    description="Lengkapi rekap jam mengajar normatif dan produktif setelah scan QR atau Face Recognition pulang."
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
                            Isi sesuai kategori jam mengajar hari ini. Kosongkan
                            field yang tidak diajar.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="jam_normatif_teori">
                                    Normatif teori
                                </Label>
                                <Input
                                    id="jam_normatif_teori"
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={form.data.jam_normatif_teori}
                                    onChange={(event) =>
                                        form.setData(
                                            'jam_normatif_teori',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Contoh: 2"
                                />
                                <InputError
                                    message={form.errors.jam_normatif_teori}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jam_produktif_teori">
                                    Produktif teori
                                </Label>
                                <Input
                                    id="jam_produktif_teori"
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={form.data.jam_produktif_teori}
                                    onChange={(event) =>
                                        form.setData(
                                            'jam_produktif_teori',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Kosongkan jika tidak ada"
                                />
                                <InputError
                                    message={form.errors.jam_produktif_teori}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jam_produktif_praktik">
                                    Produktif praktik
                                </Label>
                                <Input
                                    id="jam_produktif_praktik"
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={form.data.jam_produktif_praktik}
                                    onChange={(event) =>
                                        form.setData(
                                            'jam_produktif_praktik',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Kosongkan jika tidak ada"
                                />
                                <InputError
                                    message={form.errors.jam_produktif_praktik}
                                />
                            </div>
                        </div>

                        <div className="mt-4 rounded-lg border bg-slate-50 p-4">
                            <p className="text-sm text-muted-foreground">
                                Total jam mengajar hari ini
                            </p>
                            <p className="text-2xl font-bold">
                                {totalJamAjar} jam
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {[
                                    Number(form.data.jam_normatif_teori || 0) >
                                    0
                                        ? `${form.data.jam_normatif_teori}j normatif teori`
                                        : null,
                                    Number(form.data.jam_produktif_teori || 0) >
                                    0
                                        ? `${form.data.jam_produktif_teori}j produktif teori`
                                        : null,
                                    Number(
                                        form.data.jam_produktif_praktik || 0,
                                    ) > 0
                                        ? `${form.data.jam_produktif_praktik}j produktif praktik`
                                        : null,
                                ]
                                    .filter(Boolean)
                                    .join(' + ') || 'Belum diisi'}
                            </p>
                        </div>

                        <div className="mt-6 flex items-start gap-3 rounded-lg border p-4">
                            <Checkbox
                                id="ada_piket"
                                checked={form.data.ada_piket}
                                onCheckedChange={(checked) =>
                                    form.setData('ada_piket', checked === true)
                                }
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="ada_piket"
                                    className="flex items-center gap-2 font-medium"
                                >
                                    <ShieldCheck className="size-4 text-violet-600" />
                                    Ada piket hari ini
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Centang jika guru bertugas piket pada hari
                                    ini.
                                </p>
                            </div>
                        </div>
                        <InputError message={form.errors.ada_piket} />

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
                                onClick={() => router.visit(returnTo)}
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
                            <div className="flex justify-between gap-4 border-b pb-3">
                                <span className="text-muted-foreground">
                                    Piket
                                </span>
                                <span className="font-semibold">
                                    {form.data.ada_piket ? 'Ya' : 'Tidak'}
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

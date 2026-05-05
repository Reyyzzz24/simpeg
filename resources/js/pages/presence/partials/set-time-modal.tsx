import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TimeWindow = {
    masuk_start: string;
    masuk_end: string;
    pulang_start: string;
    pulang_end: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    timeWindow: TimeWindow;
};

export default function SetTimeModal({ isOpen, onClose, timeWindow }: Props) {
    const { data, setData, put, processing, errors, reset } =
        useForm<TimeWindow>({
            masuk_start: timeWindow.masuk_start,
            masuk_end: timeWindow.masuk_end,
            pulang_start: timeWindow.pulang_start,
            pulang_end: timeWindow.pulang_end,
        });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setData({
            masuk_start: timeWindow.masuk_start,
            masuk_end: timeWindow.masuk_end,
            pulang_start: timeWindow.pulang_start,
            pulang_end: timeWindow.pulang_end,
        });
    }, [isOpen, setData, timeWindow]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put('/presence/time-window', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Atur Waktu Presensi</DialogTitle>
                    <DialogDescription>
                        Tentukan jam mulai masuk, batas masuk, mulai pulang, dan
                        selesai pulang.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="masuk_start">Mulai masuk</Label>
                            <Input
                                id="masuk_start"
                                type="time"
                                value={data.masuk_start}
                                onChange={(event) =>
                                    setData('masuk_start', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.masuk_start} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="masuk_end">Batas masuk</Label>
                            <Input
                                id="masuk_end"
                                type="time"
                                value={data.masuk_end}
                                onChange={(event) =>
                                    setData('masuk_end', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.masuk_end} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="pulang_start">Mulai pulang</Label>
                            <Input
                                id="pulang_start"
                                type="time"
                                value={data.pulang_start}
                                onChange={(event) =>
                                    setData('pulang_start', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.pulang_start} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pulang_end">Selesai pulang</Label>
                            <Input
                                id="pulang_end"
                                type="time"
                                value={data.pulang_end}
                                onChange={(event) =>
                                    setData('pulang_end', event.target.value)
                                }
                                required
                            />
                            <InputError message={errors.pulang_end} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Waktu'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

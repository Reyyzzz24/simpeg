import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    record?: any | null;
};

export default function AnnouncementFormModal({
    open,
    setOpen,
    record,
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            content: '',
            category: 'umum',
            published_at: '',
            is_active: true,
        });

    useEffect(() => {
        if (open && record) {
            setData({
                title: record.title ?? '',
                content: record.content ?? '',
                category: record.category ?? 'umum',
                published_at: record.published_at ?? '',
                is_active: Boolean(record.is_active),
            });
            clearErrors();
        } else if (open) {
            reset();
            clearErrors();
        }
    }, [open, record]);

    const close = () => {
        setOpen(false);
        clearErrors();
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (record) {
            put(`/announcement/${record.id}`, {
                preserveScroll: true,
                onSuccess: close,
            });
            return;
        }

        post('/announcement', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                close();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : close())}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {record ? 'Edit' : 'Tambah'} Pengumuman
                        </DialogTitle>
                        <DialogDescription>
                            Tulis informasi yang ingin ditampilkan kepada pengguna.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(event) =>
                                    setData('title', event.target.value)
                                }
                                placeholder="Contoh: Jadwal Rapat Bulanan"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input
                                id="category"
                                value={data.category}
                                onChange={(event) =>
                                    setData('category', event.target.value)
                                }
                                placeholder="umum"
                            />
                            <InputError message={errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Tanggal terbit</Label>
                            <Input
                                id="published_at"
                                type="date"
                                value={data.published_at}
                                onChange={(event) =>
                                    setData('published_at', event.target.value)
                                }
                            />
                            <InputError message={errors.published_at} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Isi pengumuman</Label>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(event) =>
                                    setData('content', event.target.value)
                                }
                                placeholder="Tulis isi pengumuman..."
                                className="min-h-32"
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked === true)
                                }
                            />
                            <Label htmlFor="is_active">Aktif</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={close}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

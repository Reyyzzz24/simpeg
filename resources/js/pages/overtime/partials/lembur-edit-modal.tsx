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
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type UserOption = {
    id: number;
    nama: string;
    nip?: string | null;
    tipe?: string | null;
};

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    record?: any | null;
    users: UserOption[];
};

export default function LemburEditModal({
    open,
    setOpen,
    record,
    users,
}: Props) {
    const [userSearchOpen, setUserSearchOpen] = useState(false);
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        pegawai_id: '',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: '',
        tugas: '',
        is_approved: false,
    });

    useEffect(() => {
        if (!open || !record) {
            return;
        }

        setData({
            pegawai_id: String(record.pegawai_id ?? ''),
            tanggal: record.tanggal ?? '',
            jam_mulai: record.jam_mulai ?? '',
            jam_selesai: record.jam_selesai ?? '',
            tugas: record.tugas ?? '',
            is_approved: Boolean(record.is_approved),
        });
        clearErrors();
    }, [open, record]);

    const selectedUser = users.find(
        (user) => String(user.id) === String(data.pegawai_id),
    );

    const formatUserOption = (user: UserOption) =>
        `${user.tipe ? `[${user.tipe}] ` : ''}${user.nama ?? '-'}${
            user.nip ? ` - ${user.nip}` : ''
        }`;

    const close = () => {
        setOpen(false);
        clearErrors();
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!record) {
            return;
        }

        put(`/overtime/${record.id}`, {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : close())}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Edit Lembur</DialogTitle>
                        <DialogDescription>
                            Perbarui data lembur pegawai/guru.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Pegawai/Guru</Label>
                            <Popover
                                open={userSearchOpen}
                                onOpenChange={setUserSearchOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between font-normal"
                                    >
                                        <span className="truncate">
                                            {selectedUser
                                                ? formatUserOption(selectedUser)
                                                : 'Pilih pegawai/guru'}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari pegawai/guru..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {users.map((item) => (
                                                    <CommandItem
                                                        key={item.id}
                                                        value={formatUserOption(
                                                            item,
                                                        )}
                                                        onSelect={() => {
                                                            setData(
                                                                'pegawai_id',
                                                                String(item.id),
                                                            );
                                                            setUserSearchOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                String(
                                                                    data.pegawai_id,
                                                                ) ===
                                                                    String(
                                                                        item.id,
                                                                    )
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        <span className="truncate">
                                                            {formatUserOption(
                                                                item,
                                                            )}
                                                        </span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.pegawai_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(event) =>
                                    setData('tanggal', event.target.value)
                                }
                            />
                            <InputError message={errors.tanggal} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="jam_mulai">Jam mulai</Label>
                                <Input
                                    id="jam_mulai"
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(event) =>
                                        setData('jam_mulai', event.target.value)
                                    }
                                />
                                <InputError message={errors.jam_mulai} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="jam_selesai">Jam selesai</Label>
                                <Input
                                    id="jam_selesai"
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(event) =>
                                        setData(
                                            'jam_selesai',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.jam_selesai} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tugas">Tugas</Label>
                            <Textarea
                                id="tugas"
                                value={data.tugas}
                                onChange={(event) =>
                                    setData('tugas', event.target.value)
                                }
                            />
                            <InputError message={errors.tugas} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_approved"
                                checked={data.is_approved}
                                onCheckedChange={(checked) =>
                                    setData('is_approved', checked === true)
                                }
                            />
                            <Label htmlFor="is_approved">Disetujui</Label>
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

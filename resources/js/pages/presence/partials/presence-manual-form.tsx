import { useForm, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { store as presenceStore } from '@/routes/presence';

interface PresenceForm {
    user_id: number | string;
    tanggal: string;
    jam_masuk: string;
    jam_pulang: string;
    total_jam_ajar: string;
    jenis_ajar: string;
    status_disiplin: string;
}

export function PresenceManualForm() {
    const { users = [] } = usePage<{ users: any[] }>().props;
    const [open, setOpen] = useState(false);

    const formConfig = presenceStore.form() as any;

    const { data, setData, post, processing, errors, reset } =
        useForm<PresenceForm>({
            user_id: formConfig?.data?.user_id || '',
            tanggal: formConfig?.data?.tanggal || '',
            jam_masuk: formConfig?.data?.jam_masuk || '',
            jam_pulang: formConfig?.data?.jam_pulang || '',
            total_jam_ajar: formConfig?.data?.total_jam_ajar || '',
            jenis_ajar: formConfig?.data?.jenis_ajar || 'none',
            status_disiplin: formConfig?.data?.status_disiplin || '',
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = formConfig?.url || route('presence.store');
        post(url, {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="user_id">Pegawai</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between font-normal"
                            >
                                {data.user_id
                                    ? users.find((u) => u.id === data.user_id)
                                          ?.name
                                    : 'Pilih pegawai...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                                <CommandInput placeholder="Cari nama..." />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ditemukan.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {users.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                value={user.name}
                                                onSelect={() => {
                                                    setData('user_id', user.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        data.user_id === user.id
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                                {user.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.user_id} />
                </div>

                <div>
                    <Label htmlFor="tanggal">Tanggal</Label>
                    <Input
                        id="tanggal"
                        type="date"
                        value={data.tanggal}
                        onChange={(e) => setData('tanggal', e.target.value)}
                    />
                    <InputError message={errors.tanggal} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label>Jam Masuk</Label>
                    <Input
                        type="time"
                        value={data.jam_masuk}
                        onChange={(e) => setData('jam_masuk', e.target.value)}
                    />
                    <InputError message={errors.jam_masuk} />
                </div>
                <div>
                    <Label>Jam Pulang</Label>
                    <Input
                        type="time"
                        value={data.jam_pulang}
                        onChange={(e) => setData('jam_pulang', e.target.value)}
                    />
                    <InputError message={errors.jam_pulang} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label>Total Jam Ajar</Label>
                    <Input
                        type="number"
                        min="0"
                        max="24"
                        value={data.total_jam_ajar}
                        onChange={(e) =>
                            setData('total_jam_ajar', e.target.value)
                        }
                    />
                    <InputError message={errors.total_jam_ajar} />
                </div>
                <div>
                    <Label>Jenis Ajar</Label>
                    <select
                        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                        value={data.jenis_ajar}
                        onChange={(e) => setData('jenis_ajar', e.target.value)}
                    >
                        <option value="none">None</option>
                        <option value="teori">Teori</option>
                        <option value="praktik">Praktik</option>
                    </select>
                    <InputError message={errors.jenis_ajar} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label>Status</Label>
                    <Input
                        value={data.status_disiplin}
                        onChange={(e) =>
                            setData('status_disiplin', e.target.value)
                        }
                    />
                    <InputError message={errors.status_disiplin} />
                </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
                <DialogTrigger asChild>
                    <Button variant="secondary" type="button">
                        Batal
                    </Button>
                </DialogTrigger>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </DialogFooter>
        </form>
    );
}

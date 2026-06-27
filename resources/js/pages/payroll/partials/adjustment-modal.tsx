import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type AmountType = 'fixed' | 'percentage' | 'formula';
type FormulaType =
    | 'hadir'
    | 'jam_kerja'
    | 'lembur'
    | 'jam_mengajar_teori'
    | 'jam_mengajar_praktik'
    | 'jam_mengajar_normatif_teori'
    | 'jam_mengajar_produktif_teori'
    | 'jam_mengajar_produktif_praktik'
    | 'jam_mengajar_eskul'
    | 'piket';

type AdjustmentItem = {
    id?: number;
    component_id: string;
    amount_type: AmountType;
    formula_type: FormulaType;
    formula_interval_minutes: number;
    amount: string;
    note: string;
};

const defaultItem = (): AdjustmentItem => ({
    component_id: '',
    amount_type: 'fixed',
    formula_type: 'hadir',
    formula_interval_minutes: 30,
    amount: '',
    note: '',
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
    users: any[];
    components: any[];
    record?: any[] | null;
};

export default function AdjustmentModal({
    isOpen,
    onClose,
    users,
    components,
    record,
}: Props) {
    const isEdit = useMemo(() => !!(record && record.length > 0), [record]);
    const [userSearchOpen, setUserSearchOpen] = useState(false);

    const { data, setData, post, put, processing, reset, clearErrors } =
        useForm<{ user_id: string; periode: string; items: AdjustmentItem[] }>({
            user_id: '',
            periode: new Date().toISOString().slice(0, 7),
            items: [defaultItem()],
        });

    useEffect(() => {
        if (!isOpen) {
            clearErrors();

            return;
        }

        if (isEdit && record) {
            setData({
                user_id: String(record[0].user_id ?? ''),
                periode:
                    record[0].periode ?? new Date().toISOString().slice(0, 7),
                items: record.map((r: any) => ({
                    id: r.id,
                    component_id: String(r.component_id ?? ''),
                    amount_type: r.amount_type ?? 'fixed',
                    formula_type: r.formula_type ?? 'hadir',
                    formula_interval_minutes: Number(
                        r.formula_interval_minutes ?? 30,
                    ),
                    amount: String(r.amount ?? 0),
                    note: r.note ?? '',
                })),
            });
        } else {
            reset();
        }
    }, [isOpen, record, isEdit, clearErrors, reset, setData]);

    const addItem = () => {
        setData('items', [...data.items, defaultItem()]);
    };

    const removeItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const updateItem = (
        index: number,
        field: keyof AdjustmentItem,
        value: string | number,
    ) => {
        const newItems = [...data.items];
        const current = { ...newItems[index], [field]: value };

        if (field === 'amount_type' && value === 'formula') {
            current.formula_type = current.formula_type ?? 'hadir';
            current.formula_interval_minutes =
                current.formula_interval_minutes ?? 30;
        }

        newItems[index] = current;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && record && record.length > 0) {
            put(route('adjustments.update', { id: record[0].id }), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post('/payroll-adjustments/bulk-store', {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const getAmountPlaceholder = (item: AdjustmentItem) => {
        if (item.amount_type === 'percentage') {
            return 'Persentase (%)';
        }

        if (item.amount_type === 'formula') {
            if (item.formula_type === 'jam_kerja') {
                return 'Nominal per interval';
            }

            if (item.formula_type === 'lembur') {
                return 'Tarif/Lembur';
            }

            if (item.formula_type === 'jam_mengajar_teori') {
                return 'Nominal/Jam Teori';
            }

            if (item.formula_type === 'jam_mengajar_praktik') {
                return 'Nominal/Jam Praktik';
            }

            if (item.formula_type === 'jam_mengajar_normatif_teori') {
                return 'Nominal/Jam Normatif Teori';
            }

            if (item.formula_type === 'jam_mengajar_produktif_teori') {
                return 'Nominal/Jam Produktif Teori';
            }

            if (item.formula_type === 'jam_mengajar_produktif_praktik') {
                return 'Nominal/Jam Produktif Praktik';
            }

            if (item.formula_type === 'jam_mengajar_eskul') {
                return 'Nominal/Jam Eskul';
            }

            if (item.formula_type === 'piket') {
                return 'Nominal per Piket';
            }

            return 'Tarif/Hadir';
        }

        return 'Rp';
    };

    const getAmountLabel = (item: AdjustmentItem) => {
        if (item.amount_type === 'percentage') {
            return 'Persentase';
        }

        if (item.amount_type === 'formula') {
            if (item.formula_type === 'jam_kerja') {
                return 'Nominal per Interval';
            }

            if (item.formula_type === 'lembur') {
                return 'Tarif per Lembur';
            }

            if (item.formula_type === 'jam_mengajar_teori') {
                return 'Nominal per Jam Teori';
            }

            if (item.formula_type === 'jam_mengajar_praktik') {
                return 'Nominal per Jam Praktik';
            }

            if (item.formula_type === 'jam_mengajar_normatif_teori') {
                return 'Nominal per Jam Normatif Teori';
            }

            if (item.formula_type === 'jam_mengajar_produktif_teori') {
                return 'Nominal per Jam Produktif Teori';
            }

            if (item.formula_type === 'jam_mengajar_produktif_praktik') {
                return 'Nominal per Jam Produktif Praktik';
            }

            if (item.formula_type === 'jam_mengajar_eskul') {
                return 'Nominal per Jam Eskul';
            }

            if (item.formula_type === 'piket') {
                return 'Nominal per Piket';
            }

            return 'Tarif per Hadir';
        }

        return 'Nominal';
    };

    const selectedUser = users?.find(
        (user) => String(user.id) === String(data.user_id),
    );

    const formatUserOption = (user: any) =>
        `${user.type ? `[${user.type}] ` : ''}${user.name ?? '-'}${
            user.identifier ? ` - ${user.identifier}` : ''
        }`;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Edit Adjustment' : 'Tambah Adjustment'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? 'Perbarui daftar bonus atau potongan untuk karyawan ini.'
                                : 'Tambah daftar bonus atau potongan baru.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Periode</Label>
                            <Input
                                type="month"
                                value={data.periode}
                                onChange={(e) =>
                                    setData('periode', e.target.value)
                                }
                                required
                                disabled={isEdit}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Karyawan</Label>
                            <Popover
                                open={userSearchOpen}
                                onOpenChange={setUserSearchOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        disabled={isEdit}
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
                                                {users?.map((user) => (
                                                    <CommandItem
                                                        key={user.id}
                                                        value={formatUserOption(
                                                            user,
                                                        )}
                                                        onSelect={() => {
                                                            setData(
                                                                'user_id',
                                                                String(user.id),
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
                                                                    data.user_id,
                                                                ) ===
                                                                    String(
                                                                        user.id,
                                                                    )
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        <span className="truncate">
                                                            {formatUserOption(
                                                                user,
                                                            )}
                                                        </span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                                Daftar Komponen
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tambah Item
                            </Button>
                        </div>

                        {data.items.map((item, index) => (
                            <div
                                key={index}
                                className="relative space-y-3 rounded-lg border bg-slate-50/50 p-4"
                            >
                                {data.items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}

                                <div className="space-y-1">
                                    <Label className="text-xs">Komponen</Label>
                                    <Select
                                        value={item.component_id}
                                        onValueChange={(v) =>
                                            updateItem(index, 'component_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {components?.map((c) => (
                                                <SelectItem
                                                    key={c.id}
                                                    value={String(c.id)}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">
                                            Tipe Perhitungan
                                        </Label>
                                        <Select
                                            value={item.amount_type}
                                            onValueChange={(v) =>
                                                updateItem(
                                                    index,
                                                    'amount_type',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">
                                                    Fixed (Rp)
                                                </SelectItem>
                                                <SelectItem value="percentage">
                                                    Percentage (%)
                                                </SelectItem>
                                                <SelectItem value="formula">
                                                    Formula
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">
                                            {getAmountLabel(item)}
                                        </Label>
                                        <Input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'amount',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={getAmountPlaceholder(
                                                item,
                                            )}
                                            required
                                        />
                                    </div>
                                </div>

                                {item.amount_type === 'formula' && (
                                    <div className="space-y-2 rounded-md border border-blue-100 bg-blue-50 p-3">
                                        <p className="text-xs font-medium text-blue-700">
                                            Pengaturan Formula
                                        </p>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Select
                                                value={item.formula_type}
                                                onValueChange={(v) =>
                                                    updateItem(
                                                        index,
                                                        'formula_type',
                                                        v,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hadir">
                                                        Hadir
                                                    </SelectItem>
                                                    <SelectItem value="jam_kerja">
                                                        Jam Kerja
                                                    </SelectItem>
                                                    <SelectItem value="lembur">
                                                        Lembur
                                                    </SelectItem>
                                                    {/* <SelectItem value="jam_mengajar_teori">Jam Mengajar Teori</SelectItem> */}
                                                    {/* <SelectItem value="jam_mengajar_praktik">Jam Mengajar Praktik</SelectItem> */}
                                                    <SelectItem value="jam_mengajar_normatif_teori">
                                                        Jam Normatif Teori
                                                    </SelectItem>
                                                    <SelectItem value="jam_mengajar_produktif_teori">
                                                        Jam Produktif Teori
                                                    </SelectItem>
                                                    <SelectItem value="jam_mengajar_produktif_praktik">
                                                        Jam Produktif Praktik
                                                    </SelectItem>
                                                    <SelectItem value="jam_mengajar_eskul">
                                                        Jam Eskul
                                                    </SelectItem>
                                                    <SelectItem value="piket">
                                                        Piket
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Input
                                                type="number"
                                                min={1}
                                                className="h-8 text-xs"
                                                value={
                                                    item.formula_interval_minutes
                                                }
                                                disabled={
                                                    item.formula_type !==
                                                    'jam_kerja'
                                                }
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'formula_interval_minutes',
                                                        Number(
                                                            e.target.value || 1,
                                                        ),
                                                    )
                                                }
                                                placeholder="Menit per nominal"
                                            />
                                        </div>
                                        <p className="text-[10px] leading-tight text-blue-600 italic">
                                            {item.formula_type === 'jam_kerja'
                                                ? '* Otomatis: total menit kerja dibagi interval menit lalu dikali nominal.'
                                                : item.formula_type === 'lembur'
                                                  ? '* Otomatis: nominal dikali jumlah lembur yang disetujui di periode ini.'
                                                  : item.formula_type ===
                                                      'jam_mengajar_teori'
                                                    ? '* Otomatis: nominal dikali total jam teori per bulan dari absensi guru.'
                                                    : item.formula_type ===
                                                        'jam_mengajar_praktik'
                                                      ? '* Otomatis: nominal dikali total jam praktik per bulan dari absensi guru.'
                                                      : item.formula_type ===
                                                          'jam_mengajar_normatif_teori'
                                                        ? '* Otomatis: nominal dikali total jam teori normatif per bulan.'
                                                        : item.formula_type ===
                                                            'jam_mengajar_produktif_teori'
                                                          ? '* Otomatis: nominal dikali total jam teori produktif per bulan.'
                                                          : item.formula_type ===
                                                              'jam_mengajar_produktif_praktik'
                                                            ? '* Otomatis: nominal dikali total jam praktik produktif per bulan.'
                                                            : item.formula_type ===
                                                                'jam_mengajar_eskul'
                                                              ? '* Otomatis: nominal dikali total jam eskul per bulan.'
                                                              : item.formula_type ===
                                                                  'piket'
                                                                ? '* Otomatis: nominal dikali frekuensi piket (jumlah hari ada_piket = true) di periode ini.'
                                                                : "* Otomatis: nominal dikali total status 'hadir' di absensi."}
                                        </p>
                                    </div>
                                )}

                                {item.amount_type === 'percentage' && (
                                    <p className="text-[10px] leading-tight text-slate-500 italic">
                                        * Persentase dihitung dari default
                                        amount komponen gaji.
                                    </p>
                                )}

                                <div className="space-y-1">
                                    <Label className="text-xs">Catatan</Label>
                                    <Textarea
                                        className="h-16 text-sm"
                                        value={item.note}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'note',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Keterangan..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Simpan Perubahan'
                                  : 'Tambah Baru'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

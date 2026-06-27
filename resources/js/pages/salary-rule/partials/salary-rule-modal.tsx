import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    | 'piket';

type RuleComponentForm = {
    id: number;
    amount_type: AmountType;
    formula_type: FormulaType;
    formula_interval_minutes: number;
    amount: number;
};

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    components: any[];
    positions: any[];
};

const roles = ['admin', 'guru', 'pegawai'] as const;

const SUB_ROLE_OPTIONS = {
    guru: ['normatif', 'produktif'],
    pegawai: ['tu', 'struktural', 'karyawan', 'staf'],
} as const;

const defaultComponent = (id: number): RuleComponentForm => ({
    id,
    amount_type: 'fixed',
    formula_type: 'hadir',
    formula_interval_minutes: 30,
    amount: 0,
});

export default function SalaryRuleModal({ open, setOpen, components }: Props) {
    const [form, setForm] = useState({
        role: '',
        sub_role: '',
        status_kerja: 'tetap',
        is_active: true,
        components: [] as RuleComponentForm[],
    });

    const currentSubRoleOptions = useMemo(() => {
        if (!form.role) {
            return [];
        }

        return (
            SUB_ROLE_OPTIONS[form.role as keyof typeof SUB_ROLE_OPTIONS] ?? []
        );
    }, [form.role]);

    const handleRoleChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            role: value,
            sub_role: '',
        }));
    };

    const addComponent = (id: string) => {
        const numId = Number(id);

        setForm((prev) => {
            if (prev.components.some((component) => component.id === numId)) {
                return prev;
            }

            return {
                ...prev,
                components: [...prev.components, defaultComponent(numId)],
            };
        });
    };

    const removeComponent = (id: number) => {
        setForm((prev) => ({
            ...prev,
            components: prev.components.filter(
                (component) => component.id !== id,
            ),
        }));
    };

    const updateComponent = (
        id: number,
        key: keyof RuleComponentForm,
        value: RuleComponentForm[keyof RuleComponentForm],
    ) => {
        setForm((prev) => ({
            ...prev,
            components: prev.components.map((component) =>
                component.id === id
                    ? { ...component, [key]: value }
                    : component,
            ),
        }));
    };

    const submit = () => {
        router.post(
            '/salary-rules',
            {
                role: form.role,
                sub_role: form.sub_role,
                status_kerja: form.status_kerja,
                is_active: form.is_active ? 1 : 0,
                components: form.components,
            },
            {
                onSuccess: () => {
                    setForm({
                        role: '',
                        sub_role: '',
                        status_kerja: 'tetap',
                        is_active: true,
                        components: [],
                    });
                    setOpen(false);
                },
            },
        );
    };

    const isValid = form.role && form.sub_role && form.components.length > 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    Tambah Rule
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Salary Rule</DialogTitle>
                    <DialogDescription>
                        Rule berbasis role, sub role, status kerja, dan komponen
                        gaji.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex w-full flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Pilih Role Utama
                        </label>
                        <Select
                            value={form.role}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem
                                        key={role}
                                        value={role}
                                        className="capitalize"
                                    >
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Sub Role / Kategori
                        </label>
                        <Select
                            value={form.sub_role}
                            onValueChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    sub_role: value,
                                }))
                            }
                            disabled={!form.role}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        form.role
                                            ? 'Pilih Sub Role'
                                            : 'Pilih role terlebih dahulu'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {currentSubRoleOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Status Kerja
                        </label>
                        <Select
                            value={form.status_kerja}
                            onValueChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    status_kerja: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status kerja" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tetap">Tetap</SelectItem>
                                <SelectItem value="ptt">PTT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <hr />

                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Komponen Gaji
                        </label>
                        <Select onValueChange={addComponent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tambah Komponen" />
                            </SelectTrigger>
                            <SelectContent>
                                {components.map((component: any) => (
                                    <SelectItem
                                        key={component.id}
                                        value={String(component.id)}
                                    >
                                        {component.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        {form.components.map((component) => {
                            const masterComponent = components.find(
                                (item) => item.id === component.id,
                            );

                            return (
                                <div
                                    key={component.id}
                                    className="space-y-2 rounded border bg-slate-50/50 p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                            {masterComponent?.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeComponent(component.id)
                                            }
                                            className="text-lg text-red-500"
                                        >
                                            x
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Select
                                            value={component.amount_type}
                                            onValueChange={(value) =>
                                                updateComponent(
                                                    component.id,
                                                    'amount_type',
                                                    value as AmountType,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-8 text-xs">
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

                                        <Input
                                            type="number"
                                            className="h-8 text-xs"
                                            value={component.amount}
                                            onChange={(event) =>
                                                updateComponent(
                                                    component.id,
                                                    'amount',
                                                    Number(event.target.value),
                                                )
                                            }
                                            placeholder={
                                                component.amount_type ===
                                                'formula'
                                                    ? component.formula_type ===
                                                      'jam_kerja'
                                                        ? 'Nominal per interval'
                                                        : component.formula_type ===
                                                            'lembur'
                                                          ? 'Tarif/Lembur'
                                                          : component.formula_type ===
                                                              'jam_mengajar_teori'
                                                            ? 'Nominal/Jam Teori'
                                                            : component.formula_type ===
                                                                'jam_mengajar_praktik'
                                                              ? 'Nominal/Jam Praktik'
                                                              : component.formula_type ===
                                                                  'jam_mengajar_normatif_teori'
                                                                ? 'Nominal/Jam Normatif Teori'
                                                                : component.formula_type ===
                                                                    'jam_mengajar_produktif_teori'
                                                                  ? 'Nominal/Jam Produktif Teori'
                                                                  : component.formula_type ===
                                                                      'jam_mengajar_produktif_praktik'
                                                                    ? 'Nominal/Jam Produktif Praktik'
                                                                    : component.formula_type ===
                                                                        'piket'
                                                                      ? 'Nominal/Piket'
                                                                      : 'Tarif/Hadir'
                                                    : 'Nilai'
                                            }
                                        />
                                    </div>

                                    {component.amount_type === 'formula' && (
                                        <div className="space-y-2 rounded-md border border-blue-100 bg-blue-50 p-2">
                                            <p className="text-xs font-medium text-blue-700">
                                                Pengaturan Formula
                                            </p>
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Select
                                                    value={
                                                        component.formula_type
                                                    }
                                                    onValueChange={(value) =>
                                                        updateComponent(
                                                            component.id,
                                                            'formula_type',
                                                            value as FormulaType,
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
                                                        <SelectItem value="jam_mengajar_teori">
                                                            Jam Mengajar Teori
                                                        </SelectItem>
                                                        <SelectItem value="jam_mengajar_praktik">
                                                            Jam Mengajar Praktik
                                                        </SelectItem>
                                                        <SelectItem value="jam_mengajar_normatif_teori">
                                                            Jam Normatif Teori
                                                        </SelectItem>
                                                        <SelectItem value="jam_mengajar_produktif_teori">
                                                            Jam Produktif Teori
                                                        </SelectItem>
                                                        <SelectItem value="jam_mengajar_produktif_praktik">
                                                            Jam Produktif
                                                            Praktik
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
                                                        component.formula_interval_minutes
                                                    }
                                                    disabled={
                                                        component.formula_type !==
                                                        'jam_kerja'
                                                    }
                                                    onChange={(event) =>
                                                        updateComponent(
                                                            component.id,
                                                            'formula_interval_minutes',
                                                            Number(
                                                                event.target
                                                                    .value || 1,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="Menit per nominal"
                                                />
                                            </div>
                                            <p className="text-[10px] leading-tight text-blue-600 italic">
                                                {component.formula_type ===
                                                'jam_kerja'
                                                    ? '* Otomatis: total menit kerja dibagi interval menit lalu dikali nominal.'
                                                    : component.formula_type ===
                                                        'lembur'
                                                      ? '* Otomatis: nominal dikali jumlah lembur yang disetujui di periode ini.'
                                                      : component.formula_type ===
                                                          'jam_mengajar_teori'
                                                        ? '* Otomatis: nominal dikali total jam teori per bulan dari absensi guru.'
                                                        : component.formula_type ===
                                                            'jam_mengajar_praktik'
                                                          ? '* Otomatis: nominal dikali total jam praktik per bulan dari absensi guru.'
                                                          : component.formula_type ===
                                                              'jam_mengajar_normatif_teori'
                                                            ? '* Otomatis: nominal dikali total jam teori normatif per bulan.'
                                                            : component.formula_type ===
                                                                'jam_mengajar_produktif_teori'
                                                              ? '* Otomatis: nominal dikali total jam teori produktif per bulan.'
                                                              : component.formula_type ===
                                                                  'jam_mengajar_produktif_praktik'
                                                                ? '* Otomatis: nominal dikali total jam praktik produktif per bulan.'
                                                                : component.formula_type ===
                                                                    'piket'
                                                                  ? '* Otomatis: nominal dikali frekuensi piket di periode ini.'
                                                                  : "* Otomatis: nominal dikali total status 'hadir' di absensi."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Status Rule
                        </label>
                        <Select
                            value={form.is_active ? '1' : '0'}
                            onValueChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    is_active: value === '1',
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Aktif</SelectItem>
                                <SelectItem value="0">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="mt-2 w-full"
                        disabled={!isValid}
                        onClick={submit}
                    >
                        Simpan Rule
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

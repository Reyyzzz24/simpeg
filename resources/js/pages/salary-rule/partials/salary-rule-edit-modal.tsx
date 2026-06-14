import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    | 'piket';

type RuleComponentForm = {
    id: number;
    amount_type: AmountType;
    formula_type: FormulaType;
    formula_interval_minutes: number;
    amount: number;
};

const normalizeComponents = (items: any[] = []): RuleComponentForm[] => {
    return items.map((component: any) => ({
        id: Number(component.component_id),
        amount_type: component.amount_type ?? 'fixed',
        formula_type: component.formula_type ?? 'hadir',
        formula_interval_minutes: Number(
            component.formula_interval_minutes ?? 30,
        ),
        amount: Number(component.amount ?? 0),
    }));
};

export default function SalaryRuleEditModal({
    open,
    setOpen,
    data,
    components,
}: any) {
    const [form, setForm] = useState({
        role: '',
        sub_role: '',
        status_kerja: 'tetap',
        is_active: 1,
        components: [] as RuleComponentForm[],
    });

    useEffect(() => {
        if (!data) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setForm({
                role: data.role ?? '',
                sub_role: data.sub_role ?? '',
                status_kerja: data.status_kerja ?? 'tetap',
                is_active: Number(data.is_active ?? 1),
                components: normalizeComponents(data.salary_rule_components),
            });
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [data]);

    if (!open || !data) {
        return null;
    }

    const addComponent = (id: string) => {
        const numId = Number(id);

        setForm((prev) => {
            if (prev.components.some((component) => component.id === numId)) {
                return prev;
            }

            return {
                ...prev,
                components: [
                    ...prev.components,
                    {
                        id: numId,
                        amount_type: 'fixed',
                        formula_type: 'hadir',
                        formula_interval_minutes: 30,
                        amount: 0,
                    },
                ],
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
                    ? {
                          ...component,
                          [key]: value,
                          ...(key === 'amount_type' && value === 'formula'
                              ? {
                                    formula_type:
                                        component.formula_type ?? 'hadir',
                                    formula_interval_minutes:
                                        component.formula_interval_minutes ||
                                        30,
                                }
                              : {}),
                      }
                    : component,
            ),
        }));
    };

    const submit = () => {
        router.put(
            `/salary-rules/${data.id}`,
            {
                role: form.role,
                sub_role: form.sub_role,
                status_kerja: form.status_kerja,
                is_active: form.is_active,
                components: form.components,
            },
            {
                onSuccess: () => setOpen(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Salary Rule</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        value={form.role}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                role: event.target.value,
                            }))
                        }
                        placeholder="Role"
                    />

                    <Input
                        value={form.sub_role}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                sub_role: event.target.value,
                            }))
                        }
                        placeholder="Sub Role"
                    />

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
                            <SelectValue placeholder="Status Kerja" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tetap">Tetap</SelectItem>
                            <SelectItem value="ptt">PTT</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={addComponent}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tambah Komponen" />
                        </SelectTrigger>
                        <SelectContent>
                            {components?.map((component: any) => (
                                <SelectItem
                                    key={String(component.id)}
                                    value={String(component.id)}
                                >
                                    {component.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="space-y-3">
                        {form.components.map((component) => {
                            const masterComponent = components?.find(
                                (item: any) =>
                                    Number(item.id) === Number(component.id),
                            );

                            return (
                                <div
                                    key={String(component.id)}
                                    className="space-y-2 rounded border p-3"
                                >
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                            {masterComponent?.name ??
                                                'Unknown Component'}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() =>
                                                removeComponent(component.id)
                                            }
                                        >
                                            x
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Select
                                            value={String(
                                                component.amount_type,
                                            )}
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
                                                    Fixed
                                                </SelectItem>
                                                <SelectItem value="percentage">
                                                    Percentage
                                                </SelectItem>
                                                <SelectItem value="formula">
                                                    Formula
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            className="h-8 text-xs"
                                            value={component.amount ?? 0}
                                            onChange={(event) =>
                                                updateComponent(
                                                    component.id,
                                                    'amount',
                                                    Number(
                                                        event.target.value || 0,
                                                    ),
                                                )
                                            }
                                            placeholder="Amount"
                                        />
                                    </div>

                                    {component.amount_type === 'formula' && (
                                        <div className="space-y-2 rounded border border-blue-100 bg-blue-50 p-2">
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
                                                        <SelectItem value="piket">Piket</SelectItem>
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
                                            <p className="text-[10px] text-blue-700">
                                                                                                {component.formula_type === 'jam_kerja'
                                                                                                        ? 'Total menit kerja dibagi interval menit lalu dikali nominal.'
                                                                                                        : component.formula_type === 'lembur'
                                                                                                            ? 'Nominal dikali jumlah lembur yang disetujui di periode ini.'
                                                                                                            : component.formula_type === 'jam_mengajar_teori'
                                                                                                                ? 'Nominal dikali total jam teori per bulan dari absensi guru.'
                                                                                                                : component.formula_type === 'jam_mengajar_praktik'
                                                                                                                    ? 'Nominal dikali total jam praktik per bulan dari absensi guru.'
                                                                                                                    : component.formula_type === 'piket'
                                                                                                                        ? 'Nominal dikali frekuensi piket (jumlah hari ada_piket = true) di periode ini.'
                                                                                                                        : "Nominal dikali total status 'hadir' di absensi."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <Select
                        value={String(form.is_active)}
                        onValueChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                is_active: Number(value),
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Aktif</SelectItem>
                            <SelectItem value="0">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button className="w-full" onClick={submit}>
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

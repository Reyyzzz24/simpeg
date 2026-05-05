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
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

export default function SalaryRuleEditModal({
    open,
    setOpen,
    data,
    components,
}: any) {
    /**
     * =========================
     * STATE
     * =========================
     */
    const [form, setForm] = useState<any>({
        role: '',
        sub_role: '',
        status_kerja: 'tetap',
        is_active: 1,
        components: [],
    });

    /**
     * =========================
     * NORMALIZER (IMPORTANT FIX)
     * =========================
     */
    const normalizeComponents = (items: any[] = []) => {
        return items.map((c: any) => ({
            id: Number(c.component_id),
            amount_type: c.amount_type ?? 'fixed',
            amount: Number(c.amount ?? 0),
        }));
    };

    /**
     * =========================
     * INIT DATA
     * =========================
     */
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

    /**
     * =========================
     * ADD COMPONENT
     * =========================
     */
    const addComponent = (id: string) => {
        const numId = Number(id);

        setForm((prev: any) => {
            if (prev.components.some((c: any) => Number(c.id) === numId)) {
                return prev;
            }

            return {
                ...prev,
                components: [
                    ...prev.components,
                    {
                        id: numId,
                        amount_type: 'fixed',
                        amount: 0,
                    },
                ],
            };
        });
    };

    /**
     * =========================
     * REMOVE COMPONENT
     * =========================
     */
    const removeComponent = (id: number) => {
        setForm((prev: any) => ({
            ...prev,
            components: prev.components.filter(
                (c: any) => Number(c.id) !== Number(id),
            ),
        }));
    };

    /**
     * =========================
     * UPDATE COMPONENT FIELD
     * =========================
     */
    const updateComponent = (id: number, key: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            components: prev.components.map((c: any) =>
                Number(c.id) === Number(id) ? { ...c, [key]: value } : c,
            ),
        }));
    };

    /**
     * =========================
     * SUBMIT
     * =========================
     */
    const submit = () => {
        router.put(
            `/salary-rules/${data.id}`,
            {
                role: form.role,
                sub_role: form.sub_role,
                status_kerja: form.status_kerja,
                is_active: form.is_active,

                components: form.components.map((c: any) => ({
                    id: c.id,
                    amount_type: c.amount_type,
                    amount: c.amount,
                })),
            },
            {
                onSuccess: () => setOpen(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Salary Rule</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* ROLE */}
                    <Input
                        value={form.role}
                        onChange={(e) =>
                            setForm((prev: any) => ({
                                ...prev,
                                role: e.target.value,
                            }))
                        }
                        placeholder="Role"
                    />

                    {/* SUB ROLE */}
                    <Input
                        value={form.sub_role}
                        onChange={(e) =>
                            setForm((prev: any) => ({
                                ...prev,
                                sub_role: e.target.value,
                            }))
                        }
                        placeholder="Sub Role"
                    />

                    {/* STATUS KERJA */}
                    <Select
                        value={form.status_kerja}
                        onValueChange={(value) =>
                            setForm((prev: any) => ({
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

                    {/* ADD COMPONENT */}
                    <Select onValueChange={addComponent}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tambah Komponen" />
                        </SelectTrigger>
                        <SelectContent>
                            {components?.map((c: any) => (
                                <SelectItem
                                    key={String(c.id)}
                                    value={String(c.id)}
                                >
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* COMPONENT LIST */}
                    <div className="space-y-3">
                        {form.components.map((c: any) => {
                            const comp = components?.find(
                                (x: any) => Number(x.id) === Number(c.id),
                            );

                            return (
                                <div
                                    key={String(c.id)}
                                    className="space-y-2 rounded border p-3"
                                >
                                    {/* HEADER */}
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                            {comp?.name ?? 'Unknown Component'}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() =>
                                                removeComponent(c.id)
                                            }
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* TYPE */}
                                        <Select
                                            value={String(c.amount_type)}
                                            onValueChange={(value) =>
                                                updateComponent(
                                                    c.id,
                                                    'amount_type',
                                                    value,
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
                                                    Formula (Hadir)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* AMOUNT */}
                                        <Input
                                            type="number"
                                            className="h-8 text-xs"
                                            value={c.amount ?? 0}
                                            onChange={(e) =>
                                                updateComponent(
                                                    c.id,
                                                    'amount',
                                                    Number(e.target.value || 0),
                                                )
                                            }
                                            placeholder="Amount"
                                        />
                                    </div>

                                    {/* KETERANGAN DINAMIS */}
                                    {c.amount_type === 'formula' && (
                                        <div className="rounded border border-blue-100 bg-blue-50 p-2">
                                            <p className="text-[10px] text-blue-700">
                                                <strong>Logika Formula:</strong>{' '}
                                                Nominal di atas akan dikalikan
                                                dengan jumlah record absensi
                                                berstatus{' '}
                                                <strong>'hadir'</strong> pada
                                                periode terpilih.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* STATUS */}
                    <Select
                        value={String(form.is_active)}
                        onValueChange={(value) =>
                            setForm((prev: any) => ({
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

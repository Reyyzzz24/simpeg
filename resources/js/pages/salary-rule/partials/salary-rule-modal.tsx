import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    components: any[];
    positions: any[];
};

const roles = ['admin', 'guru', 'pegawai'] as const;

// Definisi enum sub_role sesuai database
const SUB_ROLE_OPTIONS = {
    guru: ['normatif', 'produktif'],
    pegawai: ['tu', 'struktural', 'karyawan', 'staf'],
} as const;

export default function SalaryRuleModal({
    open,
    setOpen,
    components,
    positions,
}: Props) {
    const [form, setForm] = useState({
        role: '',
        sub_role: '',
        status_kerja: 'tetap',
        is_active: true,
        components: [] as {
            id: number;
            amount_type: 'fixed' | 'percentage' | 'formula';
            amount: number;
        }[],
    });

    // Mendapatkan opsi sub_role berdasarkan role yang sedang dipilih
    const currentSubRoleOptions = useMemo(() => {
        if (!form.role) {
return [];
}

        return (
            SUB_ROLE_OPTIONS[form.role as keyof typeof SUB_ROLE_OPTIONS] || []
        );
    }, [form.role]);

    /** HANDLING ROLE CHANGE */
    const handleRoleChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            role: value,
            sub_role: '', // Reset sub_role saat role berubah
        }));
    };

    /** ADD COMPONENT */
    const addComponent = (id: string) => {
        const numId = Number(id);
        setForm((prev) => {
            if (prev.components.find((c) => c.id === numId)) {
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

    /** REMOVE COMPONENT */
    const removeComponent = (id: number) => {
        setForm((prev) => ({
            ...prev,
            components: prev.components.filter((c) => c.id !== id),
        }));
    };

    /** UPDATE COMPONENT FIELD */
    const updateComponent = (id: number, key: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            components: prev.components.map((c) =>
                c.id === id ? { ...c, [key]: value } : c,
            ),
        }));
    };

    /** SUBMIT */
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
                        Rule berbasis role + sub role + komponen gaji.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex w-full flex-col gap-4">
                    {/* ROLE */}
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
                                {roles.map((r) => (
                                    <SelectItem
                                        key={r}
                                        value={r}
                                        className="capitalize"
                                    >
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* SUB ROLE (Dinamis) */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Sub Role / Kategori
                        </label>
                        <Select
                            value={form.sub_role}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, sub_role: v }))
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

                    {/* STATUS KERJA */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Status Kerja
                        </label>
                        <Select
                            value={form.status_kerja}
                            onValueChange={(v) =>
                                setForm((prev) => ({
                                    ...prev,
                                    status_kerja: v,
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

                    {/* ADD COMPONENT */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Komponen Gaji
                        </label>
                        <Select onValueChange={addComponent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tambah Komponen" />
                            </SelectTrigger>
                            <SelectContent>
                                {components.map((c: any) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* COMPONENT LIST */}
                    <div className="space-y-3">
                        {form.components.map((c) => {
                            const comp = components.find((x) => x.id === c.id);

                            return (
                                <div
                                    key={c.id}
                                    className="space-y-2 rounded border bg-slate-50/50 p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                            {comp?.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeComponent(c.id)
                                            }
                                            className="text-lg text-red-500"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Select
                                            value={c.amount_type}
                                            onValueChange={(v) =>
                                                updateComponent(
                                                    c.id,
                                                    'amount_type',
                                                    v,
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
                                                    Formula (Kehadiran)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            className="h-8 text-xs"
                                            value={c.amount}
                                            onChange={(e) =>
                                                updateComponent(
                                                    c.id,
                                                    'amount',
                                                    Number(e.target.value),
                                                )
                                            }
                                            placeholder={
                                                c.amount_type === 'formula'
                                                    ? 'Tarif/Hadir'
                                                    : 'Nilai'
                                            }
                                        />
                                    </div>

                                    {/* INFO TAMBAHAN UNTUK FORMULA */}
                                    {c.amount_type === 'formula' && (
                                        <p className="text-[10px] leading-tight text-blue-600 italic">
                                            * Otomatis: (Nominal × Total status
                                            'hadir' di absensi)
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* STATUS */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Status Rule
                        </label>
                        <Select
                            value={form.is_active ? '1' : '0'}
                            onValueChange={(v) =>
                                setForm((prev) => ({
                                    ...prev,
                                    is_active: v === '1',
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

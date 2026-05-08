import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FormEvent } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
    permissions: Array<{ id: number; name: string }>;
};

export default function EditRoleModal({ isOpen, onClose, record, permissions }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        guard_name: 'web',
        permission_ids: [] as number[],
    });

    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!record) return;
        setData({
            name: record?.name ?? '',
            guard_name: record?.guard_name ?? 'web',
            permission_ids: (record?.permission_ids ?? []) as number[],
        });
        setSubmitError(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record]);

    const togglePermission = (id: number) => {
        setData(
            'permission_ids',
            data.permission_ids.includes(id)
                ? data.permission_ids.filter((x) => x !== id)
                : [...data.permission_ids, id],
        );
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!record) return;

        put(`/roles/${record.id}`, {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (err) => {
                setSubmitError(err?.message ?? 'Gagal menyimpan role.');
            },
        });
    };

    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Perbarui nama dan guard_name role.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label>Guard Name</Label>
                        <Select
                            value={data.guard_name}
                            onValueChange={(value) =>
                                setData('guard_name', value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih guard" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="web">web</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.guard_name} />
                    </div>

                    <div>
                        <Label>Permissions</Label>
                        <div className="mt-2 max-h-64 space-y-2 overflow-auto rounded-lg border p-3">
                            {(permissions ?? []).map((p) => (
                                <label
                                    key={p.id}
                                    className="flex cursor-pointer items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.permission_ids.includes(p.id)}
                                        onChange={() => togglePermission(p.id)}
                                    />
                                    <span className="font-mono">{p.name}</span>
                                </label>
                            ))}
                            {(!permissions || permissions.length === 0) && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada permission. Tambahkan di menu Permissions.
                                </p>
                            )}
                        </div>
                        <InputError message={(errors as any).permission_ids} />
                    </div>

                    {submitError && (
                        <p className="text-sm text-red-500">{submitError}</p>
                    )}

                    <DialogFooter className="gap-2 pt-4">
                        <Button variant="secondary" type="button" onClick={onClose}>
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


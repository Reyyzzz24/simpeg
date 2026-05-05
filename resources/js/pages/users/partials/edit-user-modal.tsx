import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
} from "@/components/ui/select";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    record: any | null;
};

export default function EditUserModal({ isOpen, onClose, record }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
        password_confirmation: '',
    });

    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        setData({
            name: record?.name || '',
            email: record?.email || '',
            role: record?.role || 'user',
            password: '',
            password_confirmation: '',
        });
        setPasswordError(null);
    }, [record]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!record) return;

        // ✅ Validasi password match
        if (data.password && data.password !== data.password_confirmation) {
            setPasswordError('Konfirmasi password tidak sama');
            return;
        }

        setPasswordError(null);

        put(`/users/${record.id}`, {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi user (kosongkan password jika tidak ingin mengubah).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">

                    <div>
                        <Label>Nama</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label>Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="pegawai">Pegawai</SelectItem>
                                <SelectItem value="guru">Guru</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superadmin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        <InputError message={errors.role} />
                    </div>

                    <div>
                        <Label>Password (opsional)</Label>
                        <Input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <Label>Konfirmasi Password</Label>
                        <Input
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                        />

                        {passwordError && (
                            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                        )}
                    </div>

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
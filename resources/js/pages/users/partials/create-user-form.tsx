import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CreateUserForm({
    onClose,
    roles,
}: {
    onClose: () => void;
    roles: Array<{ id?: number; name: string }>;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: roles?.[0]?.name ?? 'user',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            setConfirmError('Password tidak sama');
            return;
        }

        setConfirmError('');

        post('/users/store', {
            onSuccess: () => {
                reset();
                setConfirmError('');
                onClose();
            }
        });
    };
    const [confirmError, setConfirmError] = useState('');

    return (
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
                        {(roles ?? []).map((r) => (
                            <SelectItem key={r.name} value={r.name}>
                                {r.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <InputError message={errors.role} />
            </div>
            <div>
                <Label>Password</Label>
                <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                <InputError message={errors.password} />
            </div>

            <div>
                <Label>Konfirmasi Password</Label>
                <Input
                    type="password"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                />

                {confirmError && (
                    <p className="text-sm text-red-500 mt-1">{confirmError}</p>
                )}
            </div>

            <DialogFooter className="gap-2 pt-4">
                <DialogTrigger asChild>
                    <Button variant="secondary" type="button" onClick={onClose}>Batal</Button>
                </DialogTrigger>
                <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
            </DialogFooter>
        </form>
    );
}

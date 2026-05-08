import { useForm } from '@inertiajs/react';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    onClose: () => void;
    users: any[];
    permissions: any[];
};

export default function CreateUserPermissionForm({ onClose, users, permissions }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        permission_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/user-permissions/store', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <Label>User</Label>
                <Select
                    value={data.user_id}
                    onValueChange={(value) => setData('user_id', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih user" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name} ({user.email})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.user_id} />
            </div>

            <div>
                <Label>Permission</Label>
                <Select
                    value={data.permission_id}
                    onValueChange={(value) => setData('permission_id', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih permission" />
                    </SelectTrigger>
                    <SelectContent>
                        {permissions.map((permission: any) => (
                            <SelectItem key={permission.id} value={permission.id.toString()}>
                                {permission.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.permission_id} />
            </div>

            <DialogFooter className="gap-2 pt-4">
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                    >
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

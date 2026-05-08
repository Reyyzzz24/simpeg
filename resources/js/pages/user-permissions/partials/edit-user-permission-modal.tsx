import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    isOpen: boolean;
    onClose: () => void;
    record: any;
    users: any[];
    permissions: any[];
};

export default function EditUserPermissionModal({ isOpen, onClose, record, users, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: record?.user_id || '',
        permission_id: record?.permission_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/user-permissions/${record?.id}`, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit User Permission</DialogTitle>
                </DialogHeader>

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

                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="flex-1">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

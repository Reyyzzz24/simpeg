import { useForm } from '@inertiajs/react';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
};

export default function CreatePermissionForm({ onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        guard_name: 'web',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/permissions/store', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <Label>Name</Label>
                <Input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="contoh: users.view"
                />
                <InputError message={errors.name} />
            </div>

            <div>
                <Label>Guard Name</Label>
                <Select
                    value={data.guard_name}
                    onValueChange={(value) => setData('guard_name', value)}
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

            <DialogFooter className="gap-2 pt-4">
                <DialogTrigger asChild>
                    <Button variant="secondary" type="button" onClick={onClose}>
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


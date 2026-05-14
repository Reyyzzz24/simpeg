import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';

export default function DeleteUserModal({ isOpen, onClose, record }: any) {
    const { delete: destroy, processing } = useForm();

    if (!record) return null;

    const handleDelete = () => {
        destroy(`/users/${record.id}`, {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Pengguna</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Yakin ingin menghapus {record.name}? Data guru atau pegawai yang terhubung juga akan ikut terhapus.
                </p>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose} disabled={processing}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

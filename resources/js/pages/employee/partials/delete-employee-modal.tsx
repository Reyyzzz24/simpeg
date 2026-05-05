// partials/delete-employee-modal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteEmployeeModal({ isOpen, onClose, record }: any) {
    if (!record) return null

    const handleDelete = () => {
        fetch(`/pegawai/${record.id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
            }
        }).then(() => location.reload())
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Pegawai</DialogTitle>
                </DialogHeader>

                <p>Yakin ingin menghapus {record.name}?</p>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
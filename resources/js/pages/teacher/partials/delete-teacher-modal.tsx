import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Hapus Data",
    description = "Apakah kamu yakin ingin menghapus data ini?"
}: any) {

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    {description}
                </p>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
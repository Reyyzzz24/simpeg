import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type DeleteProps = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading?: boolean
    title?: string
    description?: string
}

export default function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    loading,
    title = "Hapus Data",
    description = "Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
}: DeleteProps) {

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
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? "Menghapus..." : "Hapus"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
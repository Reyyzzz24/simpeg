import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useForm } from '@inertiajs/react'
import { useEffect, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'

type Props = {
    isOpen: boolean
    onClose: () => void
    users: any[]
    components: any[]
    record?: any[] | null // Pastikan ini array
}

export default function AdjustmentModal({ isOpen, onClose, users, components, record }: Props) {
    // 1. Deteksi Mode
    const isEdit = useMemo(() => !!(record && record.length > 0), [record]);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        user_id: '',
        periode: new Date().toISOString().slice(0, 7),
        items: [{ component_id: '', amount: '', note: '' }]
    });

    // 2. Sinkronisasi Data dengan Mode
    useEffect(() => {
        if (!isOpen) {
            clearErrors();
            return;
        }

        if (isEdit && record) {
            setData({
                user_id: String(record[0].user_id ?? ''),
                periode: record[0].periode ?? new Date().toISOString().slice(0, 7),
                items: record.map((r: any) => ({
                    id: r.id, // Penting untuk update di backend
                    component_id: String(r.component_id ?? ''),
                    amount: String(r.amount ?? 0),
                    note: r.note ?? '',
                })),
            });
        } else {
            // Mode Tambah: Reset ke state awal
            reset();
        }
    }, [isOpen, record, isEdit]);

    const addItem = () => {
        setData('items', [...data.items, { component_id: '', amount: '', note: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Pilih endpoint berdasarkan mode
        const url = isEdit 
            ? '/payroll-adjustments/update' 
            : '/payroll-adjustments/bulk-store';

        post(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Edit Adjustment' : 'Tambah Adjustment'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit 
                                ? 'Perbarui daftar bonus atau potongan untuk karyawan ini.' 
                                : 'Tambah daftar bonus atau potongan baru.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label>Periode</Label>
                            <Input
                                type="month"
                                value={data.periode}
                                onChange={(e) => setData('periode', e.target.value)}
                                required
                                disabled={isEdit} // Periode biasanya dikunci saat edit
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Karyawan</Label>
                            <Select
                                value={data.user_id || ''}
                                onValueChange={(v) => setData('user_id', v)}
                                disabled={isEdit} // Karyawan dikunci saat edit
                            >
                                <SelectTrigger><SelectValue placeholder="Pilih Karyawan" /></SelectTrigger>
                                <SelectContent>
                                    {users?.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Daftar Komponen</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Tambah Item
                            </Button>
                        </div>

                        {data.items.map((item: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3 bg-slate-50/50 relative">
                                {data.items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Komponen</Label>
                                        <Select
                                            value={item.component_id}
                                            onValueChange={(v) => updateItem(index, 'component_id', v)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                                            <SelectContent>
                                                {components?.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Nominal</Label>
                                        <Input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => updateItem(index, 'amount', e.target.value)}
                                            placeholder="Rp"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Catatan</Label>
                                    <Textarea
                                        className="h-16 text-sm"
                                        value={item.note}
                                        onChange={(e) => updateItem(index, 'note', e.target.value)}
                                        placeholder="Keterangan..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Baru')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    type: string;
    start: string;
    end: string;
    onApply: (filters: {
        type: string;
        start: string;
        end: string;
    }) => void;
};

export default function ReportFilter({
    type,
    start,
    end,
    onApply,
}: Props) {
    const [open, setOpen] = useState(false);

    const [localType, setLocalType] = useState(type);
    const [localStart, setLocalStart] = useState(start);
    const [localEnd, setLocalEnd] = useState(end);

    useEffect(() => {
        setLocalType(type);
        setLocalStart(start);
        setLocalEnd(end);
    }, [type, start, end]);

    const handleApply = () => {
        onApply({
            type: localType,
            start: localStart,
            end: localEnd,
        });

        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 size-4" />
                    Filter
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 space-y-5">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Jenis Pegawai
                        </label>

                        <Select
                            value={localType}
                            onValueChange={setLocalType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih jenis pegawai" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="guru">Guru</SelectItem>
                                <SelectItem value="pegawai">Pegawai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tanggal Mulai
                        </label>

                        <input
                            type="date"
                            value={localStart}
                            onChange={(e) => setLocalStart(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tanggal Akhir
                        </label>

                        <input
                            type="date"
                            value={localEnd}
                            onChange={(e) => setLocalEnd(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <Button className="w-full" onClick={handleApply}>
                    Terapkan Filter
                </Button>
            </PopoverContent>
        </Popover>
    );
}
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

type Props = {
    type: string;
    setType: (v: string) => void;
    start: string;
    setStart: (v: string) => void;
    end: string;
    setEnd: (v: string) => void;
    onApply: (filters?: { type: string; start: string; end: string }) => void;
};

export default function ReportFilter({
    type,
    setType,
    start,
    setStart,
    end,
    setEnd,
    onApply,
}: Props) {
    const [open, setOpen] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    // Local states to avoid applying changes immediately
    const [localType, setLocalType] = useState(type);
    const [localStart, setLocalStart] = useState(start);
    const [localEnd, setLocalEnd] = useState(end);

    useEffect(() => {
        setLocalType(type);
        setLocalStart(start);
        setLocalEnd(end);
    }, [type, start, end]);

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

                        <Select value={localType} onValueChange={setLocalType}>
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

                <Button
                    className="w-full"
                    onClick={() => {
                        onApply({
                            type: localType ?? 'all',
                            start: localStart ?? '',
                            end: localEnd ?? '',
                        });
                        setOpen(false);
                    }}
                >
                    Terapkan Filter
                </Button>
            </PopoverContent>
        </Popover>
    );
}

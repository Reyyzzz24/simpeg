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
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 size-4" />
                    Filter
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 space-y-5">

                {/* TYPE */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Jenis Pegawai</label>

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

                {/* START DATE (Calendar) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tanggal Mulai</label>

                    <Popover open={openStart} onOpenChange={setOpenStart}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="mr-2 size-4" />
                                {localStart
                                    ? format(new Date(localStart), 'dd MMM yyyy')
                                    : 'Pilih tanggal'}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto">
                            <Calendar
                                mode="single"
                                selected={localStart ? new Date(localStart) : undefined}
                                onSelect={(date) => {
                                    if (!date) return;
                                    setLocalStart(format(date, 'yyyy-MM-dd'));
                                    setOpenStart(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* END DATE (Calendar) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tanggal Akhir</label>

                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="mr-2 size-4" />
                                {localEnd
                                    ? format(new Date(localEnd), 'dd MMM yyyy')
                                    : 'Pilih tanggal'}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto">
                            <Calendar
                                mode="single"
                                selected={localEnd ? new Date(localEnd) : undefined}
                                onSelect={(date) => {
                                    if (!date) return;
                                    setLocalEnd(format(date, 'yyyy-MM-dd'));
                                    setOpenEnd(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* APPLY */}
                <Button
                    className="w-full"
                    onClick={() => {
                        onApply({ type: localType ?? 'all', start: localStart ?? '', end: localEnd ?? '' });
                    }}
                >
                    Terapkan Filter
                </Button>
            </PopoverContent>
        </Popover>
    );
}
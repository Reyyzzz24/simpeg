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
import { useState } from 'react';

type Props = {
    type: string;
    setType: (v: string) => void;
    start: string;
    setStart: (v: string) => void;
    end: string;
    setEnd: (v: string) => void;
    onApply: () => void;
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

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 size-4" />
                    Filter
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 space-y-5">

                {/* TYPE */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Jenis Pegawai</label>

                    <Select value={type} onValueChange={setType}>
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
                                {start
                                    ? format(new Date(start), 'dd MMM yyyy')
                                    : 'Pilih tanggal'}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto">
                            <Calendar
                                mode="single"
                                selected={start ? new Date(start) : undefined}
                                onSelect={(date) => {
                                    if (!date) return;
                                    setStart(format(date, 'yyyy-MM-dd'));
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
                                {end
                                    ? format(new Date(end), 'dd MMM yyyy')
                                    : 'Pilih tanggal'}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto">
                            <Calendar
                                mode="single"
                                selected={end ? new Date(end) : undefined}
                                onSelect={(date) => {
                                    if (!date) return;
                                    setEnd(format(date, 'yyyy-MM-dd'));
                                    setOpenEnd(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* APPLY */}
                <Button className="w-full" onClick={onApply}>
                    Terapkan Filter
                </Button>
            </PopoverContent>
        </Popover>
    );
}
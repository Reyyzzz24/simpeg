import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { parseDateInput } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

interface DatePickerProps {
    date?: Date | string | null;
    setDate: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
    showDropdowns?: boolean;
    startYear?: number;
    endYear?: number;
    name?: string;
}

export function DatePicker({
    date,
    setDate,
    className,
    placeholder = 'Pilih tanggal',
    showDropdowns = false,
    startYear = 1900,
    endYear = new Date().getFullYear() + 10,
    name,
}: DatePickerProps) {
    const parsedDate = parseDateInput(date);

    return (
        <Popover>
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={parsedDate ? format(parsedDate, 'yyyy-MM-dd') : ''}
                />
            )}
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !parsedDate && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {parsedDate ? (
                        format(parsedDate, 'yyyy-MM-dd')
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={parsedDate}
                    onSelect={setDate}
                    initialFocus
                    captionLayout={showDropdowns ? 'dropdown' : 'label'}
                    fromYear={showDropdowns ? startYear : undefined}
                    toYear={showDropdowns ? endYear : undefined}
                />
            </PopoverContent>
        </Popover>
    );
}

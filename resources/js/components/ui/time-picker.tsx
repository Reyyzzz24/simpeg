import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface TimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    startTime?: string; // Format: HH:mm (e.g., "06:30")
    endTime?: string; // Format: HH:mm (e.g., "15:00")
    interval?: number; // Minutes (default: 30)
}

/**
 * Generate time slots between start and end time with given interval
 */
function generateTimeSlots(
    startTime: string = '06:30',
    endTime: string = '15:00',
    interval: number = 30,
): string[] {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        slots.push(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        );
        currentMinutes += interval;
    }

    return slots;
}

export function TimePicker({
    value,
    onChange,
    placeholder = 'Pilih waktu',
    className,
    disabled = false,
    startTime = '06:30',
    endTime = '15:00',
    interval = 30,
}: TimePickerProps) {
    const timeSlots = React.useMemo(
        () => generateTimeSlots(startTime, endTime, interval),
        [startTime, endTime, interval],
    );

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={cn('w-full', className)}>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={placeholder} />
                </div>
            </SelectTrigger>
            <SelectContent className="max-h-60">
                {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                        {time}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export { generateTimeSlots };

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface FormErrorSummaryProps {
    errors: Record<string, string>;
    title?: string;
    className?: string;
    dismissible?: boolean;
}

export function FormErrorSummary({
    errors,
    title = 'Terdapat kesalahan pada form',
    className,
    dismissible = false,
}: FormErrorSummaryProps) {
    const [dismissed, setDismissed] = useState(false);
    const errorEntries = Object.entries(errors);

    if (errorEntries.length === 0 || dismissed) {
        return null;
    }

    const formatFieldName = (key: string): string => {
        return key
            .split(/[._]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <Alert
            variant="destructive"
            className={cn(
                'relative border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30',
                className,
            )}
        >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold text-red-800 dark:text-red-200">
                {title} ({errorEntries.length}{' '}
                {errorEntries.length === 1 ? 'error' : 'errors'})
            </AlertTitle>
            <AlertDescription className="mt-2">
                <ul className="list-none space-y-1.5 text-sm text-red-700 dark:text-red-300">
                    {errorEntries.map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 dark:bg-red-400" />
                            <span>
                                <strong className="font-medium">
                                    {formatFieldName(key)}:
                                </strong>{' '}
                                {value}
                            </span>
                        </li>
                    ))}
                </ul>
            </AlertDescription>
            {dismissible && (
                <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className="absolute top-3 right-3 rounded-full p-1 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-200"
                    aria-label="Tutup"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </Alert>
    );
}

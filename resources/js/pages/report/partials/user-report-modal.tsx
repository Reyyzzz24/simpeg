import type { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type StatItem = {
    title: string;
    value: string | number;
    color: string;
};

type Props<TData> = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    userName: string;
    periodLabel: string;
    data: TData[];
    columns: ColumnDef<TData>[];
    stats: StatItem[];
    searchKey: string;
    searchPlaceholder: string;
    emptyText: string;
    printUrl: string;
};

export default function UserReportModal<TData>({
    isOpen,
    onClose,
    title,
    description,
    userName,
    periodLabel,
    data,
    columns,
    stats,
    searchKey,
    searchPlaceholder,
    emptyText,
    printUrl,
}: Props<TData>) {
    const handlePrint = () => {
        window.open(printUrl, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CalendarDays className="h-6 w-6 text-teal-600" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                            Nama
                        </p>
                        <p className="text-lg font-semibold">{userName}</p>
                    </div>
                    <div className="w-full sm:w-56">
                        <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                            Periode
                        </p>
                        <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium">
                            {periodLabel}
                        </p>
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {stats.map((item) => (
                        <StatCard
                            key={item.title}
                            title={item.title}
                            value={item.value}
                            color={item.color}
                        />
                    ))}
                </div>

                <div className="relative mt-4 min-h-[350px]">
                    {data.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={data}
                            searchKey={searchKey}
                            searchPlaceholder={searchPlaceholder}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-20">
                            <p className="text-muted-foreground">{emptyText}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 size-4" />
                        Print
                    </Button>
                    <Button onClick={onClose}>Tutup</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: string | number;
    color: string;
}) {
    return (
        <Card className={`${color} border shadow-sm`}>
            <CardContent className="flex flex-col items-center p-4 md:items-start">
                <p className="text-center text-xs font-semibold uppercase opacity-70 md:text-left">
                    {title}
                </p>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';

import { getColumns } from './columns';
import SalaryRuleEditModal from './partials/salary-rule-edit-modal';
import SalaryRuleModal from './partials/salary-rule-modal';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Salary Rule', href: '/salary-rules' },
];

export default function SalaryRuleIndex({ data, components, positions }: any) {
    const [createOpen, setCreateOpen] = useState(false);

    /**
     * EDIT STATE
     */
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const remove = (row: any) => {
        if (confirm('Yakin hapus rule ini?')) {
            router.delete(`/salary-rules/${row.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleEdit = (row: any) => {
        setSelected(row);
        setEditOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <PageHeader
                title="Salary Rule"
                subtitle="Payroll Engine"
                description="Aturan bonus dan potongan gaji"
            />

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Data Salary Rule</h2>

                <DataTable
                    data={data ?? []}
                    columns={getColumns({
                        onDelete: remove,
                        onEdit: handleEdit,
                    })}
                    searchKey="role"
                    searchPlaceholder="Cari role..."
                    actions={
                        <SalaryRuleModal
                            open={createOpen}
                            setOpen={setCreateOpen}
                            components={components ?? []}
                            positions={positions ?? []}
                        />
                    }
                />
            </div>
            <SalaryRuleEditModal
                open={editOpen}
                setOpen={setEditOpen}
                data={selected}
                components={components ?? []}
                positions={positions ?? []}
            />
        </div>
    );
}

SalaryRuleIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

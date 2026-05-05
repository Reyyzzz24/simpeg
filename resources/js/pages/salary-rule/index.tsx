import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/ui/data-table'

import SalaryRuleModal from './partials/salary-rule-modal'
import SalaryRuleEditModal from './partials/salary-rule-edit-modal'
import { getColumns } from './columns'

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Salary Rule', href: '/salary-rules' },
]

export default function SalaryRuleIndex({ data, components, positions }: any) {

    const [createOpen, setCreateOpen] = useState(false)

    /**
     * EDIT STATE
     */
    const [editOpen, setEditOpen] = useState(false)
    const [selected, setSelected] = useState<any>(null)

    const remove = (row: any) => {
        if (confirm('Yakin hapus rule ini?')) {
            window.location.href = `/salary-rules/${row.id}`
        }
    }

    const handleEdit = (row: any) => {
        setSelected(row)
        setEditOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">

            <PageHeader
                title="Salary Rule"
                subtitle="Payroll Engine"
                description="Aturan bonus dan potongan gaji"
            />

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                    Data Salary Rule
                </h2>

                <DataTable
                    data={data ?? []}
                    columns={getColumns({
                        onDelete: remove,
                        onEdit: handleEdit
                    })}
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
    )
}

SalaryRuleIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
)
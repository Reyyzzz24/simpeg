import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    OnChangeFn,
    PaginationState,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronsUpDown,
    Filter,
    RefreshCcw,
    Settings2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface DataTableFilterOption {
    label: string
    value: string
    className?: string
}

export interface DataTableFilter {
    key: string
    title: string
    options: DataTableFilterOption[]
    value?: string
    onChange: (value: string) => void
}

function FilterPanel({ filters }: { filters: DataTableFilter[] }) {
    const [open, setOpen] = React.useState(false)

    const activeFiltersCount = filters.filter(
        (f) => f.value && f.value !== "all"
    ).length

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                        <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[800px] max-w-[90vw]">
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filters.map((filter) => (
                        <div key={filter.key} className="space-y-2">
                            <label className="text-sm font-medium">
                                {filter.title}
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={false}
                                        aria-controls={`${filter.key}-content`}
                                        className="w-full justify-between font-normal"
                                    >
                                        <span className="truncate">
                                            {filter.value && filter.value !== "all"
                                                ? filter.options.find(
                                                      (option) =>
                                                          option.value === filter.value
                                                  )?.label
                                                : `Semua ${filter.title}`}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    id={`${filter.key}-content`}
                                    className="w-[300px] p-0"
                                    align="start"
                                >
                                    <Command>
                                        <CommandInput
                                            placeholder={`Cari ${filter.title}...`}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="all"
                                                    onSelect={() => {
                                                        filter.onChange("all")
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            !filter.value ||
                                                                filter.value === "all"
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    Semua {filter.title}
                                                </CommandItem>
                                                {filter.options.map((option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className={option.className}
                                                        onSelect={(currentValue: any) => {
                                                            filter.onChange(
                                                                currentValue === filter.value
                                                                    ? "all"
                                                                    : currentValue
                                                            )
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                filter.value === option.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {option.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function SortableHeader<TData, TValue>({
    header,
}: {
    header: import("@tanstack/react-table").Header<TData, TValue>
}) {
    if (header.isPlaceholder) {
        return null
    }

    const label = flexRender(header.column.columnDef.header, header.getContext())

    if (!header.column.getCanSort()) {
        return label
    }

    const direction = header.column.getIsSorted()

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 gap-2 px-3 text-left font-semibold"
            onClick={header.column.getToggleSortingHandler()}
        >
            <span className="truncate">{label}</span>
            {direction === "asc" ? (
                <ArrowUp className="h-4 w-4 shrink-0" />
            ) : direction === "desc" ? (
                <ArrowDown className="h-4 w-4 shrink-0" />
            ) : (
                <ArrowUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
        </Button>
    )
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    onSearch?: (value: string) => void
    filters?: DataTableFilter[]
    initialColumnVisibility?: VisibilityState

    // Server-side options
    pageCount?: number
    totalRows?: number
    pagination?: PaginationState
    onPaginationChange?: OnChangeFn<PaginationState>
    onPageSizeChange?: (pageSize: number) => void
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
    columnFilters?: ColumnFiltersState
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
    onReset?: () => void
    actions?: React.ReactNode

    // Row selection options
    rowSelection?: RowSelectionState
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder,
    onSearch,
    filters,
    initialColumnVisibility,
    pageCount,
    totalRows,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    sorting: externalSorting,
    onSortingChange,
    columnFilters: externalColumnFilters,
    onColumnFiltersChange,
    onReset,
    rowSelection: externalRowSelection,
    onRowSelectionChange,
    actions,
}: DataTableProps<TData, TValue>) {
    const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
    const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility ?? {})
    const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})
    const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    // Determine if we are controlled or uncontrolled
    const isServerSide = typeof pageCount === 'number'

    const finalPagination = isServerSide ? pagination ?? internalPagination : internalPagination
    const finalSorting = isServerSide ? externalSorting ?? internalSorting : internalSorting
    const finalColumnFilters = isServerSide ? externalColumnFilters ?? internalColumnFilters : internalColumnFilters
    const finalRowSelection = externalRowSelection ?? internalRowSelection
    const handleRowSelectionChange = onRowSelectionChange ?? setInternalRowSelection

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        pageCount: isServerSide ? pageCount : undefined,
        state: {
            sorting: finalSorting,
            columnFilters: finalColumnFilters,
            columnVisibility,
            rowSelection: finalRowSelection,
            pagination: finalPagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: handleRowSelectionChange,
        onSortingChange: isServerSide ? onSortingChange : setInternalSorting,
        onColumnFiltersChange: isServerSide ? onColumnFiltersChange : setInternalColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: isServerSide ? onPaginationChange : setInternalPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: !isServerSide ? getFilteredRowModel() : undefined,
        getPaginationRowModel: !isServerSide ? getPaginationRowModel() : undefined,
        getSortedRowModel: !isServerSide ? getSortedRowModel() : undefined,
        manualPagination: isServerSide,
        manualSorting: isServerSide,
        manualFiltering: isServerSide,
    })

    const searchColumn = React.useMemo(() => {
        if (!searchKey) {
            return undefined
        }

        return table.getAllColumns().find((column) => column.id === searchKey)
    }, [table, searchKey])

    const [searchValue, setSearchValue] = React.useState(
        (searchColumn?.getFilterValue() as string) ?? ""
    )

    React.useEffect(() => {
        setSearchValue((searchColumn?.getFilterValue() as string) ?? "")
    }, [searchColumn])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchColumn) {
                searchColumn.setFilterValue(searchValue)
            }

            if (searchKey && isServerSide && onSearch) {
                onSearch(searchValue)
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [searchValue, searchColumn, searchKey, onSearch, isServerSide])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                {searchKey && (
                    <div className="flex items-center py-4 flex-1">
                        <Input
                            placeholder={searchPlaceholder ?? `Cari ${searchKey}...`}
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            className="max-w-sm w-full"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2 ml-auto">
                    {actions}
                    {isServerSide && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchValue("")
                                if (onReset) {
                                    onReset()
                                } else {
                                    table.resetColumnFilters()
                                    table.resetSorting()
                                    table.resetPagination()
                                }
                            }}
                            className="h-8"
                        >
                            Reset
                            <RefreshCcw className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                    {filters && filters.length > 0 && (
                        <FilterPanel filters={filters} />
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings2 className="mr-2 h-4 w-4" />
                                Tampilan
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-xl border-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            <SortableHeader header={header} />
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada hasil.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                table={table}
                totalRows={totalRows}
                onPageSizeChange={onPageSizeChange}
                currentPageIndex={finalPagination.pageIndex}
                currentPageSize={finalPagination.pageSize}
            />
        </div>
    )
}

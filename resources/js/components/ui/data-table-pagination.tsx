import { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    // Server-side pagination props
    totalRows?: number
    onPageSizeChange?: (pageSize: number) => void
    currentPageIndex?: number
    currentPageSize?: number
}

export function DataTablePagination<TData>({
    table,
    totalRows,
    onPageSizeChange,
    currentPageIndex,
    currentPageSize,
}: DataTablePaginationProps<TData>) {
    const tablePageSize = table.getState().pagination.pageSize
    const pageCount = table.getPageCount()

    // For server-side, use prop; for client-side, use table state
    const isServerSide = typeof totalRows === 'number'
    const pageSize = isServerSide && typeof currentPageSize === 'number' ? currentPageSize : tablePageSize


    // Use currentPageIndex from props for server-side mode, fallback to table state
    const pageIndex = isServerSide && typeof currentPageIndex === 'number'
        ? currentPageIndex
        : table.getState().pagination.pageIndex

    // For server-side pagination, we need to check pageIndex directly
    // because getCanPreviousPage/getCanNextPage may not work correctly
    // when manualPagination is enabled
    const canGoPrevious = pageIndex > 0
    const canGoNext = pageCount > 0 ? pageIndex < pageCount - 1 : false

    // Get the correct row counts based on mode
    const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
    const displayedRowCount = isServerSide
        ? totalRows
        : table.getFilteredRowModel().rows.length

    // Handle page size change
    const handlePageSizeChange = (value: string) => {
        const newPageSize = Number(value)
        if (isServerSide && onPageSizeChange) {
            // For server-side, trigger the callback
            onPageSizeChange(newPageSize)
        } else {
            // For client-side, just update the table state
            table.setPageSize(newPageSize)
        }
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {selectedRowCount > 0 ? (
                    <>
                        {selectedRowCount} dari {displayedRowCount} baris terpilih.
                    </>
                ) : (
                    <>
                        Total {displayedRowCount} baris.
                    </>
                )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Baris per halaman</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[110px] items-center justify-center text-sm font-medium">
                    Halaman {pageIndex + 1} dari {pageCount || 1}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Ke halaman pertama</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(pageIndex - 1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Ke halaman sebelumnya</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(pageIndex + 1)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Ke halaman selanjutnya</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(pageCount - 1)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Ke halaman terakhir</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

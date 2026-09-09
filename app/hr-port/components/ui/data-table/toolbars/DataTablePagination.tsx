import { Table } from "@tanstack/react-table"

import { PER_PAGE_COUNT } from "~/hr-port/components/ui/data-table/constants"
import TablePagination from "~/hr-port/components/ui/data-table/toolbars/TablePagination"

type Props<TData> = {
  table: Table<TData>
}

export const DataTablePagination = <TData,>(props: Props<TData>) => {
  const { table } = props
  const paginationSlotProps = table.options.meta?.slotProps?.pagination
  const {
    getPrePaginationRowModel,
    getState,
    setPageIndex,
    setPageSize,
    getFilteredRowModel,
    getPageCount,
    options: { rowCount, pageCount, manualFiltering },
    refs: { paginationRef },
  } = table
  const state = getState()
  const pageIndex = state.pagination.pageIndex || 0
  const pageSize = state.pagination.pageSize || PER_PAGE_COUNT

  const totalRowCount = manualFiltering
    ? (rowCount ?? getPrePaginationRowModel().rows.length)
    : getFilteredRowModel().rows.length

  const totalPagesCount = manualFiltering ? (pageCount ?? 1) : getPageCount()

  if (!totalRowCount) {
    return null
  }

  return (
    <TablePagination
      {...paginationSlotProps}
      ref={paginationRef}
      onPageChange={(num) => setPageIndex(num - 1)}
      onRowsPerPageChange={setPageSize}
      pageIndex={pageIndex}
      rowsPerPage={pageSize}
      totalCount={totalRowCount}
      totalPages={totalPagesCount}
    />
  )
}

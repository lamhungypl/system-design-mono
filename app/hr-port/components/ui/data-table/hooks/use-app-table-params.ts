import {
  RowData,
  Table,
  type TableOptions,
  TableState,
} from "@tanstack/react-table"
import isEqual from "lodash/isEqual"
import { PropsWithRef, RefObject, useMemo, useRef } from "react"
import { useDebounce } from "use-debounce"

import { AppTableProps } from "~/hr-port/components/ui/data-table/DataTable"
import { useAppTableState } from "~/hr-port/components/ui/data-table/hooks/use-app-table-state"
import { tableStateToQueryParams } from "~/hr-port/components/ui/data-table/utils"
import { PageParams } from "~/hr-port/features/common/data-access/types"

export type TableManualState = Partial<
  Pick<TableState, "pagination" | "columnFilters" | "globalFilter" | "sorting">
>

type UseAppTableParamsReturn<T extends RowData, FilterParams = unknown> = {
  queryParams: FilterParams & PageParams
  // PORT: `| null` added — React 19 types `useRef<T>(null)` as RefObject<T | null>.
  tableProps: Partial<
    PropsWithRef<{ ref?: RefObject<Table<T> | null> } & AppTableProps<T>>
  >
}

const useAppTableParams = <T extends RowData, FilterParams = unknown>(
  options?: Partial<TableOptions<T>>
) => {
  const tableState = useAppTableState(options)
  const tableRef = useRef<Table<T>>(null)

  const {
    columnFilters = [],
    globalFilter,
    sorting = [],
    pagination,

    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setPagination,
  } = tableState

  const tableProps = useMemo(() => {
    return {
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      state: {
        columnFilters,
        globalFilter,
        sorting,
        pagination,
      },
      ref: tableRef,
    } satisfies UseAppTableParamsReturn<T, FilterParams>["tableProps"]
  }, [
    columnFilters,
    globalFilter,
    pagination,
    setColumnFilters,
    setGlobalFilter,
    setPagination,
    setSorting,
    sorting,
  ])

  const queryParams = useMemo(() => {
    return tableStateToQueryParams<FilterParams>({
      pagination,
      columnFilters,
      globalFilter,
      sorting,
    })
  }, [columnFilters, globalFilter, pagination, sorting])

  const [debouncedParams] = useDebounce(queryParams, 300, {
    equalityFn: isEqual,
  })

  return {
    tableProps: tableProps,
    queryParams: debouncedParams,
  } satisfies UseAppTableParamsReturn<T, FilterParams>
}

export default useAppTableParams

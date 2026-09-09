import { RowData, Table } from "@tanstack/react-table"
import { useEffect, useMemo } from "react"

import useParsedStateParams from "~/hr-port/components/ui/data-table/hooks/use-parsed-state-params"

const useTableLocationEffect = <T extends RowData>(table: Table<T>) => {
  const { columnFilters: parsedFilters, sorting: parsedSorting } =
    useParsedStateParams()
  const { getAllColumns, options, setColumnFilters, setSorting } = table

  const syncWithLocation = options.meta?.syncWithLocation

  const columnIds = useMemo(() => {
    return getAllColumns().map((column) => column.id)
  }, [getAllColumns])

  useEffect(() => {
    if (syncWithLocation) {
      const paramsColumnFilters = (parsedFilters ?? []).filter((query) =>
        columnIds.includes(query.id)
      )
      setColumnFilters(paramsColumnFilters)
    }
  }, [columnIds, parsedFilters, setColumnFilters, syncWithLocation])

  useEffect(() => {
    if (syncWithLocation) {
      const paramsSorting = (parsedSorting ?? []).filter((query) =>
        columnIds.includes(query.id)
      )
      setSorting(paramsSorting)
    }
  }, [columnIds, parsedSorting, setSorting, syncWithLocation])
}

export default useTableLocationEffect

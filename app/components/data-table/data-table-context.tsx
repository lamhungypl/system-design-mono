import { createContext, useContext } from "react"
import type { Table, RowData } from "@tanstack/react-table"
import type { TableSize } from "./types"

export interface DataTableContextValue<T extends RowData = RowData> {
  table: Table<T>
  size: TableSize
  bordered: boolean
  showHeader: boolean
  loading: boolean
  emptyText: React.ReactNode
  expandedRowRender?: (record: T, index: number) => React.ReactNode
  rowExpandable?: (record: T) => boolean
  scrollY?: number | string
  stickyHeader: boolean
  infinite?: {
    hasMore: boolean
    loading: boolean
    onLoadMore: () => void
  }
  onColumnReorder?: (sourceId: string, targetId: string) => void
}

const DataTableContext = createContext<DataTableContextValue | null>(null)

export function DataTableProvider<T extends RowData>({
  value,
  children,
}: {
  value: DataTableContextValue<T>
  children: React.ReactNode
}) {
  return (
    <DataTableContext.Provider value={value as DataTableContextValue}>
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTableContext<T extends RowData = RowData>() {
  const ctx = useContext(DataTableContext)
  if (!ctx) {
    throw new Error("DataTable composition parts must be rendered inside <DataTable.Root>")
  }
  return ctx as DataTableContextValue<T>
}

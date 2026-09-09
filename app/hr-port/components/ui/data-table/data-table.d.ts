import "@tanstack/react-table"

import { Column, Row, RowData } from "@tanstack/react-table"
import { Virtualizer } from "@tanstack/react-virtual"
import type { MutableRefObject, ReactNode } from "react"

import {
  TableBody,
  TableFooter,
  TableHeader,
} from "~/hr-port/components/base/table"

import TablePagination from "./toolbars/TablePagination"

declare module "@tanstack/react-table" {
  interface Table {
    refs: {
      lastRowRef: MutableRefObject<HTMLDivElement | null>
      paginationRef: MutableRefObject<HTMLDivElement | null>
      scrollAreaRef: MutableRefObject<HTMLDivElement | null>
      tableContainerRef: MutableRefObject<HTMLDivElement | null>
      topToolbarRef: MutableRefObject<HTMLDivElement | null>
    }
  }
  interface TableState {
    columnSizeVars: { [key: string]: number }
    isLoading: boolean
  }
  /**
   *
   *  TODO: move table's options to TableContext then remove some duplicated options and table state hooks
   *
   */
  interface TableOptionsResolved<TData extends RowData> {
    enableFooter?: boolean
    enableFooterSticky?: boolean
    enableHeader?: boolean
    enablePagination?: boolean
    enablePaginationSticky?: boolean
    enableTopToolbar?: boolean
    onBottomReached?: () => void
    renderTopToolbar?: (props: { table: Table<TData> }) => ReactNode
    rowVirtualizerProps?: Virtualizer<HTMLDivElement, HTMLTableRowElement>
    selectAllMode?: "all" | "page"
    topToolbar?: React.ReactNode
  }

  interface TableOptions {
    tableId?: string
  }

  interface TableMeta<TData extends RowData> {
    /**
     *  @describe defaultValues default values for table state, useful to set default initial values when sync with location
     *
     */
    defaultValues?: Partial<TableManualState>
    getRowClassname?: (row: Row<TData>) => string
    getRowIsHidden?: (props: { row: Row<TData> }) => boolean
    getRowOnClick?: (row: Row<TData>) => void
    renderEmpty?: React.ReactNode
    slotProps?: {
      body?: Partial<React.ComponentProps<typeof TableBody>>
      footer?: Partial<React.ComponentProps<typeof TableFooter>>
      header?: Partial<React.ComponentProps<typeof TableHeader>>
      pagination?: Partial<React.ComponentProps<typeof TablePagination>>
      scrollArea?: React.ComponentProps<"div">
      wrapper?: React.ComponentProps<"div">
    }
    /**
     * NOTE: should to be used with useAppTableParams hook only
     */
    syncWithLocation?: boolean
  }

  type FilterProps = {
    column: Column<TData>
    table: Table<TData>
  }

  // PORT: type parameters added to match app/components/data-table/adapt-columns.ts,
  // which augments ColumnMeta too. TS requires every declaration of an augmented
  // interface to have identical type parameters (TS2428).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    Filter?: (props: FilterProps) => ReactNode
    /**
     * hidden columns with customized keys or features. Note that this is different from columnHiding feature
     */
    isHidden?: boolean
  }
  interface ColumnSizingInstance {
    getTotalVisibleSize: () => number
  }
}

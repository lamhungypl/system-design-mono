import { RowData, Table as TableInstance } from "@tanstack/react-table"
import {
  CSSProperties,
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"

import { AppEmptyIcon } from "~/hr-port/assets/svgs/icons/Icon"
import { Table } from "~/hr-port/components/base/table"
import DataTableBody from "~/hr-port/components/ui/data-table/body/DataTableBody"
import DataTableBodyLoading from "~/hr-port/components/ui/data-table/body/DataTableBodyLoading"
import DataTableFooter from "~/hr-port/components/ui/data-table/footers/data-table-footer"
import DataTableHeader from "~/hr-port/components/ui/data-table/headers/DataTableHeader"
import { useAppTable } from "~/hr-port/components/ui/data-table/hooks/use-app-table"
import { AppTableOptions } from "~/hr-port/components/ui/data-table/hooks/use-app-table-options"
import { DataTablePagination } from "~/hr-port/components/ui/data-table/toolbars/DataTablePagination"
import { DataTableTopToolbar } from "~/hr-port/components/ui/data-table/toolbars/DataTableTopToolbar"
import { SCROLL_BAR_WIDTH } from "~/hr-port/constants"
import { cn } from "~/hr-port/utils/style"

import "./data-table.scss"

export type AppTableProps<TData extends RowData> = {
  isLoading?: boolean
  maxHeight?: CSSProperties["maxHeight"]
} & AppTableOptions<TData>

const DataTable = forwardRef<
  TableInstance<unknown>,
  PropsWithChildren<AppTableProps<unknown>>
>(function AppTableInner(props, ref) {
  const { data, maxHeight = "50vh", isLoading = false } = props
  const table = useAppTable(props)
  const {
    getRowModel,
    setState,
    options: {
      enableFooter,
      enableFooterSticky,
      enablePagination,
      enableTopToolbar,
      enableHeader,
      meta,
      enablePaginationSticky,
    },
    refs: { scrollAreaRef, tableContainerRef },
  } = table
  const footerWrapperRef = useRef<HTMLDivElement>(null)

  const rowsCount = getRowModel().rows.length

  useImperativeHandle(ref, () => table, [table])

  const bodyHasScrollbar = useMemo(() => {
    if (data.length === 0) return false
    if (scrollAreaRef?.current) {
      return (
        scrollAreaRef.current.scrollHeight > scrollAreaRef.current.clientHeight
      )
    }
    return false
  }, [scrollAreaRef, data])

  useEffect(() => {
    setState((state) => ({
      ...state,
      isLoading,
    }))
  }, [isLoading, setState])

  return (
    <div
      {...meta?.slotProps?.wrapper}
      className={cn(
        "data-table",
        "w-full",
        meta?.slotProps?.wrapper?.className
      )}
      ref={tableContainerRef}
    >
      {enableTopToolbar && <DataTableTopToolbar table={table} />}

      <div
        ref={scrollAreaRef}
        className={cn(
          "w-full overflow-auto",
          meta?.slotProps?.scrollArea?.className
        )}
        style={{ maxHeight, ...meta?.slotProps?.scrollArea?.style }}
        onScroll={() => {
          if (footerWrapperRef.current && scrollAreaRef.current) {
            footerWrapperRef.current.scrollLeft =
              scrollAreaRef.current.scrollLeft
          }
        }}
      >
        <Table
          style={{ minWidth: table.getTotalVisibleSize(), display: "grid" }}
        >
          {enableHeader && <DataTableHeader table={table} />}
          {isLoading ? (
            <DataTableBodyLoading table={table} />
          ) : (
            <DataTableBody table={table} />
          )}
          {enableFooter && !enableFooterSticky && (
            <DataTableFooter table={table} />
          )}
        </Table>

        {!isLoading &&
          rowsCount === 0 &&
          (table.options.meta?.renderEmpty ?? (
            <div className="sticky left-0 flex items-center justify-center py-7">
              <AppEmptyIcon />
            </div>
          ))}
      </div>

      {enablePagination &&
        (enablePaginationSticky ? (
          <div className="sticky bottom-0 z-10">
            <div className="border-transparent bg-white">
              <DataTablePagination table={table} />
            </div>
          </div>
        ) : (
          <DataTablePagination table={table} />
        ))}

      {enableFooter && enableFooterSticky && (
        <div
          ref={footerWrapperRef}
          className="scrollbar-hidden sticky bottom-0 z-10 overflow-auto"
          style={{
            paddingRight: bodyHasScrollbar ? SCROLL_BAR_WIDTH : 0,
          }}
        >
          <Table
            style={{ minWidth: table.getTotalVisibleSize(), display: "grid" }}
          >
            <DataTableFooter table={table} />
          </Table>
        </div>
      )}
    </div>
  )
}) as <T extends RowData>(
  p: { ref?: React.ForwardedRef<TableInstance<T>> } & AppTableProps<T>
) => React.ReactElement

export default DataTable

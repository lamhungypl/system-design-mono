import { type RowData, type Table } from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { forwardRef, memo } from "react"

import { TableBody } from "~/hr-port/components/base/table"
import DataTableBodyRow from "~/hr-port/components/ui/data-table/body/DataTableBodyRow"

type Props<T extends RowData> = {
  table: Table<T>
}

const DataTableBody = forwardRef<HTMLTableSectionElement, Props<unknown>>(
  (props, ref) => {
    const { table } = props
    const bodySlotProps = table.options.meta?.slotProps?.body

    const { getRowModel } = table

    const allRows = getRowModel().rows.filter(
      (row) => !table.options.meta?.getRowIsHidden?.({ row })
    )

    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
      estimateSize: () => 50,
      overscan: 5,
      ...table.options.rowVirtualizerProps,
      getScrollElement: () => table.refs.scrollAreaRef?.current ?? null,
      count: allRows.length,
      measureElement:
        typeof window !== "undefined" &&
        navigator.userAgent.indexOf("Firefox") === -1
          ? (element) => element?.getBoundingClientRect().height
          : undefined,
    })

    return (
      <TableBody
        ref={ref}
        {...bodySlotProps}
        style={{
          ...bodySlotProps?.style,
          display: "grid",
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = allRows[virtualRow.index]
          return (
            <DataTableBodyRow
              key={row.id}
              row={row}
              table={table}
              virtualRow={virtualRow}
              rowVirtualizer={rowVirtualizer}
            />
          )
        })}
      </TableBody>
    )
  }
)

//special memoized wrapper for our table body that we will use during column resizing
export const MemoizedTableBody = memo(
  DataTableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof DataTableBody
export default DataTableBody

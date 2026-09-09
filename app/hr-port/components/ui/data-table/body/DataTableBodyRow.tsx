import { Row, RowData, Table } from "@tanstack/react-table"
import { VirtualItem, Virtualizer } from "@tanstack/react-virtual"

import { TableRow } from "~/hr-port/components/base/table"
import DataTableBodyCell from "~/hr-port/components/ui/data-table/body/DataTableBodyCell"
import { cn } from "~/hr-port/utils/style"

type Props<T extends RowData> = {
  row: Row<T>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  table: Table<T>
  virtualRow: VirtualItem
}

const DataTableBodyRow = <T extends RowData>(props: Props<T>) => {
  const { row, table, virtualRow, rowVirtualizer } = props

  const visibleCells = row
    .getVisibleCells()
    .filter((cell) => !cell.column.columnDef.meta?.isHidden)

  const allRows = table
    .getRowModel()
    .rows.filter((row) => !table.options.meta?.getRowIsHidden?.({ row }))

  return (
    <TableRow
      key={row.id}
      data-index={virtualRow.index}
      data-state={row.getIsSelected() && "selected"}
      ref={(node) => {
        rowVirtualizer.measureElement(node)
        if (virtualRow.index === allRows.length - 1) {
          table.refs.lastRowRef.current = node
        }
      }}
      className={cn(
        {
          "bg-[#FFFAEE]": row.getIsGrouped(),
        },
        table.options.meta?.getRowClassname?.(row)
      )}
      onClick={() => table.options.meta?.getRowOnClick?.(row)}
      style={{
        display: "flex",
        position: "absolute",
        transform: `translateY(${virtualRow.start}px)`,
        width: "100%",
      }}
    >
      {visibleCells.map((cell) => (
        <DataTableBodyCell key={cell.id} table={table} cell={cell} />
      ))}
    </TableRow>
  )
}

export default DataTableBodyRow

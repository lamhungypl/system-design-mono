import { Cell, flexRender, RowData, Table } from "@tanstack/react-table"

import { TableCell } from "~/hr-port/components/base/table"
import { getCommonCellStyles } from "~/hr-port/components/ui/data-table/utils/cell-utils"
import { cn } from "~/hr-port/utils/style"

export type DataTableBodyCellProps<T extends RowData> = {
  cell: Cell<T, any>
  table: Table<T>
}
export const DataTableBodyCell = <T extends RowData>(
  props: DataTableBodyCellProps<T>
) => {
  const { cell } = props
  const { column } = cell
  const { columnDef } = column

  const { style, className } = getCommonCellStyles({ column })

  const renderCellContent = () => {
    if (cell.getIsAggregated()) {
      return columnDef.aggregatedCell
        ? flexRender(columnDef.aggregatedCell, cell.getContext())
        : null
    }

    return flexRender(columnDef.cell, cell.getContext())
  }

  return (
    <TableCell
      style={{
        ...style,
        width: column.getSize(),
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
      }}
      className={cn("[&:has(.edited-cell)]:bg-[#FFF0CE]", className)}
    >
      {renderCellContent()}
    </TableCell>
  )
}

export default DataTableBodyCell

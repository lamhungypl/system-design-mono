import { flexRender, Header, RowData, Table } from "@tanstack/react-table"

import { TableHead } from "~/hr-port/components/base/table"
import SortingArrow from "~/hr-port/components/ui/data-table/components/SortingArrow"
import { getCommonCellStyles } from "~/hr-port/components/ui/data-table/utils/cell-utils"
import { cn } from "~/hr-port/utils/style"

export type DataTableHeadCellProps<T extends RowData> = {
  header: Header<T, any>
  table: Table<T>
}

const DataTableHeadCell = <T extends RowData>(
  props: DataTableHeadCellProps<T>
) => {
  const { header } = props
  const { column } = header
  const { style, className } = getCommonCellStyles({ column })

  const renderHeaderContent = () => {
    if (header.isPlaceholder) return null

    return flexRender(column.columnDef.header, header.getContext())
  }

  return (
    <TableHead
      style={{
        ...style,
        width: column.getSize(),
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
      }}
      className={cn(className)}
    >
      {renderHeaderContent()}
      {column.getCanSort() && (
        <SortingArrow
          sortDirection={column.getIsSorted()}
          onClick={() => column.toggleSorting()}
          className="ml-2"
        />
      )}
    </TableHead>
  )
}

export default DataTableHeadCell

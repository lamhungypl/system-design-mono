import { flexRender, Header, RowData, Table } from "@tanstack/react-table"

import { TableCell } from "~/hr-port/components/base/table"
import { getCommonCellStyles } from "~/hr-port/components/ui/data-table/utils/cell-utils"
import { cn } from "~/hr-port/utils/style"

type Props<T extends RowData> = {
  footer: Header<T, any>
  table: Table<T>
}

const DataTableFooterCell = <T extends RowData>(props: Props<T>) => {
  const { footer } = props
  const { column } = footer
  const { style, className } = getCommonCellStyles({ column })

  const renderFooterContent = () => {
    if (footer.isPlaceholder) return null

    return flexRender(column.columnDef.footer, footer.getContext())
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
      className={cn("font-bold", className)}
    >
      {renderFooterContent()}
    </TableCell>
  )
}

export default DataTableFooterCell

import { HeaderGroup, RowData, Table } from "@tanstack/react-table"

import { TableRow } from "~/hr-port/components/base/table"
import DataTableFooterCell from "~/hr-port/components/ui/data-table/footers/data-table-footer-cell"

type Props<T extends RowData> = {
  footerGroup: HeaderGroup<T>
  table: Table<T>
}

const DataTableFooterRow = <T extends RowData>(props: Props<T>) => {
  const { table, footerGroup } = props
  return (
    <TableRow key={footerGroup.id} style={{ display: "flex", width: "100%" }}>
      {footerGroup.headers
        .filter((footer) => !footer.column.columnDef.meta?.isHidden)
        .map((footer) => (
          <DataTableFooterCell key={footer.id} table={table} footer={footer} />
        ))}
    </TableRow>
  )
}

export default DataTableFooterRow

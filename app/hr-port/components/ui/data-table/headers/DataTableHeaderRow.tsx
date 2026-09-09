import { HeaderGroup, RowData, Table } from "@tanstack/react-table"

import { TableRow } from "~/hr-port/components/base/table"
import DataTableHeadCell from "~/hr-port/components/ui/data-table/headers/DataTableHeadCell"

type Props<T extends RowData> = {
  headerGroup: HeaderGroup<T>
  table: Table<T>
}

const DataTableHeaderRow = <T extends RowData>(props: Props<T>) => {
  const { table, headerGroup } = props
  return (
    <TableRow key={headerGroup.id} style={{ display: "flex", width: "100%" }}>
      {headerGroup.headers
        .filter((header) => !header.column.columnDef.meta?.isHidden)
        .map((header) => (
          <DataTableHeadCell key={header.id} table={table} header={header} />
        ))}
    </TableRow>
  )
}

export default DataTableHeaderRow

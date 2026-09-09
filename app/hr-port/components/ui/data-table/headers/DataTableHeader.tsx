import { RowData, Table } from "@tanstack/react-table"
import { forwardRef } from "react"

import { TableHeader } from "~/hr-port/components/base/table"
import DataTableHeaderRow from "~/hr-port/components/ui/data-table/headers/DataTableHeaderRow"

type Props<T extends RowData> = {
  table: Table<T>
}

const DataTableHeader = forwardRef<HTMLTableSectionElement, Props<unknown>>(
  function DataTableHeaderInner(props, ref) {
    const { table } = props
    const headerSlotProps = table.options.meta?.slotProps?.header

    return (
      <TableHeader
        ref={ref}
        {...headerSlotProps}
        style={{ ...headerSlotProps?.style, display: "grid", width: "100%" }}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <DataTableHeaderRow
            key={headerGroup.id}
            headerGroup={headerGroup}
            table={table}
          />
        ))}
      </TableHeader>
    )
  }
)

export default DataTableHeader

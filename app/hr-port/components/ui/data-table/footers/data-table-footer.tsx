import { RowData, Table } from "@tanstack/react-table"
import { forwardRef } from "react"

import { TableFooter } from "~/hr-port/components/base/table"
import DataTableFooterRow from "~/hr-port/components/ui/data-table/footers/data-table-footer-row"

type Props<T extends RowData> = {
  table: Table<T>
}

const DataTableFooter = forwardRef<HTMLTableSectionElement, Props<unknown>>(
  function DataTableHeaderInner(props, ref) {
    const { table } = props
    const footerSlotProps = table.options.meta?.slotProps?.footer

    return (
      <TableFooter
        ref={ref}
        {...footerSlotProps}
        style={{ ...footerSlotProps?.style, display: "grid", width: "100%" }}
      >
        {table.getFooterGroups().map((footerGroup) => (
          <DataTableFooterRow
            key={footerGroup.id}
            footerGroup={footerGroup}
            table={table}
          />
        ))}
      </TableFooter>
    )
  }
)

export default DataTableFooter

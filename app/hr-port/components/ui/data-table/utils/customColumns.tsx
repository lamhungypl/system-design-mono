import { ColumnDef, RowData } from "@tanstack/react-table"

import { SelectCheckbox } from "~/hr-port/components/ui/data-table/components/SelectCheckbox"
import { COLUMN_ID } from "~/hr-port/components/ui/data-table/constants"

/**
 *
 * NOTE: theses "featured-columns" should be hidden from table utilities such as: column-hiding, column-sorting, column-filtering, etc.
 * But they still need to be rendered in the table, thus, we have meta.Header & meta.Cell for that purpose
 *
 *
 */

export const selectionColumn = <T extends RowData>(): ColumnDef<T> => ({
  id: COLUMN_ID.SELECTION,
  enableResizing: false,
  minSize: 50,
  size: 50,
  maxSize: 50,
  enableHiding: false,
  enableSorting: false,
  header: ({ table }) => {
    return <SelectCheckbox table={table} headerSelectAll />
  },
  cell: ({ table, row }) => {
    return row.getCanSelect() ? (
      <SelectCheckbox table={table} row={row} />
    ) : null
  },
})

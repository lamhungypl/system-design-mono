import { RowData, Table } from "@tanstack/react-table"
import clsx from "clsx"

type Props<TData extends RowData> = {
  table: Table<TData>
}

const DataTableFilters = <T extends RowData>(props: Props<T>) => {
  const { table } = props
  const filterColumns = table
    .getAllColumns()
    .filter((column) => column.columnDef.meta?.Filter)

  return (
    <div className={clsx("flex flex-wrap items-center gap-1")}>
      {filterColumns.map((column) => (
        <div key={column.id} className="w-full">
          {column.columnDef.meta?.Filter?.({ column, table })}
        </div>
      ))}
    </div>
  )
}

export default DataTableFilters

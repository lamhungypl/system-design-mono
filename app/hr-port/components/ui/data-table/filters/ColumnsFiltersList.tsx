import { RowData, Table } from "@tanstack/react-table"
import { Fragment } from "react"

type Props<T extends RowData> = {
  table: Table<T>
}

const ColumnsFiltersList = <T extends RowData>(props: Props<T>) => {
  const { table } = props
  const filterColumns = table
    .getAllColumns()
    .filter((column) => column.columnDef.meta?.Filter)

  return (
    <Fragment>
      {filterColumns.map((column) => {
        return (
          <div key={column.id} className="w-full">
            {column.columnDef.meta?.Filter?.({ column, table })}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ColumnsFiltersList

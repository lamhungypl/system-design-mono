import { RowData, Table } from "@tanstack/react-table"

import DataTableFilters from "~/hr-port/components/ui/data-table/filters/DataTableFilters"
import GlobalFilterTextField from "~/hr-port/components/ui/data-table/filters/GlobalFilterTextField"

type Props<TData extends RowData> = {
  table: Table<TData>
}

export const DataTableTopToolbar = <TData extends RowData>(
  props: Props<TData>
) => {
  const { table } = props

  const {
    refs: { topToolbarRef },
    options: { topToolbar, renderTopToolbar, enableGlobalFilter },
  } = table

  return (
    <div ref={topToolbarRef}>
      {renderTopToolbar?.({ table }) ?? (
        <>
          {!!topToolbar && (
            <div className="mb-5 flex justify-end">
              {enableGlobalFilter && <GlobalFilterTextField table={table} />}
              <div className="">{topToolbar}</div>
            </div>
          )}
          <DataTableFilters table={table} />
        </>
      )}
    </div>
  )
}

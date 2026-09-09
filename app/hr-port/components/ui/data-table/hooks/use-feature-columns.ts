import { ColumnDef, RowData } from "@tanstack/react-table"
import { useMemo } from "react"

import { COLUMN_ID } from "~/hr-port/components/ui/data-table/constants"
import { AppTableOptions } from "~/hr-port/components/ui/data-table/hooks/use-app-table-options"
import { selectionColumn } from "~/hr-port/components/ui/data-table/utils/customColumns"

const featureColumns: Record<string, ColumnDef<any>> = {
  [COLUMN_ID.SELECTION]: selectionColumn(),
}

type Props<TData extends RowData> = {
  options: AppTableOptions<TData>
}

const useFeatureColumns = <T extends RowData>(props: Props<T>) => {
  const {
    options: { enableRowSelection },
  } = props

  return useMemo(() => {
    // using Map for better properties order
    const featColumns = new Map<string, boolean>()

    featColumns.set(COLUMN_ID.SELECTION, !!enableRowSelection)

    const visibleFeatColumnIds = Array.from(featColumns.entries()).reduce(
      (cols, [colId, colCheck]) => {
        if (colCheck) {
          return cols.concat(colId)
        }
        return cols
      },
      [] as string[]
    )

    return visibleFeatColumnIds.map((colId) => featureColumns[colId])
  }, [enableRowSelection])
}

export default useFeatureColumns

import { Row, RowData, Table } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/hr-port/components/base/tooltip"
import { AppCheckbox } from "~/hr-port/components/ui/app-checkbox/app-checkbox"

interface Props<TData extends RowData> {
  headerSelectAll?: boolean
  row?: Row<TData>
  table: Table<TData>
}

export const SelectCheckbox = <T extends RowData>(props: Props<T>) => {
  const { row, headerSelectAll, table } = props
  const {
    getState,
    options: { selectAllMode = "page" },
  } = table
  const { isLoading } = getState()
  const { t } = useTranslation()

  let allRowsSelected

  if (headerSelectAll) {
    if (selectAllMode === "page") {
      allRowsSelected = table.getIsAllPageRowsSelected()
    } else {
      allRowsSelected = table.getIsAllRowsSelected()
    }
  }

  const isIndeterminate = headerSelectAll
    ? table.getIsSomeRowsSelected() && !allRowsSelected
    : row?.getIsSomeSelected()
  const isChecked = headerSelectAll ? allRowsSelected : row?.getIsSelected()

  return (
    <Tooltip>
      {/* PORT: `asChild` + a span wrapper. TooltipTrigger renders a <button> by
          default and AppCheckbox is a radix checkbox <button>, so the source markup
          nests two buttons — React 19 warns and it is invalid HTML. */}
      <TooltipTrigger asChild>
        <span className="flex items-center">
          <AppCheckbox
            checked={isIndeterminate ? "indeterminate" : isChecked}
            onCheckedChange={(nextChecked) => {
              if (row) {
                row.toggleSelected(!!nextChecked)
              } else if (selectAllMode === "all") {
                table.toggleAllRowsSelected(!!nextChecked)
              } else {
                table.toggleAllPageRowsSelected(!!nextChecked)
              }
            }}
            disabled={isLoading}
          />
        </span>
      </TooltipTrigger>
      {headerSelectAll && (
        <TooltipContent>{t("common.table.select_deselect_all")}</TooltipContent>
      )}
    </Tooltip>
  )
}

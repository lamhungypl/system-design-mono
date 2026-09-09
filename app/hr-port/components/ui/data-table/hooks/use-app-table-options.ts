import type { RowData, TableOptions } from "@tanstack/react-table"

import { AtLeast } from "~/hr-port/types/common"

export type AppTableOptions<TData extends RowData> = AtLeast<
  TableOptions<TData>,
  "columns" | "data" | "state" | "initialState"
>
export const useAppTableOptions = <TData extends RowData>(
  options: AppTableOptions<TData>
) => {
  const {
    enableSorting = true,
    enableTopToolbar = true,
    manualFiltering = true,
    manualPagination = true,
    manualSorting = true,
    enableHeader = true,
    enableColumnPinning = true,
    defaultColumn,
    ...rest
  } = options

  return {
    enableSorting,
    enableTopToolbar,
    manualFiltering,
    manualPagination,
    manualSorting,
    enableHeader,
    enableColumnPinning,
    defaultColumn: {
      enableSorting: false,
      enableGrouping: false,
      ...defaultColumn,
    },
    ...rest,
  } satisfies AppTableOptions<TData>
}

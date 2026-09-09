import { Column, RowData, Table } from "@tanstack/react-table"

export type TableFilterComponentProps<T extends RowData> = {
  column: Column<T>
  table: Table<T>
  title: string
}

/**
 * PORT: the source declares `FilterProps` inside its `declare module
 * '@tanstack/react-table'` augmentation and imports it from there. TypeScript does not
 * surface type aliases added that way as exports of the augmented module (TS2305), so
 * it is re-declared here and the two list components import it from this file.
 */
export type FilterProps<TData = any> = {
  column: import("@tanstack/react-table").Column<TData>
  table: import("@tanstack/react-table").Table<TData>
}

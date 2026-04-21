import type { ColumnDef, Row, RowData, SortingFn } from "@tanstack/react-table"
import type { Key } from "react"
import type { ColumnType } from "./types"

declare module "@tanstack/react-table" {
  // Augment ColumnMeta so `column.columnDef.meta?.antColumn` is typed without casts at call sites.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    antColumn?: ColumnType<TData>
  }
}

function makeSorter<T>(sorter: ColumnType<T>["sorter"]): SortingFn<T> | undefined {
  if (!sorter) return undefined
  if (typeof sorter === "function") {
    return (rowA, rowB) => sorter(rowA.original, rowB.original)
  }
  return undefined
}

export function columnKey<T>(col: ColumnType<T>): string {
  if (col.key !== undefined) return String(col.key)
  if (col.dataIndex !== undefined) return String(col.dataIndex)
  return String(col.title)
}

function isRecordWithKey(x: unknown): x is { key?: Key; id?: Key } {
  return typeof x === "object" && x !== null
}

export function resolveRowKey<T>(
  record: T,
  rowKey: keyof T | ((record: T) => Key) | undefined,
  fallbackIndex: number,
): string {
  if (typeof rowKey === "function") return String(rowKey(record))
  if (rowKey !== undefined) {
    const v = record[rowKey]
    if (v !== undefined && v !== null) return String(v)
  }
  if (isRecordWithKey(record)) {
    const maybeKey = record.key ?? record.id
    if (maybeKey !== undefined && maybeKey !== null) return String(maybeKey)
  }
  return String(fallbackIndex)
}

export function antColumnsToTanstack<T extends RowData>(columns: ColumnType<T>[]): ColumnDef<T>[] {
  return columns.map((col): ColumnDef<T> => {
    const id = columnKey(col)
    const accessor = col.dataIndex

    const filterFn: ColumnDef<T>["filterFn"] = col.onFilter
      ? (row: Row<T>, _columnId, filterValue) => {
          if (!Array.isArray(filterValue) || filterValue.length === 0) return true
          return filterValue.some((v) => col.onFilter!(v, row.original))
        }
      : col.filters
        ? (row: Row<T>, columnId, filterValue) => {
            if (!Array.isArray(filterValue) || filterValue.length === 0) return true
            const cell = row.getValue(columnId)
            return filterValue.some((v) => v === cell)
          }
        : undefined

    const baseMeta = { antColumn: col }
    const sharedSize = typeof col.width === "number" ? col.width : undefined
    const sharedSort = !!col.sorter
    const sharedFilter = !!col.filters || !!col.onFilter
    const sortingFn: ColumnDef<T>["sortingFn"] = makeSorter(col.sorter) ?? "auto"

    if (accessor !== undefined) {
      return {
        id,
        accessorKey: String(accessor),
        header: () => col.title,
        enableSorting: sharedSort,
        enableColumnFilter: sharedFilter,
        sortingFn,
        filterFn,
        meta: baseMeta,
        size: sharedSize,
        cell: col.render
          ? ({ row, getValue }) => col.render!(getValue(), row.original, row.index)
          : ({ getValue }) => {
              const v = getValue()
              return v === null || v === undefined ? "" : String(v)
            },
      }
    }

    return {
      id,
      header: () => col.title,
      enableSorting: sharedSort,
      enableColumnFilter: sharedFilter,
      sortingFn,
      filterFn,
      meta: baseMeta,
      size: sharedSize,
      cell: col.render
        ? ({ row }) => col.render!(undefined, row.original, row.index)
        : () => null,
    }
  })
}

import type { ReactNode, Key } from "react"

export type SortOrder = "ascend" | "descend" | null

export type ColumnAlign = "left" | "center" | "right"

export interface ColumnFilterItem {
  text: ReactNode
  value: string | number | boolean
}

export interface ColumnType<T> {
  title: ReactNode
  dataIndex?: keyof T & (string | number)
  key?: Key
  render?: (value: unknown, record: T, index: number) => ReactNode
  sorter?: boolean | ((a: T, b: T) => number)
  sortOrder?: SortOrder
  defaultSortOrder?: SortOrder
  filters?: ColumnFilterItem[]
  onFilter?: (value: string | number | boolean, record: T) => boolean
  filteredValue?: Array<string | number | boolean>
  width?: number | string
  align?: ColumnAlign
  fixed?: "left" | "right" | boolean
  ellipsis?: boolean
  className?: string
}

export interface TablePaginationConfig {
  current?: number
  pageSize?: number
  total?: number
  defaultCurrent?: number
  defaultPageSize?: number
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showTotal?: (total: number, range: [number, number]) => ReactNode
  onChange?: (page: number, pageSize: number) => void
}

export interface RowSelection<T> {
  type?: "checkbox" | "radio"
  selectedRowKeys?: Key[]
  defaultSelectedRowKeys?: Key[]
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void
  getCheckboxProps?: (record: T) => { disabled?: boolean }
  preserveSelectedRowKeys?: boolean
}

export interface ExpandableConfig<T> {
  expandedRowRender?: (record: T, index: number) => ReactNode
  rowExpandable?: (record: T) => boolean
  expandedRowKeys?: Key[]
  defaultExpandedRowKeys?: Key[]
  onExpand?: (expanded: boolean, record: T) => void
  onExpandedRowsChange?: (expandedRowKeys: Key[]) => void
}

export type TableSize = "small" | "middle" | "large"

export interface SorterResult<T> {
  column?: ColumnType<T>
  order?: SortOrder
  field?: keyof T & (string | number)
  columnKey?: Key
}

export interface TableChangeInfo<T> {
  pagination: TablePaginationConfig
  filters: Record<string, Array<string | number | boolean> | null>
  sorter: SorterResult<T> | SorterResult<T>[]
}

export interface TableLocale {
  emptyText?: ReactNode
  filterConfirm?: ReactNode
  filterReset?: ReactNode
}

export interface InfiniteLoadConfig {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
}

export interface TableProps<T> {
  columns: ColumnType<T>[]
  dataSource: T[]
  rowKey?: keyof T | ((record: T) => Key)
  pagination?: false | TablePaginationConfig
  rowSelection?: RowSelection<T>
  expandable?: ExpandableConfig<T>
  loading?: boolean
  size?: TableSize
  bordered?: boolean
  showHeader?: boolean
  onChange?: (info: TableChangeInfo<T>) => void
  locale?: TableLocale
  scroll?: { x?: number | string | true; y?: number | string }
  className?: string
  tableLayout?: "auto" | "fixed"
  /** Infinite scroll sentinel — when the last row intersects the viewport and hasMore is true, onLoadMore fires. */
  infinite?: InfiniteLoadConfig
  /** Controlled column order (left-to-right). */
  columnOrder?: string[]
  onColumnOrderChange?: (order: string[]) => void
  /** Row grouping — list of column ids to group by. Groups render as collapsible separator rows. */
  grouping?: string[]
  onGroupingChange?: (grouping: string[]) => void
}

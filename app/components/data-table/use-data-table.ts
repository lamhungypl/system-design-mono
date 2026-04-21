import { useEffect, useMemo, useRef, useState } from "react"
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ExpandedState,
  type RowData,
  type RowSelectionState,
  type Table,
  type TableState,
  type Updater,
} from "@tanstack/react-table"
import { antColumnsToTanstack, resolveRowKey, columnKey } from "./adapt-columns"
import { expandColumn, selectionColumn } from "./feature-columns"
import type { TableProps } from "./types"

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater
}

export function useDataTable<T extends RowData>(props: TableProps<T>): Table<T> {
  const {
    columns,
    dataSource,
    rowKey,
    pagination,
    rowSelection,
    expandable,
    columnOrder,
    onColumnOrderChange,
    grouping,
    onGroupingChange,
  } = props

  const columnPinning = useMemo(() => {
    const left: string[] = []
    const right: string[] = []
    columns.forEach((c) => {
      if (c.fixed === "left" || c.fixed === true) left.push(columnKey(c))
      else if (c.fixed === "right") right.push(columnKey(c))
    })
    return { left, right }
  }, [columns])

  const columnDefs = useMemo(() => {
    const base = antColumnsToTanstack(columns)
    const prefix = []
    if (expandable?.expandedRowRender) prefix.push(expandColumn<T>())
    if (rowSelection) prefix.push(selectionColumn<T>(rowSelection.type ?? "checkbox"))
    return [...prefix, ...base]
  }, [columns, expandable?.expandedRowRender, rowSelection])

  const getRowId = useMemo(() => {
    return (record: T, index: number) => resolveRowKey(record, rowKey, index)
  }, [rowKey])

  const paginationEnabled = pagination !== false
  // Manual (server-driven) pagination: caller provides a total count.
  const manualPagination = paginationEnabled && pagination?.total !== undefined
  const rowCount = manualPagination ? pagination!.total : undefined

  // Own the full state in a single useState so TanStack never reaches for its
  // internal hook (which would setState during render and trigger warnings).
  const [ownState, setOwnState] = useState<Partial<TableState>>(() => {
    const state: Partial<TableState> = {}
    const sorting = columns
      .filter((c) => c.defaultSortOrder)
      .map((c) => ({ id: columnKey(c), desc: c.defaultSortOrder === "descend" }))
    state.sorting = sorting
    state.columnFilters = []
    state.rowSelection = (() => {
      const keys = rowSelection?.defaultSelectedRowKeys ?? []
      return Object.fromEntries(keys.map((k) => [String(k), true])) as RowSelectionState
    })()
    state.expanded = (() => {
      const keys = expandable?.defaultExpandedRowKeys ?? []
      return (keys.length
        ? Object.fromEntries(keys.map((k) => [String(k), true]))
        : {}) as ExpandedState
    })()
    state.pagination = {
      pageIndex: paginationEnabled
        ? (pagination?.current ?? pagination?.defaultCurrent ?? 1) - 1
        : 0,
      pageSize: paginationEnabled
        ? pagination?.pageSize ?? pagination?.defaultPageSize ?? 10
        : dataSource.length || 10,
    }
    state.columnOrder = columnOrder ?? []
    state.grouping = grouping ?? []
    return state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  // TanStack may call onStateChange synchronously inside useReactTable's setup
  // (to reconcile state). Calling setState there triggers a "can't update a
  // component that hasn't mounted yet" warning. Buffer those calls until after
  // the first commit.
  const committedRef = useRef(false)
  const pendingUpdatesRef = useRef<Array<(s: Partial<TableState>) => Partial<TableState>>>([])

  useEffect(() => {
    committedRef.current = true
    if (pendingUpdatesRef.current.length > 0) {
      const queued = pendingUpdatesRef.current
      pendingUpdatesRef.current = []
      setOwnState((prev) => queued.reduce((acc, fn) => fn(acc), prev))
    }
  }, [])

  const applyStateUpdate = (fn: (s: Partial<TableState>) => Partial<TableState>) => {
    if (committedRef.current) {
      setOwnState(fn)
    } else {
      pendingUpdatesRef.current.push(fn)
    }
  }

  // Build the merged state TanStack should see — controlled values override owned state.
  const effectiveState = useMemo<Partial<TableState>>(() => {
    const s: Partial<TableState> = { ...ownState, columnPinning }
    if (rowSelection?.selectedRowKeys) {
      s.rowSelection = Object.fromEntries(
        rowSelection.selectedRowKeys.map((k) => [String(k), true]),
      ) as RowSelectionState
    }
    if (expandable?.expandedRowKeys) {
      s.expanded = Object.fromEntries(
        expandable.expandedRowKeys.map((k) => [String(k), true]),
      ) as ExpandedState
    }
    if (
      paginationEnabled &&
      (pagination?.current !== undefined || pagination?.pageSize !== undefined)
    ) {
      s.pagination = {
        pageIndex: (pagination!.current ?? 1) - 1,
        pageSize: pagination!.pageSize ?? s.pagination?.pageSize ?? 10,
      }
    }
    if (columnOrder !== undefined) s.columnOrder = columnOrder
    if (grouping !== undefined) s.grouping = grouping
    return s
  }, [
    ownState,
    columnPinning,
    rowSelection?.selectedRowKeys,
    expandable?.expandedRowKeys,
    paginationEnabled,
    pagination && pagination.current,
    pagination && pagination.pageSize,
    columnOrder,
    grouping,
  ])

  const table = useReactTable<T>({
    data: dataSource,
    columns: columnDefs,
    getRowId,
    state: effectiveState,
    onStateChange: (updater) => {
      applyStateUpdate((prev) => resolveUpdater(updater, prev as TableState))
    },
    enableRowSelection: rowSelection
      ? rowSelection.getCheckboxProps
        ? (row) => !(rowSelection.getCheckboxProps?.(row.original)?.disabled ?? false)
        : true
      : false,
    enableMultiRowSelection: rowSelection?.type !== "radio",
    enableExpanding: !!expandable?.expandedRowRender || !!grouping?.length,
    getRowCanExpand: expandable?.rowExpandable
      ? (row) => expandable.rowExpandable!(row.original)
      : expandable?.expandedRowRender
        ? () => true
        : undefined,
    enableGrouping: grouping !== undefined || !!onGroupingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel:
      expandable?.expandedRowRender || grouping?.length ? getExpandedRowModel() : undefined,
    getGroupedRowModel: grouping ? getGroupedRowModel() : undefined,
    getPaginationRowModel: paginationEnabled && !manualPagination ? getPaginationRowModel() : undefined,
    rowCount,
    manualPagination,
    manualSorting: false,
    manualFiltering: false,
  })

  // Fire user-supplied onChange callbacks when OUR internal intended state changes.
  // We watch `ownState` (the value TanStack wanted to set) rather than `effectiveState`
  // (which is overridden by controlled props) — otherwise a controlled parent never
  // sees the user's click because the effective value stays pinned to the prop.
  const prevOwnStateRef = useRef<Partial<TableState> | null>(null)
  useEffect(() => {
    const prev = prevOwnStateRef.current
    prevOwnStateRef.current = ownState
    if (!prev) return

    if (rowSelection?.onChange && prev.rowSelection !== ownState.rowSelection) {
      const sel = ownState.rowSelection ?? {}
      const keys = Object.keys(sel).filter((k) => sel[k])
      const selectedRows = dataSource.filter((record, i) =>
        keys.includes(resolveRowKey(record, rowKey, i)),
      )
      rowSelection.onChange(keys, selectedRows)
    }

    if (expandable?.onExpandedRowsChange && prev.expanded !== ownState.expanded) {
      const exp = ownState.expanded
      if (typeof exp === "object" && exp !== null) {
        const keys = Object.keys(exp).filter((k) => (exp as Record<string, boolean>)[k])
        expandable.onExpandedRowsChange(keys)
      }
    }

    if (pagination && pagination.onChange && prev.pagination !== ownState.pagination) {
      const p = ownState.pagination
      if (p) pagination.onChange(p.pageIndex + 1, p.pageSize)
    }

    if (onColumnOrderChange && prev.columnOrder !== ownState.columnOrder) {
      onColumnOrderChange(ownState.columnOrder ?? [])
    }

    if (onGroupingChange && prev.grouping !== ownState.grouping) {
      onGroupingChange(ownState.grouping ?? [])
    }
  })

  return table
}

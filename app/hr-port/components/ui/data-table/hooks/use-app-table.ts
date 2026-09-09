import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef, RowData } from "@tanstack/react-table"
import { useInViewport, useMemoizedFn } from "ahooks"
import { produce } from "immer"
import { cloneDeep } from "lodash"
import { useCallback, useEffect, useMemo } from "react"

import { COLUMN_ID } from "~/hr-port/components/ui/data-table/constants"
import {
  AppTableOptions,
  useAppTableOptions,
} from "~/hr-port/components/ui/data-table/hooks/use-app-table-options"
import { useAppTableRefs } from "~/hr-port/components/ui/data-table/hooks/use-app-table-refs"
import { useAppTableState } from "~/hr-port/components/ui/data-table/hooks/use-app-table-state"
import useFeatureColumns from "~/hr-port/components/ui/data-table/hooks/use-feature-columns"
import useTableLocationEffect from "~/hr-port/components/ui/data-table/hooks/use-table-location-effect"

const useAppTableInstance = <TData extends RowData>(
  options: AppTableOptions<TData>
) => {
  const { onBottomReached: onBottomReachedProp } = options
  const initCoreState = useAppTableState(options)

  //TODO:  fix dynamic pinning // NOSONAR
  const initialState = useMemo(() => {
    const initState = options.initialState ?? {}
    const nextInitState = produce(initState, (draftState) => {
      if (options.enableColumnPinning) {
        if (!draftState.columnPinning) {
          draftState.columnPinning = { left: [], right: [] }
        }

        const { left: leftPinningIds = [] } = draftState.columnPinning || {}

        /** Make Selection column auto pinned */
        if (options.enableRowSelection) {
          draftState.columnPinning.left = [
            COLUMN_ID.SELECTION as string,
          ].concat(leftPinningIds)
        }
      }
    })
    return nextInitState
  }, [
    options.enableColumnPinning,
    options.enableRowSelection,
    options.initialState,
  ])

  const featureColumns = useFeatureColumns({
    options,
  })
  const columnDefs = useMemo(() => {
    const columns = cloneDeep(options.columns)
    const fillUndefinedAggregatedCell = () => {
      columns.forEach((column) => {
        if (!("aggregatedCell" in column)) {
          column.aggregatedCell = undefined
        }
      })
    }

    fillUndefinedAggregatedCell()

    return [...featureColumns, ...columns] as ColumnDef<TData, any>[]
  }, [featureColumns, options.columns])

  const {
    lastRowRef,
    scrollAreaRef,
    tableContainerRef,
    topToolbarRef,
    paginationRef,
  } = useAppTableRefs()

  const {
    pagination,
    sorting,
    setSorting,
    setPagination,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
  } = initCoreState

  const tableScrollToTop = useCallback(() => {
    if (scrollAreaRef?.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }, [scrollAreaRef])

  const onBottomReached = useMemoizedFn(() => {
    onBottomReachedProp?.()
  })

  const [inViewPort] = useInViewport(lastRowRef)

  useEffect(() => {
    if (inViewPort) {
      onBottomReached()
    }
  }, [onBottomReached, inViewPort])

  const table = useReactTable({
    ...options,
    columns: columnDefs,
    initialState,
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter,
      ...options.state,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: options.enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      options.enableFilters ||
      options.enableGlobalFilter ||
      options.enableColumnFilters
        ? getFilteredRowModel()
        : undefined,
    getGroupedRowModel: options.enableGrouping
      ? getGroupedRowModel()
      : undefined,
    getExpandedRowModel: options.enableExpanding
      ? getExpandedRowModel()
      : undefined,

    onSortingChange: (updater) => {
      options.onSortingChange?.(updater)
      tableScrollToTop()
      setSorting(updater)
    },

    onPaginationChange: (updater) => {
      options.onPaginationChange?.(updater)
      tableScrollToTop()
      setPagination(updater)
    },

    onColumnFiltersChange: (updater) => {
      options.onColumnFiltersChange?.(updater)
      tableScrollToTop()
      setColumnFilters(updater)
    },

    onGlobalFilterChange: (updater) => {
      options.onGlobalFilterChange?.(updater)
      tableScrollToTop()
      setGlobalFilter(updater)
    },
  })

  useTableLocationEffect(table)

  table.refs = {
    lastRowRef,
    scrollAreaRef,
    tableContainerRef,
    topToolbarRef,
    paginationRef,
  }

  table.getTotalVisibleSize = () => {
    const hiddenColumns = table
      .getVisibleFlatColumns()
      .filter((item) => item.columnDef.meta?.isHidden)
    const hiddenSize = hiddenColumns.reduce((sum, col) => {
      return sum + Number(col.columnDef.size)
    }, 0)

    return table.getTotalSize() - hiddenSize
  }

  return table
}

/**
 * @param options table options
 * @description Use this hook over `useReactTable`
 * @returns TableInstance with additional options and features
 */
export const useAppTable = <T extends RowData>(options: AppTableOptions<T>) => {
  const parsedTableOptions = useAppTableOptions(options)
  const tableInstance = useAppTableInstance(parsedTableOptions)
  return tableInstance
}

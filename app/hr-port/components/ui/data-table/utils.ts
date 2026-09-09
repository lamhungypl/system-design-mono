import { ColumnFiltersState, SortingState } from "@tanstack/react-table"

import {
  INFINITE_PER_PAGE_COUNT,
  PER_PAGE_COUNT,
} from "~/hr-port/components/ui/data-table/constants"
import { TableManualState } from "~/hr-port/components/ui/data-table/hooks/use-app-table-params"
import { PageParams } from "~/hr-port/features/common/data-access/types"
import {
  parseFilterParams,
  parseSortParams,
  queryStringToParams,
} from "~/hr-port/features/common/utils/routers"

export const tableStateToQueryParams = <FilterParams = unknown>(
  tableState: TableManualState
) => {
  const { pagination, columnFilters, globalFilter, sorting } = tableState || {}

  const pageIndex = pagination?.pageIndex || 0

  return {
    page: pageIndex + 1,
    size: pagination?.pageSize,
    ...generateFilterObject(columnFilters),
    search: globalFilter ? globalFilter : undefined,
    sort: generateSortParams(sorting) || undefined,
  } as FilterParams & PageParams
}

export const generateFilterObject = (columnFilters?: ColumnFiltersState) => {
  if (!columnFilters) return {}
  return columnFilters?.reduce(
    (filterObj, columnFilter) => {
      filterObj[columnFilter.id] = columnFilter.value
      return filterObj
    },
    {} as Record<string, any>
  )
}

export const generateSortParams = (sorting?: SortingState) => {
  return (
    sorting?.reduce((sortStr, columnSort, currentIndex) => {
      sortStr = sortStr.concat(
        `${currentIndex !== 0 ? ";" : ""}${columnSort.id},${columnSort.desc ? "desc" : "asc"}`
      )

      return sortStr
    }, "") || undefined
  )
}

export const hasFilter = (columnFilters?: ColumnFiltersState) => {
  if (!columnFilters) {
    return false
  }

  return columnFilters.some(({ value }) => {
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return !!value
  })
}

export const getPageParams = <FilterParams = unknown>(
  pageParams?: FilterParams & Partial<PageParams>,
  isInfiniteQuery = false
) => {
  const defaultPerPage = isInfiniteQuery
    ? INFINITE_PER_PAGE_COUNT
    : PER_PAGE_COUNT
  const params = {
    ...pageParams,
    page: pageParams?.page || 1,
    size: pageParams?.size || defaultPerPage,
  } as FilterParams & Partial<PageParams>

  return params
}

export const queryStringToTableState = (
  url: string
): Partial<TableManualState> => {
  const params = queryStringToParams(url)
  const parsedFilters = parseFilterParams(url)
  const parsedSorting = parseSortParams(params?.sort || "")
  const parsedPageIndex = params?.page ? params.page - 1 : 0
  const parsedPageSize = Number(params?.size) || PER_PAGE_COUNT
  const parsedGlobalFilter = params?.search
  return {
    globalFilter: parsedGlobalFilter,
    columnFilters: parsedFilters,
    sorting: parsedSorting,
    pagination: {
      pageIndex: parsedPageIndex,
      pageSize: parsedPageSize,
    },
  }
}
